import { ApplicationError } from '@/base/errors';

export class SecurityError extends ApplicationError {
  constructor(message?: string) {
    super(message);
  }
}

export class AccessError extends ApplicationError {
  constructor(message?: string) {
    super(message);
  }
}
