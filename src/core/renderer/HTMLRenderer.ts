import { BaseObject } from '@/core/BaseObject';
import { EditorBodyNavigator } from '@/core/renderer/editor/EditorBodyNavigator';
import { EditorDisplayController } from '@/core/renderer/system/EditorDisplayController';
import { EditorBodyContainer } from '@/core/renderer/editor/EditorBodyContainer';
import { UserClipboardController } from '@/core/renderer/system/UserClipboardController';
import { EditorSelectionContainer } from '@/core/renderer/selection/EditorSelectionContainer';
import { EditorStorage } from '@/core/renderer/system/EditorStorage';
import { EditorActiveState } from '@/core/renderer/state/EditorActiveState';
import { EditorLockedState } from '@/core/renderer/state/EditorLockedState';
import { EditorRowsController } from '@/core/renderer/editor/EditorRowsController';
import { UserTextHintVisitor } from '@/core/renderer/visitors/UserTextHintVisitor';
import { KeywordCheckerVisitor } from '@/core/renderer/visitors/KeywordCheckerVisitor';
import { EditorSimpleNavigator } from '@/core/renderer/editor/EditorSimpleNavigator';
import { IAbstractRenderer } from '@/core/renderer';
import { CommandImpl, CommandsRegistry, EditorCommandCenter, NoHistoryCommandImpl } from '@/core/renderer/commands/command-manager';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';
import { EditorThemeService } from './system/EditorTheme';
import { EditorCSSName } from '@/core/renderer/chars/helpers';
import { removeChildren, useOutsideClick } from '@/core/base/dom';
import { isMac } from '@/core/base/platform';
import { isString } from '@/core/base/types';
import { EditorLang, EditorTheme, IPosition } from '@/core/types';
import { EditorMouseHandler } from '@/core/renderer/mouse/mouse-handler';
import { EditorKeyboardHandler } from '@/core/renderer/keyboard/keyboard-handler';
import { EditorMouseEvent } from '@/core/renderer/mouse/mouse-event';
import { EditorKeyboardEvent } from '@/core/renderer/keyboard/keyboard-event';
import { toDisposable } from '@/core/base/disposable';
import { StateController } from '@/core/renderer/state/StateController';

export interface IEditorOptions {
  name?: string;
  readonly?: boolean;
}

const DEFAULT_OPTIONS: IEditorOptions = {
  name: 'user',
  readonly: false,
};

export class HTMLRenderer extends BaseObject implements IAbstractRenderer {
  public readonly storage: EditorStorage;
  public readonly clipboard: UserClipboardController;
  public readonly selection: EditorSelectionContainer;
  public readonly navigatorManager: EditorSimpleNavigator;
  public readonly display: EditorDisplayController;
  public readonly navigator: EditorBodyNavigator;
  public readonly controller: EditorRowsController;
  public readonly body: EditorBodyContainer;
  public readonly commandCenter: EditorCommandCenter;
  public readonly theme: EditorThemeService;
  public readonly mouse: EditorMouseHandler;
  public readonly keyboard: EditorKeyboardHandler;
  public readonly state: StateController;

  public $isMount: boolean = false;
  private _isLock: boolean = true;
  private readonly _options: IEditorOptions;

  constructor(options: IEditorOptions = {}) {
    super();

    this._options = Object.assign(DEFAULT_OPTIONS, options);
    const { name } = this._options as Required<IEditorOptions>;

    if (!window.isSecureContext) {
      console.warn(`markybox works only in https context.`);
    }

    const storage = this.storage = new EditorStorage();
    const display = this.display = new EditorDisplayController();

    this.mouse = new EditorMouseHandler();
    this.keyboard = new EditorKeyboardHandler(this);

    const navigator = this.navigator = new EditorBodyNavigator(storage, display, name);
    const controller = this.controller = new EditorRowsController(this);
    const selection = this.selection = new EditorSelectionContainer(this, storage, display, this.mouse);

    const body = this.body = new EditorBodyContainer(storage, display, navigator, controller);
    const command = this.commandCenter = new EditorCommandCenter();

    this.state = new StateController(
      navigator,
      controller,
      storage,
      selection,
      body,
      command
    );

    this.body.addVisitor('hint', new UserTextHintVisitor(navigator));
    this.body.addVisitor('keyword', new KeywordCheckerVisitor(body));

    this.theme = new EditorThemeService(body);
    this.clipboard = new UserClipboardController();
    this.navigatorManager = new EditorSimpleNavigator(controller, display, storage);
  }

  public get isLock(): boolean {
    return this._isLock;
  }

  public unlock(): void {
    return this.state.unlock();
  }

  public lock(): void {
    return this.state.lock();
  }

