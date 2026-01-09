'use client';

import { Role, Candidate } from '@/types';
import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';

interface AdminSummaryMetricsProps {
  roles: Role[];
  candidates: Candidate[];
}

export function AdminSummaryMetrics({ roles, candidates }: AdminSummaryMetricsProps) {
  // Calculate total revenue at middle stages (in_client_process, middle_stages)
  const middleStagesRevenue = roles.reduce((total, role) => {
    const roleCandidates = candidates.filter(c => c.roleId === role.id);
    const hasMiddleStage = roleCandidates.some(c =>
      ['in_client_process', 'middle_stages'].includes(c.currentStage)
    );
    return hasMiddleStage ? total + (role.estimatedRevenue || 0) : total;
  }, 0);

  // Calculate total revenue at final stages (final_stages, verbal_offer, signed_offer)
  const finalStagesRevenue = roles.reduce((total, role) => {
    const roleCandidates = candidates.filter(c => c.roleId === role.id);
    const hasFinalStage = roleCandidates.some(c =>
      ['final_stages', 'verbal_offer', 'signed_offer'].includes(c.currentStage)
    );
    return hasFinalStage ? total + (role.estimatedRevenue || 0) : total;
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Middle Stages Revenue */}
      <Card className="p-4 border-l-4 border-l-primary shadow-[0_4px_12px_rgba(1,44,97,0.15)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary/80">Revenue at Middle Stages</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              In Client Process + Middle Stages
            </p>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-bold text-primary">${(middleStagesRevenue / 1000).toFixed(0)}k</p>
        </div>
      </Card>

      {/* Final Stages Revenue */}
      <Card className="p-4 border-l-4 border-l-primary shadow-[0_4px_12px_rgba(1,44,97,0.15)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary/80">Revenue at Final Stages</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Final Stages + Verbal Offer + Signed Offer
            </p>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-bold text-primary">${(finalStagesRevenue / 1000).toFixed(0)}k</p>
        </div>
      </Card>
    </div>
  );
}
