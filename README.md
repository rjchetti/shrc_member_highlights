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


## Deployment & Configuration

### 🚀 Base64 Storage Workaround (Free Tier)
To keep this project on the **Firebase Free Tier** (no billing credit card required), we avoid using Cloud Storage. Instead:
- Images are converted to **Base64 strings** automatically during submission.
- **Limit:** Images must be under **1MB**.
- Data is stored directly in Firestore.

### 🛠️ Setup Instructions
1.  **Environment Variables:** Create a `.env` file based on `.env.example` with your Firebase keys.
2.  **Install Dependencies:** `npm install`
3.  **Local Development:** `npm run dev`
4.  **Build for Production:** `npm run build`
5.  **Deploy to Hosting:** `npx firebase-tools deploy`

### 🔒 Firestore Security Rules
The project includes a `firestore.rules` file. Deploy it via the Firebase CLI or copy the content to the Firebase Console. It ensures:
- Members can only see/edit their own submissions.
- Admins (emails defined in `firebase.ts`) can see and delete everything.

## 📱 Integration with ClubRunner
In the Admin Dashboard, select the highlights you want to include and click **"Copy ClubRunner HTML"**. Paste this directly into a "Static/Custom HTML" block in the ClubRunner email editor.
