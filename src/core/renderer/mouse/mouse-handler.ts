import { Disposable } from '@/core/base/disposable';
import { EventEmitter } from '@/core/base/event-emitter';

export class EditorMouseHandler extends Disposable {
  public readonly emitter: EventEmitter = new EventEmitter();

  constructor() {
    super();
  }

  public init(root: HTMLElement): void {
    root.addEventListener('click', () => {});
    root.addEventListener('dblclick', () => {});
    root.addEventListener('mousedown', () => {});
    root.addEventListener('mousemove', () => {});
    root.addEventListener('mouseup', () => {});

    root.addEventListener('touchstart', () => {});
    root.addEventListener('touchmove', () => {});
    root.addEventListener('touchend', () => {});
    root.addEventListener('focus', () => {});
    root.addEventListener('blur', () => {});
  }
}
