import { AbstractKeyApplicator, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';

export class JSONKeyApplicator extends AbstractKeyApplicator implements IAbstractKeyApplicator {
  constructor(context: EditorGlobalContext) {
    super(context);
  }
}
