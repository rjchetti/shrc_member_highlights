# SHRC Member Highlights System

A high-performance, bilingual (EN/KR) solicitation system for the Seoul Hanmaum Rotary Club (District 3650), designed to showcase professional achievements of its members.

## Features
-   **Authenticated Submission:** Members sign in via Google/Email to share their career highlights.
-   **Edit Capability:** Members can update their current month's submission at any time.
-   **Bilingual UI:** Full support for English and Korean.
-   **Admin Dashboard:** PR/Marketing chair can review, select, and translate highlights.
-   **ClubRunner Export:** One-click copy of responsive HTML for the monthly newsletter.

## Prerequisites
1.  **Firebase Project:** Created via [Firebase Console](https://console.firebase.google.com/).
    -   Enable **Authentication** (Google & Email/Password).
    -   Enable **Cloud Firestore**.
    -   Enable **Cloud Storage**.
2.  **Node.js**: v18+ recommended.

## Setup Instructions
1.  **Environment Variables:** Create a `.env` file in the root directory and add your Firebase configuration:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

2.  **Install & Run:**
    ```bash
    npm install
    npm run dev
    ```

3.  **Firestore Security Rules:** Apply the following rules in the Firebase Console:
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /submissions/{submissionId} {
          // Read: Allow if admin OR if it's the user's own submission
          allow read: if request.auth != null; 
          // Write: Allow if authenticated and matching userId
          allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
          allow update: if request.auth != null && resource.data.userId == request.auth.uid;
        }
      }
    }
    ```
    *Note: For strict Admin-only access to all records, you can check for a specific email or use custom claims.*

## Integration with ClubRunner
In the Admin Dashboard, select the highlights you want to include, choose the output language (EN or KO), and click **"Copy ClubRunner HTML"**. This can be pasted directly into a Custom HTML block in the ClubRunner email editor.
