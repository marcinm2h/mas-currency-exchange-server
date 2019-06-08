export function validateCreditCardNumber(value?: string) {
  if (typeof value !== 'string') {
    return false;
  }

  if (value.length < 16) {
    return false;
  }

  return true;
}
