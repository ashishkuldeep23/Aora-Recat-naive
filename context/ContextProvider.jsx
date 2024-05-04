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

    // const [theme, setTheme] = useState(true)




    // // // These two var is very imp. if we remove this then when ever our data got change then our state var also get updated with old data ---------->

    // let firstTimeAllPost = true;
    // let firstTimeLatestPost = true;



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
    }



    useEffect(() => {

        getCurrentUser()
            .then((res) => {
                if (res) {
                    setIsLoggedIn(true)
                    setUser(res)
                } else {
                    setIsLoggedIn(false)
                    setUser(null)
                }
            })
            .catch(e => {
                console.log(e);
            })
            .finally(() => {
                setIsLoading(false)
                // setIsLoading(true)
            })

    }, [])


    // // // This is used to get data from loacl and set into provider ------->
    useEffect(() => {

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
                updateAllData
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider