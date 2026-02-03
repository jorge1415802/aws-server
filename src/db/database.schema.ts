import { ColumnType, Generated } from 'kysely';

export interface FileTable {
  id: Generated<string>;
  fileName: string;
  s3Url: string;
  size: number;
  mimeType: string;
  createdAt: Generated<Date>;
}


export interface Database {
  File: FileTable; // "files" es el nombre de la tabla en Neon
}