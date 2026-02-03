import { Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Kysely } from 'kysely';
import type { Database } from 'src/db/database.schema';
import { FileInfo } from './interfaces/file.interface';


@Injectable()
export class FileService {

  constructor(
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,   // Usa @Inject con el Token
    @Inject('SQS_CLIENT') private readonly sqsClient: SQSClient, // Usa @Inject con el Token
    @Inject('DATABASE_CONNECTION') private readonly db : Kysely<Database>
  ) {}


  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  async uploadFileAndNotify(fileInfo: FileInfo) {
    // upload file to S3 logic here
    const bucket = process.env.S3_BUCKET_NAME;
    const region = process.env.APP_REGION  || 'us-east-1';
    const queueUrl = process.env.SQS_QUEUE_URL || 'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/procesar-imagen-cola.fifo';
    
    await this.s3Client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: fileInfo.s3Key,
      Body: fileInfo.buffer,
      ContentType: fileInfo.mimetype,
    }));

    const s3Url = process.env.NODE_ENV === 'production'
  ? `https://${bucket}.s3.${region}://${fileInfo.s3Key}`
  : `http://localhost:4566/${bucket}/${fileInfo.s3Key}`;

    
    const record = await this.db.insertInto('File').values({
      fileName: fileInfo.originalname,
      s3Url: s3Url,
      size: fileInfo.size,
      mimeType: fileInfo.mimetype
    })
    .returningAll()
    .executeTakeFirst()


    await this.sqsClient.send(new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({
        fileId : record?.id,
        s3Key: fileInfo.s3Key,
      }),
      MessageGroupId: `file-group-${record?.id}`, // Necesario para colas FIFO
    }));

    return {
      message: 'File uploaded successfully and notification sent to SQS',
      record
    };
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
