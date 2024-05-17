export interface IMediaController {
    getPicture(req: any, res: any, next: any): Promise<any>;
    uploadPicture(req: any, res: any, next: any): Promise<any>;
}