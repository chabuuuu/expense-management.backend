const multer = require('multer');
const path = require('path');
  const storage =  multer.diskStorage({
    destination: async (req: any, file: any, cb: any) => {
      await cb(null, `storage/media`);        
    },
    filename: async (req: any, file: any, cb: any) => {
      var imagename = Date.now() + path.extname(file.originalname);
      req.imagename = imagename;
      console.log('imagename:', imagename);
      
      await cb(null, imagename);
    },
  });
  console.log(storage.getFilename);
  
  export var uploadPicture =  multer({
    storage:  storage,
  }).single('image');

