import { NestFactory } from '@nestjs/core';
import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { AppModule } from '../app.module';
import { Handler, Context, Callback } from 'aws-lambda';

let cachedServer: Handler;

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  if (!cachedServer) {
    // Inicializamos la app de Nest sin levantar el servidor HTTP
    const nestApp = await NestFactory.create(AppModule);
    await nestApp.init();
        
    // Obtenemos la instancia de Express interna de Nest
    const expressApp = nestApp.getHttpAdapter().getInstance();
    
    // Creamos el adaptador que traduce de Lambda a Express
    cachedServer = serverlessExpress({ app: expressApp });
  }

  // Retornamos la ejecución del evento actual
  return cachedServer(event, context, callback);
};
