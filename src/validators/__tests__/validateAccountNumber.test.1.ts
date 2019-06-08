import { validateCreditCardNumber } from '../validateCreditCardNumber';

test('invalid credit card number', () => {
  [undefined, null, '', '1', '123'].forEach(value =>
    expect(validateCreditCardNumber(value)).toBe(false)
  );
});

test('valid credit card number', () => {
  ['5106208050715581', '5277308220106555'].forEach(value =>
    expect(validateCreditCardNumber(value)).toBe(true)
  );
});
