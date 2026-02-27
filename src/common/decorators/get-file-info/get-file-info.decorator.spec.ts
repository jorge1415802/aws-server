import { GetFileInfo } from "./get-file-info.decorator";
import { ExecutionContext } from "@nestjs/common";
import 'reflect-metadata'; // Asegurá que esté para que funcione Reflect

function getParamDecoratorFactory(decorator: Function) {
  const target = { [decorator.name]: () => {} };
  const key = decorator.name;
  
  // Ejecutamos el decorador sobre nuestra función temporal
  decorator(target, key, 0);

  // Extraemos los metadatos que Nest inyectó
  const metadata = Reflect.getMetadata('__routeArguments__', target.constructor, key);
  
  // Buscamos la primera clave (normalmente '0:0') y extraemos la factory
  const firstKey = Object.keys(metadata)[0];
  return metadata[firstKey].factory;
}

describe('Get-File-Info', () => {
    const factory = getParamDecoratorFactory(GetFileInfo)


    it('should return de file information if the file exist', () => {
        const mockFile = {
            originalname: 'test.png',
            mimetype: 'image/png',
            size: 1024,
            buffer: Buffer.from('test'),
        };
        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    file: mockFile,
                }),
            }),
        } as unknown as ExecutionContext;

        const result = factory(null, mockExecutionContext)
        expect(result).toBeDefined();
        expect(result.originalname).toBe(mockFile.originalname);
        expect(result.s3Key).toContain('test.png'); // Verifica que genere la key
    })
})