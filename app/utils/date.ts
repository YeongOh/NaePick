import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export function getRelativeDate(date: string | Date) {
  return dayjs(date).fromNow();
}

export function sortDate(
  a: string | Date,
  b: string | Date,
  order: 'newest' | 'oldest'
) {
  if (order === 'newest') return dayjs(a).isAfter(dayjs(b)) ? -1 : 1;
  return dayjs(a).isAfter(dayjs(b)) ? 1 : -1;
}
