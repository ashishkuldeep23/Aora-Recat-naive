import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from '../lib/appwrite'
import { Alert } from "react-native";
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

    const initialPlayingVideoState = {
        mode: false,
        videoId: "",
        videoUri: ""
    }

    const [playingVideo, setPlayingVideo] = useState(initialPlayingVideoState)


    // const [theme, setTheme] = useState(true)




    // // // These two var is very imp. if we remove this then when ever our data got change then our state var also get updated with old data ---------->

    // let firstTimeAllPost = true;
    // let firstTimeLatestPost = true;


    // // // This fn is used to upadate data on user action (save or remove)
    const updateAllData = (upadtedPost) => {

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
        allPost.splice(index1, 1, upadtedPost)

        // console.log(JSON.stringify(allPost, null, 4))

        // console.log("Newly formed arr here ------------>")
        // console.log(JSON.stringify(allPost[0], null, 4))
        setAllPost([...allPost])



        // // // Latest video list me kabhi kuch na ho when ever state got changed

        // let index2 = allLetestPost.findIndex(ele => ele.$id === upadtedPost.$id)
        // allLetestPost.splice(index2, 1, upadtedPost)
        // setAllLetestPost([...allLetestPost])


        let index3 = allSavedPost.findIndex(ele => ele.$id === upadtedPost.$id)
        allSavedPost.splice(index3, 1, upadtedPost)
        setAllSavedPost([...allSavedPost])


        // // // Update single post data  ------>
        setSinglePostGlobal(upadtedPost)

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

            }

        }

        updateAllData(singlePostGlobal)
    }


    // // // Update User data 
    // // Currently using only in saved and remove post.

    const updateUser = (newUserData) => {
        // // // Make sure new user data is coming.
        setUser(newUserData)
    }


    // // // fetch used data here ---------->
    useEffect(() => {


        // // // Get current user data --------->

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
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider