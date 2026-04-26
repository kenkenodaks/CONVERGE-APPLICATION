import { google } from 'googleapis';
import { Readable } from 'stream';
import type { DriveFolder } from '@/types';

// Use OAuth2 (user's own Google Drive quota — works with free accounts)
function getDrive() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Missing OAuth2 credentials. Please complete the Google OAuth setup at /api/oauth/setup'
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback`
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

export async function getOrCreateFolder(name: string, parentId?: string): Promise<string> {
  const drive = getDrive();
  const safe = name.replace(/[<>:"/\\|?*]/g, '_');

  const q = [
    `name='${safe}'`,
    `mimeType='application/vnd.google-apps.folder'`,
    `trashed=false`,
    parentId ? `'${parentId}' in parents` : '',
  ]
    .filter(Boolean)
    .join(' and ');

  const existing = await drive.files.list({ q, fields: 'files(id)', spaces: 'drive' });
  if (existing.data.files?.length) return existing.data.files[0].id!;

  const created = await drive.files.create({
    requestBody: {
      name: safe,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId && { parents: [parentId] }),
    },
    fields: 'id',
  });

  return created.data.id!;
}

export async function uploadFileToDrive(
  folderId: string,
  fileName: string,
  mimeType: string,
  buffer: Buffer
): Promise<{ id: string; webViewLink: string; thumbnailLink?: string }> {
  const drive = getDrive();

  const file = await drive.files.create({
    requestBody: { name: fileName, parents: [folderId] },
    media: { mimeType, body: Readable.from(buffer) },
    fields: 'id, webViewLink, thumbnailLink',
  });

  // Make photo publicly viewable (read-only)
  await drive.permissions.create({
    fileId: file.data.id!,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  return {
    id: file.data.id!,
    webViewLink: file.data.webViewLink!,
    thumbnailLink: file.data.thumbnailLink ?? undefined,
  };
}

export async function saveJsonToDrive(
  folderId: string,
  data: Record<string, unknown>
): Promise<string> {
  const drive = getDrive();
  const body = JSON.stringify(data, null, 2);

  const file = await drive.files.create({
    requestBody: {
      name: 'application-data.json',
      parents: [folderId],
      mimeType: 'application/json',
    },
    media: { mimeType: 'application/json', body: Readable.from([body]) },
    fields: 'id',
  });

  return file.data.id!;
}

export async function createApplicationFolder(applicantName: string): Promise<string> {
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const rootName = 'Converge Applications';

  const parentId = rootFolderId ?? (await getOrCreateFolder(rootName));

  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const folderName = `${applicantName} — ${date}`;

  return getOrCreateFolder(folderName, parentId);
}

export async function listApplications(): Promise<DriveFolder[]> {
  const drive = getDrive();
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const q = [
    `mimeType='application/vnd.google-apps.folder'`,
    `trashed=false`,
    rootFolderId ? `'${rootFolderId}' in parents` : '',
  ]
    .filter(Boolean)
    .join(' and ');

  const folders = await drive.files.list({
    q,
    fields: 'files(id, name, createdTime, webViewLink)',
    orderBy: 'createdTime desc',
    pageSize: 100,
  });

  const results = await Promise.all(
    (folders.data.files ?? []).map(async (folder) => {
      const children = await drive.files.list({
        q: `'${folder.id}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, webViewLink, thumbnailLink)',
      });

      return {
        id: folder.id!,
        name: folder.name!,
        createdTime: folder.createdTime!,
        webViewLink: folder.webViewLink!,
        children: (children.data.files ?? []).map((f) => ({
          id: f.id!,
          name: f.name!,
          mimeType: f.mimeType!,
          webViewLink: f.webViewLink!,
          thumbnailLink: f.thumbnailLink ?? undefined,
        })),
      };
    })
  );

  return results;
}
