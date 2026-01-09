'use client';

import { useCurrentUser } from '@/contexts/UserContext';
import { useData } from '@/contexts/DataContext';
import { useFilters } from '@/contexts/FilterContext';
import { RoleCardLink } from '@/components/task-list/RoleCardLink';
import { DashboardAlerts } from '@/components/task-list/DashboardAlerts';
import { AdminSummaryMetrics } from '@/components/task-list/AdminSummaryMetrics';
import { Select } from '@/components/ui/select';
import { useMemo } from 'react';
import { calculateDashboardAlerts } from '@/lib/utils/alert-utils';
import { DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, userRole } = useCurrentUser();
  const { roles, candidates, clients, tas } = useData();
  const { taFilter, setTaFilter, accountFilter, setAccountFilter, priorityFilter, setPriorityFilter } = useFilters();

  // Filter roles based on user role and filters
  const visibleRoles = useMemo(() => {
    let filtered = roles;
    
    if (userRole === 'admin') {
      // Admins see all roles, but can filter by TA, account, or priority
      if (taFilter) {
        filtered = filtered.filter(role => role.assignedTAId === taFilter);
      }
      if (accountFilter) {
        filtered = filtered.filter(role => role.clientId === accountFilter);
      }
      if (priorityFilter) {
        filtered = filtered.filter(role => role.priority === priorityFilter);
      }
    } else {
      // TAs see only their assigned roles
      filtered = filtered.filter(role => currentUser.assignedRoleIds.includes(role.id));
    }
    
    return filtered;
  }, [roles, userRole, currentUser, taFilter, accountFilter, priorityFilter]);

  // Sort roles: high priority first, then by created date
  const sortedRoles = useMemo(() => {
    return [...visibleRoles].sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return b.createdDate.getTime() - a.createdDate.getTime();
    });
  }, [visibleRoles]);

  // Get unique TAs and clients for filter dropdowns
  const uniqueTAs = useMemo(() => {
    return tas.filter(ta => ta.role === 'ta');
  }, [tas]);

  const uniqueClients = useMemo(() => {
    return clients;
  }, [clients]);

  // Calculate dashboard alerts for visible roles
  const dashboardAlerts = useMemo(() => {
    return calculateDashboardAlerts(visibleRoles, candidates, clients);
  }, [visibleRoles, candidates, clients]);

  // Calculate booked revenue (signed_offer stage)
  const bookedRevenue = useMemo(() => {
    return visibleRoles.reduce((total, role) => {
      const roleCandidates = candidates.filter(c => c.roleId === role.id);
      const hasSignedOffer = roleCandidates.some(c => c.currentStage === 'signed_offer');
      return hasSignedOffer ? total + (role.estimatedRevenue || 0) : total;
    }, 0);
  }, [visibleRoles, candidates]);

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Dashboard Header with Booked Revenue */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{currentUser.name.split(' ')[0]}'s Dashboard</h2>
            <p className="text-muted-foreground mt-1">
              {userRole === 'admin'
                ? `Viewing all ${visibleRoles.length} roles across all TAs`
                : `Viewing your ${visibleRoles.length} assigned roles`}
            </p>
          </div>

          {/* Booked Revenue */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center gap-2 text-sm text-primary/70 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">Booked Revenue</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              ${(bookedRevenue / 1000).toFixed(0)}k
            </div>
          </div>
        </div>

        {/* Admin Summary Metrics */}
        {userRole === 'admin' && (
          <AdminSummaryMetrics roles={visibleRoles} candidates={candidates} />
        )}

        {/* Filters for admin view */}
        {userRole === 'admin' && (
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 max-w-xs">
              <label className="text-sm font-medium mb-2 block">Filter by TA</label>
              <Select
                value={taFilter || ''}
                onChange={(e) => setTaFilter(e.target.value || undefined)}
              >
                <option value="">All TAs</option>
                {uniqueTAs.map(ta => (
                  <option key={ta.id} value={ta.id}>{ta.name}</option>
                ))}
              </Select>
            </div>
            <div className="flex-1 max-w-xs">
              <label className="text-sm font-medium mb-2 block">Filter by Account</label>
              <Select
                value={accountFilter || ''}
                onChange={(e) => setAccountFilter(e.target.value || undefined)}
              >
                <option value="">All Accounts</option>
                {uniqueClients.map(client => (
                  <option key={client.id} value={client.id}>{client.company}</option>
                ))}
              </Select>
            </div>
            <div className="flex-1 max-w-xs">
              <label className="text-sm font-medium mb-2 block">Filter by Priority</label>
              <Select
                value={priorityFilter || ''}
                onChange={(e) => setPriorityFilter(e.target.value as any || undefined)}
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="low">Low</option>
                <option value="deprioritized">Deprioritized</option>
              </Select>
            </div>
            {(taFilter || accountFilter || priorityFilter) && (
              <button
                onClick={() => {
                  setTaFilter(undefined);
                  setAccountFilter(undefined);
                  setPriorityFilter(undefined);
                }}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Dashboard Alerts - TA view only */}
        {userRole !== 'admin' && <DashboardAlerts alerts={dashboardAlerts} />}

        {sortedRoles.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/20 p-12 text-center">
            <p className="text-muted-foreground">No roles assigned yet</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedRoles.map((role) => {
              const client = clients.find(c => c.id === role.clientId);
              const roleCandidates = candidates.filter(c => c.roleId === role.id);
              const assignedTA = tas.find(ta => ta.id === role.assignedTAId);

              return (
                <RoleCardLink
                  key={role.id}
                  role={role}
                  client={client!}
                  candidates={roleCandidates}
                  assignedTA={assignedTA}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
