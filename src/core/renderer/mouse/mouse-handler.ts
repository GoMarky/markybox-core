import { Disposable, IDisposable } from '@/core/base/disposable';
import { EventEmitter } from '@/core/base/event-emitter';
import { EditorMouseEvent } from '@/core/renderer/mouse/mouse-event';

type EditorEventType = 'click' | 'dblclick' | 'tripleclick' | 'quadclick' | 'mousedown' | 'mousemove' | 'mouseup' | 'contextmenu';

export class EditorMouseHandler extends Disposable {
  private readonly emitter: EventEmitter = new EventEmitter();

  constructor() {
    super();
  }

  private toEditorEvent(event: MouseEvent): EditorMouseEvent {
    return new EditorMouseEvent(event);
  }

  public addEventListener(type: EditorEventType, listener: (event: EditorMouseEvent) => void): IDisposable {
    return this.emitter.on(type, listener);
  }

  private onClick = (domEvent: MouseEvent) => {
    const editorEvent = this.toEditorEvent(domEvent);

    this.emitter.emit('click', editorEvent);
  }

  private onDblClick = (domEvent: MouseEvent) => {
    const editorEvent = this.toEditorEvent(domEvent);
    this.emitter.emit('dblclick', editorEvent);
  }

  private onMousedown = (domEvent: MouseEvent) => {
    const editorEvent = this.toEditorEvent(domEvent);
    this.emitter.emit('mousedown', editorEvent);
  }

  private onMousemove = (domEvent: MouseEvent) => {
    const editorEvent = this.toEditorEvent(domEvent);
    this.emitter.emit('mousemove', editorEvent);
  }

  private onMouseup = (domEvent: MouseEvent) => {
    const editorEvent = this.toEditorEvent(domEvent);
    this.emitter.emit('mouseup', editorEvent);
  }

  private onContextmenu = (domEvent: MouseEvent) => {
    const editorEvent = this.toEditorEvent(domEvent);
    this.emitter.emit('contextmenu', editorEvent);
  }

  public mount(root: HTMLElement): void {
    root.addEventListener('click', this.onClick);
    root.addEventListener('dblclick', this.onDblClick);
    root.addEventListener('mousedown', this.onMousedown);
    root.addEventListener('mousemove', this.onMousemove);
    root.addEventListener('mouseup', this.onMouseup);
    root.addEventListener('contextmenu', this.onContextmenu);

    root.addEventListener('touchstart', () => {});
    root.addEventListener('touchmove', () => {});
    root.addEventListener('touchend', () => {});
    root.addEventListener('focus', () => {});
    root.addEventListener('blur', () => {});
  }
}
