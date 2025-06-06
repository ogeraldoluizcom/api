import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

// Define MulterFile type for TypeScript
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class UploadService {
  private s3 = new AWS.S3({
    endpoint: process.env.DO_SPACES_ENDPOINT,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
    region: 'fra1',
  });

  private bucket = process.env.DO_SPACES_BUCKET;
  async uploadFile(file: MulterFile, folder = 'cases') {
    const fileName = `${folder}/${uuid()}-${file.originalname}`;

    const result = await this.s3
      .upload({
        Bucket: this.bucket,
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      })
      .promise();

    return result.Location;
  }
}
