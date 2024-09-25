const { imagekit } = require("../config/multer");

const doesImageKitFolderExist = async (folderPath) => {
    try {
        const response = await imagekit.listFiles({
            path: folderPath,
            limit: 1,
        });

        return response.length > 0;
    } catch (error) {
        console.error("Error checking folder existence:", error);
        return false;
    }
};

module.exports = doesImageKitFolderExist;
