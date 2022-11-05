import { Disposable, IDisposable } from '@/core/base/disposable';
import { EventEmitter } from '@/core/base/event-emitter';
import { EditorKeyboardEvent } from '@/core/renderer/keyboard/keyboard-event';
import windowShortcut from '@gomarky/window-shortcut';
import { StateController } from '@/core/renderer/state/StateController';

type EditorKeyboardType = 'keydown' | 'keyup';

export class EditorKeyboardHandler extends Disposable {
  private readonly emitter: EventEmitter = new EventEmitter();

  constructor(
    private readonly state: StateController
  ) {
    super();

    this.init();
  }

  public registerShortcut(shortcut: string, listener: (event: KeyboardEvent) => void): IDisposable {
    return windowShortcut.registerShortcut(shortcut, (event) => {
      if (this.state.isLock) {
        return;
      }

      event.preventDefault();

      Reflect.apply(listener, undefined, [event]);
    });
  }

  public addEventListener(type: EditorKeyboardType, listener: (event: EditorKeyboardEvent) => void): IDisposable {
    return this.emitter.on(type, listener);
  }

  private toEditorEvent(event: KeyboardEvent): EditorKeyboardEvent {
    return new EditorKeyboardEvent(event);
  }

  private init() {
    window.addEventListener('keydown', (event) => {
      this.emitter.emit('keydown', this.toEditorEvent(event));
    });

    window.addEventListener('keyup', (event) => {
      this.emitter.emit('keyup', this.toEditorEvent(event));
    });
  }
}
