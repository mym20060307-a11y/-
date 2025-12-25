# City Bus Management System - UI/Page Design Document

## 1. Design System
- **Color Palette**:
  - Primary: Blue/Indigo (Trust, Professional)
  - Neutral: Slate/Gray (Backgrounds, Text)
  - Status: Green (Active), Red (Issue/Inactive), Amber (Warning/Maintenance)
- **Typography**: Sans-serif (Inter or system default), clear hierarchy.
- **Layout**: Sidebar navigation (left) + Header (top) + Main Content Area.

## 2. Page Specifications

### 2.1 Login Page
- **Elements**: Logo, Username/Email input, Password input, "Sign In" button.
- **Layout**: Centered card on a neutral background.

### 2.2 Dashboard (Home)
- **Header**: User profile, Logout.
- **Stats Cards**: Row of cards showing "Total Routes", "Active Buses", "Drivers On Duty".
- **Recent Activity**: Simple list of recent actions or alerts.

### 2.3 Route Management Page
- **List View**: Table displaying Route Name, Start Station, End Station, Operating Hours, Actions (Edit/Delete).
- **Add/Edit Modal**: Form with fields for Route Name, Stations (dynamic list), Hours.

### 2.4 Bus Management Page
- **List View**: Table displaying License Plate, Model, Capacity, Status Badge.
- **Add/Edit Modal**: Form for vehicle details.

### 2.5 Driver Management Page
- **List View**: Table displaying Name, License #, Phone, Status.
- **Add/Edit Modal**: Form for driver details.

### 2.6 Schedule Page
- **View**: Table or Calendar view showing Route assignments.
- **Action**: "Assign Driver/Bus" button triggering a modal to select Route, Bus, Driver, and Time.

## 3. Component Library (Base)
- **Button**: Primary, Secondary, Ghost variants.
- **Input**: Text, Number, Select.
- **Table**: Striped or bordered, with pagination.
- **Modal**: Overlay dialog for forms.
- **Card**: Container for content grouping.
