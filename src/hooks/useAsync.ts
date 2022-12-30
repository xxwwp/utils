import { useEffect, useMemo, useState } from "react";

type PromiseState = "pending" | "fulfilled" | "rejected";

interface AsyncFunction<P extends any[], D = any> {
  (...args: P): Promise<D>;
}

interface UseAsyncOptions {
  /** 延时 loading */
  loadingDelay?: number;
}

export default function useAsync<P extends any[], D = any>(
  asyncFn: AsyncFunction<P, D>,
  options: UseAsyncOptions = {}
) {
  const { loadingDelay } = options;

  const [promiseState, setPromiseState] = useState<PromiseState | null>(null);
  const [data, setData] = useState<D | null>(null);
  const [error, setError] = useState<D | null>(null);

  const [loading, setLoading] = useState(promiseState === "pending");

  const run = useMemo(
    () =>
      async (...args: P) => {
        setPromiseState("pending");

        try {
          const res = await asyncFn(...args);
          setPromiseState("fulfilled");
          setData(res);
          setError(null);
          return res;
        } catch (error: any) {
          setPromiseState("rejected");
          setError(error);
          return error;
        }
      },
    [asyncFn]
  );

  // 参考 https://www.nngroup.com/articles/response-times-3-important-limits/
  useEffect(() => {
    if (promiseState !== "pending") return setLoading(false);

    const timer = setTimeout(() => setLoading(true), loadingDelay);
    return () => clearTimeout(timer);
  }, [promiseState, loadingDelay]);

  return {
    promiseState,
    loading,
    data,
    run,
    error,
  };
}

export const useAsyncRun: typeof useAsync = <D = any>(asyncFn: AsyncFunction<[], D>) => {
  const asyncHook = useAsync<[], D>(asyncFn);
  const { run } = asyncHook;

  useEffect(() => void run(), [run]);

  return {
    ...asyncHook,
  };
};
