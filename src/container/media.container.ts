import { IMediaController } from "@/controller/interface/i.media.controller";
import { MediaController } from "@/controller/media.controller";
import { ITYPES } from "@/types/interface.types";
import { Container } from "inversify";

const mediaContainer = new Container();

mediaContainer.bind<IMediaController>(ITYPES.Controller).to(MediaController);

const mediaController = mediaContainer.get<IMediaController>(ITYPES.Controller);

export { mediaController };