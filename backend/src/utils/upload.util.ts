import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

export function getMulterStorage(subFolder: string) {
  const basePath = process.env.UPLOADS_PATH || '/home/caseaiwk/prolockerlb.com/uploads';
  const uploadPath = join(basePath, subFolder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return diskStorage({
    destination: uploadPath,
    filename: (req, file, callback) => {
      const uniqueName = `${Date.now()}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  });
}


// import { diskStorage } from 'multer';
// import { extname, join } from 'path';
// import * as fs from 'fs';

// export function getMulterStorage(subFolder: string) {
//   // Absolute path to frontend uploads folder
//   const uploadPath = join('/home/caseaiwk/prolockerlb.com/uploads', subFolder);

//   // Ensure folder exists
//   if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
//   }

//   return diskStorage({
//     destination: uploadPath,
//     filename: (req, file, callback) => {
//       const uniqueName = `${Date.now()}${extname(file.originalname)}`;
//       callback(null, uniqueName);
//     },
//   });
// }
