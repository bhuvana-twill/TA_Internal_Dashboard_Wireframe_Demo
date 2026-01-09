'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUser } from '@/contexts/UserContext';
import { useData } from '@/contexts/DataContext';
import { PipelineView } from '@/components/task-list/PipelineView';
import { PriorityBadge } from '@/components/task-list/PriorityBadge';
import { RoleAlerts } from '@/components/task-list/RoleAlerts';
import { Users } from 'lucide-react';
import { useMemo } from 'react';

export default function RolePipelinePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, userRole } = useCurrentUser();
  const { roles, candidates, clients, updateCandidateStage } = useData();

  const roleId = params.roleId as string;

  // Get highlight query param for candidate highlighting
  const highlightCandidateId = searchParams.get('highlight');
  const role = roles.find(r => r.id === roleId);
  const client = role ? clients.find(c => c.id === role.clientId) : null;
  const roleCandidates = candidates.filter(c => c.roleId === roleId);

  // Get visible roles for sidebar
  const visibleRoles = useMemo(() => {
    if (userRole === 'admin') {
      return roles;
    }
    return roles.filter(r => currentUser.assignedRoleIds.includes(r.id));
  }, [roles, userRole, currentUser]);

  // Sort by priority
  const sortedRoles = useMemo(() => {
    return [...visibleRoles].sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return b.createdDate.getTime() - a.createdDate.getTime();
    });
  }, [visibleRoles]);

  if (!role || !client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Role not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar with role list */}
      <aside className="w-80 border-r bg-background overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b sticky top-0 bg-background z-10">
          <h3 className="font-semibold text-sm text-muted-foreground">
            YOUR ROLES ({visibleRoles.length})
          </h3>
        </div>

        <div className="p-2">
          {sortedRoles.map((r) => {
            const isActive = r.id === roleId;
            const roleClient = clients.find(c => c.id === r.clientId);
            const roleCandidates = candidates.filter(c => c.roleId === r.id);
            const candidateCount = roleCandidates.length;

            // Calculate action items (same logic as RoleCardLink)
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const newCandidates = roleCandidates.filter(c => {
              const submittedDate = new Date(c.submittedDate);
              return submittedDate >= oneDayAgo;
            }).length;

            // Count qualified candidates with 3+ days without update
            const qualifiedAlerts = roleCandidates.filter(c => {
              if (c.currentStage !== 'qualified') return false;
              const daysSinceUpdate = Math.floor(
                (now.getTime() - new Date(c.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
              );
              return daysSinceUpdate >= 3;
            }).length;

            // Count twill interview candidates with 3+ days without update
            const twillAlerts = roleCandidates.filter(c => {
              if (c.currentStage !== 'twill_interview') return false;
              const daysSinceUpdate = Math.floor(
                (now.getTime() - new Date(c.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
              );
              return daysSinceUpdate >= 3;
            }).length;

            // Count client process candidates with 5+ days without update
            const clientProcessAlerts = roleCandidates.filter(c => {
              if (c.currentStage !== 'in_client_process') return false;
              const daysSinceUpdate = Math.floor(
                (now.getTime() - new Date(c.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
              );
              if (c.alertCleared && c.alertClearedDate) {
                const daysSinceCleared = Math.floor(
                  (now.getTime() - new Date(c.alertClearedDate).getTime()) / (1000 * 60 * 60 * 24)
                );
                return daysSinceCleared >= 5;
              }
              return daysSinceUpdate >= 5;
            }).length;

            // Count final stages candidates with 3+ days without update
            const finalStagesAlerts = roleCandidates.filter(c => {
              if (c.currentStage !== 'final_stages') return false;
              const daysSinceUpdate = Math.floor(
                (now.getTime() - new Date(c.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
              );
              if (c.alertCleared && c.alertClearedDate) {
                const daysSinceCleared = Math.floor(
                  (now.getTime() - new Date(c.alertClearedDate).getTime()) / (1000 * 60 * 60 * 24)
                );
                return daysSinceCleared >= 3;
              }
              return daysSinceUpdate >= 3;
            }).length;

            // Total action items
            let actionItemCount = 0;
            if (newCandidates > 0) actionItemCount++;
            if (qualifiedAlerts > 0) actionItemCount++;
            if (twillAlerts > 0) actionItemCount++;
            if (clientProcessAlerts > 0) actionItemCount++;
            if (finalStagesAlerts > 0) actionItemCount++;

            return (
              <button
                key={r.id}
                onClick={() => router.push(`/dashboard/role/${r.id}`)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                <div className="font-medium text-sm truncate">{r.title}</div>
                <div className={`text-xs mt-1 truncate ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {roleClient?.company}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className={`flex items-center gap-1 text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    <Users className="h-3 w-3" />
                    {candidateCount}
                  </div>
                  <div className="flex items-center gap-2">
                    {actionItemCount > 0 && (
                      <div className={`flex items-center justify-center h-5 min-w-5 px-1.5 rounded text-xs font-semibold ${
                        isActive
                          ? 'bg-primary-foreground text-primary'
                          : 'bg-destructive text-destructive-foreground'
                      }`}>
                        {actionItemCount}
                      </div>
                    )}
                    {!isActive && (
                      <div className="scale-75 origin-right">
                        <PriorityBadge priority={r.priority} />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main pipeline view */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="border-b bg-background p-6 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{role.title}</h1>
              <p className="text-muted-foreground mt-1">
                {client.company} · {roleCandidates.length} candidates
              </p>
            </div>
            <PriorityBadge priority={role.priority} />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <RoleAlerts
            role={role}
            candidates={roleCandidates}
            clientName={client.company}
          />
          <PipelineView
            candidates={roleCandidates}
            onStatusChange={updateCandidateStage}
            highlightCandidateId={highlightCandidateId || undefined}
          />
        </div>
      </div>
    </div>
  );
}
