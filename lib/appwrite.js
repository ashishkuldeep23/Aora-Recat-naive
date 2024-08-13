
// com.ashish.aora

import { Client, ID, Account, Avatars, Databases, Query, Storage } from 'react-native-appwrite';


export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.ashish.aora",
    projectId: "662f743f0003981ab337",
    databaseId: "662fba5c0009381c92f4",
    userCollectionId: "662fbb03001be964d057",
    videoCollectionId: "662fbb50001b0637b557",
    commentCollectionId: "663eeaa000365f66aae4",
    notificationCollectionId: "6662919e00332329d64a",
    feedbackCollectionId: "668f3b0400241432af02",
    storageId: "662fbd51000c8dffbb4a"
}


const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    notificationCollectionId,
    feedbackCollectionId,
    storageId
} = appwriteConfig


// Init your react-native SDK
const client = new Client();


client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);


// // Experiment ------------------------->>

let mineUserId = '';

export const setMineUserId = (userId) => {

    // console.log({ userId })

    mineUserId = userId
    return "Set successfully."
}



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

        // console.log(newUser)

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


        // console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv", JSON.stringify(currentAccount, null, 4))
        // let currentUserId = currentAccount.$id;
        // let currentLogedInUserData = await getSearchUserData(currentUserId)
        // return currentLogedInUserData;


        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        console.log("LogIn with ----> ", currentUser.documents[0].username)

        return currentUser.documents[0]

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const getSearchUserData = async (id) => {

    // console.log("_____________________::::::::::>", id)

    if (!id) return Error("User id is not given.")


    try {

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", id)]
        )

        if (currentUser.total === 0) throw Error("No data found : 404");


        // console.log(JSON.stringify(currentUser.documents[0], null, 4))


        console.log("Searching user:-", currentUser.documents[0].username)

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
            [Query.orderDesc("rank")],
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

        const users = await databases.listDocuments(
            databaseId,
            appwriteConfig.userCollectionId,
            [
                // Query.search("username", query),
                Query.search("email", query)
            ]
        )

        // console.log(posts.documents)

        return {
            posts: posts.documents,
            users: users.documents
        }
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
            [
                Query.equal("creator", userId),
                Query.orderDesc("$createdAt")
            ]
        )

        // console.log(posts.documents)

        return posts.documents;

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }

}

// // // this is very special appwrite fn(), is give one post data , user data and rest all post written by same user ---------->
export const getSinglePostWithAllData = async (postId) => {
    try {


        if (!postId) throw Error("Post id not given. Go back.");

        const singlePost = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.equal("$id", postId)]
        )

        if (!singlePost) throw Error;

        // console.log(singlePost.documents[0])

        // // // Here in appweite i'm using 3 Query to to get data (Read carefuly) ----------->

        const restPostBySameUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [
                Query.equal("creator", singlePost.documents[0].creator.$id),
                Query.notEqual("$id", postId),
                Query.orderDesc("$createdAt")
            ]
        )


        return {
            singlePost: singlePost.documents[0],
            restPost: restPostBySameUser.documents
        }

        // // // now get rest all post by this user -------->


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

// // // Upload file related 1st fn()
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

// // // Upload file related 2nd fn()
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

// // // Upload file related Main fn()
export async function createVideoPost(form) {
    try {

        console.log(JSON.stringify(form), null, 4)

        // console.log('==================================>')


        // "thumbnail":{"uri":"https://res.cloudinary.com/dlvq8n2ca/image/upload/v1723523098/sgb4my2nqndxsvx2odup.png"}

        // "thumbnail":{"mimeType":"image/png","uri":"file:///data/user/0/host.exp.exponent/cache/DocumentPicker/fcca650b-1fe1-494e-8539-3159c869e0a8.png"


        // let { thumbnail, video } = form


        let mainVideoUrl, mainImageUrl;


        // console.log(form.thumbnail)
        // console.log(Object.keys(form.thumbnail))
        // console.log(form.thumbnail.uri)
        // console.log(`${form.thumbnail.uri}` === 'https://res.cloudinary.com/dlvq8n2ca/image/upload/v1723523098/sgb4my2nqndxsvx2odup.png')



        if (`${form.thumbnail.uri}` === 'https://res.cloudinary.com/dlvq8n2ca/image/upload/v1723523098/sgb4my2nqndxsvx2odup.png') {

            // console.log('Fuck ==================================>')
            // console.log(form.thumbnail.uri)

            mainImageUrl = form.thumbnail.url;

            const [videoUrl] = await Promise.all([
                uploadFile(form.video, "video"),
            ]);

            mainVideoUrl = videoUrl;

        } else {

            const [thumbnailUrl, videoUrl] = await Promise.all([
                uploadFile(form.thumbnail, "image"),
                uploadFile(form.video, "video"),
            ]);

            mainVideoUrl = videoUrl;
            mainImageUrl = thumbnailUrl;
        }


        // console.log(mainImageUrl, mainVideoUrl)


        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                prompt: form.prompt,
                video: mainVideoUrl,
                thumbnail: mainImageUrl,
                creator: form.userId,
            }
        );

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}

