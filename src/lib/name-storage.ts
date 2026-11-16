const KEY = 'wall:name';

export function loadName(): string {
  try {
    return window.localStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveName(name: string): void {
  try {
    window.localStorage.setItem(KEY, name);
  } catch {
    // Storage is blocked or full: the name just is not remembered.
  }
}
