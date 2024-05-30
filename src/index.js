const express = require("express")
const multer = require("multer")
const path = require("path")
const crypto = require("crypto")
const cloudinary = require("cloudinary").v2
const fs = require("fs")

const app = express()

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './uploads')
    },
    filename : (req, file, cb) => {
        crypto.randomBytes(10, (err, byte) => {
            if(err){
                return res.status(500).json({message : "Something went wrong while uploading file"})
            }
            return cb(null, byte.toString('hex') + path.extname(file.originalname))
        })
    }
})

const upload = multer({storage})

          
cloudinary.config({ 
  cloud_name: 'duvoga9f5', 
  api_key: '235896485895776', 
  api_secret: 'CDpvfkgYBQSlV3t2IN2HnepzGEU' 
});

const uploadToCloudinary = async localFile => {
    try{
        let response = await cloudinary.uploader.upload(localFile)
        fs.unlinkSync(localFile)
        return response.url
    }
    catch(err){
        throw new Error("Something went wrong while uplaoding to cloudinary")
    }
}


app.get('/', (req, res) => {
    console.log(__dirname)
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/upload', upload.single("image"), async (req, res) => {
    const fileUrl = await uploadToCloudinary(req.file.path)
    res.status(200).json({message : `file uploaded to url ${fileUrl}`})
})

app.listen(3000, () => {
    console.log("Server started")
})