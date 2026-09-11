import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Minimal data-fetching hook shared by every resource hook below. Wraps an
 * async call with loading/error state and a `refetch` you can call after a
 * mutation. Deliberately simple (no cache) since the mock API already lives
 * in memory/localStorage — swap for TanStack Query later if/when real
 * network calls make caching worthwhile.
 */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, isLoading: true, error: null });
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const refetch = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    return fnRef.current()
      .then((data) => setState({ data, isLoading: false, error: null }))
      .catch((error) => setState({ data: null, isLoading: false, error }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
