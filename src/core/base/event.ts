/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/await-thenable */

import { Disposable, IDisposable } from '@/core/base/disposable';
import { LinkedList } from '@/core/base/linked-list';

export interface IEmitterOptions {
  onFirstListenerAdd?: CallableFunction;
  onFirstListenerDidAdd?: CallableFunction;
  onListenerDidAdd?: CallableFunction;
  onLastListenerRemove?: CallableFunction;
  leakWarningThreshold?: number;
}

export interface IEvent<T> {
  (listener: (e: T) => void, thisArgs?: any, disposables?: IDisposable[]): IDisposable;
}

type Listener<T> = [(e: T) => void, any] | ((e: T) => void);

export abstract class AppEvent<T> extends Disposable {
  private _defaultPrevented = false;
  private _stopped = false;

  protected constructor(public readonly data: T) {
    super();
  }

  public get defaultPrevented(): boolean {
    return this._defaultPrevented;
  }

  public get stopped(): boolean {
    return this._stopped;
  }

  public preventDefault(): void {
    this._defaultPrevented = true;
  }

  public stopPropagation(): void {
    this._stopped = true;
  }
}

export class Emitter<T> {
  private readonly _options?: IEmitterOptions;
  private _disposed = false;
  private _event?: IEvent<T>;
  private _deliveryQueue?: LinkedList<[Listener<T>, T]>;

  protected _listeners?: LinkedList<Listener<T>>;

  constructor(options?: IEmitterOptions) {
    this._options = options;
  }

  private static readonly _noop = (): void => undefined;

  public get event(): IEvent<T> {
    if (!this._event) {
      this._event = (
        listener: (e: T) => void,
        thisArgs?: T,
        disposables?: IDisposable[]
      ): IDisposable => {
        if (!this._listeners) {
          this._listeners = new LinkedList();
        }

        const firstListener = this._listeners.isEmpty();

        if (firstListener && this._options && this._options.onFirstListenerAdd) {
          this._options.onFirstListenerAdd(this);
        }

        const remove = this._listeners.push(!thisArgs ? listener : [listener, thisArgs]);

        if (firstListener && this._options && this._options.onFirstListenerDidAdd) {
          this._options.onFirstListenerDidAdd(this);
        }

        if (this._options && this._options.onListenerDidAdd) {
          this._options.onListenerDidAdd(this, listener, thisArgs);
        }

        const result: IDisposable = {
          dispose: () => {
            result.dispose = Emitter._noop;
            if (!this._disposed) {
              remove();
              if (this._options && this._options.onLastListenerRemove) {
                const hasListeners = this._listeners && !this._listeners.isEmpty();
                if (!hasListeners) {
                  this._options.onLastListenerRemove(this);
                }
              }
            }
          },
        };

        disposables?.push(result);

        return result;
      };
    }

    return this._event;
  }

  public fire(event: T): void {
    if (this._listeners) {
      if (!this._deliveryQueue) {
        this._deliveryQueue = new LinkedList();
      }

      for (let iter = this._listeners.iterator(), e = iter.next(); !e.done; e = iter.next()) {
        this._deliveryQueue.push([e.value as Listener<T>, event]);
      }

      while (this._deliveryQueue.size > 0) {
        if (event instanceof AppEvent && event.stopped) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const [listener, _event] = this._deliveryQueue.shift()!;
        try {
          if (typeof listener === 'function') {
            listener.call(undefined, _event);
          } else {
            listener[0].call(listener[1], _event);
          }
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }

  public async fireAsync(event: T): Promise<void> {
    if (this._listeners) {
      if (!this._deliveryQueue) {
        this._deliveryQueue = new LinkedList();
      }

      for (let iter = this._listeners.iterator(), e = iter.next(); !e.done; e = iter.next()) {
        this._deliveryQueue.push([e.value as Listener<T>, event]);
      }

      while (this._deliveryQueue.size > 0) {
        if (event instanceof AppEvent && event.stopped) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const [listener, _event] = this._deliveryQueue.shift()!;
        try {
          if (typeof listener === 'function') {
            await listener.call(undefined, _event);
          } else {
            await listener[0].call(listener[1], _event);
          }
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }

  public dispose(): void {
    if (this._listeners) {
      this._listeners.clear();
    }
    if (this._deliveryQueue) {
      this._deliveryQueue.clear();
    }

    this._disposed = true;
  }
}
