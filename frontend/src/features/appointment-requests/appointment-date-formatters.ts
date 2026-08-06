export function formatDateTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { timeStyle: 'short' }).format(new Date(value));
}
