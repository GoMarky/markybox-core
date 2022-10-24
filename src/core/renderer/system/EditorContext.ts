import { Disposable } from '@/core/base/disposable';

export interface IContextKey<T> {
  set(value: T): void;

  reset(): void;

  get(): T | undefined;
}

class RawContextKey<T> extends Disposable implements IContextKey<T> {
  private readonly _defaultValue: T | undefined;
  private _value: T;

  constructor(private readonly key: string, defaultValue: T | undefined) {
    super();
    this._defaultValue = defaultValue;

    if (this._defaultValue) {
      this._value = this._defaultValue;
    }
  }

  public get(): T | undefined {
    return this._value;
  }

  public reset(): void {
    if (this._defaultValue) {
      this._value = this._defaultValue;
    }
  }

  public set(value: T): void {
    this._value = value;
  }
}

export namespace EditorContextKeys {
  export const doubleClickMode = new RawContextKey('ctx.dblclick.pressed', false);
}

