const cloudinary = require("cloudinary").v2;

const deleteFile = (imgSrc) => {
  /*   console.log(imgSrc); */
  const imgSrcSplited = imgSrc.split("/");
  const folderName = imgSrcSplited.at(-2);
  const fieldName = imgSrcSplited.at(-1).split(".");

  const public_id = `${folderName}/${fieldName[0]}`;

  cloudinary.uploader.destroy(public_id, () => {
    console.log("Image deleted from Cloudinary 🔥");
  });
};

module.exports = { deleteFile };
