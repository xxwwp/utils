/** 文件转 base64 */
export async function fileToBase64(img: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () =>
      setTimeout(() => {
        resolve(reader.result as string);
      }, 1000)
    );
    reader.readAsDataURL(img);
  });
}

/**
 * 在 body 出现滚动条时，隐藏滚动条并填充 padding-left 让其正常显示
 *
 * @returns
 */
export function hideBodyScrollbar() {
  const scrollbarWidth = window.innerWidth - document.body.clientWidth;

  const bs = document.body.style;

  if (scrollbarWidth !== 0) {
    const { paddingRight, overflow } = bs;
    bs.paddingRight = scrollbarWidth + "px";
    bs.overflow = "hidden";
    return () => {
      bs.paddingRight = paddingRight;
      bs.overflow = overflow;
    };
  }

  return () => void 0;
}

/**
 * 复制文本
 *
 * @param text 需要复制的文本
 * @returns 是否复制成功，过低版本浏览器可能会复制失败。
 */
export function copyText(text: string): boolean {
  if (navigator.clipboard?.writeText) {
    // w3 标准
    navigator.clipboard.writeText(text);
  } else if ((window as any).clipboardData?.setData) {
    // 兼容 ie
    (window as any).clipboardData.setData("Text", text);
  } else if (document.queryCommandSupported?.("copy")) {
    // 使用已废弃的 document.execCommand 方法
    const ref = document.createElement("textarea");
    document.body.appendChild(ref);
    ref.value = text;
    ref.select();
    document.execCommand("copy");
    document.body.removeChild(ref);
  } else {
    return false;
  }
  return true;
}