export const savePostAdd = async (postId, userData) => {
    try {

        // console.log({ post, userID })

        // // // // Hum user data database me savedPost ke andar postId ko rakhege in arr ----->


        let savedPostArr = []

        if (userData && userData?.savedPost?.length > 0) {
            savedPostArr = [postId, ...userData?.savedPost]
        } else {
            savedPostArr = [postId, ...userData?.savedPost]
        }



        const result = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userData.$id,
            {
                // ...post,
                savedPost: savedPostArr
            }, // data (optional)
            // ["read("any")"] // permissions (optional)
        );

        // console.log({ result });


        // // // return data should change user data from global.

        return result

    } catch (error) {
        throw new Error(error);
    }

}

export const savePostRemove = async (postId, userData) => {
    try {

        // console.log({ post, userID })

        // // // Remove user id from post.savedBy arr ----->

        let filteredArr = userData.savedPost.filter((ele) => {
            if (ele !== postId) {
                return ele
            }
        })

        // console.log({ filteredArr })


        const result = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userData.$id,
            {
                // ...post,
                savedPost: filteredArr
            }, // data (optional)
            // ["read("any")"] // permissions (optional)
        );


        // console.log({ result });

        return result

    } catch (error) {
        throw new Error(error);
    }

}

export const getAllSavedPost = async (userId) => {
    try {

        // console.log("Cll ...........")


        if (!userId) return Error("UserId is not given.")


        const getUserData = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", userId)]
        )


        let resultArr = []


        if (getUserData.documents[0].savedPost.length > 0) {

            for (let i = 0; i < getUserData.documents[0].savedPost.length; i++) {


                const singlePost = await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.videoCollectionId,
                    [Query.equal("$id", getUserData.documents[0].savedPost[i])]
                )

                resultArr.push(singlePost.documents[0])

            }


        }


        return resultArr;

    } catch (error) {
        throw new Error(error);
    }
}

export const deletePostById = async (postId) => {
    try {

        // console.log(postId)

        const res = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            postId
        )


        // console.log(JSON.stringify(res, null, 4))

        return postId

    } catch (error) {
        throw new Error(error);
    }
}

export const updatePostData = async (formData, postData) => {


    try {
        // console.log(JSON.stringify(formData), null, 4)

        let { title, thumbnail, video, prompt } = formData

        // console.log(title, prompt)
        // console.log(JSON.stringify(video))
        // console.log(JSON.stringify(thumbnail))
        // console.log(JSON.stringify(postData))


        // // // phle check kro ki kya video aur thumbnail me koi new file hai kya ???

        // // // updated variables here ----------->

        let newTitle, newPrompt, newVideo, newThumnail;



        if (Object.keys(video).length > 1) {
            // // Means video changed or updated ------------>

            let newUrlOfVideo = await uploadFile(video, "video");

            // console.log({ newUrlOfVideo })

            newVideo = newUrlOfVideo
        } else {
            newVideo = video.uri
        }


        if (Object.keys(thumbnail).length > 1) {
            // // Means video changed or updated ------------>

            let newUrlOfImage = await uploadFile(thumbnail, "image")

            // console.log({ newUrlOfImage })

            newThumnail = newUrlOfImage
        } else {
            newThumnail = thumbnail.uri
        }


        newTitle = title
        newPrompt = prompt


        // console.log({ [postData.$id]: postData.$id })

        // console.log("------------------------------->", { newPrompt, newTitle, newVideo, newThumnail })


        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            postData.$id,
            {
                title: newTitle,
                prompt: newPrompt,
                video: newVideo,
                thumbnail: newThumnail,
            }
        );



        // console.log(JSON.stringify(updatedPost, null, 4))

        return updatedPost;

    } catch (error) {
        throw new Error(error);
    }

}

