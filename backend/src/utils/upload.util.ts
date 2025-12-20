import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

export function getMulterStorage(subFolder: string) {
  const basePath = process.env.UPLOADS_PATH || 'uploads';
  const uploadPath = join(__dirname, '..', '..', basePath, subFolder);

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
