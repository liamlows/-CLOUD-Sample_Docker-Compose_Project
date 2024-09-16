const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId:  process.env.S3_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_KEY,
});

const BUCKET_NAME = "course-pickle";


const uploadImage = async (accountId, image, extension) => {
    if(!process.env.S3_ACCESS_KEY){
        return async (accountId, image, extension) => {
            console.log("S3 not configured.");
        };
    }

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: `images/${accountId}.${extension}`,
        Body: image.data,
        ACL:'public-read',
    };

    // Uploading files to the bucket
    return s3.upload(params).promise();
}

module.exports = {
    s3,
    uploadImage
};