import { useEffect } from "react";
import { useStableFn } from "./use-stable-fn";

interface Lifecycle<T> {
  mount?: (ctx: T) => void | Promise<void>;
  unmount?: (ctx: T) => void | Promise<void>;
}

const noop = () => void 0;

export const useLifecycle = <T extends Record<string, any>>(
  lifecycle: Lifecycle<T>
) => {
  const mountCallback = useStableFn(lifecycle.mount || noop);
  const unmountCallback = useStableFn(lifecycle.unmount || noop);
  useEffect(() => {
    const ctx: T = {} as T;
    mountCallback(ctx);
    return () => {
      unmountCallback(ctx);
    };
  }, [mountCallback, unmountCallback]);
};
