const multer = require('multer')
const path = require('path')

const multerConfig = {
	dest: path.resolve(__dirname, '..', '..', 'uploads'),
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, path.resolve(__dirname, '..', '..', 'uploads'))
		},
		filename: (req, file, cb) => {
			const { id } = req.params
			cb(null, `${id}.jpeg`)
		},
	}),
	limits: {
		fileSize: 2 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif']
		if (allowedMimes.includes(file.mimetype)) {
			cb(null, true)
		} else {
			cb(new Error('Invalid file type.'))
		}
	},
}

const multerUploader = multer(multerConfig).single('image')
module.exports = multerUploader
