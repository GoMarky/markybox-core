/**
 *
 * Enables logging of potentially leaked disposables.
 *
 * A disposable is considered leaked if it is not disposed or not registered as the child of
 * another disposable. This tracking is very simple an only works for classes that either
 * extend Disposable or use a DisposableStore. This means there are a lot of false positives.
 */
const TRACK_DISPOSABLES = false;

const __is_disposable_tracked__ = '__is_disposable_tracked__';

function markTracked<T extends IDisposable>(x: T): void {
  if (!TRACK_DISPOSABLES) {
    return;
  }

  if (x && x !== Disposable.None) {
    try {
      (x as any)[__is_disposable_tracked__] = true;
    } catch {
      // noop
    }
  }
}

function trackDisposable<T extends IDisposable>(x: T): T {
  if (!TRACK_DISPOSABLES) {
    return x;
  }

  const stack = new Error('Potentially leaked disposable').stack!;
  window.setTimeout(() => {
    if (!(x as any)[__is_disposable_tracked__]) {
      console.info(stack);
    }
  }, 3000);

  return x;
}

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 *  Dispose thing
 */
export interface IDisposable {
  dispose(): void;
}

export function toDisposable(func: () => void): IDisposable {
  const self = trackDisposable({
    dispose: () => {
      markTracked(self);

      Reflect.apply(func, undefined, []);
    },
  });

  return self;
}

export abstract class Disposable implements IDisposable {
  public static None = Object.freeze<IDisposable>({
    dispose() {
      //
    },
  });

  protected constructor() {
    trackDisposable(this);
  }

  public dispose(): void {
    markTracked(this);
  }
}

export class DisposableStore implements IDisposable {
  private readonly _toDispose = new Set<IDisposable>();
  private _isDisposed = false;

  public dispose(): void {
    if (this._isDisposed) {
      return;
    }

    markTracked(this);
    this._isDisposed = true;
    this.clear();
  }

  public clear(): void {
    this._toDispose.forEach(item => item.dispose());
    this._toDispose.clear();
  }

  public add<T extends IDisposable>(t: T): T {
    if (!t) {
      return t;
    }

    if (((t as unknown) as DisposableStore) === this) {
      throw new ReferenceError('Cannot register a disposable on itself!');
    }

    markTracked(t);
    if (this._isDisposed) {
      console.warn('Registering disposable on object that has already been disposed of');

      t.dispose();
    } else {
      this._toDispose.add(t);
    }

    return t;
  }
}