export const uploadProfileImg = async (formData, userData) => {

    try {


        let { profilePic } = formData

        if (!profilePic) return Error("No picture is not getting.")

        let newUrlOfProfilePic = await uploadFile(profilePic, "image");


        let newArrOfAllProfile = []

        if (userData.allProfilePic && userData.allProfilePic.length > 0) {

            newArrOfAllProfile = [newUrlOfProfilePic, ...userData.allProfilePic]
        } else {
            newArrOfAllProfile = [newUrlOfProfilePic]
        }


        // // // now upadate actual document ----------------->


        const updateUserProfile = await databases.updateDocument(
            databaseId,
            userCollectionId,
            userData.$id,
            {
                avatar: newUrlOfProfilePic,
                allProfilePic: newArrOfAllProfile
            }
        )


        // console.log(JSON.stringify(updateUserProfile, null, 4))

        return updateUserProfile

    } catch (error) {
        throw new Error(error);
    }

}

// // // newUserData will include 1. user profile pic or avatar of user , 2. user name,  
export const updateUserData = async (newUserData, userData) => {
    try {


        const { username, avatar } = newUserData


        const updateUserProfile = await databases.updateDocument(
            databaseId,
            userCollectionId,
            userData.$id,
            {
                avatar: avatar ? avatar : userData.avatar,
                username: username ? username : userData.username
            }
        )

        // console.log(JSON.stringify(updateUserProfile, null, 4))

        return updateUserProfile

    } catch (error) {
        throw new Error(error);
    }
}


// // // Update follow part ------------------->
// // Make it followers and following type --------->
// // Kyoki abhi agr koi apko follow krne lag form his/her end to ap bhi ushe follow krne lagoge autometically.


// // // So now this fn() will recive two ids (both ids) as params.
export const addFollow = async (byUserId, toUserId) => {

    try {

        // console.log({ byUserId, toUserId })


        let byUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", byUserId)]
        );

        byUser = byUser.documents[0]


        let toUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", toUserId)]
        );

        toUser = toUser.documents[0]


        // // // ab yaha pr smne wale user key followedBy arr me apni userId or email insert krege -----> 

        // console.log({ byUser, toUser })


        // // // Hum dono ke followedBy arr me ek dusare ki id insert krege ---->

        // // // jo follow krne wala hai wo 
        // // Means yaha pr followers me ana chahiye ---->
        const res1 = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            toUser.$id, // // // Kyoki smne wale use ko upadate krna chahata hu
            {
                followers: [byUser.$id, ...toUser.followers],
                // ...toUser
            }

        )


        const res2 = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            byUser.$id,
            {
                following: [toUser.$id, ...byUser.following],
                // ...byUser
            }
        )


        // console.log({ res1 })
        // console.log({ res2 })

        // // // Now send notifiction for the other user ===========================>>

        let notificationData = {
            whoSended: byUserId,
            notificationFor: toUserId,
            type: "Following",
            typeLikeInfo: "",
            typeFollowingInfo: byUserId
        }

        // // // Doing here becoz this fn called several places ------->
        createNewNotification(notificationData)


        return { byUser: res2, toUser: res1 }

    } catch (error) {
        throw new Error(error);
    }
}

export const removeFollow = async (byUserId, toUserId) => {
    try {


        let byUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", byUserId)]
        );

        byUser = byUser.documents[0]


        let toUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", toUserId)]
        );

        toUser = toUser.documents[0]


        let filteredArrForByUser = byUser.following.filter((ele) => {
            if (ele !== toUser.$id) {
                return ele
            }
        })


        const res2 = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            byUser.$id,
            {
                following: filteredArrForByUser
            }
        )



        let filteredArrForToUser = toUser.followers.filter((ele) => {
            if (ele !== byUser.$id) {
                return ele
            }
        })


        const res1 = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            toUser.$id, // // // Kyoki smne wale use ko upadate krna chahata hu
            {
                followers: filteredArrForToUser
            }
        )


        // console.log({ res1, res2 })


        let notificationData = {
            whoSended: byUserId,
            notificationFor: toUserId,
            type: "Following",
            typeLikeInfo: "",
            typeFollowingInfo: byUserId
        }


        // // // Doing here becoz this fn called several places ------->
        deleteOneNotification(notificationData)


        return { byUser: res2, toUser: res1 }
    } catch (error) {
        throw new Error(error);
    }
}

