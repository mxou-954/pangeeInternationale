import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/s3.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity'; // ton entité Document

@Injectable()
export class DocumentsService {
  private bucketName = 'pangee-internationale-documents';
  private region = 'eu-north-1';

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async uploadDocument(file: Express.Multer.File, recipientId: string): Promise<string> {
    const fileKey = `documents/${uuid()}-${file.originalname}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;

    // 💾 enregistrement en base
    const doc = this.documentRepository.create({
      name: file.originalname,
      url,
      recipientId,
      uploaderId: 'A_FAIRE', // récupère ça depuis l'utilisateur connecté si tu as auth
      uploadDate: new Date(),
    });

    await this.documentRepository.save(doc);

    return url;
  }

  async find(userId: string) {
    return this.documentRepository.find({
    where: { recipientId: userId },
    order: { uploadDate: 'DESC' },
  });
  }
}
