const { imagekit } = require("../config/multer");

const doesImageExist = async (fieldname, folderPath) => {
    const fieldnameRegex = new RegExp(fieldname, "g");
    try {
        const files = await imagekit.listFiles({
            path: folderPath,
        });
        if (!files.length) return null;

        for (const file of files)
            if (file.name.search(fieldnameRegex) == 0) return file.fileId;

        return null;
    } catch (error) {
        console.error("Error checking folder existence:", error);
        return null;
    }
};

module.exports = doesImageExist;
