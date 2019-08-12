const {
    cloudinaryUploadPreset,
    cloudinaryCloudName
} = Meteor.settings.public;

const postUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`;

export default {
    uploadVideo: uploadBlob =>
        new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", uploadBlob);
            formData.append("upload_preset", cloudinaryUploadPreset);
            return fetch(postUrl, {
                method: "post",
                body: formData
            })
                .then(response => {
                    console.log("Cloudinary Response:", response)
                    return response.json()
                })
                .then(json => {
                    console.log("Cloudinary JSON:", json)
                    resolve(json);
                })
                .catch(error => {
                    console.warn("Cloudinary Error:", error);
                    reject(error);
                });
        })
};
