# Twill TA Internal Dashboard

A modern, Kanban-style interface for Talent Advisors to manage candidate referrals through the hiring pipeline. Built to replace the current Airtable workflow with a faster, more intuitive tool.

## Overview

Twill is a platform where roles are posted and candidates are sourced from members and member partners. TAs manage and review submitted referrals, moving them through the hiring process.

**Key Features:**
- **Role Overview Dashboard**: Grid of all your assigned roles
- **Kanban Pipeline View**: Click any role to see candidates organized in columns by stage (just like Airtable!)
- **Quick Status Updates**: Move candidates between stages with one-click buttons
- **Role Switcher Sidebar**: Easily switch between roles without going back to dashboard
- **Alerts System**: Get notified about candidates that need attention

## The Twill Candidate Pipeline

Candidates move through these stages in order:

### Initial Screening
1. **No Status** - Just submitted, not yet reviewed
2. **Qualified** - Worth talking to
3. **Unqualified** - Not a fit for this role
4. **Fit & Hold** - Strong candidate, but not right for this specific role

### TA Process
5. **Twill Interview** - TA conducting internal interview

### Client Submission
6. **Submitted** - Info sent to client for thumbs up/down
7. **Rejection 0** - Client rejected before any interviews

### Client Process
8. **Intro Request Made** - Client wants to talk, email intro sent
9. **In Client Process** - Client is interviewing them
10. **Rejection 1** - Rejected after 1 interview

### Advanced Stages
11. **Middle Stages** - Multiple interviews completed
12. **Rejection 2** - Rejected after 2+ interviews
13. **Final Stages** - Near the end of process

### Offer Stage
14. **Verbal Offer** - Candidate received verbal offer
15. **Signed Offer** - Deal closed! 🎉

## User Experience

### Dashboard View (`/dashboard`)
- Grid of role cards showing:
  - Role title and client company
  - Priority badge (High/Low/Deprioritized)
  - Candidate count
- Click any role card → Opens full pipeline view

### Pipeline View (`/dashboard/role/[roleId]`)
**Left Sidebar:**
- List of all your assigned roles
- Click to instantly switch between role pipelines
- Shows candidate count and priority for each
- "Back to Dashboard" button at top

**Main Area:**
- Horizontal scrolling Kanban board
- Each column = one pipeline stage
- Color-coded: Blue (active), Red (rejected), Green (offers)
- Candidate cards show:
  - Name and email
  - Source (Member/Partner/TA)
  - Days in current stage
  - **Quick Move buttons** to advance to next stages

### Alerts View (`/dashboard/alerts`)
- Prioritized alerts for situations needing attention
- Organized by High/Medium/Low priority
- Dismissible notifications

## Tech Stack

- **Framework**: Next.js 14 (React App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Date Utilities**: date-fns
- **State**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Flow

1. **View Roles**: See grid of 5 assigned roles (default user: Sarah Johnson)
2. **Click a Role**: Opens Kanban pipeline view
3. **Move Candidates**: Click "Quick Move" buttons to update status
4. **Switch Roles**: Use left sidebar to view different role pipelines
5. **Back to Dashboard**: Click "Back to Dashboard" or use browser back button
6. **View Alerts**: Navigate to Alerts page to see notifications
7. **Switch User Type**: Toggle TA/Admin in header (Admin sees all 20 roles)

## Mock Data

**Current prototype includes:**
- 5 Talent Advisors (4 TAs + 1 Admin)
- 12 Clients with various statuses
- 20 Active Roles distributed across TAs
- 27 Candidates across different pipeline stages
- 16 Active Alerts

## Key Interactions

### Moving Candidates
Each candidate card shows "Quick Move" buttons with the next logical stages. For example:
- From "No Status" → Quick moves to "Qualified" or "Unqualified"
- From "Qualified" → Quick moves to "Twill Interview"
- From "Submitted" → Quick moves to "Rejection 0" or "Intro Request Made"

One click updates the status and the card moves to the new column.

### Switching Roles
Instead of going back to the dashboard, TAs can:
1. Use the left sidebar to see all their roles
2. Click any role to instantly load that pipeline
3. Keep working in pipeline view without navigation disruption

### Role-Based Access
- **TA View**: See only your assigned roles (5 roles)
- **Admin View**: See all roles across all TAs (20 roles)
- Toggle using the TA/Admin switcher in the header

## Project Structure

```
app/
├── dashboard/
│   ├── page.tsx                    # Role grid dashboard
│   ├── role/[roleId]/page.tsx     # Pipeline view with sidebar
│   ├── alerts/page.tsx            # Alerts system
│   └── layout.tsx                 # Dashboard shell
│
components/
├── task-list/
│   ├── RoleCardLink.tsx           # Clickable role card
│   ├── PipelineView.tsx           # Kanban board
│   └── PriorityBadge.tsx          # Priority indicator
├── alerts/
│   └── AlertCard.tsx              # Alert notifications
└── ui/                             # Base components

types/
└── candidate.ts                    # 15 pipeline stages defined

lib/
├── mock-data/
│   ├── candidates-new.ts          # Demo candidates
│   ├── roles.ts                   # 20 roles
│   └── clients.ts                 # 12 clients
└── constants/
    └── pipeline-stages.ts         # Stage labels
```

## Color System

**Pipeline Columns:**
- **Blue** (bg-blue-50): Active stages (Qualified, Twill Interview, Submitted, etc.)
- **Red** (bg-red-50): Rejection stages (Rejection 0, 1, 2, Unqualified)
- **Green** (bg-green-50, bg-emerald-50): Success stages (Final Stages, Verbal Offer, Signed Offer)
- **Gray** (bg-gray-50): No Status

**Priority Badges:**
- **High**: Red (client responsive, ready to hire)
- **Low**: Blue (accepting candidates opportunistically)
- **Deprioritized**: Gray (client paused)

## Next Steps for Production

This is currently a **prototype with mock data**. For production:

### Backend
- REST API or GraphQL
- PostgreSQL database
- Authentication (JWT/OAuth)
- Real-time updates (WebSockets)

### Features
- Search/filter candidates
- Bulk status updates
- Notes and comments on candidates
- Email notifications to members
- Slack integration for alerts
- Export to CSV
- Audit log of status changes
- Drag-and-drop to move candidates
- Keyboard shortcuts

### Integration
- Connect to existing Twill member database
- Sync with client data
- Email service for notifications

## Why This Design?

**Inspired by Airtable but optimized for TAs:**
- ✅ Familiar Kanban view TAs already use
- ✅ Faster than Airtable (no database queries needed for each click)
- ✅ Role switcher sidebar keeps TAs in flow
- ✅ Quick Move buttons = less clicking than dropdowns
- ✅ Clean, uncluttered interface
- ✅ Mobile-friendly (horizontal scroll works on touch)

## License

Internal tool - All rights reserved.
