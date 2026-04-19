import { API_BASE_URL } from '../../services/api';

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const convertDriveLink = (url) => {
  if (!url) return '';
  
  // Extract ID
  const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
  if (match && match[1]) {
    // Return backend proxy URL
    return `${API_BASE_URL}/api/drive/proxy/${match[1]}`;
  }
  return url;
};

export const convertDriveViewLink = (url) => {
  if (!url) return '';
  const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/view`;
  }
  return url;
};