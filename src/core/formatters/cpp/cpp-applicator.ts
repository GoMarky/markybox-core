import { AbstractKeyApplicator, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';

export class CPPKeyApplicator extends AbstractKeyApplicator implements IAbstractKeyApplicator {
  constructor(context: EditorGlobalContext) {
    super(context);
  }
}
