/** 判断值是否是布尔值 */
export function isBoolean(val: any): val is boolean {
  return Object.prototype.toString.call(val) === "[object Boolean]";
}

/** 判断值是否是 undefined */
export function isUndefined(val: any): val is undefined {
  return typeof val === "undefined";
}

/** 判断值是否是字符串 */
export function isString(val: any): val is string {
  return Object.prototype.toString.call(val) === "[object String]";
}

/** 判断值是否是 null */
export function isNull(val: any): val is null {
  return null === val;
}

/** 判断值是否是数字 */
export function isNumber(val: unknown): val is number {
  return Object.prototype.toString.call(val) === "[object Number]";
}

/** 判断值是否是 BigInt */
export function isBigInt(val: unknown): val is bigint {
  return Object.prototype.toString.call(val) === "[object BigInt]";
}

/** 判断值是否是 Symbol */
export function isSymbol(val: unknown): val is symbol {
  return Object.prototype.toString.call(val) === "[object Symbol]";
}

/** 判断值是否是 Set */
export function isSet(val: unknown): val is Set<unknown> {
  return Object.prototype.toString.call(val) === "[object Set]";
}

/** 判断值是否是 Map */
export function isMap(val: unknown): val is Map<unknown, unknown> {
  return Object.prototype.toString.call(val) === "[object Map]";
}

/** 判断值是否是 WeakSet */
export function isWeakSet(val: unknown): val is WeakSet<object> {
  return Object.prototype.toString.call(val) === "[object WeakSet]";
}

/** 判断值是否是 WeakMap */
export function isWeakMap(val: unknown): val is WeakMap<object, unknown> {
  return Object.prototype.toString.call(val) === "[object WeakMap]";
}

/** 移动数组项 */
export function arrayMove<T = any>(arr: T[], oldIndex: number, newIndex: number) {
  if (arr.length <= oldIndex || arr.length <= newIndex) {
    throw new Error(
      `arrayMove 移动索引超出数组长度，数组长度为 ${arr.length}，oldIndex 为 ${oldIndex} 、newIndex 为 ${newIndex}`
    );
  }

  const newArr = Array.from(arr);
  const changeItem = newArr.splice(oldIndex, 1)[0];
  newArr.splice(newIndex, 0, changeItem);

  return newArr;
}

// 参见：https://stackoverflow.com/questions/53966509/typescript-type-safe-omit-function
interface OmitFunc {
  <T extends object, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
    [K2 in Exclude<keyof T, K[number]>]: T[K2];
  };
}

// 通过键名来筛选对象属性，返回一个新对象，原对象不会改变
export const omit: OmitFunc = (obj, ...keys) => {
  const ret = {} as {
    [K in keyof typeof obj]: typeof obj[K];
  };
  let key: keyof typeof obj;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
};

/** 限制字符长度，使用省略号进行补充 */
export function stringLimit(str: string, count: number, fill = "...") {
  if (!isString(str)) return "";

  if (str.length > count) {
    return str.substring(0, count) + fill;
  } else {
    return str;
  }
}

/**
 * 安全的解析 JSON
 *
 * @param value 需要解析的 json 字符串
 * @returns
 */
export function SafeJSONParse(value: any): unknown {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