export const getAllFollowerForUser = async (userId, whatField) => {

    try {

        if (!userId) return Error("UserId is not given.")


        const getUserData = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", userId)]
        )


        let resultArr = []

        if (whatField === "followers") {

            if (getUserData.documents[0].followers.length > 0) {

                for (let i = 0; i < getUserData.documents[0].followers.length; i++) {
                    const singleUser = await databases.listDocuments(
                        appwriteConfig.databaseId,
                        appwriteConfig.userCollectionId,
                        [Query.equal("$id", getUserData.documents[0].followers[i])]
                    )
                    resultArr.push(singleUser.documents[0])
                }
            }

        }
        else if (whatField === "following") {
            if (getUserData.documents[0].following.length > 0) {

                for (let i = 0; i < getUserData.documents[0].following.length; i++) {
                    const singleUser = await databases.listDocuments(
                        appwriteConfig.databaseId,
                        appwriteConfig.userCollectionId,
                        [Query.equal("$id", getUserData.documents[0].following[i])]
                    )
                    resultArr.push(singleUser.documents[0])
                }
            }
        }




        // console.log({ resultArr })


        return resultArr;


    } catch (error) {
        throw new Error(error);
    }
}


// // // where :- Remove Where
// // // yourId :- your user id 
// // // delUserId :- Id of front user that you want to remove as follower or following.
export const removeOneFollowerAndFollowing = async (where, yourId, delUserId) => {

    console.log({ where, yourId, delUserId })

    try {

        if (!yourId) return Error("UserId is not given.")


        const getYourUserData = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", yourId)]
        )

        const getOtherUserData = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", delUserId)]
        )


        // // this var will hold updated value inside it ---------->
        let updateYourData;


        if (where === "followers") {


            let filteredYourArr = getYourUserData?.documents[0]['followers'].filter((ele) => {
                if (ele !== delUserId) {
                    return ele
                }
            })

            let filteredOtherArr = getOtherUserData?.documents[0]["following"].filter(ele => ele !== yourId)

            updateYourData = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                yourId,
                {
                    ['followers']: filteredYourArr
                }
            )

            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                delUserId,
                {
                    ['following']: filteredOtherArr
                }
            )

        }

        else if (where === "following") {
            let filteredYourArr = getYourUserData?.documents[0]['following'].filter((ele) => {
                if (ele !== delUserId) {
                    return ele
                }
            })

            let filteredOtherArr = getOtherUserData?.documents[0]["followers"].filter(ele => ele !== yourId)

            updateYourData = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                yourId,
                {
                    ['following']: filteredYourArr
                }
            )

            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                delUserId,
                {
                    ['followers']: filteredOtherArr
                }
            )
        }



        // console.log({ updateYourData })

        return updateYourData;

    } catch (error) {
        throw new Error(error);
    }

}

// // this will accept full comment object in parameter ----->
export const createComment = async (commentObj, singlePost) => {

    // console.log({ mineUserId })
    // // // yes -------->


    try {
        // console.log(singlePost.commentBy.map(ele => ele.textComment))

        if (!commentObj || !singlePost) return new Error("Mandatory fields are not given.")


        const newComment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentCollectionId,
            ID.unique(),
            { ...commentObj }
        )

        // console.log(JSON.stringify(newComment), null, 4)


        // // // now upadte the singlePost that belongs to this comment ------------>

        // console.log(JSON.stringify(newComent), null, 4)
        // console.log(JSON.stringify(singlePost.commentBy), null, 4)



        // let newArr = [newComent, ...singlePost.commentBy]
        // // // Old way of using ---------------->
        // let newArr = [newComment.$id, ...singlePost.commentBy.map(ele => ele.$id)]


        let newCommentsArr = [newComment.$id, ...singlePost?.comments]

        let newRank = 0;

        if (!singlePost?.rank) {
            newRank = 2;
        } else {
            newRank = +singlePost.rank + 2
        }


        let updatePost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            singlePost.$id,
            {
                comments: newCommentsArr,
                rank: newRank
                // rank: singlePost?.rank ? singlePost?.rank + 2 : 2
            }
        )


        await incUserRank(singlePost.creator, 2)


        // console.log(JSON.stringify(singlePost), null, 4)


        return newComment;

    } catch (error) {
        throw new Error(error);
    }
}

