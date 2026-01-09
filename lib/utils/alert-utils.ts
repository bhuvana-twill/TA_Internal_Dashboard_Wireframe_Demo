import { Candidate, Role, Client } from '@/types';
import { getBusinessDaysSince } from './date-utils';

export interface CandidateAlert {
  candidate: Candidate;
  daysInStage: number;
  alertType: 'new' | 'qualified' | 'twill_screen' | 'client_process' | 'final_stages';
}

export interface RoleAlert {
  roleId: string;
  roleTitle: string;
  clientName: string;
  candidates: CandidateAlert[];
}

export interface DashboardAlerts {
  critical: {
    clientProcess5Days: RoleAlert[];
  };
  urgent: {
    newSubmissions: RoleAlert[];
    qualified3Days: RoleAlert[];
    twillScreen3Days: RoleAlert[];
    finalStages3Days: RoleAlert[];
  };
  totalCount: number;
}

/**
 * Calculate all alerts across the dashboard with new rules:
 * - New candidate status: Until cleared (cleared automatically on stage change)
 * - Qualified status: Flag after 3+ days without update (cleared automatically on stage change)
 * - Twill screen status: Flag after 3+ days without update (cleared automatically on stage change)
 * - Client process: Alert every 5 business days for follow-up (only cleared manually, re-surfaces after 5 days)
 * - Final stages: Alert every 3 days (only cleared manually, re-surfaces after 3 days)
 */
export function calculateDashboardAlerts(
  roles: Role[],
  candidates: Candidate[],
  clients: Client[]
): DashboardAlerts {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const newSubmissionsRoles: RoleAlert[] = [];
  const qualified3DaysRoles: RoleAlert[] = [];
  const twillScreen3DaysRoles: RoleAlert[] = [];
  const clientProcess5DaysRoles: RoleAlert[] = [];
  const finalStages3DaysRoles: RoleAlert[] = [];

  roles.forEach(role => {
    const roleCandidates = candidates.filter(c => c.roleId === role.id);
    const client = clients.find(c => c.id === role.clientId);

    if (!client) return;

    // New submissions in last 24 hours (auto-clears when stage changes)
    const newCandidates = roleCandidates
      .filter(c => {
        const submittedDate = new Date(c.submittedDate);
        // Show if submitted in last 24 hours, only clear when they move to a different stage
        return submittedDate >= oneDayAgo;
      })
      .map(c => ({
        candidate: c,
        daysInStage: 0,
        alertType: 'new' as const,
      }));

    // Qualified status - 3+ days without update (auto-clears when stage changes)
    const qualifiedCandidates = roleCandidates
      .filter(c => {
        if (c.currentStage !== 'qualified') return false;
        const daysSinceUpdate = getBusinessDaysSince(new Date(c.lastUpdatedDate));
        return daysSinceUpdate >= 3;
      })
      .map(c => ({
        candidate: c,
        daysInStage: getBusinessDaysSince(new Date(c.lastUpdatedDate)),
        alertType: 'qualified' as const,
      }));

    // Twill screen status - 3+ days without update (auto-clears when stage changes)
    const twillScreenCandidates = roleCandidates
      .filter(c => {
        if (c.currentStage !== 'twill_interview') return false;
        const daysSinceUpdate = getBusinessDaysSince(new Date(c.lastUpdatedDate));
        return daysSinceUpdate >= 3;
      })
      .map(c => ({
        candidate: c,
        daysInStage: getBusinessDaysSince(new Date(c.lastUpdatedDate)),
        alertType: 'twill_screen' as const,
      }));

    // Client process - alert every 5 business days (manual clear, re-surfaces after 5 days)
    const clientProcessCandidates = roleCandidates
      .filter(c => {
        if (c.currentStage !== 'in_client_process') return false;
        const daysSinceUpdate = getBusinessDaysSince(new Date(c.lastUpdatedDate));
        // If alert was cleared, check if 5 days have passed since clearing
        if (c.alertCleared && c.alertClearedDate) {
          const daysSinceCleared = getBusinessDaysSince(new Date(c.alertClearedDate));
          return daysSinceCleared >= 5;
        }
        // Otherwise, show if 5+ days since update
        return daysSinceUpdate >= 5;
      })
      .map(c => ({
        candidate: c,
        daysInStage: getBusinessDaysSince(new Date(c.lastUpdatedDate)),
        alertType: 'client_process' as const,
      }));

    // Final stages - alert every 3 days (manual clear, re-surfaces after 3 days)
    const finalStagesCandidates = roleCandidates
      .filter(c => {
        if (c.currentStage !== 'final_stages') return false;
        const daysSinceUpdate = getBusinessDaysSince(new Date(c.lastUpdatedDate));
        // If alert was cleared, check if 3 days have passed since clearing
        if (c.alertCleared && c.alertClearedDate) {
          const daysSinceCleared = getBusinessDaysSince(new Date(c.alertClearedDate));
          return daysSinceCleared >= 3;
        }
        // Otherwise, show if 3+ days since update
        return daysSinceUpdate >= 3;
      })
      .map(c => ({
        candidate: c,
        daysInStage: getBusinessDaysSince(new Date(c.lastUpdatedDate)),
        alertType: 'final_stages' as const,
      }));

    // Add to alerts if any candidates match
    if (newCandidates.length > 0) {
      newSubmissionsRoles.push({
        roleId: role.id,
        roleTitle: role.title,
        clientName: client.company,
        candidates: newCandidates,
      });
    }
    if (qualifiedCandidates.length > 0) {
      qualified3DaysRoles.push({
        roleId: role.id,
        roleTitle: role.title,
        clientName: client.company,
        candidates: qualifiedCandidates,
      });
    }
    if (twillScreenCandidates.length > 0) {
      twillScreen3DaysRoles.push({
        roleId: role.id,
        roleTitle: role.title,
        clientName: client.company,
        candidates: twillScreenCandidates,
      });
    }
    if (clientProcessCandidates.length > 0) {
      clientProcess5DaysRoles.push({
        roleId: role.id,
        roleTitle: role.title,
        clientName: client.company,
        candidates: clientProcessCandidates,
      });
    }
    if (finalStagesCandidates.length > 0) {
      finalStages3DaysRoles.push({
        roleId: role.id,
        roleTitle: role.title,
        clientName: client.company,
        candidates: finalStagesCandidates,
      });
    }
  });

  // Calculate total count (each category counts as 1)
  let totalCount = 0;
  if (clientProcess5DaysRoles.length > 0) totalCount++;
  if (newSubmissionsRoles.length > 0) totalCount++;
  if (qualified3DaysRoles.length > 0) totalCount++;
  if (twillScreen3DaysRoles.length > 0) totalCount++;
  if (finalStages3DaysRoles.length > 0) totalCount++;

  return {
    critical: {
      clientProcess5Days: clientProcess5DaysRoles,
    },
    urgent: {
      newSubmissions: newSubmissionsRoles,
      qualified3Days: qualified3DaysRoles,
      twillScreen3Days: twillScreen3DaysRoles,
      finalStages3Days: finalStages3DaysRoles,
    },
    totalCount,
  };
}
