import { Loader2 } from 'lucide-react';

export default function Spinner() {
  return (
    <div className="flex h-16 w-16 items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
    </div>
  );
}
