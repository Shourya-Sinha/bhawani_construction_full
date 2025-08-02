import ImageKit from "imagekit";
import { Readable } from 'stream';
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Worker Upload Middleware
export const uploadIDFileFromStream = async (stream, fileName, options = {}) => {
    return new Promise((resolve, reject) => {
        const chunks = [];

        stream
            .on('data', (chunk) => chunks.push(chunk))
            .on('end', async () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    const result = await imagekit.upload({
                        file: buffer,
                        fileName,
                        folder: "/BHCFamily/Worker/IDs",
                        ...options
                    });
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', reject);
    });
};

export const uploadIntroVideoFileFromStream = async (stream, fileName, options = {}) => {
    return new Promise((resolve, reject) => {
        const chunks = [];

        stream
            .on('data', (chunk) => chunks.push(chunk))
            .on('end', async () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    const result = await imagekit.upload({
                        file: buffer,
                        fileName,
                        folder: "/BHCFamily/Worker/IntroVideos",
                        ...options
                    });
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', reject);
    });
};

// export const uploadProfilePicFromStream = async (stream, fileName, options = {}) => {
//     return new Promise((resolve, reject) => {
//         const chunks = [];

//         stream
//             .on('data', (chunk) => chunks.push(chunk))
//             .on('end', async () => {
//                 try {
//                     const buffer = Buffer.concat(chunks);
//                     const result = await imagekit.upload({
//                         file: buffer,
//                         fileName,
//                         folder: "/BHCFamily/Worker/ProfilePic",
//                         ...options
//                     });
//                     resolve(result);
//                 } catch (error) {
//                     reject(error);
//                 }
//             })
//             .on('error', reject);
//     });
// };

export const uploadProfilePicFromStream = async (buffer, fileName, options = {}) => {
    try {
        const result = await imagekit.upload({
            file: buffer,
            fileName,
            folder: "/BHCFamily/Worker/ProfilePic",
            ...options
        });
        return result;
    } catch (error) {
        throw error;
    }
};


// Company Upload Middleware
export const uploadProjectFileFromStream = async (stream, fileName, options = {}) => {
    return new Promise((resolve, reject) => {
        const chunks = [];

        stream
            .on('data', (chunk) => chunks.push(chunk))
            .on('end', async () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    const result = await imagekit.upload({
                        file: buffer,
                        fileName,
                        folder: "/BHCFamily/Company/ProjectFile",
                        ...options
                    });
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', reject);
    });
};

export const uploadCompanyLogoFromStream = async (stream, fileName, options = {}) => {
    return new Promise((resolve, reject) => {
        const chunks = [];

        stream
            .on('data', (chunk) => chunks.push(chunk))
            .on('end', async () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    const result = await imagekit.upload({
                        file: buffer,
                        fileName,
                        folder: "/BHCFamily/Company/Logo",
                        ...options
                    });
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', reject);
    });
};

export const uploadCompanyProjectFileFromStream = async (stream, fileName, options = {}) => {
    return new Promise((resolve, reject) => {
        const chunks = [];

        stream
            .on('data', (chunk) => chunks.push(chunk))
            .on('end', async () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    const result = await imagekit.upload({
                        file: buffer,
                        fileName,
                        folder: "/BHCFamily/Company/Published_Project_File",
                        ...options
                    });
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', reject);
    });
};


// Global Delete Middleware
export const deleteFile = async (fileId) => {
  try {
    return await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error("ImageKit delete error:", error);
    throw error;
  }
};