/**
 * 把像素转化为 rem
 *
 * @param pixel
 * @returns
 */
export function toRem(pixel: number) {
  return pixel / 16 + "rem";
}
