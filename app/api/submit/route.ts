import { NextRequest, NextResponse } from 'next/server';
import { validateServerSide } from '@/lib/validations';
import { createApplicationFolder, uploadFileToDrive, saveJsonToDrive } from '@/lib/googleDrive';
import { generateApplicationId } from '@/lib/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png']);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // ── Extract text fields ──────────────────────────────────────────
    const fields = {
      fullName: (formData.get('fullName') as string | null)?.trim() ?? '',
      sitio: (formData.get('sitio') as string | null)?.trim() ?? '',
      barangay: (formData.get('barangay') as string | null)?.trim() ?? '',
      municipality: (formData.get('municipality') as string | null)?.trim() ?? '',
      cellphone: (formData.get('cellphone') as string | null)?.trim() ?? '',
      email: (formData.get('email') as string | null)?.trim() ?? '',
    };

    // ── Validate text fields ─────────────────────────────────────────
    const validation = validateServerSide(fields);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed. Please check the highlighted fields.',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // ── Validate photo ───────────────────────────────────────────────
    const photoFile = formData.get('photo') as File | null;
    if (!photoFile || photoFile.size === 0) {
      return NextResponse.json(
        { success: false, message: 'A photo is required.' },
        { status: 400 }
      );
    }
    if (!ALLOWED_TYPES.has(photoFile.type)) {
      return NextResponse.json(
        { success: false, message: 'Only JPG and PNG images are accepted.' },
        { status: 400 }
      );
    }
    if (photoFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Photo must be smaller than 5 MB.' },
        { status: 400 }
      );
    }

    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());

    // ── Create Google Drive folder ───────────────────────────────────
    const folderId = await createApplicationFolder(fields.fullName);

    // ── Upload photo ─────────────────────────────────────────────────
    const ext = photoFile.name.split('.').pop() ?? 'jpg';
    const safeFileName = `photo_${Date.now()}.${ext}`;
    const photoResult = await uploadFileToDrive(folderId, safeFileName, photoFile.type, photoBuffer);

    // ── Save application JSON ────────────────────────────────────────
    const applicationId = generateApplicationId();
    const submittedAt = new Date().toISOString();

    // Only store clean applicant details in Drive
    await saveJsonToDrive(folderId, {
      id: applicationId,
      name: fields.fullName,
      phone: fields.cellphone,
      email: fields.email,
      sitio: fields.sitio,
      barangay: fields.barangay,
      municipality: fields.municipality,
      date: new Date(submittedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      data: {
        applicationId,
        applicantName: fields.fullName,
        submittedAt,
      },
    });
  } catch (err) {
    // Log full Google API error details
    const gErr = err as { status?: number; errors?: unknown[]; message?: string };
    console.error('[submit] status:', gErr?.status);
    console.error('[submit] message:', gErr?.message);
    console.error('[submit] errors:', JSON.stringify(gErr?.errors, null, 2));
    console.error('[submit] full:', err);

    let message = 'An unexpected error occurred. Please try again.';
    if (gErr?.message?.includes('GOOGLE_SERVICE_ACCOUNT_KEY')) {
      message = 'Google Drive is not configured.';
    } else if (gErr?.status === 403) {
      message = `403 Forbidden: ${gErr?.message ?? 'Check Drive API is enabled and folder is shared with Editor access.'}`;
    }

    return NextResponse.json({ success: false, message, _debug: gErr?.errors }, { status: 500 });
  }
}
