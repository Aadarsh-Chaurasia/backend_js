import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)

        cb(null, file.originalname) // Storing file temporary with original name but this can lead to overriding file if user upload multiple files with same name.
    }
})

export const upload = multer({ storage: storage })