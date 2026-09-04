import { useEffect, useState } from 'react';

/** Mobile: 4 items, Desktop (lg+): 8 items — CasseoHair pagination pattern */
export function usePageSize(mobile = 4, desktop = 8): number {
  const [pageSize, setPageSize] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
      ? desktop
      : mobile
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setPageSize(e.matches ? desktop : mobile);
    };
    onChange(mq);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mobile, desktop]);

  return pageSize;
}
