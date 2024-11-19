import { Publicity } from '@/app/lib/types';

export const publicityText: { [key in Publicity]: string } = {
  public: '모두에게 공개 됩니다.',
  unlisted: '링크를 가지고 있는 사용자만 볼 수 있습니다.',
  private: '만든 사용자만 볼 수 있습니다.',
};

export function translateMediaType(mediaType: string) {
  if (mediaType === 'cdn_img') return '이미지';
  if (mediaType === 'cdn_video') return '동영상';
  if (mediaType === 'chzzk') return '치지직';
  if (mediaType === 'youtube') return '유튜브';
}
