import { isNull, isNumber, isObject, isString, safeJSONParse } from "./es";

/** 永不超时的字面量 */
export const TimeoutForever = 0;

/** storage 的基本配置 */
export interface StorageBaseConfig {
  /** 存储时的 key 前缀 */
  path?: string;

  /** 存储用的 Storage */
  instance: Storage | (() => Storage);
}

/** 存储单元的 key */
export interface StorageConfig {
  key: string;
}

/** 存储单元类 */
export class StorageUnit {
  private baseConfig: StorageBaseConfig;
  private config: StorageConfig;

  constructor(baseConfig: StorageBaseConfig, config: StorageConfig) {
    this.baseConfig = baseConfig;
    this.config = config;
  }

  /** 获得存储单元的 key */
  getKey() {
    return [this.baseConfig.path, this.config.key].join("/");
  }

  /** 获得存储单元归属的 Storage */
  private getStorage() {
    const ins = this.baseConfig.instance;
    return ins instanceof Storage ? ins : ins();
  }

  /**
   * 获得存储单元在本地的的原子数据
   *
   * @returns 当找不到时返回 null
   */
  getAtom(): StorageAtom | null {
    const local = safeJSONParse(this.getStorage().getItem(this.getKey()));

    return StorageAtom.isAtom(local) ? new StorageAtom(local) : null;
  }

  /**
   * 获得存储单元的原子数据
   *
   * @returns 当找不到时返回 null
   */
  get(): string | null {
    const data = this.getAtom();

    if (isNull(data)) {
      return null;
    }

    const { value, timeout } = data.get();

    /** 是否已经超时 */
    const isTimeouted = timeout !== TimeoutForever && Date.now() > timeout;
    return isTimeouted ? null : value;
  }

  /**
   * 设置存储单元的值
   *
   * @param newValue 新设置的值
   * @param timeout 过期时的时间戳
   */
  set(newValue: unknown, timeout = TimeoutForever) {
    const localAtom = this.getAtom();

    if (!isNull(localAtom)) {
      localAtom.update(newValue, timeout);
    }

    const atom = isNull(localAtom) ? StorageAtom.creator(newValue, timeout) : localAtom;

    this.getStorage().setItem(this.getKey(), atom.toString());
  }

  remove() {
    this.getStorage().removeItem(this.getKey());
  }
}

/** 存储原子类型 */
interface DStorageAtom {
  value: string | null;
  createAt: number;
  updateAt: number;
  timeout: number;
}

/** 存储原子类 */
class StorageAtom {
  private data: DStorageAtom;
  constructor(data: DStorageAtom) {
    this.data = data;
  }

  update(newValue: unknown, timeout = this.data.timeout) {
    this.data.value = String(newValue);
    this.data.updateAt = Date.now();
    this.data.timeout = timeout;

    return this;
  }

  get() {
    return { ...this.data };
  }

  toString() {
    return JSON.stringify(this.data);
  }

  static isAtom(data: unknown): data is DStorageAtom {
    if (!isObject(data)) return false;

    function checkDate(v: unknown) {
      return isNumber(v) && v >= 0;
    }

    return checkDate(data.createAt) && checkDate(data.updateAt) && checkDate(data.timeout) && isString(data.value);
  }

  static creator(value: unknown, timeout = TimeoutForever): StorageAtom {
    const now = Date.now();
    return new StorageAtom({ value: String(value), createAt: now, updateAt: now, timeout });
  }
}
