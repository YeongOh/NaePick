import { PopularNextCursor } from '../lib/types';

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

export function isPopularNextCursor(cursor: unknown): cursor is PopularNextCursor {
  return typeof cursor === 'object' && cursor !== null && 'matchCount' in cursor && 'createdAt' in cursor;
}

export function translateCategory(categoryName: string): string {
  switch (categoryName) {
    case 'animations':
      return '애니메이션';
    case 'athletes':
      return '운동선수';
    case 'celebrities':
      return '연예인';
    case 'idols':
      return '아이돌';
    case 'other':
      return '기타';
    case 'actors':
      return '배우';
    case 'streamers':
      return '스트리머';
    case 'songs':
      return '노래';
    case 'manga':
      return '만화';
    case 'singers':
      return '가수';
    case 'webtoons':
      return '웹툰';
    case 'youtubers':
      return '유튜버';
    default:
      return '잘못된 카테고리';
  }
}

export function translatePublicity(publicity: string): string {
  switch (publicity) {
    case 'public':
      return '전체 공개';
    case 'unlisted':
      return '미등록';
    case 'private':
      return '비공개';
    default:
      return '오류';
  }
}
