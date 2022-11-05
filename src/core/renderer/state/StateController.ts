import { Disposable } from '@/core/base/disposable';
import { AbstractEditorState } from '@/core/renderer/state/AbstractEditorState';
import { EditorActiveState } from '@/core/renderer/state/EditorActiveState';
import { EditorLockedState } from '@/core/renderer/state/EditorLockedState';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';
import { EditorBodyNavigator } from '@/core/renderer/editor/EditorBodyNavigator';
import { EditorRowsController } from '@/core/renderer/editor/EditorRowsController';
import { EditorStorage } from '@/core/renderer/system/EditorStorage';
import { EditorSelectionContainer } from '@/core/renderer/selection/EditorSelectionContainer';
import { EditorBodyContainer } from '@/core/renderer/editor/EditorBodyContainer';
import { EditorCommandCenter } from '@/core/renderer/commands/command-manager';

export class StateController extends Disposable {
  private _currentState: AbstractEditorState;

  constructor(
    private readonly navigator: EditorBodyNavigator,
    private readonly rowsController: EditorRowsController,
    private readonly storage: EditorStorage,
    private readonly selection: EditorSelectionContainer,
    private readonly body: EditorBodyContainer,
    private readonly command: EditorCommandCenter,
  ) {
    super();

    this._context = new EditorGlobalContext(navigator, rowsController, storage, selection, body, command, this);
    this._currentState = new EditorLockedState(this._context);

    this.body.setContext(this._context);
    this.command.setContext(this._context);
  }

  private readonly _context: EditorGlobalContext;
  public get context(): EditorGlobalContext {
    return this._context;
  }

  private _isLock: boolean = true;
  public get isLock(): boolean {
    return this._isLock;
  }

  public get current(): AbstractEditorState {
    return this._currentState;
  }

  public lock() {
    if (this._isLock) {
      return;
    }

    const { context } = this;
    this._currentState = new EditorLockedState(context);
    this._isLock = true;
  }

  public unlock() {
    if (!this._isLock) {
      return;
    }

    const { context } = this;
    this._currentState = new EditorActiveState(context);

    this._isLock = false;
  }
}
