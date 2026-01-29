
# Plan: Edit and Remove Teacher Profiles in Admin Panel

## Overview
Add functionality for admins to edit existing teacher profiles and remove teachers from the platform. When a teacher is removed, their authentication account will be disabled, preventing them from logging in.

## Technical Approach

### 1. Create New Edge Function: `remove-teacher`
A backend function that uses the Supabase Service Role Key to:
- Verify the caller is an authenticated admin
- Delete the user from Supabase Auth using `auth.admin.deleteUser()`
- The database trigger will cascade delete the profile and user_role entries

**Location**: `supabase/functions/remove-teacher/index.ts`

### 2. Create New Edge Function: `update-teacher`
A backend function that uses the Supabase Service Role Key to:
- Verify the caller is an authenticated admin
- Update the teacher's profile information in the `profiles` table
- Optionally update email in Supabase Auth if email is changed

**Location**: `supabase/functions/update-teacher/index.ts`

### 3. Update TeachersManagement.tsx

**Add Edit Functionality**:
- Add "Edit" button in the table actions column
- Create an Edit Dialog similar to the Add Teacher dialog but pre-populated with existing data
- Call the `update-teacher` edge function to save changes

**Add Remove Functionality**:
- Add "Remove" button in the Settings tab of teacher detail dialog
- Add confirmation dialog before deletion (using AlertDialog)
- Call the `remove-teacher` edge function
- Show appropriate success/error toast messages
- Refresh the teacher list after successful deletion

### 4. Update supabase/config.toml
Register the two new edge functions:
```toml
[functions.update-teacher]
verify_jwt = false

[functions.remove-teacher]
verify_jwt = false
```

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/remove-teacher/index.ts` | Create | Edge function to delete teacher auth account |
| `supabase/functions/update-teacher/index.ts` | Create | Edge function to update teacher profile |
| `src/pages/admin/TeachersManagement.tsx` | Modify | Add Edit button, Edit dialog, Remove button with confirmation |
| `supabase/config.toml` | Modify | Register new edge functions |

## UI Changes

### Table Actions Column
- Keep existing "View" and "Verify/Unverify" buttons
- Add new "Edit" button with Pencil icon

### Teacher Detail Dialog - Settings Tab
Add a danger zone section with:
- Red "Remove Teacher" button
- Confirmation dialog explaining the action is permanent
- Warning that the teacher will lose access immediately

### Edit Teacher Dialog
- Same fields as Add Teacher (except password)
- Pre-populated with current values
- Photo upload capability
- Save/Cancel buttons

## Security Considerations
- Both edge functions verify admin role before processing
- Use Service Role Key for privileged operations
- JWT verification disabled at function level but validated in code
- Cascade delete ensures no orphaned data
