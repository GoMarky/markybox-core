import { BaseObject } from '@/core/BaseObject';
import { MHTMLEditorNavigator } from '@/core/renderer/editor/EditorBodyNavigator';
import { IPosition } from '@/core/types';
import { MChar } from '@/core/renderer/editor/EditorBodyTextarea';
import { EditorRowsController } from '@/core/renderer/editor/EditorRowsController';
import { EditorStorage } from '@/core/renderer/system/EditorStorage';
import { EditorDisplayController } from '@/core/renderer/system/EditorDisplayController';

class MHTMLEditorNavigatorCommandManager extends BaseObject {
  constructor(
    private readonly navigatorManager: EditorSimpleNavigator,
    private readonly controller: EditorRowsController,
    private readonly storage: EditorStorage,
    private readonly navigators: Map<string, MHTMLEditorNavigator>) {
    super();
  }

  public enterSymbol(name: string, position: IPosition, char: MChar): void {
    const { controller, storage } = this;
    let { row, column } = position;

    if (char === '\n') {
      const newRow = controller.addEmptyRow();

      row = newRow.index;
    } else {
      const matchedRow = storage.at(position.row);

      if (matchedRow) {
        matchedRow.inputAt(char, position.column);
      }
    }

    return this.with(name, (navigator) => {
      navigator.setPosition({ row, column: column + 1 });
    })
  }

  public changePosition(name: string, position: IPosition): void {
    return this.with(name, (navigator) => navigator.setPosition(position))
  }

  private with(name: string, callback: (navigator: MHTMLEditorNavigator) => void): void {
    const navigator = this.navigators.get(name);

    if (!navigator) {
      this.navigatorManager.add(name);
      return this.with(name, callback);
    }

    return Reflect.apply(callback, undefined, [navigator]);
  }
}

export class EditorSimpleNavigator extends BaseObject {
  private static MAX_NAVIGATORS_LENGTH = 6;

  public readonly commandCenter: MHTMLEditorNavigatorCommandManager;
  private readonly navigators: Map<string, MHTMLEditorNavigator> = new Map();

  constructor(
    private readonly controller: EditorRowsController,
    private readonly display: EditorDisplayController,
    private readonly storage: EditorStorage) {
    super();

    this.commandCenter = new MHTMLEditorNavigatorCommandManager(this, controller, storage, this.navigators);
  }

  public add(name: string): void {
    if (this.navigators.size >= EditorSimpleNavigator.MAX_NAVIGATORS_LENGTH) {
      throw new Error(`Maximum number of navigators reached. Current: ${this.navigators.size}`);
    }

    const navigator = new MHTMLEditorNavigator(this.display, this.storage, name);

    this.navigators.set(name, navigator);
  }

  public remove(name: string): void {
    const navigator = this.navigators.get(name);

    if (!navigator) {
      throw new Error(`Can find navigator with name - ${name}`);
    }

    navigator.dispose();
    this.navigators.delete(name);
  }
}
