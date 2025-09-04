import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get, 
  Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { Express } from 'express';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('recipientId') recipientId: string,
  ) {
    const url = await this.documentsService.uploadDocument(file, recipientId);
    return { url };
  }

  @Get()
async listDocuments(@Query('userId') userId: string) {
  return this.documentsService.find(userId)
}
}
