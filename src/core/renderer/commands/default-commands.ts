import { CommandImpl, CommandsRegistry } from '@/core/renderer/commands/command-manager';
import { IPosition } from '@/core/common';

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
