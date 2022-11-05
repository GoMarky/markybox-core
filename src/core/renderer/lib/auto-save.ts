import { BaseObject } from '@/core/BaseObject';
import { HTMLRenderer } from '@/core';
import { Emitter, IEvent } from '@/core/base/event';
import { debounce } from '@/core/base/async';
import { EditorStorage } from '@/core/renderer/system/EditorStorage';

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

  constructor(private readonly storage: EditorStorage) {
    super();
  }

  private getText() {
    const { rows } = this.storage;

    return rows.map((row) => row.toString()).join('\n');
  }

  public save(): void {
    if (this.type === AutoSave.Disabled) {
      return;
    }

    return this.doSave();
  }

  private doSave = debounce(() => {
    const text = this.getText();

    if (this.type === AutoSave.Always) {
      this._onDidSave.fire(text);
    }
  }, SAVE_TIMEOUT)
}
