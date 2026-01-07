'use client';

import { useState } from 'react';
import { Role, Candidate, Client, PipelineStage } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { PriorityBadge } from './PriorityBadge';
import { PipelineView } from './PipelineView';
import { Users, ArrowRight } from 'lucide-react';

interface RoleCardProps {
  role: Role;
  client: Client;
  candidates: Candidate[];
  onStatusChange: (candidateId: string, newStage: PipelineStage) => void;
}

export function RoleCardSimple({ role, client, candidates, onStatusChange }: RoleCardProps) {
  const [isPipelineOpen, setIsPipelineOpen] = useState(false);

  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter(
    c => !['unqualified', 'rejection_0', 'rejection_1', 'rejection_2', 'signed_offer'].includes(c.currentStage)
  );

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsPipelineOpen(true)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{role.title}</CardTitle>
              <CardDescription className="mt-1">
                {client.company}
              </CardDescription>
            </div>
            <PriorityBadge priority={role.priority} />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{totalCandidates} total candidates</span>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              View Pipeline
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Dialog open={isPipelineOpen} onOpenChange={setIsPipelineOpen}>
        <DialogContent className="w-[95vw] max-w-none p-0">
          <div className="sticky top-0 bg-background border-b p-6 z-10">
            <DialogHeader>
              <div className="flex-1">
                <DialogTitle className="text-2xl">{role.title}</DialogTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  {client.company} · {totalCandidates} candidates
                </div>
              </div>
              <DialogClose onClick={() => setIsPipelineOpen(false)} />
            </DialogHeader>
          </div>

          <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(95vh - 100px)' }}>
            <PipelineView candidates={candidates} onStatusChange={onStatusChange} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
