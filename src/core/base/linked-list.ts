/* eslint-disable @typescript-eslint/no-explicit-any */

interface IIteratorUndefinedResult {
  readonly done: true;
  readonly value: undefined;
}

export const FIN: IIteratorUndefinedResult = { done: true, value: undefined };

class Node<E> {
  public static readonly Undefined = new Node<any>(undefined);

  public element: E;
  public next: Node<E> = Node.Undefined;
  public prev: Node<E> = Node.Undefined;

  constructor(element: E) {
    this.element = element;
  }
}

export class LinkedList<E> {
  private _first: Node<E> = Node.Undefined;
  private _last: Node<E> = Node.Undefined;
  private _size = 0;

  public get size(): number {
    return this._size;
  }

  public isEmpty(): boolean {
    return this._first === Node.Undefined;
  }

  public clear(): void {
    this._first = Node.Undefined;
    this._last = Node.Undefined;
    this._size = 0;
  }

  public unshift(element: E): () => void {
    return this.insert(element, false);
  }

  public push(element: E): () => void {
    return this.insert(element, true);
  }

  public shift(): E | undefined {
    if (this._first === Node.Undefined) {
      return undefined;
    } else {
      const res = this._first.element;
      this.remove(this._first);

      return res;
    }
  }

  public pop(): E | undefined {
    if (this._last === Node.Undefined) {
      return undefined;
    } else {
      const res = this._last.element;
      this.remove(this._last);

      return res;
    }
  }

  public iterator(): Iterator<E> {
    let element: { done: false; value: E };
    let node = this._first;

    return {
      next(): { done: false; value: E } {
        if (node === Node.Undefined) {
          return FIN as any;
        }

        if (!element) {
          element = { done: false, value: node.element };
        } else {
          element.value = node.element;
        }
        node = node.next;

        return element;
      },
    };
  }

  public toArray(): E[] {
    const result: E[] = [];
    for (let node = this._first; node !== Node.Undefined; node = node.next) {
      result.push(node.element);
    }

    return result;
  }

  private insert(element: E, atTheEnd: boolean): () => void {
    const newNode = new Node(element);
    if (this._first === Node.Undefined) {
      this._first = newNode;
      this._last = newNode;
    } else if (atTheEnd) {
      // push
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const oldLast = this._last!;
      this._last = newNode;
      newNode.prev = oldLast;
      oldLast.next = newNode;
    } else {
      // unshift
      const oldFirst = this._first;
      this._first = newNode;
      newNode.next = oldFirst;
      oldFirst.prev = newNode;
    }
    this._size += 1;

    let didRemove = false;

    return (): void => {
      if (!didRemove) {
        didRemove = true;
        this.remove(newNode);
      }
    };
  }

  private remove(node: Node<E>): void {
    if (node.prev !== Node.Undefined && node.next !== Node.Undefined) {
      // middle
      const anchor = node.prev;
      anchor.next = node.next;
      node.next.prev = anchor;
    } else if (node.prev === Node.Undefined && node.next === Node.Undefined) {
      // only node
      this._first = Node.Undefined;
      this._last = Node.Undefined;
    } else if (node.next === Node.Undefined) {
      // last
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._last = this._last!.prev!;
      this._last.next = Node.Undefined;
    } else if (node.prev === Node.Undefined) {
      // first
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._first = this._first!.next!;
      this._first.prev = Node.Undefined;
    }

    // done
    this._size -= 1;
  }
}
