import { getRepository } from 'typeorm';
import { Client } from '../models/Client';
import { Currency } from '../models/Currency';
import { Wallet } from '../models/Wallet';
import { IdentificationDocument } from '../models/IdentificationDocument';
import * as uuid from 'uuid/v4';
import { PurchaseOffer } from '../models/PurchaseOffer';
import { SaleOffer } from '../models/SaleOffer';

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

export async function mockClients(currencies: Currency[]) {
  const clients: Client[] = [];
  clients.push(
    await mockClient(
      {
        login: 'andrzej',
        password: 'pw',
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
        password: 'pw',
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
        password: 'pw',
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

export async function mockPurchaseOffer({
  owner,
  participant,
  fromCurrency,
  fromAmount,
  toCurrency,
  toAmount
}: {
  owner: Client;
  participant?: Client;
  fromCurrency: Currency;
  fromAmount: number;
  toCurrency: Currency;
  toAmount: number;
}) {
  const offer = new PurchaseOffer();
  offer.owner = owner;
  if (participant) {
    offer.status = 'completed';
    offer.participant = participant;
  }
  offer.fromCurrency = fromCurrency;
  offer.fromAmount = fromAmount;
  offer.toCurrency = toCurrency;
  offer.toAmount = toAmount;

  const offerRepository = getRepository(PurchaseOffer);
  offerRepository.save(offer);
}

export async function mockSaleOffer({
  participant,
  owner,
  fromCurrency,
  fromAmount,
  toCurrency,
  toAmount
}: {
  owner: Client;
  participant?: Client;
  fromCurrency: Currency;
  fromAmount: number;
  toCurrency: Currency;
  toAmount: number;
}) {
  const offer = new SaleOffer();
  offer.owner = owner;
  if (participant) {
    offer.status = 'completed';
    offer.participant = participant;
  }
  offer.fromCurrency = fromCurrency;
  offer.fromAmount = fromAmount;
  offer.toCurrency = toCurrency;
  offer.toAmount = toAmount;

  const offerRepository = getRepository(SaleOffer);
  offerRepository.save(offer);
}

export async function mock() {
  const currencies = await mockCurrencies();
  const clients = await mockClients(currencies);
  await mockPurchaseOffer({
    owner: clients[0],
    fromAmount: 100,
    fromCurrency: currencies.find(currency => currency.symbol === 'PLN'),
    toAmount: 200,
    toCurrency: currencies.find(currency => currency.symbol === 'RUB')
  });
  await mockPurchaseOffer({
    owner: clients[1],
    fromAmount: 200,
    fromCurrency: currencies.find(currency => currency.symbol === 'USD'),
    toAmount: 300,
    toCurrency: currencies.find(currency => currency.symbol === 'PLN')
  });
  await mockSaleOffer({
    owner: clients[1],
    fromAmount: 200,
    fromCurrency: currencies.find(currency => currency.symbol === 'USD'),
    toAmount: 300,
    toCurrency: currencies.find(currency => currency.symbol === 'PLN')
  });
  await mockSaleOffer({
    owner: clients[1],
    participant: clients[0],
    fromAmount: 250,
    fromCurrency: currencies.find(currency => currency.symbol === 'USD'),
    toAmount: 1000,
    toCurrency: currencies.find(currency => currency.symbol === 'PLN')
  });
}
