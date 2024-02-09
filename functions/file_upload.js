require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");

// Call the function with the directory path
const directoryPath = "./files/";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// Configure AWS credentials
AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

// Create an instance of the AWS.S3 class
const s3 = new AWS.S3();

// function uploadFileToS3(fileName, filePath) {
//   fs.readFile(directoryPath + filePath, (err, fileContent) => {
//     if (err) {
//       console.error("Error reading file:", err);
//     } else {
//       const params = {
//         Bucket: bucketName,
//         Key: fileName,
//         Body: fileContent,
//       };

//       s3.upload(params, (err, data) => {
//         if (err) {
//           console.error("Error uploading file:", err);
//         } else {
//           console.log("File uploaded successfully:", data);
//         }
//       });
//     }
//   });
// }

function uploadFileToS3(fileName, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(directoryPath + filePath, (err, fileContent) => {
      if (err) {
        console.error("Error reading file:", err);
        reject(err);
      } else {
        const params = {
          Bucket: bucketName,
          Key: fileName,
          Body: fileContent,
        };

        s3.upload(params, (err, data) => {
          if (err) {
            console.error("Error uploading file:", err);
            reject(err);
          } else {
            const fileUrl = data.Location;
            resolve(fileUrl);
          }
        });
      }
    });
  });
}

function getFileListFromS3Bucket(bucketName) {
  const params = {
    Bucket: bucketName,
  };

  s3.listObjects(params, (err, data) => {
    if (err) {
      console.error("Error retrieving file list:", err);
    } else {
      console.log("Files in the bucket:", data.Contents);
    }
  });
}

exports.uploadFileToS3 = uploadFileToS3;
exports.getFileListFromS3Bucket = getFileListFromS3Bucket;