export const getAllCommentsForThisPost = async (postId) => {

    // // // Get latest post data from backend ----->
    // // // and get all comments about post

    // console.log({ postId })

    try {

        if (!postId) throw Error("Post id not given. Go back.");

        const singlePost = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.equal("$id", postId)]
        )

        // console.log(JSON.stringify(singlePost.documents[0], null, 4))
        // console.log(JSON.stringify(singlePost.documents[0].comments))
        // console.log(JSON.stringify(singlePost.documents[0].comments.length))


        // if (!singlePost) throw Error;

        if (singlePost?.documents[0]?.comments?.length <= 0) {
            console.log("No comment found for this post.")
            return []
        }

        let arrCommentsArr = [];


        for (let i = 0; i < singlePost.documents[0].comments.length; i++) {

            // console.log(i)
            // console.log(singlePost.documents[0].comments[i])

            const singleComment = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.commentCollectionId,
                [Query.equal("$id", singlePost.documents[0].comments[i])]
            )

            // console.log(JSON.stringify(singleComment))

            arrCommentsArr.push(singleComment.documents[0])

        }


        // console.log({ arrCommentsArr })

        return arrCommentsArr;


    } catch (error) {
        throw new Error(error);
    }


}

export const updateCommentApi = async (updatedCmntData, commentId) => {

    // console.log({ updatedCmntData, commentId })

    try {

        const updateComment = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentCollectionId,
            commentId,
            { ...updatedCmntData }
        )


        // console.log(JSON.stringify(updateComment), null, 4)

        return updateComment

    } catch (error) {
        throw new Error(error);
    }
}

export const deleteComment = async (commentId, singlePost) => {

    try {

        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentCollectionId,
            commentId,
        )

        let newCommentsArr = singlePost?.comments.filter((ele) => ele !== commentId)

        let newRank = 0;

        if (!singlePost?.rank) {
            newRank = 0;
        } else {
            newRank = +singlePost.rank - 2
        }


        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            singlePost.$id,
            {
                comments: newCommentsArr,
                rank: newRank
                // rank: singlePost?.rank ? singlePost?.rank - 2 : 0
            }
        )

        await decUserRank(singlePost.creator, 2)

        return commentId
    } catch (error) {
        throw new Error(error);
    }

}

export const likePost = async (postId, userId) => {
    try {

        // console.log({ postId, userId })

        // // // // Hum user data database me savedPost ke andar postId ko rakhege in arr ----->


        const getPostDataById = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.equal("$id", postId)]
        )

        // console.log({ getPostDataById })

        let likedByArr = []

        if (getPostDataById && getPostDataById?.documents[0] && getPostDataById?.documents[0].likes?.length > 0) {

            likedByArr = [userId, ...getPostDataById?.documents[0].likes]
        } else {

            likedByArr = [userId, ...getPostDataById?.documents[0].likes]
        }

        // console.log({ likedByArr })


        const singlePost = getPostDataById?.documents[0];

        let newRank = 0;

        if (!singlePost?.rank) {
            newRank = 1;
        } else {
            newRank = singlePost.rank + 1
        }


        const result = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            postId,
            {
                // ...post,
                likes: likedByArr,
                rank: newRank
                // rank: singlePost?.rank ? singlePost?.rank + 1 : 1
                // rank: (?.rank || 0) + 1
            }, // data (optional)
            // ["read("any")"] // permissions (optional)
        );

        // console.log({ result });

        await incUserRank(singlePost.creator, 1);


        // // // return data should change user data from global.

        return result

    } catch (error) {
        throw new Error(error);
    }
}

export const disLikePost = async (postId, userId) => {
    try {

        // console.log({ postId, userId })

        // // // Remove user id from post.savedBy arr ----->

        const getPostDataById = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.equal("$id", postId)]
        )



        let filteredArr = getPostDataById?.documents[0].likes.filter((ele) => {
            if (ele !== userId) {
                return ele
            }
        })

        // console.log({ filteredArr })

        const singlePost = getPostDataById?.documents[0]

        let newRank = 0;

        if (!singlePost?.rank) {
            newRank = 0;
        } else {
            newRank = singlePost.rank - 1
        }


        const result = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            postId,
            {
                // ...post,
                likes: filteredArr,
                rank: newRank
            }, // data (optional)
            // ["read("any")"] // permissions (optional)
        );


        await decUserRank(singlePost.creator, 1);

        // console.log({ result });
        return result
    } catch (error) {
        throw new Error(error);
    }
}

