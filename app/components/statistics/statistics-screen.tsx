'use client';

import { Candidate, Worldcup } from '@/app/lib/definitions';
import 'dayjs/locale/ko';

interface Props {
  candidates: Candidate[];
  worldcup: Worldcup;
}

export default function StatisticsScreen({ candidates, worldcup }: Props) {
  return (
    <>
      <section className='p-4'></section>
    </>
  );
}
