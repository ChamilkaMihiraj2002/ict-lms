export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;

  // Trim whitespace
  const cleanUrl = url.trim();

  // If it's already just a raw ID without slashes or HTTP
  if (/^[a-zA-Z0-9_-]{25,}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  // Pattern 1: drive.google.com/file/d/{FILE_ID}/view
  const fileDMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: drive.google.com/open?id={FILE_ID} or /uc?id={FILE_ID}
  const idParamMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  return null;
}

export function getGoogleDriveEmbedUrl(url: string): string {
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
}

export function getGoogleDriveDownloadUrl(url: string): string {
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}
