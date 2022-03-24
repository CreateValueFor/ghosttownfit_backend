const multerS3 = require("multer-s3")
const multer = require("multer")
const AWS = require('aws-sdk');

const path = require('path')
const uuid = require('uuid').v4
const dotenv = require('dotenv');
dotenv.config();

const { AWS_config_region, AWS_IDENTITYPOOLID } = process.env;

const bucket = 'ghosttown'

AWS.config.update({
    region: AWS_config_region,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: AWS_IDENTITYPOOLID
    })
})

const s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: { Bucket: bucket }
})

const upload = multer({
    storage: multerS3({
        s3,
        bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, 'products/' + uuid4().replace(/-/g, "") + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
})

module.exports(uplaod)