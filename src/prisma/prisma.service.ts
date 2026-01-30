import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';






@Injectable()
export class PrismaService extends PrismaClient  implements OnModuleInit, OnModuleDestroy {
    

    private readonly logger = new Logger()

    constructor() {
        const url = process.env.DATABASE_URL?.toString();
        if(!url) throw Error('env variable not defined')
        const pool = new  Pool({
            connectionString: url,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000,
            max: 1
        })
        // const adapter = new PrismaPg({connectionString: url});
        const adapter = new PrismaPg(pool);
        // super({adapter})
        super({ 
      adapter,
      // ESTO ARREGLA EL ERROR: Obligamos a Prisma a buscar el cliente en la carpeta correcta de AWS
        __internal: {
        engine: {
          binaryPath: '/var/task/node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node'
        }
      } as any
    });

    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('connected db')
            this.logger.log(process.env.DATABASE_URL)
        } catch (error) {
            this.logger.error('fail to connect db',error);
        }
        
    }

    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.logger.log('disconected')    
        } catch (error) {
            this.logger.error('error on try disconnect', error);
        }
        
    }
}
