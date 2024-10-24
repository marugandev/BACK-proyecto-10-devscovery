const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const uploadImg = (folderName) => {
  const mainFolder = "proyecto-10-devscovery";
  const subFolder = folderName;

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `${mainFolder}/${subFolder}`,
      allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
      transformation: [{ fetch_format: "webp", quality: "auto:good" }]
    }
  });

  return multer({ storage: storage });
};

module.exports = { uploadImg };
