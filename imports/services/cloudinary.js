const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET
} = Meteor.settings.public;

const postUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

export default {
    uploadVideo: uploadBlob =>
        new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", uploadBlob);
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
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
