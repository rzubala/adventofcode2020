import * as file from 'fs';

export class FileReader {
    readData = (path: string) => {
        return new Promise<any>((resolve, reject) => {
            file.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        });
    }
}

export class Stack<T> {
    _store: T[] = [];
    push(val: T) {
      this._store.push(val);
    }
    pop(): T | undefined {
      return this._store.pop();
    }
  }