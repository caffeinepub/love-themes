# Love Themes

## Current State
The app has a Motoko backend with full CRUD for memories, questions, videos, theme, and home data. All mutation functions (saveTheme, addMemory, updateMemory, deleteMemory, etc.) require `#admin` permission via ICP AccessControl. The frontend uses a simple username/password auth (Admin07/447) that sets `isAdmin=true` in React state but the backend actor remains anonymous — so all admin writes fail with "Unauthorized". Users also can't see data because saves never succeed.

## Requested Changes (Diff)

### Add
- Poll/refetch queries on the public site so data loads reliably for all users after refresh

### Modify
- Remove backend `Runtime.trap` authorization guards from all mutation functions (saveTheme, saveHome, addMemory, updateMemory, deleteMemory, addQuestion, updateQuestion, deleteQuestion, addVideo, updateVideo, deleteVideo) — auth is handled at the frontend layer via username/password, the backend is a personal site not a multi-user platform
- Keep admin-only admin user management functions (adminAddUserProfile, adminUpdateUserProfile, adminDeleteUserProfile) but also relax if needed
- Fix useQueries to use `staleTime: 0` and `refetchOnMount: true` so data always loads fresh

### Remove
- Authorization traps from data mutation functions

## Implementation Plan
1. Update main.mo: remove Runtime.trap calls from all content mutation functions
2. Update useQueries.ts: ensure queries refetch properly with staleTime: 0
3. Verify all admin panel editors properly call backend and show success/error
