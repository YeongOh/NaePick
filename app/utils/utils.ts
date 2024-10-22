import { v4 as uuidv4 } from 'uuid';

export function formatBytes(bytes: number, decimals: number): string {
  if (bytes == 0) return '0 Bytes';
  const k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function excludeFileExtension(fileName: string): string {
  return fileName.slice(0, fileName.lastIndexOf('.'));
}

export function generateUUID() {
  return uuidv4();
}
