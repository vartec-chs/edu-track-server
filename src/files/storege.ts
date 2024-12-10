import { diskStorage } from 'multer'

export const storage = diskStorage({
	destination: './uploads',
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	},
})