export const getAllLikes = async (postId) => {
    try {

        // console.log("Cll ...........")


        if (!postId) return Error("UserId is not given.")


        const getPostData = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.equal("$id", postId)]
        )


        let resultArr = []


        if (getPostData.documents[0].likes.length > 0) {

            for (let i = 0; i < getPostData.documents[0].likes.length; i++) {

                const singleUser = await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.userCollectionId,
                    [Query.equal("$id", getPostData.documents[0].likes[i])]
                )

                resultArr.push(singleUser.documents[0])

            }

        }



        return resultArr;

    } catch (error) {
        throw new Error(error);
    }
}

// // // Notification fns() here ==============================>>
// // data look like -----> { whoSended, whenCreated, type, typeLikeInfo, typeFollowingInfo, notificationFor, seen }
export const createNewNotification = async (data) => {

    try {

        // some if's here to prevent err ------>

        // console.log(JSON.stringify(data, null, 4));


        if (Object.keys(data).length <= 0) return new Error("Data not given for new notifaiction.");

        const { whoSended, whenCreated, type, typeLikeInfo, typeFollowingInfo, notificationFor, seen } = data

        // some mandatory fields are ------->

        if (!whoSended || !type || !notificationFor || (!typeLikeInfo && !typeFollowingInfo)) return new Error("Mandatory fields are not given.");



        let makeDate = new Date();
        makeDate = makeDate.toLocaleDateString()


        let makeNewNotiObj = {
            whoSended: whoSended,

            notificationFor: notificationFor,

            type: type,

            typeLikeInfo: typeLikeInfo || null,

            typeFollowingInfo: typeFollowingInfo || null,

            whenCreated: whenCreated || makeDate,

            seen: seen || false,
        }



        const newNotification = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.notificationCollectionId,
            ID.unique(),
            {
                ...makeNewNotiObj
            }
        )


        // console.log(JSON.stringify(newNotification, null, 4))

        return newNotification;

    } catch (error) {
        throw new Error(error);
    }
}

// // data look like -----> { whoSended, type, typeLikeInfo, typeFollowingInfo, notificationFor }
export const deleteOneNotification = async (data) => {


    if (Object.keys(data).length <= 0) return new Error("Data not given for new notifaiction.");

    const { whoSended, typeLikeInfo, typeFollowingInfo, notificationFor, type } = data


    if (!whoSended || !notificationFor || !type || (!typeLikeInfo && !typeFollowingInfo)) return new Error("Mandatory fields are not given.");


    // // // Get notification from appwrite then delete it.

    let getNotificationData = null;


    if (type === "Like") {

        const getNoti = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.notificationCollectionId,
            [
                Query.equal("whoSended", whoSended),
                Query.equal("notificationFor", notificationFor),
                Query.equal("typeLikeInfo", typeLikeInfo)
            ]

        )


        getNotificationData = getNoti.documents[0]

    }
    else {

        const getNoti = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.notificationCollectionId,
            [
                Query.equal("whoSended", whoSended),
                Query.equal("notificationFor", notificationFor),
                Query.equal("typeFollowingInfo", typeFollowingInfo)
            ]

        )


        getNotificationData = getNoti.documents[0]

    }

    // console.log({ getNotificationData })


    if (getNotificationData?.$id) {
        const deltetNoti = databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.notificationCollectionId,
            getNotificationData.$id
        )

        // console.log(deltetNoti)


        return true
    }

    return false

}

export const getAllNotiForThisUser = async (userId) => {
    try {

        // console.log("Get notification for this user --------->", userId)


        let getAllNotis = await databases.listDocuments(
            databaseId,
            notificationCollectionId,
            [
                Query.equal("notificationFor", `${userId}`),
                Query.orderDesc("$createdAt")
            ]
        )


        // console.log(getAllNotis)

        return getAllNotis.documents;

    } catch (error) {
        throw new Error(error);
    }
}

export const makeNotiSeen = async (arrOfNotis, userId) => {

    try {


        if (arrOfNotis.length <= 0) return Error("Array of unseen notifiation are not getting.")

        for (let i = 0; i < arrOfNotis.length; i++) {

            // console.log(arrOfNotis[i].$id)

            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.notificationCollectionId,
                arrOfNotis[i].$id,
                {
                    seen: true
                }
            );

            // console.log(updateSingleNoti)

        }


        // // // now getAll new notifications ---------------->

        let getAllNotis = await databases.listDocuments(
            databaseId,
            notificationCollectionId,
            [
                Query.equal("notificationFor", `${userId}`),
                Query.orderDesc("$createdAt")
            ]
        )

        return getAllNotis.documents;

    } catch (error) {
        throw new Error(error);
    }
}

