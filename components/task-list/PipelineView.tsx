'use client';

import { Candidate, PipelineStage } from '@/types';
import { PIPELINE_STAGE_LABELS, PIPELINE_STAGES } from '@/lib/constants/pipeline-stages';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { getBusinessDaysSince } from '@/lib/utils/date-utils';
import { getQuickMoveOptions, isStageUrgent, getWaitingTimeColorLevel } from '@/lib/utils/quick-move-logic';
import { Clock, Mail, ChevronRight, AlertCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PipelineViewProps {
  candidates: Candidate[];
  onStatusChange: (candidateId: string, newStage: PipelineStage) => void;
}

export function PipelineView({ candidates, onStatusChange }: PipelineViewProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);

  // Group candidates by stage and sort by days in stage (longest first)
  const candidatesByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    const stageCandidates = candidates.filter(c => c.currentStage === stage);
    // Sort by days in stage descending (most urgent first)
    stageCandidates.sort((a, b) => {
      const daysA = getBusinessDaysSince(a.stageEnteredDate);
      const daysB = getBusinessDaysSince(b.stageEnteredDate);
      return daysB - daysA;
    });
    acc[stage] = stageCandidates;
    return acc;
  }, {} as Record<PipelineStage, Candidate[]>);

  const handleToggleSelect = (candidateId: string) => {
    const newSelection = new Set(selectedCandidates);
    if (newSelection.has(candidateId)) {
      newSelection.delete(candidateId);
    } else {
      newSelection.add(candidateId);
    }
    setSelectedCandidates(newSelection);
  };

  const handleBulkMove = (targetStage: PipelineStage) => {
    selectedCandidates.forEach(candidateId => {
      onStatusChange(candidateId, targetStage);
    });
    setSelectedCandidates(new Set());
  };

  const handleClearSelection = () => {
    setSelectedCandidates(new Set());
  };

  const getStageColor = (stage: PipelineStage) => {
    if (stage.includes('rejection') || stage === 'unqualified') {
      return 'bg-red-50 border-red-200';
    }
    if (stage === 'signed_offer') {
      return 'bg-green-50 border-green-200';
    }
    if (stage === 'verbal_offer' || stage === 'final_stages') {
      return 'bg-emerald-50 border-emerald-200';
    }
    if (stage === 'no_status') {
      return 'bg-gray-50 border-gray-200';
    }
    return 'bg-blue-50 border-blue-200';
  };

  return (
    <>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {PIPELINE_STAGES.map((stage) => {
            const stageCandidates = candidatesByStage[stage] || [];
            const count = stageCandidates.length;

            return (
              <div
                key={stage}
                className={cn(
                  'flex-shrink-0 w-80 rounded-lg border-2 p-4',
                  getStageColor(stage)
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">
                    {PIPELINE_STAGE_LABELS[stage]}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {stageCandidates.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-8">
                      No candidates
                    </div>
                  ) : (
                    stageCandidates.map((candidate) => (
                      <CandidateCardKanban
                        key={candidate.id}
                        candidate={candidate}
                        onStatusChange={onStatusChange}
                        isSelected={selectedCandidates.has(candidate.id)}
                        onToggleSelect={handleToggleSelect}
                        onShowDetail={setDetailCandidate}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedCandidates.size > 0 && (
        <BulkActionBar
          selectedCount={selectedCandidates.size}
          onMove={handleBulkMove}
          onClear={handleClearSelection}
        />
      )}

      {/* Candidate Detail Modal */}
      {detailCandidate && (
        <CandidateDetailModal
          candidate={detailCandidate}
          onClose={() => setDetailCandidate(null)}
          onStatusChange={onStatusChange}
        />
      )}
    </>
  );
}

interface CandidateCardKanbanProps {
  candidate: Candidate;
  onStatusChange: (candidateId: string, newStage: PipelineStage) => void;
  isSelected: boolean;
  onToggleSelect: (candidateId: string) => void;
  onShowDetail: (candidate: Candidate) => void;
}

function CandidateCardKanban({
  candidate,
  onStatusChange,
  isSelected,
  onToggleSelect,
  onShowDetail
}: CandidateCardKanbanProps) {
  const daysInStage = getBusinessDaysSince(candidate.stageEnteredDate);
  const colorLevel = getWaitingTimeColorLevel(candidate.currentStage, daysInStage);

  // Get smart quick move options
  const quickMoveOptions = getQuickMoveOptions(candidate.currentStage);

  // Get referral origin label
  const sourceLabel = {
    member_referral: 'Member',
    member_partner: 'Member Plus',
    ta_sourced: 'TA Sourced',
  }[candidate.source];

  // Color coding based on Slack notification thresholds
  const getBorderColor = () => {
    if (colorLevel === 'critical') return 'border-red-500 border-2'; // 3BD for review, 5BD for screening
    if (colorLevel === 'urgent') return 'border-orange-400 border-2';  // 2BD for review
    if (colorLevel === 'warning') return 'border-yellow-400 border-2'; // 4BD for screening
    return 'border-gray-200';
  };

  const getTimeColor = () => {
    if (colorLevel === 'critical') return 'text-red-600 font-bold';
    if (colorLevel === 'urgent') return 'text-orange-600 font-semibold';
    if (colorLevel === 'warning') return 'text-yellow-600 font-semibold';
    return 'text-muted-foreground';
  };

  return (
    <div
      className={cn(
        'rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition-all',
        isSelected && 'ring-2 ring-primary',
        getBorderColor()
      )}
    >
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Checkbox
            checked={isSelected}
            onChange={() => onToggleSelect(candidate.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <button
              onClick={() => onShowDetail(candidate)}
              className="font-medium text-sm hover:text-primary text-left w-full"
            >
              {candidate.name}
            </button>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Mail className="h-3 w-3" />
              <span className="truncate">{candidate.email}</span>
            </div>
            <Badge variant="outline" className="text-xs mt-1.5">
              {sourceLabel}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1.5 pb-1 border-t border-b">
          <div className="text-xs text-muted-foreground">Time in stage:</div>
          <div className={cn("flex items-center gap-1.5 font-bold text-sm", getTimeColor())}>
            <Clock className="h-4 w-4" />
            <span>{daysInStage}d</span>
            {colorLevel === 'critical' && <Bell className="h-4 w-4 animate-pulse" />}
            {colorLevel === 'urgent' && <AlertCircle className="h-4 w-4" />}
          </div>
        </div>

        {/* Full Status Dropdown */}
        <div className="pt-2 border-t">
          <label className="text-xs text-muted-foreground block mb-1">
            Change Status:
          </label>
          <select
            value={candidate.currentStage}
            onChange={(e) => onStatusChange(candidate.id, e.target.value as PipelineStage)}
            className="w-full text-xs border rounded px-2 py-1 bg-white hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          >
            {PIPELINE_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {PIPELINE_STAGE_LABELS[stage]}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Move Buttons */}
        {quickMoveOptions.length > 0 && (
          <div className="pt-2 space-y-1">
            <div className="text-xs text-muted-foreground mb-1">Quick Move:</div>
            {quickMoveOptions.slice(0, 3).map((stage) => (
              <Button
                key={stage}
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(candidate.id, stage)}
                className="w-full justify-between text-xs h-7"
              >
                <span className="truncate">{PIPELINE_STAGE_LABELS[stage]}</span>
                <ChevronRight className="h-3 w-3 ml-1 flex-shrink-0" />
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Bulk Action Bar Component
interface BulkActionBarProps {
  selectedCount: number;
  onMove: (stage: PipelineStage) => void;
  onClear: () => void;
}

function BulkActionBar({ selectedCount, onMove, onClear }: BulkActionBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-4 rounded-lg shadow-lg border-2 border-primary-foreground/20 z-50">
      <div className="flex items-center gap-4">
        <span className="font-semibold">{selectedCount} selected</span>
        <div className="h-6 w-px bg-primary-foreground/30" />
        <div className="flex items-center gap-2">
          <span className="text-sm">Move to:</span>
          <select
            onChange={(e) => {
              if (e.target.value) {
                onMove(e.target.value as PipelineStage);
              }
            }}
            className="bg-white text-gray-900 rounded px-3 py-1 text-sm border-0 focus:ring-2 focus:ring-white"
          >
            <option value="">Select stage...</option>
            {PIPELINE_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {PIPELINE_STAGE_LABELS[stage]}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          Clear Selection
        </Button>
      </div>
    </div>
  );
}

// Candidate Detail Modal Component
interface CandidateDetailModalProps {
  candidate: Candidate;
  onClose: () => void;
  onStatusChange: (candidateId: string, newStage: PipelineStage) => void;
}

function CandidateDetailModal({ candidate, onClose, onStatusChange }: CandidateDetailModalProps) {
  const daysInStage = getBusinessDaysSince(candidate.stageEnteredDate);
  const daysSinceSubmitted = getBusinessDaysSince(candidate.submittedDate);

  const sourceLabel = {
    member_referral: 'Member Referral',
    member_partner: 'Member Partner',
    ta_sourced: 'TA Sourced',
  }[candidate.source];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{candidate.name}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">CONTACT INFO</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${candidate.email}`} className="text-primary hover:underline">
                  {candidate.email}
                </a>
              </div>
            </div>
          </div>

          {/* Source & Timeline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">SOURCE</h3>
              <Badge variant="outline">{sourceLabel}</Badge>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">TIME IN PIPELINE</h3>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{daysSinceSubmitted} business days</span>
              </div>
            </div>
          </div>

          {/* Current Stage */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">CURRENT STAGE</h3>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div>
                <div className="font-semibold">{PIPELINE_STAGE_LABELS[candidate.currentStage]}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {daysInStage} days in this stage
                </div>
              </div>
              {isStageUrgent(candidate.currentStage, daysInStage) && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Needs Attention
                </Badge>
              )}
            </div>
          </div>

          {/* Stage History Timeline */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">STAGE HISTORY</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="w-0.5 h-full bg-border mt-1" />
                </div>
                <div className="pb-4">
                  <div className="font-medium">{PIPELINE_STAGE_LABELS[candidate.currentStage]}</div>
                  <div className="text-sm text-muted-foreground">
                    {candidate.stageEnteredDate.toLocaleDateString()} - Present ({daysInStage} days)
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                </div>
                <div>
                  <div className="font-medium">Submitted</div>
                  <div className="text-sm text-muted-foreground">
                    {candidate.submittedDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">UPDATE STATUS</h3>
            <div className="grid grid-cols-2 gap-2">
              {getQuickMoveOptions(candidate.currentStage).map((stage) => (
                <Button
                  key={stage}
                  variant="outline"
                  onClick={() => {
                    onStatusChange(candidate.id, stage);
                    onClose();
                  }}
                  className="justify-between"
                >
                  <span>{PIPELINE_STAGE_LABELS[stage]}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* All Stages Dropdown */}
          <div>
            <label className="font-semibold text-sm text-muted-foreground block mb-2">
              OR MOVE TO ANY STAGE
            </label>
            <select
              value={candidate.currentStage}
              onChange={(e) => {
                onStatusChange(candidate.id, e.target.value as PipelineStage);
                onClose();
              }}
              className="w-full border rounded-md px-3 py-2"
            >
              {PIPELINE_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {PIPELINE_STAGE_LABELS[stage]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
