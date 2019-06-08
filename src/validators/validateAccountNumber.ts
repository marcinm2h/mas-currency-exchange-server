export function validateAccountNumber(value?: string) {
  if (typeof value !== 'string') {
    return false;
  }

  if (value.length < 26) {
    return false;
  }

  return true;
}