export const incUserRank = async (userData, howMany) => {
    try {

        if (mineUserId === userData.$id) {
            // console.log("Yezzzzzzzzzzzzzzzz")
            return
        }

        let newRank = 0;

        if (!userData?.rank) {
            newRank = +howMany;
        } else {
            newRank = +userData.rank + howMany
        }

        let updatedData = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userData.$id,
            {
                rank: newRank
            }
        )

        // console.log({ updatedData })
        return updatedData;

    } catch (error) {
        throw new Error(error);
    }
}

export const decUserRank = async (userData, howMany) => {
    try {


        if (mineUserId === userData.$id) {
            // console.log("Yezzzzzzzzzzzzzzzz22222222")
            return
        }

        let newRank = 0;

        if (!userData?.rank) {
            newRank = 0;
        } else {
            newRank = (+userData.rank) - howMany
        }

        let updatedData = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userData.$id,
            {
                rank: newRank
            }
        )

        // console.log({ updatedData })
        return updatedData;

    } catch (error) {
        throw new Error(error);
    }
}


// // // Feedback fn() here (CRUD) -------------->


export const createNewFeedback = async (feedback, username, userId) => {
    try {

        // console.log({ feedback, username, userId })

        if (!feedback || !username || !userId) throw Error("Mandatory field is not given.")

        const makeBody = {
            feedback: feedback.trim(),
            user: userId,
            username: username.trim(),
            color: getRandomColor()
        }


        const newFeedback = await databases.createDocument(
            databaseId,
            feedbackCollectionId,
            ID.unique(),
            makeBody
        )



        // console.log(JSON.stringify(newFeedback, null, 4))


        return newFeedback

    } catch (error) {
        throw new Error(error);
    }
}


export const getAllFeedbacks = async () => {

    try {

        const allFeedback = await databases.listDocuments(
            databaseId,
            feedbackCollectionId,
            [Query.orderDesc("$createdAt")]
        )

        // console.log({ allFeedback })

        return allFeedback.documents;

    } catch (err) {
        throw new Error(err);
    }
}


export const updateSingleFeedback = async (data) => {

    if (!data || !data.feedId) throw Error("Mandatory field is not given.");

    try {
        const updateFeedback = await databases.updateDocument(
            databaseId,
            feedbackCollectionId,
            data.feedId,
            {
                username: data.username,
                feedback: data.feedback
            }
        )

        // console.log(JSON.stringify(updateFeedback, null, 4))

        return updateFeedback

    } catch (err) {
        throw new Error(err);
    }
}



export const deleteOneFeedback = async (feedId) => {

    if (!feedId) throw Error("Mandatory field is not given.");

    try {
        const deltetFeed = databases.deleteDocument(
            databaseId,
            feedbackCollectionId,
            feedId
        )

        return deltetFeed;
    }
    catch (err) {
        throw new Error(err);
    }

}


export const submitReplyForFeed = async (reply, feedId) => {

    if (!reply || !feedId) throw Error("Mandatory field is not given.");

    try {


        const updateFeedback = await databases.updateDocument(
            databaseId,
            feedbackCollectionId,
            feedId,
            {
                reply: reply
            }
        )

        // console.log(JSON.stringify(updateFeedback, null, 4))

        return updateFeedback

    } catch (err) {
        throw new Error(err);

    }

}


// // // if someOne disLike or unFollow then create a delete fn() create to delete the notifiction from database.


// // // Fetching data from own backend =================>>
// // Yaha pr localhost check kro jo expo me milta hai wo =================>>

export async function fatch() {

    const response = await fetch(`https://feedback-hzwx.onrender.com/getFeedback/ecommerce`)
    let data = await response.json();
    return data
}





// // // Get Random color for just theme --------------------->

function getRandomColor() {

    let colorArr = [

        '#91DDCF',
        '#FF7D29',
        '#CAF4FF',
        '#FF76CE',
        '#CCD3CA',
        '#F5EEE6',
        '#FFB22C',
        '#6B240C',
        '#FFF6E9',
        '#10439F',
        '#8B93FF',
        '#FF9BD2',
        '#FE0000'

    ]
    return colorArr[Math.floor(Math.random() * colorArr.length)]
}