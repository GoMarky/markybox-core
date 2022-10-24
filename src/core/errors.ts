
export class SecurityError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class AccessError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
