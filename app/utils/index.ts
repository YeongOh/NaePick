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

export function mp4toJpg(pathname: string): string {
  return pathname.substring(0, pathname.lastIndexOf('.')) + '.jpg';
}

export function delay(timeInMillisecond: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeInMillisecond);
  });
}
