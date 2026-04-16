export const generateId = () => Math.random().toString(36).substring(2, 9);

export const convertDriveLink = (url) => {
  if (!url) return '';
  const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
};