// s3.js or your AWS configuration file

const AWS = require("aws-sdk");

// Remove explicit credentials and only set the region
AWS.config.update({
  region: "us-east-2", // Ensure this matches your actual AWS region
});

// Initialize the S3 client without credentials
const s3 = new AWS.S3();

module.exports = s3;
