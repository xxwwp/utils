import { startTransition, useEffect, useRef, useState } from "react";
import { isNull } from "../es";

export interface UseElementLeaveViewportParams {
  /** 观测区域的偏移量，当前视图的区域加上此值为观测区域的最终值，元素离开观测区域被视为离开 */
  offset?: number;
}

/** 监听一个元素是否离开视图 */
export default function useElementLeaveViewport<R extends HTMLElement>({
  offset = 0,
}: UseElementLeaveViewportParams = {}) {
  const ref = useRef<R>(null);

  const [leaved, setleaved] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const vh = window.innerHeight + offset;

    const fn = () => {
      if (isNull(el)) return;

      const rect = el.getBoundingClientRect();
      startTransition(() => {
        // 判断位置、目标顶部在可视区或底部在可视区，或目标整个覆盖了可视区
        if (
          // 元素的顶部在观测区域中
          (vh > rect.top && rect.top > -offset) ||
          // 元素的底部在观测区域中
          (vh > rect.bottom && rect.bottom > -offset) ||
          // 元素顶部到底部跨越整个观测区域
          (rect.top < -offset && rect.bottom > vh)
        ) {
          setleaved(false);
        } else {
          setleaved(true);
        }
      });
    };

    // 立即执行一次
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, [offset]);

  return [ref, leaved] as const;
}
