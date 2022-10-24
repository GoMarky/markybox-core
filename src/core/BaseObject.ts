import { nanoid } from 'nanoid';
import { Disposable, DisposableStore } from '@/core/base/disposable';

export abstract class BaseObject extends Disposable {
  protected disposables: DisposableStore = new DisposableStore();

  public readonly id = nanoid(10);
}
