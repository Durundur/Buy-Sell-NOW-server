const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'dj16gqjts',
    api_key: '886367423267998',
    api_secret: '_tsjmGnHnvjM908JdMNEtsFSG0w',
    secure: true
  })

const uploadImages = async (filesToUpload, advertId) => {
    const urls = {};
    for(let key in filesToUpload){
        const fileIndex = key.split('.')[1];
        try {
            const result = await cloudinary.uploader.upload(filesToUpload[key].path, {public_id: `${advertId}.${fileIndex}`, overwrite: true, upload_preset: 'gtu733xq'});
            urls[`images.${fileIndex}`] = result.url;
        } catch (error) {
            console.error(error);
        }
    }
    return urls
    
}

module.exports = uploadImages
