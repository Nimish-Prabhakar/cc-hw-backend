// controllers/fileController.js
const {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({ region: process.env.AWS_REGION });

exports.uploadFile = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const fileStream = fs.createReadStream(file.path);
    console.log("File path:", file.path);
    console.log("Uploading file:", file.originalname);

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${uuidv4()}-${file.originalname}`,
      Body: fileStream,
      ContentDisposition: "inline",
    };

    const data = await s3.send(new PutObjectCommand(uploadParams));
    console.log("File uploaded successfully:", data);
    res.status(200).json({
      message: "File uploaded successfully",
      url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${uploadParams.Key}`,
    });
  } catch (error) {
    console.error("Error during upload:", error);
    res.status(500).json({ error: "Error uploading file" });
  }
};

exports.listFiles = async (req, res) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
  };

  try {
    const data = await s3.send(new ListObjectsCommand(params));
    const files = data.Contents.map((file) => ({
      name: file.Key,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${file.Key}`,
    }));
    res.status(200).json(files);
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ error: "Error listing files" });
  }
};

exports.deleteFile = async (req, res) => {
  const { fileName } = req.params;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
};
