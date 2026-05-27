export function getLocalData<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);

  if (!data) {
    return defaultValue;
  }

  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}

export function setLocalData<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocalData(key: string): void {
  localStorage.removeItem(key);
}