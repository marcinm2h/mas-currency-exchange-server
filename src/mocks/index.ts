import { getRepository } from 'typeorm';
import { Client } from '../models/Client';
import { Currency } from '../models/Currency';
import { Wallet } from '../models/Wallet';
import { IdentificationDocument } from '../models/IdentificationDocument';
import * as uuid from 'uuid/v4';

async function mockClient(
  {
    login,
    password,
    firstName,
    lastName,
    birthday,
    PESEL,
    mail,
    contactAddress
  }: {
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    birthday: string;
    PESEL: string;
    mail?: string;
    contactAddress?: string;
  },
  { currencies }: { currencies: Currency[] }
) {
  const wallets = currencies.map(currency => {
    const wallet = new Wallet();
    wallet.currency = currency;
    return wallet;
  });
  const walletRepository = getRepository(Wallet);
  await walletRepository.save(wallets);

  const identificationDocument = new IdentificationDocument();
  identificationDocument.type = Math.random() > 0.5 ? 'id-card' : 'passport';
  identificationDocument.idNumber = uuid().substring(0, 6);
  identificationDocument.scannedDocumentUrl = `${identificationDocument.idNumber}.jpg`;

  const client = new Client();
  client.login = login;
  client.password = password;
  client.firstName = firstName;
  client.lastName = lastName;
  client.birthday = new Date(birthday);
  client.PESEL = PESEL;
  client.mail = mail;
  client.contactAddress = contactAddress;

  wallets.forEach(wallet => {
    wallet.owner = client;
  });
  client.wallets = wallets;

  const identificationDocumentRepository = getRepository(
    IdentificationDocument
  );
  await identificationDocumentRepository.save(identificationDocument);

  identificationDocument.owner = client;
  client.identificationDocument = identificationDocument;

  const clientRepository = getRepository(Client);
  await clientRepository.save(client);

  return client;
}

async function mockCurrencies() {
  const currencies = [
    ['Polish zloty', 'PLN'],
    ['United States Dollar', 'USD'],
    ['Euro', 'EUR'],
    ['Russian Ruble', 'RUB']
  ].map(([name, symbol]) => {
    const currency = new Currency();
    currency.name = name;
    currency.symbol = symbol;
    return currency;
  });
  const currencyRepository = getRepository(Currency);
  await currencyRepository.save(currencies);

  return currencies;
}

export async function mockClients() {
  const currencies = await mockCurrencies();
  const clients = [];
  clients.push(
    await mockClient(
      {
        login: 'client01',
        password: 'pw01',
        firstName: 'Andrzej',
        lastName: 'Andrzejewski',
        birthday: '01-22-1990',
        PESEL: '90050293154',
        mail: 'client01@example.com'
      },
      { currencies }
    )
  );
  clients.push(
    await mockClient(
      {
        login: 'client02',
        password: 'pw02',
        firstName: 'Janusz',
        lastName: 'Januszewicz',
        birthday: '02-23-1967',
        PESEL: '67022393154',
        mail: 'client02@example.com'
      },
      { currencies }
    )
  );
  clients.push(
    await mockClient(
      {
        login: 'client03',
        password: 'pw03',
        firstName: 'Janina',
        lastName: 'Janowicz',
        birthday: '04-02-1988',
        PESEL: '88020493154',
        mail: 'client03@example.com'
      },
      { currencies }
    )
  );

  return clients;
}
