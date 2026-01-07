'use client';

import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/contexts/UserContext';
import { useData } from '@/contexts/DataContext';
import { PriorityBadge } from '@/components/task-list/PriorityBadge';
import { PipelineView } from '@/components/task-list/PipelineView';
import { useMemo, useEffect } from 'react';

export default function KanbanPage() {
  const router = useRouter();
  const { currentUser, userRole } = useCurrentUser();
  const { roles, candidates, clients, updateCandidateStage } = useData();

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

  // Select first role by default
  const selectedRole = sortedRoles[0];
  const selectedClient = selectedRole ? clients.find(c => c.id === selectedRole.clientId) : null;
  const selectedCandidates = selectedRole ? candidates.filter(c => c.roleId === selectedRole.id) : [];

  // Redirect to first role's pipeline page
  useEffect(() => {
    if (selectedRole) {
      router.push(`/dashboard/role/${selectedRole.id}`);
    }
  }, [selectedRole, router]);

  if (!selectedRole || !selectedClient) {
    return (
      <div className="flex h-full overflow-hidden">
        {/* Sidebar with role list */}
        <aside className="w-80 border-r bg-background overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b sticky top-0 bg-background z-10">
            <h3 className="font-semibold text-sm text-muted-foreground">
              YOUR ROLES (0)
            </h3>
          </div>
          <div className="p-4 text-center text-muted-foreground">
            No roles assigned yet
          </div>
        </aside>

        {/* Empty main area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">No roles available</p>
            <p className="text-sm mt-2">Roles will appear here when assigned</p>
          </div>
        </div>
      </div>
    );
  }

  // This will redirect, so this won't actually render
  return null;
}
