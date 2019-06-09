import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Client } from '../models/Client';
import { IdentificationDocument } from '../models/IdentificationDocument';

export const listClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repository = getRepository(Client);
    const clients = await repository.find();
    res.json(clients);
  } catch (e) {
    next();
  }
};

export const getClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repository = getRepository(Client);
    const results = await repository.findOne(req.params.id);
    return res.send(results);
  } catch (e) {
    next();
  }
};

export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const clientRepository = getRepository(Client);
  // let clients = await clientRepository.find({
  //   relations: ['identificationDocument']
  // });
  // // create a photo
  // let photo = new Photo();
  // photo.name = "Me and Bears";
  // photo.description = "I am near polar bears";
  // photo.filename = "photo-with-bears.jpg";
  // photo.isPublished = true;

  // // create a photo metadata
  // let metadata = new PhotoMetadata();
  // metadata.height = 640;
  // metadata.width = 480;
  // metadata.compressed = true;
  // metadata.comment = "cybershoot";
  // metadata.orientation = "portait";
  // metadata.photo = photo; // this way we connect them

  // // get entity repositories
  // let photoRepository = connection.getRepository(Photo);
  // let metadataRepository = connection.getRepository(PhotoMetadata);

  // // first we should save a photo
  // await photoRepository.save(photo);

  // // photo is saved. Now we need to save a photo metadata
  // await metadataRepository.save(metadata);

  // // done
  // console.log("Metadata is saved, and relation between metadata and photo is created in the database too");

  try {
    const clientRepository = getRepository(Client);
    const identificationDocumentRepository = getRepository(
      IdentificationDocument
    );
    const identificationDocument = await identificationDocumentRepository.create(
      {
        idNumber: 'ASV6969',
        type: 'id-card',
        scannedDocumentUrl: ''
      }
    );
    await identificationDocumentRepository.save(identificationDocument);
    console.log(JSON.stringify(identificationDocument, null, 2));
    const client = await clientRepository.create({
      login: 'pkogucik',
      firstName: 'Pietrek',
      lastName: 'Kogucik',
      PESEL: '66666666666',
      password: 'kogut',
      identificationDocument
    });

    const results = await clientRepository.save(client);
    return res.send(results);
  } catch (e) {
    next();
  }
  // try {
  //   const repository = getRepository(Client);
  //   const client = await repository.create(req.body);
  //   const results = await repository.save(client);
  //   return res.send(results);
  // } catch (e) {
  //   next();
  // }
};

export const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repository = getRepository(Client);
    const client = await repository.findOne(req.params.id);
    await repository.merge(client, req.body);
    const results = await repository.save(client);
    return res.send(results);
  } catch (e) {
    next();
  }
};

export const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repository = getRepository(Client);
    const results = await repository.remove(req.params.id);
    return res.send(results);
  } catch (e) {
    next();
  }
};
