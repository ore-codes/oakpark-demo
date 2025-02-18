import { useEffect, useState } from 'react';
import { Observable, Subscription } from 'rxjs';

export default function useRxState<T>(observable: Observable<T>): T | undefined {
  const [data, setData] = useState<T>();

  useEffect(() => {
    const subscription: Subscription = observable.subscribe(setData);
    return () => subscription.unsubscribe();
  }, [observable]);

  return data;
}
