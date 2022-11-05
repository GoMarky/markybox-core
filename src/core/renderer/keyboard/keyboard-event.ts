import { Disposable } from '@/core/base/disposable';
import { Char } from '@/core/base/char';

export class EditorKeyboardEvent extends Disposable {
  constructor(
    private readonly domEvent: KeyboardEvent,
  ) {
    super();
  }

  public get isRepeat(): boolean {
    return this.domEvent.repeat;
  }

  public get code(): Char {
    return this.domEvent.code as Char;
  }
}
