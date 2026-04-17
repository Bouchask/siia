import { API_BASE_URL } from '../services/api';

/**
 * Converts a Google Drive link into a backend-proxied URL.
 * This is the most reliable way as it uses the service account to fetch private images.
 */
export const convertDriveLink = (url) => {
  if (!url) return "";

  // Extract the unique file ID
  const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);

  if (match && match[1]) {
    const fileId = match[1];
    // Point to your Flask backend proxy endpoint
    return `${API_BASE_URL}/api/drive/proxy/${fileId}`;
  }

  return url;
};
