# TA Internal Dashboard - Demo Walkthrough

## Overview
This demo showcases the Talent Advisor (TA) internal dashboard with two main views: **Dashboard** and **Kanban View**. The application provides comprehensive tools for managing candidate pipelines across multiple roles.

---

## 🔑 Key Features to Notice

### **Navigation**
- Two main pages accessible from the header:
  - **Dashboard**: Overview of all assigned roles
  - **Kanban View**: Detailed pipeline management for individual roles

- **View Switcher (Demo Only)**: The TA/Admin toggle in the header is for demonstration purposes only. In production, users automatically see their appropriate view based on their email address—TAs see only their assigned roles, while Admins see all roles across all TAs.

---

## 📊 Dashboard Page

### **Role Cards Overview**
Each role card displays critical information at a glance:

1. **Priority Classification**
   - **High Priority**: Black badge - Client is responsive and ready to hire
   - **Low Priority**: Gray badge - Client accepting candidates opportunistically
   - **De-prioritized**: Light gray badge - Client needs to pause

2. **Alert Notifications**
   - Red badge on role title shows number of active alerts
   - **New Candidate Alerts**: Candidates submitted in the last 24 hours
   - **No Status Duration Alerts**: Candidates waiting in "no status" stage for:
     - 2+ business days
     - 3+ business days
     - 5+ business days

3. **Time-to-Action Metrics**
   Displayed at the top of each role card:
   - **Time to 1st Submit**: Days from role creation to first candidate submission
   - **Time to 1st Qualified**: Days to first qualified candidate submission
   - **Time to 5 Qualified**: Days to achieve five qualified candidate submissions

4. **Pipeline Stage Breakdown**
   - Mini cards showing candidate counts across active pipeline stages
   - Only displays stages that currently have candidates
   - Limited to 6 most important stages to avoid clutter

5. **Quick Stats**
   - Total candidate count for the role
   - "View Pipeline" link to navigate to detailed Kanban view

---

## 📋 Kanban View (Click Any Role Card)

### **Sidebar Navigation**
- **Roles List**: Quick access to all assigned roles
- Click any role to switch between different candidate pipelines

### **Pipeline Stages**
Candidates organized in columns representing their current stage:
- Submitted Referrals
- Member Partners
- Members
- TA Sourcing
- Validated
- Awaiting Screening
- Screened
- Submitted to Client
- Awaiting Feedback
- Client Approved
- Interview stages (1, 2)
- Take Home Exercise
- Reference Checks
- Hired
- Disqualified stages

### **Candidate Cards**

#### **Visual Indicators**
- **Highlighted Cards**: Candidates requiring TA action are visually emphasized
- **Time-Based Sorting**: Cards automatically sorted by time spent in current stage (longest waiting time appears first)

#### **Quick Actions**

1. **Change Status** (Primary Action)
   - Dropdown showing ALL available pipeline stages
   - Allows moving candidates to any stage in the pipeline

2. **Quick Move** (Efficiency Feature)
   - Smart shortcuts showing only the most commonly used stages that follow the current stage
   - Reduces clicks for typical workflow progressions
   - Example: If candidate is in "Screened", Quick Move might show "Submitted to Client", "Awaiting Feedback", etc.

3. **Bulk Selection**
   - Checkbox on each candidate card
   - Select multiple candidates simultaneously
   - Move entire batch to a different stage at once
   - Ideal for processing multiple candidates through the same stage transition

### **Stage Cards (Pipeline Summary)**
- Display count of candidates in each pipeline stage
- Shows mini cards with both the number and stage label
- Helps TAs quickly identify bottlenecks or stages requiring attention

---

## 💡 Workflow Tips

1. **Start on Dashboard**: Get a high-level view of all your roles, prioritize based on alerts and role priority
2. **Investigate Alerts**: Check roles with notification badges for urgent actions
3. **Dive into Kanban**: Click any role card to access detailed candidate management
4. **Use Quick Move**: Save time by using Quick Move for standard progressions
5. **Bulk Actions**: When multiple candidates need the same status change, use checkboxes for batch operations
6. **Monitor Time Metrics**: Keep an eye on "time in stage" to identify stalled candidates

---

## 🎯 Demo-Specific Notes

- The **TA/Admin View Switcher** in the header demonstrates how different user roles see different data
- In production, this switcher will not exist—users are automatically assigned their view based on email authentication
- **TA View**: Shows only roles assigned to that specific Talent Advisor
- **Admin View**: Shows all roles across all Talent Advisors for oversight and management

---

## 🎨 Design Philosophy

- **Black & White Interface**: Clean, professional appearance with minimal color distraction
- **Color Reserved for Alerts**: Red used exclusively for high-priority notifications and alerts
- **Pipeline Cards**: Maintain visual distinction while keeping the overall aesthetic minimal
- **Focus on Functionality**: Every UI element serves a clear purpose in the TA workflow
