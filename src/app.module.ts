import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { S3Client } from '@aws-sdk/client-s3'
import { SQSClient } from '@aws-sdk/client-sqs'
import { FileModule } from './files/file/file.module';
import { Kysely, PostgresDialect } from 'kysely';
import type { Database } from './db/database.schema'
import { Pool } from 'pg';


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
        // envFilePath: `.env` 
        ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
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
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: () => {
        return new Kysely<Database>({
          dialect: new PostgresDialect({
            pool : new Pool({
              connectionString : process.env.DATABASE_URL,
              ssl: { rejectUnauthorized : true }
            })
          })
        })
      }
    }
  ],
  exports: ['S3_CLIENT', 'SQS_CLIENT','DATABASE_CONNECTION'],
})
export class AppModule {}