  public mount(element: string | HTMLElement): this {
    const rootElement = isString(element) ? document.querySelector<HTMLElement>(element) : element;

    if (!rootElement) {
      throw new Error('Element ${selector} not found.');
    }

    if (rootElement.hasChildNodes()) {
      removeChildren(rootElement);
    }

    this.body.mount(rootElement);
    this.display.mount(rootElement);

    const bodyElement = this.body.el;

    this.navigator.mount(bodyElement);
    this.selection.mount(bodyElement);
    this.mouse.mount(rootElement);
    rootElement.classList.add(EditorCSSName.RootClassName);

    this.unlock();
    this.theme.init();
    this.registerListeners(rootElement);
    this.controller.addEmptyRow();
    this.display.whenMounted.open();
    this.$isMount = true;

    return this;
  }

  public clear(): void {
    this.controller.clear();
    this.navigator.setPosition({ row: 0, column: 0 });
  }

  public getText(): string {
    const { rows } = this.storage;

    return rows.map((row) => row.toString()).join('\n');
  }

  public setText(text: string): this {
    this.controller.setWholeText(text);

    return this;
  }

  public setFormat(lang: EditorLang): this {
    this.body.setFormat(lang);

    return this;
  }

  public setTheme(theme: EditorTheme): this {
    this.theme.setTheme(theme);

    return this;
  }

  private registerListeners(root: HTMLElement): void {
    this.registerCommands();
    this.registerShortcuts();

    const onClick = (event: EditorMouseEvent) => this.state.current.onClick(event);
    const onKeydown = (event: EditorKeyboardEvent) => this.state.current.onKeyDown(event);
    const onKeyup = (event: EditorKeyboardEvent) => this.state.current.onKeyUp(event);

    const onOutsideClick = useOutsideClick(root, () => this.lock());
    window.document.addEventListener('click', onOutsideClick)
    this.disposables.add(toDisposable(() => window.document.removeEventListener('click', onOutsideClick)));

    this.keyboard.addEventListener('keydown', onKeydown);
    this.keyboard.addEventListener('keyup', onKeyup);
    this.mouse.addEventListener('click', onClick);
  }

  private registerCommands() {
    CommandsRegistry.registerCommand(
      'editor.redo',
      () => new NoHistoryCommandImpl(() => this.commandCenter.redoCommand())
    );
    CommandsRegistry.registerCommand(
      'editor.undo',
      () => new NoHistoryCommandImpl(() => this.commandCenter.undoCommand())
    );
    CommandsRegistry.registerCommand('editor.position.update', (ctx) => {
      const { navigator } = ctx;

      const execute = (position: IPosition) => {
        navigator.setPosition(position);
        return position;
      };

      const undo = (position: IPosition) => {
        navigator.setPosition(position);
        return position;
      };

      return new CommandImpl(execute, undo);
    })

    CommandsRegistry.registerCommand('editor.char.add', (ctx) => {
      const { controller, navigator } = ctx;

      const execute = (char: string) => {
        const { position: { column, row } } = navigator;
        const { currentRow } = controller;

        currentRow.inputAt(char, column);
        navigator.setPosition({ row, column: column + 1 });

        controller.editorAutoSave.save();
      };

      const undo = () => {
        const { currentRow } = controller;

        controller.removeLastLetterFromRow(currentRow);
      };

      return new CommandImpl(execute, undo);
    })
  }

  private registerShortcuts() {
    const meta: string = isMac ? 'Meta' : 'Ctrl';

    const SELECT_ALL_KEY = `${meta}+A`;
    const REDO_KEY = `${meta}+Shift+Z`;
    const UNDO_KEY = `${meta}+Z`;
    const COPY_KEY = `${meta}+C`;
    const PASTE_KEY = `${meta}+V`;
    const ADD_INTENT_KEY = 'Tab';

    this.keyboard.registerShortcut(SELECT_ALL_KEY, () => {
      this.selection.selectAll()
    });

    this.keyboard.registerShortcut(ADD_INTENT_KEY, () => {
      this.controller.addIndentToCurrentRow();
    });

    this.keyboard.registerShortcut(REDO_KEY, () => {
      this.commandCenter.executeCommand('editor.redo');
    });

    this.keyboard.registerShortcut(UNDO_KEY, () => {
      this.commandCenter.executeCommand('editor.undo');
    });

    this.keyboard.registerShortcut('Shift+Tab', () => {
      this.controller.removeIndentFromCurrentRow();
    });

    this.keyboard.registerShortcut(COPY_KEY, () => {
      const text = this.selection.getSelectedText();
      void this.clipboard.write(text);
    });

    this.keyboard.registerShortcut(PASTE_KEY, async () => {
      const text = await this.clipboard.read();
      this.controller.setWholeText(text);
    });
  }

  public dispose(): void {
    this.storage.dispose();
    this.display.dispose();
    this.navigator.dispose();
    this.controller.dispose();
    this.selection.dispose();
    this.body.dispose();
    this.mouse.dispose();
    this.commandCenter.dispose();
    this.clipboard.dispose();
    this.navigatorManager.dispose();
  }
}
