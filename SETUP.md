# Converge Application System — Setup Guide

## Prerequisites
- Node.js 18+
- A Google account
- A Google Cloud project

---

## Step 1 — Install Dependencies

```bash
cd app
npm install
```

---

## Step 2 — Google Cloud Project Setup

### 2a. Create a Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click **"New Project"**
3. Name it `converge-application` → **Create**
4. Select the project from the top dropdown

### 2b. Enable Google Drive API

1. In the left sidebar, go to **APIs & Services → Library**
2. Search for **"Google Drive API"**
3. Click it → **Enable**

### 2c. Create a Service Account

1. Go to **APIs & Services → Credentials**
2. Click **"+ Create Credentials" → Service Account**
3. Name: `converge-drive-writer`
4. Role: **Editor** (or custom role with Drive file permissions)
5. Click **Done**
6. Click the created service account → **Keys** tab
7. **Add Key → Create New Key → JSON**
8. A `*.json` file downloads — **keep it safe!**

---

## Step 3 — Google Drive Folder Setup

1. Go to https://drive.google.com
2. Create a folder named **"Converge Applications"**
3. Right-click the folder → **Share**
4. Paste your service account email (found in the JSON key as `client_email`) 
   - e.g., `converge-drive-writer@your-project.iam.gserviceaccount.com`
5. Set permission to **Editor** → Done
6. Copy the **Folder ID** from the URL:
   - URL example: `https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`
   - Folder ID = `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`

---

## Step 4 — Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in:

### Encode your service account key (Base64):

**On macOS/Linux:**
```bash
base64 -i service-account.json | tr -d '\n'
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json"))
```

**On Windows (Git Bash):**
```bash
base64 -w 0 service-account.json
```

3. Paste the base64 output as `GOOGLE_SERVICE_ACCOUNT_KEY`:

```env
GOOGLE_SERVICE_ACCOUNT_KEY=eyJ0eXBlIjoic2Vydmljz...  (your base64 string)
GOOGLE_DRIVE_FOLDER_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
ADMIN_SECRET=your_strong_admin_password_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 5 — Run the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

- **Application Form:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin

---

## Step 6 — Test the Form

1. Fill out all form fields
2. Upload a JPG/PNG photo (< 5 MB)
3. Click **Submit Application**
4. You should be redirected to `/success` with an Application ID
5. Check your Google Drive folder — you should see:
   ```
   Converge Applications/
   └── Juan Dela Cruz — 2026-04-26/
       ├── photo_1745654321.jpg
       └── application-data.json
   ```

---

## Admin Dashboard

1. Go to http://localhost:3000/admin
2. Enter the `ADMIN_SECRET` password you set in `.env.local`
3. View all submitted applications
4. Click the external link icon to open the applicant's folder in Google Drive

---

## Deployment — Vercel

1. Push your code to GitHub (make sure `.env.local` is in `.gitignore`)

2. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. In the Vercel dashboard → **Settings → Environment Variables**, add:
   - `GOOGLE_SERVICE_ACCOUNT_KEY`
   - `GOOGLE_DRIVE_FOLDER_ID`
   - `ADMIN_SECRET`
   - `NEXT_PUBLIC_APP_URL` (set to your production URL)

5. Redeploy:
   ```bash
   vercel --prod
   ```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_KEY is not set` | Add the env var in `.env.local` |
| `403 Forbidden` from Drive API | Make sure you shared the Drive folder with the service account email |
| `File upload fails` | Check that the Drive API is enabled in Google Cloud Console |
| Photo not showing in admin | Google Drive thumbnail takes a few minutes to generate |
| `Invalid password` in admin | Check `ADMIN_SECRET` in your `.env.local` |

---

## File Structure

```
app/
├── app/
│   ├── layout.tsx          — Root layout (Navbar, Footer, Toaster)
│   ├── page.tsx            — Landing page + embedded form
│   ├── globals.css         — Global styles + Tailwind
│   ├── success/page.tsx    — Success confirmation page
│   ├── admin/page.tsx      — Admin dashboard
│   └── api/
│       ├── submit/route.ts       — POST: handle form submission
│       └── applications/route.ts — GET: list applications (admin)
├── components/
│   ├── ApplicationForm.tsx — 4-step multi-step form
│   ├── FileUpload.tsx      — Drag & drop photo upload
│   ├── ProgressSteps.tsx   — Step indicator
│   ├── Navbar.tsx          — Navigation bar
│   └── Footer.tsx          — Footer
├── lib/
│   ├── googleDrive.ts      — All Google Drive API logic
│   ├── validations.ts      — Zod schemas (shared frontend/backend)
│   └── utils.ts            — Helpers (cn, formatDate, etc.)
├── types/
│   └── index.ts            — TypeScript interfaces
├── .env.local.example      — Environment variable template
└── SETUP.md                — This file
```
