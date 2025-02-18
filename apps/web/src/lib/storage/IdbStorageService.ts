import { del, get, set } from 'idb-keyval';
import { BehaviorSubject } from 'rxjs';

export class IDBStorageService<T> {
  private subject: BehaviorSubject<T | null>;

  constructor(private key: string) {
    this.subject = new BehaviorSubject<T | null>(null);
    this.initialize();
  }

  private async initialize() {
    const storedValue = await get<T>(this.key);
    this.subject.next(storedValue || null);
  }

  get data$() {
    return this.subject.asObservable();
  }

  async setData(value: T) {
    await set(this.key, value);
    this.subject.next(value);
  }

  async clear() {
    await del(this.key);
    this.subject.next(null);
  }
}
