import { EditorBodyNavigator } from '@/core/renderer/editor/EditorBodyNavigator';
import { EditorRowsController } from '@/core/renderer/editor/EditorRowsController';
import { EditorBodyContainer } from '@/core/renderer/editor/EditorBodyContainer';
import { EditorStorage } from '@/core/renderer/system/EditorStorage';
import { EditorSelectionContainer } from '@/core/renderer/selection/EditorSelectionContainer';
import { EditorCommandCenter } from '@/core/renderer/commands/command-manager';
import { Disposable } from '@/core/base/disposable';
import { StateController } from '@/core/renderer/state/StateController';

export class EditorGlobalContext extends Disposable {
  constructor(
    public readonly navigator: EditorBodyNavigator,
    public readonly controller: EditorRowsController,
    public readonly storage: EditorStorage,
    public readonly selection: EditorSelectionContainer,
    public readonly body: EditorBodyContainer,
    public readonly command: EditorCommandCenter,
    public readonly state: StateController
  ) {
    super();
  }
}
