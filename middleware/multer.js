import multer from 'multer'

// multer storage
const storage = multer.diskStorage({
    // setting the destination of the file
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

// multer upload
const upload = multer({ storage })

export default upload;