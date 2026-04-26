export interface ApplicationFormData {
  fullName: string;
  sitio: string;
  barangay: string;
  municipality: string;
  cellphone: string;
  email: string;
  photo: File | null;
}

export interface ApplicationRecord {
  id: string;
  fullName: string;
  sitio: string;
  barangay: string;
  municipality: string;
  cellphone: string;
  email: string;
  photoFileId?: string;
  photoWebViewLink?: string;
  photoThumbnailLink?: string;
  submittedAt: string;
  folderId: string;
  applicationId: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

export interface DriveFolder {
  id: string;
  name: string;
  createdTime: string;
  webViewLink: string;
  children?: DriveFile[];
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  thumbnailLink?: string;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface SubmissionSuccessData {
  applicationId: string;
  applicantName: string;
  submittedAt: string;
}
