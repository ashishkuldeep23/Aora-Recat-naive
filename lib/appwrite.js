
// com.ashish.aora

import { Client, ID, Account, Avatars, Databases, Query, Storage } from 'react-native-appwrite';


export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.ashish.aora",
    projectId: "662f743f0003981ab337",
    databaseId: "662fba5c0009381c92f4",
    userCollectionId: "662fbb03001be964d057",
    videoCollectionId: "662fbb50001b0637b557",
    storageId: "662fbd51000c8dffbb4a"
}



const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = appwriteConfig


// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
    ;



const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User

export const createNewUser = async (email, password, username) => {
    try {

        const newAccount = await account.create(
            ID.unique(),
            `${email}`,
            `${password}`,
            `${username}`
        )

        if (!newAccount) throw Error;


        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        console.log(newUser)

        return newUser

    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}

export const signIn = async (email, password) => {
    try {

        const session = await account.createEmailSession(email, password)

        // console.log(session)

        return session

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const getCurrentUser = async () => {

    try {

        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        // console.log(currentAccount)


        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        console.log("Getting user :-", currentUser.documents[0].username)

        return currentUser.documents[0]

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const getAllPosts = async () => {
    try {

        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc("$createdAt")]
        )

        // console.log(posts.documents)

        return posts.documents;

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }

}

export const getLatestPosts = async () => {
    try {

        // const limit = 3;

        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(4)]
        )

        // console.log(posts.documents)

        return posts.documents;

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }

}

export const searchPostByQuery = async (query) => {
    try {

        // const limit = 3;

        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search("title", query)]
        )

        // console.log(posts.documents)

        return posts.documents;

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }

}

export const getUserPosts = async (userId) => {
    try {

        // const limit = 3;

        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
        )

        // console.log(posts.documents)

        return posts.documents;

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }

}

export const SignOut = async () => {
    try {

        const session = await account.deleteSession('current');
        return session

    } catch (error) {
        throw new Error(error)

    }
}

export async function getFilePreview(fileId, type) {
    let fileUrl;

    try {
        if (type === "video") {
            fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                appwriteConfig.storageId,
                fileId,
                2000,
                2000,
                "top",
                100
            );
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export async function uploadFile(file, type) {
    if (!file) return;

    // console.log({ file })

    const { mimeType, ...rest } = file;

    // console.log({ mimeType })

    const asset = { type: mimeType, ...rest };

    // console.log({ asset })

    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset
        );

        // console.log({ uploadedFile })

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export async function createVideoPost(form) {
    try {

        // let { thumbnail, video } = form

        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ]);

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                prompt: form.prompt,
                video: videoUrl,
                thumbnail: thumbnailUrl,
                creator: form.userId,
            }
        );

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}



// // // Fetching data from own backend ---------->
// // Yaha pr localhost check kro jo expo me milta hai wo ---->

export async function fatch() {

    const response = await fetch(`https://feedback-hzwx.onrender.com/getFeedback/ecommerce`)
    let data = await response.json();
    return data
}
