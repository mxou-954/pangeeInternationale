// lib/notifier.ts
export type Notifier = { success: (m: string) => void; error: (m: string) => void };

let notifier: Notifier = { success: () => {}, error: () => {} }; // no-op par défaut

export function setNotifier(n: Notifier) {
  notifier = n;
}

export function getNotifier(): Notifier {
  return notifier;
}
