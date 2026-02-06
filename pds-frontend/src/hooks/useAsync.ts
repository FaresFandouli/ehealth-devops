import { useEffect, useState, useCallback, useRef } from 'react';

interface AsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
): AsyncState<T> & { run: () => Promise<void> } => {
  const { immediate = true, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const isMountedRef = useRef(true);

  const run = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null });

    try {
      const response = await asyncFunction();
      if (isMountedRef.current) {
        setState({ status: 'success', data: response, error: null });
        onSuccess?.(response);
      }
    } catch (error) {
      if (isMountedRef.current) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ status: 'error', data: null, error: err });
        onError?.(err);
      }
    }
  }, [asyncFunction, onSuccess, onError]);

  useEffect(() => {
    isMountedRef.current = true;
    if (immediate) {
      run();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [run, immediate]);

  return { ...state, run };
};

export default useAsync;
