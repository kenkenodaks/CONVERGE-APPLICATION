import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');

  if (error) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:2rem;background:#fef2f2;color:#991b1b">
        <h2>Authorization denied</h2><p>${error}</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  if (!code) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:2rem">No code received.</body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    `${appUrl}/api/oauth/callback`
  );

  const { tokens } = await oauth2Client.getToken(code);
  const refreshToken = tokens.refresh_token;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>OAuth Setup — Converge App</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1rem; }
    .card { background: white; border-radius: 16px; padding: 2rem; max-width: 560px; width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    h2 { color: #16a34a; margin: 0 0 0.5rem; }
    p { color: #64748b; font-size: 14px; margin: 0 0 1.5rem; }
    .token-box { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; font-family: monospace; font-size: 12px; word-break: break-all; color: #1e293b; margin-bottom: 1.5rem; }
    .step { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 1rem; font-size: 13px; color: #1e40af; }
    .step code { background: #dbeafe; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    .copy-btn { background: #2563eb; color: white; border: none; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; margin-bottom: 1.5rem; }
    .copy-btn:hover { background: #1d4ed8; }
    .check { color: #16a34a; font-size: 48px; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="check">✅</div>
    <h2>Authorization Successful!</h2>
    <p>Copy the refresh token below and add it to your <strong>.env.local</strong> file.</p>

    <div class="token-box" id="token">${refreshToken ?? 'No refresh token returned — try visiting /api/oauth/setup again'}</div>

    <button class="copy-btn" onclick="copyToken()">Copy Refresh Token</button>

    <div class="step">
      <strong>Add this line to your .env.local:</strong><br/><br/>
      <code>GOOGLE_OAUTH_REFRESH_TOKEN=${refreshToken ?? 'PASTE_TOKEN_HERE'}</code><br/><br/>
      Then <strong>restart</strong> the dev server with <code>npm run dev</code> and try submitting the form again.
    </div>
  </div>
  <script>
    function copyToken() {
      navigator.clipboard.writeText(document.getElementById('token').innerText);
      event.target.textContent = 'Copied!';
      setTimeout(() => event.target.textContent = 'Copy Refresh Token', 2000);
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}
