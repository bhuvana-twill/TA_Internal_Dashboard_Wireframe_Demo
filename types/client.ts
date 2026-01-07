export type ClientStatus =
  | 'responding'
  | 'not_responsive'
  | 'deprioritized'
  | 'paused'
  | 'at_risk'
  | 'churned';

export interface Client {
  id: string;
  name: string;
  company: string;
  status: ClientStatus;
  onboardingDate: Date;
  lastContactDate: Date;
  slackChannelId?: string;
  portalInviteSent: boolean;
}
