import { Disposable } from '@/core/base/disposable';

export class EditorMouseEvent extends Disposable {
  constructor(
    private readonly domEvent: MouseEvent,
  ) {
    super();
  }
}
