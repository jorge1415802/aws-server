export interface FileInfo {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
    s3Key: string;
}