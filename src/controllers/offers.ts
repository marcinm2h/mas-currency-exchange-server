import { NextFunction, Response } from 'express';
import { getRepository } from 'typeorm';
import { Request } from '../routes/auth';
import { PurchaseOffer } from '../models/PurchaseOffer';
import { SaleOffer } from '../models/SaleOffer';
import { OfferType } from '../models/abstracts/Offer';
import { Client } from '../models/Client';
import { Currency } from '../models/Currency';
import { Wallet } from '../models/Wallet';

//FIXME: przenieść do user
export const createOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.session;
    const {
      type,
      fromAmount,
      fromCurrencyId,
      toAmount,
      toCurrencyId
    }: {
      type: OfferType;
      fromAmount: number;
      fromCurrencyId: number;
      toAmount: number;
      toCurrencyId: number;
    } = req.body;
    debugger;
    if (fromCurrencyId === toCurrencyId) {
      throw new Error('From currency can not be same as to currency');
    }
    if (fromAmount < 1 || toAmount < 1) {
      throw new Error('Min offer amount is 1');
    }
    const repository = getRepository(
      type === 'purchase' ? PurchaseOffer : SaleOffer
    );
    const clientRepository = getRepository(Client);
    const owner = await clientRepository.findOne(userId, {
      relations: ['wallets', 'wallets.currency']
    });
    const ownerOfferWalletFromCurrency = owner.wallets.find(
      wallet => wallet.currency.id === fromCurrencyId
    );
    if (ownerOfferWalletFromCurrency.balance < fromAmount) {
      throw new Error('Insuffcient funds');
    }

    const currencyRepository = getRepository(Currency);
    const fromCurrency = await currencyRepository.findOne(fromCurrencyId);
    const toCurrency = await currencyRepository.findOne(toCurrencyId);
    const offer = repository.create({
      owner,
      fromAmount,
      fromCurrency,
      toAmount,
      toCurrency
    });

    const response = await repository.save(offer);

    res.json({
      data: response
    });
  } catch (e) {
    next(e);
  }
};

export const listOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchasefferRepository = getRepository(PurchaseOffer);
    const saleOfferRepository = getRepository(SaleOffer);
    const purchaseOffers = await purchasefferRepository.find({
      relations: ['fromCurrency', 'toCurrency', 'participant', 'owner']
    });
    const saleOffers = await saleOfferRepository.find({
      relations: ['fromCurrency', 'toCurrency', 'participant', 'owner']
    });

    res.json({
      data: [...purchaseOffers, ...saleOffers]
    });
  } catch (e) {
    next(e);
  }
};

export const listPurchaseOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query;
    const purchasefferRepository = getRepository(PurchaseOffer);
    const purchaseOffers = await purchasefferRepository.find({
      relations: ['fromCurrency', 'toCurrency', 'participant', 'owner'],
      where: { status }
    });

    res.json({
      data: purchaseOffers
    });
  } catch (e) {
    next(e);
  }
};

export const listSaleOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query;
    const saleOfferRepository = getRepository(SaleOffer);
    const saleOffers = await saleOfferRepository.find({
      relations: ['fromCurrency', 'toCurrency', 'participant', 'owner'],
      where: { status }
    });

    res.json({
      data: saleOffers
    });
  } catch (e) {
    next(e);
  }
};

export const getPurchaseOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: offerId } = req.params;
    const purchaseOfferRepository = getRepository(PurchaseOffer);
    const purchaseOffer = await purchaseOfferRepository.findOne(offerId, {
      relations: ['fromCurrency', 'toCurrency', 'participant', 'owner']
    });

    res.json({
      data: purchaseOffer
    });
  } catch (e) {
    next(e);
  }
};

export const getSaleOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: offerId } = req.params;
    const saleOfferRepository = getRepository(SaleOffer);
    const saleOffer = await saleOfferRepository.findOne(offerId, {
      relations: ['fromCurrency', 'toCurrency', 'participant', 'owner']
    });

    res.json({
      data: saleOffer
    });
  } catch (e) {
    next(e);
  }
};

export const acceptOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.session;
    const {
      type,
      offerId
    }: {
      type: OfferType;
      offerId: number;
    } = req.body;
    const offerRepository = getRepository(
      type === 'purchase' ? PurchaseOffer : SaleOffer
    );
    const offer = await offerRepository.findOne(offerId, {
      relations: ['owner', 'fromCurrency', 'toCurrency']
    });
    if (offer.owner.id === userId) {
      throw new Error('User can not accept own offers');
    }

    const clientRepository = getRepository(Client);
    const participant = await clientRepository.findOne(userId, {
      relations: ['wallets']
    });
    const owner = await clientRepository.findOne(offer.owner.id, {
      relations: ['wallets']
    });

    offer.participant = participant;
    offer.status = 'completed';
    const response = await offerRepository.save(offer);

    const walletRepository = getRepository(Wallet);
    const ownerWallets = await walletRepository.find({
      where: { owner },
      relations: ['currency']
    });
    const participantWallets = await walletRepository.find({
      where: { owner: participant },
      relations: ['currency']
    });

    const ownerOfferWalletFromCurrency = ownerWallets.find(
      wallet => wallet.currency.id === offer.fromCurrency.id
    );
    const ownerOfferWalletToCurrency = ownerWallets.find(
      wallet => wallet.currency.id === offer.toCurrency.id
    );
    const participantOfferWalletFromCurrency = participantWallets.find(
      wallet => wallet.currency.id === offer.fromCurrency.id
    );
    const participantOfferWalletToCurrency = participantWallets.find(
      wallet => wallet.currency.id === offer.toCurrency.id
    );

    if (offer.type === 'purchase') {
      ownerOfferWalletFromCurrency.balance =
        ownerOfferWalletFromCurrency.balance + offer.fromAmount;
      ownerOfferWalletToCurrency.balance =
        ownerOfferWalletToCurrency.balance - offer.toAmount;
      participantOfferWalletFromCurrency.balance =
        participantOfferWalletFromCurrency.balance - offer.fromAmount;
      participantOfferWalletToCurrency.balance =
        participantOfferWalletToCurrency.balance + offer.toAmount;
    } else if (offer.type === 'sale') {
      ownerOfferWalletFromCurrency.balance =
        ownerOfferWalletFromCurrency.balance - offer.fromAmount;
      ownerOfferWalletToCurrency.balance =
        ownerOfferWalletToCurrency.balance + offer.toAmount;
      participantOfferWalletFromCurrency.balance =
        participantOfferWalletFromCurrency.balance + offer.fromAmount;
      participantOfferWalletToCurrency.balance =
        participantOfferWalletToCurrency.balance - offer.toAmount;
    }

    await walletRepository.save([...ownerWallets, ...participantWallets]);

    res.json({
      data: response
    });
  } catch (e) {
    next(e);
  }
};
