import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config'
import { S3Client } from '@aws-sdk/client-s3'
import { SQSClient } from '@aws-sdk/client-sqs'
import { FileModule } from './files/file/file.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
        // envFilePath: `.env` 
        ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    PrismaModule,
    FileModule
    
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'S3_CLIENT',
      useFactory: () => new S3Client({
        // region: 'us-east-1',
        // endpoint: 'http://localhost:4566',
        // forcePathStyle: true,
        // credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
      }),
    },
    {
      provide: 'SQS_CLIENT',
      useFactory: () => new SQSClient({
        // region: 'us-east-1',
        // endpoint: 'http://localhost:4566',
        // credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
      }),
    },
  ],
  exports: ['S3_CLIENT', 'SQS_CLIENT'],
})
export class AppModule {}
