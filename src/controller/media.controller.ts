import { IMediaController } from "@/controller/interface/i.media.controller";
import BaseError from "@/utils/error/base.error";
import { StatusCodes } from "http-status-codes";
import { injectable } from "inversify";
const config = require("config");


@injectable()
export class MediaController implements IMediaController{
    async getPicture(req: any, res: any, next: any): Promise<any> {
        try {
            const pictureName = req.params.pictureName;
            if (!pictureName)
              throw new BaseError(
                StatusCodes.BAD_REQUEST,
                "fail",
                "Picture name is required"
              );
              const root = process.cwd();
              const path = `${root}/storage/media/${pictureName}`;
              res.sendFile(path);
        } catch (error) {
            next(error);
        }
    }
    async uploadPicture(req: any, res: any, next: any): Promise<any> {
        try {
            const pictureName = req.imagename;
            console.log("pictureName:", pictureName);
            const media_root = config.get("server").media_root;
            const api_version = config.get("API_VERSION");
            const root = process.cwd();
            const pictureURL = `${media_root}${api_version}/media/${pictureName}`;
            console.log("pictureURL", pictureURL);
            res.json({
              message: "Upload ảnh thành công",
              picture_url: pictureURL,
            });
          } catch (error) {
            next(error);
          }
    }

}