import { createContext, useContext, useState, useEffect } from "react";
import { createNewNotification, getAllNotiForThisUser, getCurrentUser } from '../lib/appwrite'
import { Alert, Text, View } from "react-native";
import * as SecureStore from 'expo-secure-store';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext)


const GlobalProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [theme, setTheme] = useState(false)
    const [user, setUser] = useState(null);

    // // // Some post related arrays ----------->>
    const [allPost, setAllPost] = useState([])
    const [allLetestPost, setAllLetestPost] = useState([])
    const [allSavedPost, setAllSavedPost] = useState([])

    // // // Below status used in single post page ---------->
    const [singlePostGlobal, setSinglePostGlobal] = useState({})
    const [restPostGlobal, setRestPostGlobal] = useState([])


    // // isConnected var will store info of user mobile data -------->>
    const [isInternetConnected, setInternetConnected] = useState(false);


    const initialPlayingVideoState = {
        mode: false,
        videoId: "",
        videoUri: ""
    }

    const [playingVideo, setPlayingVideo] = useState(initialPlayingVideoState)

    const [updatingPostData, setUpdatingPostData] = useState({
        mode: false,
        postData: null
    })

    const MODAL_INIT_CONTENT = <View>
        <Text className=" text-center text-4xl text-red-500">Hello World</Text>
    </View>

    const [modalContent, setModalContent] = useState(MODAL_INIT_CONTENT)
    const [modalVisible, setModalVisible] = useState(false);


    const [allNotifications, setAllNotifications] = useState([])



    // const [theme, setTheme] = useState(true)




    // // // These two var is very imp. if we remove this then when ever our data got change then our state var also get updated with old data ---------->

    // let firstTimeAllPost = true;
    // let firstTimeLatestPost = true;


    // // // This fn is used to upadate data on user action (save or remove)
    // // // upadtedPost can be updated data -------> (In case of deleting this should be a object with only key that is $id of deleted post id.)
    // // // isDeletingThisPost is going true or false.
    const updateAllData = (upadtedPost, isDeletingThisPost) => {

        // console.log(JSON.stringify(upadtedPost, null, 4))

        // // // Not working properly ------>
        // let newAllDataArr = allPost.filter((ele) => {
        //     if (ele.$id === upadtedPost.$id) {
        //         return { ...upadtedPost }
        //     } else {
        //         return { ...ele }
        //     }
        // })


        let index1 = allPost.findIndex(ele => ele.$id === upadtedPost.$id)

        if (!isDeletingThisPost) {
            allPost.splice(index1, 1, upadtedPost)
        }
        else {
            allPost.splice(index1, 1)
        }


        // console.log(JSON.stringify(allPost, null, 4))

        // console.log("Newly formed arr here ------------>")
        // console.log(JSON.stringify(allPost[0], null, 4))
        setAllPost([...allPost])



        // // // Latest video list me kabhi kuch na ho when ever state got changed

        // let index2 = allLetestPost.findIndex(ele => ele.$id === upadtedPost.$id)
        // allLetestPost.splice(index2, 1, upadtedPost)
        // setAllLetestPost([...allLetestPost])


        let index3 = allSavedPost.findIndex(ele => ele.$id === upadtedPost.$id)

        if (!isDeletingThisPost) {
            allSavedPost.splice(index3, 1, upadtedPost)
        } else {
            allSavedPost.splice(index3, 1)
        }

        setAllSavedPost([...allSavedPost])


        // // // Update single post data  ------>
        if (!isDeletingThisPost) {
            setSinglePostGlobal(upadtedPost)
        }
    }

    // // // This is used in single post page ------>
    const updateSinglePostState = (singlePost, restPost) => {

        // // // Update rest post data ----->
        // let index4 = restPostGlobal.findIndex((ele) => ele?.$id === upadtedPost?.$id)
        // restPostGlobal.splice(index4, 1, upadtedPost)


        setRestPostGlobal([...restPost])

        // // // Update single post data  ------>
        setSinglePostGlobal(singlePost)

    }


    // // // This is alos used in single post page but for user ---->
    const upadateFollowList = (byUser, toUser) => {

        // console.log({ byUser, toUser })

        if (!byUser || !toUser) return

        // // // Update user data who send following request ---->
        setUser(byUser)

        // // // Update single post user's data in single post ---->

        setSinglePostGlobal({ ...singlePostGlobal, creator: toUser })

    }


    // // // This is also used in single post page but for commnets ----->
    const updateComment = (resultData, whatUpdate) => {

        // // // whatUpdate will have 3 values (1. created , 2. updated , 3. deleted)
        // // Based on these value you should chnage the current state of singlePostGlobal.


        if (whatUpdate === 'created') {

            // if (singlePostGlobal && singlePostGlobal?.commentBy) {
            //     singlePostGlobal.commentBy.unshift(resultData)
            // }
            if (singlePostGlobal && singlePostGlobal?.comments) {
                singlePostGlobal.comments.unshift(resultData.$id)

                singlePostGlobal.rank = (singlePostGlobal.rank || 0) + 2
            }

            // updateAllData(resultData)

        }
        // else if (whatUpdate === "updated") {
        //     if (singlePostGlobal && singlePostGlobal?.commentBy) {
        //         let index = singlePostGlobal.commentBy.findIndex(ele => ele.$id === resultData.$id)
        //         singlePostGlobal.commentBy.splice(index, 1, resultData)
        //     }
        // }
        else if (whatUpdate === "deleted") {

            if (singlePostGlobal && singlePostGlobal?.commentBy) {

                // // // now for delete resultData, should be comment id that you deleted recentlly.

                let index = singlePostGlobal.comments.findIndex(ele => ele === resultData)
                singlePostGlobal.commentBy.splice(index, 1)

                singlePostGlobal.rank = (singlePostGlobal.rank || 0) - 2

            }

        }

        updateAllData(singlePostGlobal)
    }


    // // // Update User data 
    // // Currently using only in saved and remove post.
    // // whatUpdate will take waht you going to update here ---------->

    const updateUser = (newUserData, whatUpdate) => {
        // // // Make sure new user data is coming.

        if (whatUpdate === "profilePic") {

            setUser(pre => ({
                ...pre,
                avatar: newUserData.avatar,
                allProfilePic: newUserData.allProfilePic
            }))


        } else {
            setUser(newUserData)
        }

    }


    // // // Get current user data --------->
    const fetchCurrentUserData = () => {

        getCurrentUser()
            .then((res) => {

                // console.log({ res })
                if (res) {
                    setIsLoggedIn(true)
                    setUser(res)
                } else {
                    setIsLoggedIn(false)
                    setUser(null)
                }
            })
            .catch(e => {
                console.log({ e });
            })
            .finally(() => {
                setIsLoading(false)
                // setIsLoading(true)
            })
    }



    // // // This fn() used to create new notification in appwrite backend.
    // // // Take care during calling fn() by params. If any get disturbed then notification got created other place or not created.


    // // data look like -----> { whoSended, whenCreated, type, typeLikeInfo, typeFollowingInfo, notificationFor, seen }

    const createNotification = async (data) => {

        const {
            whoSended,
            type,
            typeLikeInfo,
            typeFollowingInfo,
            notificationFor
        } = data

        // // Notifaication will look like ------------->
        // let singleNotificaton = {
        //     whoSended: " your User Details (We can give user ref or info like dp name email etc.)",
        //     whenCreated: "A js date object here thet contain date in localStringFormate.",
        //     type: "Like | Following ",
        //     typeLikeInfo: "Post $id or null",
        //     typeFollowingInfo: "your User $id Details or null",
        //     notificationFor: "Ref (jiske liye notification banaya gaya hai, uski id.) (Front person user.$id)",
        //     seen: "A boolen value that contain user seen this notification or not."
        // }
        // console.log(whoSended, type, typeLikeInfo, typeFollowingInfo, notificationFor)


        if (!whoSended || !type || !notificationFor || (!typeLikeInfo && !typeFollowingInfo)) {
            console.log("something not given.");
            return new Error("Mandatory fields are not given.");
        }


        try {

            // let data = {
            //     whoSended, notificationFor, type, typeFollowingInfo, typeLikeInfo
            // }

            let result = await createNewNotification(data)

            // console.log(result)

            if (result) {
                // // // Show a alert here --------->

                // Alert.alert("Notification sended.")

            }


        } catch (error) {
            Alert.alert("Error", error?.message)
        }



    }





    // // // This var will take care about fetching notification.
    // const [firstTimeFetchingNotification, setFirstTimeFetchingNotification] = useState(false)


    // // // // fetch all notifaiction for this user :-------->

    const fetchedNotification = async (userId) => {

        // console.log(userId)

        getAllNotiForThisUser(userId)
            .then((res) => {

                // console.log({ res })
                // console.log(res.length)

                if (res && res.length > 0) {
                    setAllNotifications(res)

                }

            })
            .catch(e => {
                console.log({ e });
            })
            .finally(() => {
                // setFirstTimeFetchingNotification(true)
                setIsLoading(false)

                // setIsLoading(true)
            })
    }


    useEffect(() => {

        if (allNotifications.length === 0 && user?.$id) {
            // console.log("Now fetching data -------->")
            fetchedNotification(user?.$id)
        }

    }, [user])


    // // // This is used to get data from loacl and set into provider ------->
    // useEffect(() => {

    //     SecureStore.getItemAsync("themeMode")
    //         .then((result) => {
    //             if (result) {
    //                 setTheme(JSON.parse(result));
    //             }
    //         })
    //         .catch((err) => {
    //             Alert.alert("Error", err)
    //         })

    // }, [])


    // // // This is used to get data from provider and set into local ------->
    useEffect(() => {

        SecureStore.setItemAsync("themeMode", JSON.stringify(theme))
            .then((result) => {
                console.log(`Set into global provider, ${result}`)
            })
            .catch((err) => {
                Alert.alert("Error", err)
            })

    }, [theme])




    // // // fetch used data here ---------->
    useEffect(() => {

        // // // Get current user data --------->
        fetchCurrentUserData()


        // // // Get data from localStorage/SecureStore ----------->
        SecureStore.getItemAsync("themeMode")
            .then((result) => {
                if (result) {
                    setTheme(JSON.parse(result));
                }
            })
            .catch((err) => {
                Alert.alert("Error", err)
            })

    }, [])




    return (
        <GlobalContext.Provider
            value={{
                isLoading,
                setIsLoading,
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                theme,
                setTheme,
                allPost,
                setAllPost,
                allLetestPost,
                setAllLetestPost,
                allSavedPost,
                setAllSavedPost,
                updateAllData,
                restPostGlobal,
                singlePostGlobal,
                updateSinglePostState,
                upadateFollowList,
                updateComment,
                updateUser,
                playingVideo,
                setPlayingVideo,
                initialPlayingVideoState,
                updatingPostData,
                setUpdatingPostData,
                modalContent,
                setModalContent,
                modalVisible,
                setModalVisible,
                isInternetConnected,
                setInternetConnected,
                fetchCurrentUserData,
                fetchedNotification,
                allNotifications,
                setAllNotifications,
                createNotification
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider