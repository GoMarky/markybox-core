export class Barrier {
  private _isOpen: boolean;
  private readonly _promise: Promise<boolean>;
  private _completePromise!: (v: boolean) => void;

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Create barrier for app.
   *  It create promise that you can resolve in any time you want. (By calling open method).
   */
  constructor() {
    this._isOpen = false;
    this._promise = new Promise<boolean>(c => {
      this._completePromise = c;
    });
  }

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Flag that means does it barrier already open.
   *
   *  @return boolean
   */
  public isOpen(): boolean {
    return this._isOpen;
  }

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Open barrier, or say in another words resolve promise inside barrier.
   *
   *  @return void
   */
  public open(): void {
    this._isOpen = true;
    this._completePromise(true);
  }

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Get promise barrier.
   *
   *  @return Promise<boolean>
   */
  public wait(): Promise<boolean> {
    return this._promise;
  }
}

/**
 *
 * @see https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940
 *
 * @param func
 * @param waitFor
 */
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => ReturnType<F>) => {
  let timeout = 0;

  const debounced = (...args: any[]): void => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), waitFor);
  };

  return (debounced as unknown) as (...args: Parameters<F>) => ReturnType<F>;
};

type ThrottledFunction<T extends (...args: any) => any> = (...args: Parameters<T>) => ReturnType<T>;

/**
 * Creates a throttled function that only invokes the provided function (`func`)
 * at most once per within a given number of milliseconds (`limit`)
 *
 * @see https://github.com/bameyrick/throttle-typescript
 */
export function throttle<T extends (...args: any) => any>(
  func: T,
  limit: number
): ThrottledFunction<T> {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function (this: any): ReturnType<T> {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    if (!inThrottle) {
      inThrottle = true;

      setTimeout(() => (inThrottle = false), limit);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      lastResult = func.apply(context, args);
    }

    return lastResult;
  };
}
