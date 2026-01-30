import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Context, SQSEvent } from "aws-lambda";
import { AppModule } from "src/app.module";
import { FileService } from "src/files/file/file.service";


export const handler = async (event: SQSEvent, context: Context) => {
    // Crear el contexto de la aplicación NestJS (sin server HTTP)
    const app = await NestFactory.createApplicationContext(AppModule);
    const fileService = app.get(FileService);
    const logger = new Logger();

    try {
        for (const record of event.Records) {

            console.log('--- New SQS Record ---');
            console.log('Message ID:', record.messageId);
            console.log('Body:', record.body);
            console.log('Attributes:', record.attributes);
            console.log('----------------------');
            // const messageBody = JSON.parse(record.body);
            // const { originalname, mimetype, size, buffer, s3Key } = messageBody;
            // await fileService.uploadFileAndNotify({ originalname, mimetype, size, buffer, s3Key });
        }
    } catch (error) {
        logger.error('Error processing SQS event', error);
    }
    finally {
        await app.close();
    }
}