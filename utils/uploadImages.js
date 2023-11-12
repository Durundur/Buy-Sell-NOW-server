const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dj16gqjts',
    api_key: '886367423267998',
    api_secret: '_tsjmGnHnvjM908JdMNEtsFSG0w',
    secure: true
})

const uploadImages = async (filesToUpload, publicId) => {
    const urls = {};
    for (let key in filesToUpload) {
        try {
            const result = await cloudinary.uploader.upload(filesToUpload[key].path, { public_id: `${publicId}.${key}`, overwrite: true, upload_preset: 'gtu733xq' });
            console.log(result);
            if (key.includes('image')) {
                urls[`images.${key.split('.')[1]}`] = result.url;
            } else {
                urls[key] = result.url;
            }
        } catch (error) {
            console.error(error);
        }
    }
    return urls
}

const deleteImage = async (imageId) => {
    try {
        const result = await cloudinary.uploader.destroy(imageId);
        return result;
    }
    catch (error) {
        console.error(error);
    }
}

module.exports = { uploadImages, deleteImage }
