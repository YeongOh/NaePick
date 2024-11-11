import dayjs from '@/app/utils/dayjs';

export function sortDate(a: string | Date, b: string | Date, order: 'newest' | 'oldest') {
  if (order === 'newest') return dayjs(a).isAfter(dayjs(b)) ? -1 : 1;
  return dayjs(a).isAfter(dayjs(b)) ? 1 : -1;
}
