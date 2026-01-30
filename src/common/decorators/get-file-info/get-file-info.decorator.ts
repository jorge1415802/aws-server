import { BadRequestException, createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const GetFileInfo = createParamDecorator(
    (data : unknown, ctx : ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const file = request.file; // get the file

        if(!file) {
            throw new BadRequestException('file not provided')
        }

        return {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer,
            s3Key: `${Date.now()}-${file.originalname}`
        }
    }
)
