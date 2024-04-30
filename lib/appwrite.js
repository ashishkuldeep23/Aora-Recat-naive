
// com.ashish.aora

import { Client, ID, Account, Avatars, Databases } from 'react-native-appwrite';


export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.ashish.aora",
    projectId: "662f743f0003981ab337",
    databaseId: "662fba5c0009381c92f4",
    userCollectionId: "662fbb03001be964d057",
    videoCollectionId: "662fbb03001be964d057",
    storageId: "662fbd51000c8dffbb4a"
}


// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
    ;



const account = new Account(client);
const avatars = new Avatars(client);
const detabases = new Databases(client);

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

        const newUser = await detabases.createDocument(
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


export async function signIn(email, password) {
    try {

        const session = await account.createEmailSession(email, password)

        console.log(session)

        return session

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

