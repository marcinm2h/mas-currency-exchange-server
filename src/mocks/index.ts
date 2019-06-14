import { getRepository } from 'typeorm';
import { Client } from '../models/Client';
import { Currency } from '../models/Currency';
import { Wallet } from '../models/Wallet';
import { IdDocument } from '../models/IdDocument';
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
    wallet.balance = parseFloat((Math.random() * 100000).toFixed(2));
    return wallet;
  });
  const walletRepository = getRepository(Wallet);
  await walletRepository.save(wallets);

  const idDocument = new IdDocument();
  idDocument.type = Math.random() > 0.5 ? 'id-card' : 'passport';
  idDocument.idNumber = uuid().substring(0, 6);
  idDocument.scannedDocumentUrl = `${idDocument.idNumber}.jpg`;

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

  const idDocumentRepository = getRepository(IdDocument);
  await idDocumentRepository.save(idDocument);

  idDocument.owner = client;
  client.idDocument = idDocument;

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
        login: 'janusz',
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
        login: 'radek',
        password: 'pw',
        firstName: 'Radosław',
        lastName: 'Radosławski',
        birthday: '04-02-1988',
        PESEL: '88020493154',
        mail: 'client03@example.com'
      },
      { currencies }
    )
  );
  clients.push(
    await mockClient(
      {
        login: 'anna',
        password: 'pw',
        firstName: 'Anna',
        lastName: 'Aneczko',
        birthday: '04-02-1988',
        PESEL: '88020493154',
        mail: 'client03@example.com'
      },
      { currencies }
    )
  );
  clients.push(
    await mockClient(
      {
        login: 'gosia',
        password: 'pw',
        firstName: 'Małgorzata',
        lastName: 'Mago',
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
  await offerRepository.save(offer);
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
  await offerRepository.save(offer);
}

export async function mock() {
  const currencies = await mockCurrencies();
  const clients = await mockClients(currencies);
  const randomClient = () =>
    clients[Math.floor(Math.random() * clients.length)];
  const randomNumber = (min = 1, max = 900) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const randomCurrencies = () => {
    const idx1 = Math.floor(Math.random() * currencies.length);
    let idx2 = Math.floor(Math.random() * currencies.length);
    idx2 = idx2 === idx1 ? 1 : idx2;
    return [currencies[idx1], currencies[idx2]];
  };
  const randomArgs = () => {
    const [c1, c2] = randomCurrencies();
    return {
      owner: randomClient(),
      fromAmount: randomNumber(),
      fromCurrency: c1,
      toAmount: randomNumber(),
      toCurrency: c2
    };
  };

  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockPurchaseOffer(randomArgs());
  await mockSaleOffer(randomArgs());
  await mockSaleOffer(randomArgs());
  await mockSaleOffer(randomArgs());
  await mockSaleOffer(randomArgs());
  await mockSaleOffer(randomArgs());
  await mockSaleOffer(randomArgs());
  await mockSaleOffer(randomArgs());
  await mockSaleOffer(randomArgs());
  await mockSaleOffer(randomArgs());
  await mockSaleOffer(randomArgs());
  await mockSaleOffer(randomArgs());
  await mockSaleOffer(randomArgs());
  await mockSaleOffer(randomArgs());

  // await mockPurchaseOffer({
  //   owner: randomClient(),
  //   fromAmount: randomNumber(),
  //   fromCurrency: c1,
  //   toAmount: 200,
  //   toCurrency: c2
  // });
  // await mockPurchaseOffer({
  //   owner: clients[0],
  //   fromAmount: 100,
  //   fromCurrency: currencies.find(currency => currency.symbol === 'PLN'),
  //   toAmount: 200,
  //   toCurrency: currencies.find(currency => currency.symbol === 'RUB')
  // });
  // await mockPurchaseOffer({
  //   owner: clients[1],
  //   fromAmount: 200,
  //   fromCurrency: currencies.find(currency => currency.symbol === 'USD'),
  //   toAmount: 300,
  //   toCurrency: currencies.find(currency => currency.symbol === 'PLN')
  // });
  // await mockSaleOffer({
  //   owner: clients[1],
  //   fromAmount: 200,
  //   fromCurrency: currencies.find(currency => currency.symbol === 'USD'),
  //   toAmount: 300,
  //   toCurrency: currencies.find(currency => currency.symbol === 'PLN')
  // });
  // await mockSaleOffer({
  //   owner: clients[1],
  //   participant: clients[0],
  //   fromAmount: 250,
  //   fromCurrency: currencies.find(currency => currency.symbol === 'USD'),
  //   toAmount: 1000,
  //   toCurrency: currencies.find(currency => currency.symbol === 'PLN')
  // });
}
