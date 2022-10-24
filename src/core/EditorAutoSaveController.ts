import { BaseObject } from '@/core/BaseObject';
import { HTMLRenderer } from '@/core/index';
import { Emitter, IEvent } from '@/core/base/event';
import { debounce } from '@/core/base/async';

export enum AutoSave {
  Timeout,
  Always,
  OnChange,
  Disabled
}

const SAVE_TIMEOUT = 500;

export class EditorAutoSaveController extends BaseObject {
  private readonly _onDidSave: Emitter<string> = new Emitter<string>();
  public readonly onDidSave: IEvent<string> = this._onDidSave.event;

  public type: AutoSave = AutoSave.Always;

  constructor(private readonly renderer: HTMLRenderer) {
    super();
  }

  public save(): void {
    if (this.type === AutoSave.Disabled) {
      return;
    }

    return this.doSave();
  }

  private doSave = debounce(() => {
    const text = this.renderer.getText();

    if (this.type === AutoSave.Always) {
      this._onDidSave.fire(text);
    }
  }, SAVE_TIMEOUT)
}
