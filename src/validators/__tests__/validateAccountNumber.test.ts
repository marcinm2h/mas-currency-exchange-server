import { validateAccountNumber } from '../validateAccountNumber';

test('invalid account number', () => {
  [undefined, null, '', '1', '123'].forEach(value =>
    expect(validateAccountNumber(value)).toBe(false)
  );
});

test('valid account number', () => {
  ['57249000050223335049672699', '13249000051748163820351994'].forEach(value =>
    expect(validateAccountNumber(value)).toBe(true)
  );
});
