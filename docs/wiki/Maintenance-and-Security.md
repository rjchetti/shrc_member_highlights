# Maintenance & Security Guide

This guide is for the Tech Committee or any developer who will maintain the system for the club.

## 1. Managing Admins
Admin access is controlled by an explicit list of email addresses in the codebase. To add or remove a PR/Marketing Chair:
1.  Open `src/lib/firebase.ts`.
2.  Locate the `ADMIN_EMAILS` array:
    ```typescript
    export const ADMIN_EMAILS = [
      'rjchetti@gmail.com', 
      'new.chair@example.com' // Add new emails here
    ];
    ```
3.  Commit and redeploy the application.

## 2. Firebase Security Rules
The system uses Firebase Firestore and Storage. The security rules ensure that and ordinary members can only edit their own submissions.

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{submissionId} {
      // Members can read all (to see their own)
      // Admins can read all for dashboard
      allow read: if request.auth != null; 
      
      // Only the owner of the submission can write/edit
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 3. Storage Folders
*   All profile photos are stored in the `/photos` directory in Cloud Storage.
*   The path format is usually `/photos/{userId}_{timestamp}`.

## 4. Updates & Deployment
The app is built with **Vite** and **React**.
*   To run locally: `npm run dev`
*   To build for production: `npm run build`
*   To deploy: Ensure the environment variables in `.env.production` (or your CI/CD provider) match the club's Firebase project.

## 5. Branding
To update the club logo or primary colors:
1.  **Logo**: Update the URL in `src/App.tsx` (line 34).
2.  **Colors**: Modify the CSS variables in `src/index.css`.

---
*Back to [Home](Home)*
