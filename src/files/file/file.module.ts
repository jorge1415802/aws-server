import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}
