import { Candidate, Role, Client } from '@/types';
import { getBusinessDaysSince } from './date-utils';

export interface RoleAlert {
  roleId: string;
  roleTitle: string;
  clientName: string;
  candidates: Candidate[];
}

export interface DashboardAlerts {
  critical: {
    noStatus5Days: RoleAlert[];
  };
  urgent: {
    noStatus3Days: RoleAlert[];
    newSubmissions: RoleAlert[];
  };
  warning: {
    noStatus2Days: RoleAlert[];
  };
  totalCount: number;
}

/**
 * Calculate all alerts across the dashboard
 */
export function calculateDashboardAlerts(
  roles: Role[],
  candidates: Candidate[],
  clients: Client[]
): DashboardAlerts {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const noStatus5DaysRoles: RoleAlert[] = [];
  const noStatus3DaysRoles: RoleAlert[] = [];
  const noStatus2DaysRoles: RoleAlert[] = [];
  const newSubmissionsRoles: RoleAlert[] = [];

  roles.forEach(role => {
    const roleCandidates = candidates.filter(c => c.roleId === role.id);
    const client = clients.find(c => c.id === role.clientId);

    if (!client) return;

    // Check for candidates in no_status for various durations
    const noStatusCandidates = roleCandidates.filter(c => c.currentStage === 'no_status');

    const noStatus5Days = noStatusCandidates.filter(c =>
      getBusinessDaysSince(new Date(c.stageEnteredDate)) >= 5
    );
    const noStatus3Days = noStatusCandidates.filter(c => {
      const days = getBusinessDaysSince(new Date(c.stageEnteredDate));
      return days >= 3 && days < 5;
    });
    const noStatus2Days = noStatusCandidates.filter(c => {
      const days = getBusinessDaysSince(new Date(c.stageEnteredDate));
      return days >= 2 && days < 3;
    });

    // Check for new submissions in last 24 hours
    const newCandidates = roleCandidates.filter(c => {
      const submittedDate = new Date(c.submittedDate);
      return submittedDate >= oneDayAgo;
    });

    // Add to alerts if any candidates match
    if (noStatus5Days.length > 0) {
      noStatus5DaysRoles.push({
        roleId: role.id,
        roleTitle: role.title,
        clientName: client.company,
        candidates: noStatus5Days,
      });
    }
    if (noStatus3Days.length > 0) {
      noStatus3DaysRoles.push({
        roleId: role.id,
        roleTitle: role.title,
        clientName: client.company,
        candidates: noStatus3Days,
      });
    }
    if (noStatus2Days.length > 0) {
      noStatus2DaysRoles.push({
        roleId: role.id,
        roleTitle: role.title,
        clientName: client.company,
        candidates: noStatus2Days,
      });
    }
    if (newCandidates.length > 0) {
      newSubmissionsRoles.push({
        roleId: role.id,
        roleTitle: role.title,
        clientName: client.company,
        candidates: newCandidates,
      });
    }
  });

  // Calculate total count (prioritize higher severity)
  let totalCount = 0;
  if (noStatus5DaysRoles.length > 0) totalCount++;
  if (noStatus3DaysRoles.length > 0 && noStatus5DaysRoles.length === 0) totalCount++;
  if (noStatus2DaysRoles.length > 0 && noStatus5DaysRoles.length === 0 && noStatus3DaysRoles.length === 0) totalCount++;
  if (newSubmissionsRoles.length > 0) totalCount++;

  return {
    critical: {
      noStatus5Days: noStatus5DaysRoles,
    },
    urgent: {
      noStatus3Days: noStatus3DaysRoles,
      newSubmissions: newSubmissionsRoles,
    },
    warning: {
      noStatus2Days: noStatus2DaysRoles,
    },
    totalCount,
  };
}
