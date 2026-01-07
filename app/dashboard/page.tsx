'use client';

import { useCurrentUser } from '@/contexts/UserContext';
import { useData } from '@/contexts/DataContext';
import { RoleCardLink } from '@/components/task-list/RoleCardLink';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { currentUser, userRole } = useCurrentUser();
  const { roles, candidates, clients } = useData();

  // Filter roles based on user role
  const visibleRoles = useMemo(() => {
    if (userRole === 'admin') {
      return roles; // Admins see all roles
    }
    // TAs see only their assigned roles
    return roles.filter(role => currentUser.assignedRoleIds.includes(role.id));
  }, [roles, userRole, currentUser]);

  // Sort roles: high priority first, then by created date
  const sortedRoles = useMemo(() => {
    return [...visibleRoles].sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return b.createdDate.getTime() - a.createdDate.getTime();
    });
  }, [visibleRoles]);

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{currentUser.name.split(' ')[0]}'s Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            {userRole === 'admin'
              ? `Viewing all ${visibleRoles.length} roles across all TAs`
              : `Viewing your ${visibleRoles.length} assigned roles`}
          </p>
        </div>

        {sortedRoles.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/20 p-12 text-center">
            <p className="text-muted-foreground">No roles assigned yet</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedRoles.map((role) => {
              const client = clients.find(c => c.id === role.clientId);
              const roleCandidates = candidates.filter(c => c.roleId === role.id);

              return (
                <RoleCardLink
                  key={role.id}
                  role={role}
                  client={client!}
                  candidates={roleCandidates}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
