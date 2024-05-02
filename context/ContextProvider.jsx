import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from '../lib/appwrite'
import { View } from "react-native-animatable";
import { Text } from "react-native";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext)


const GlobalProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);



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
                setUser
            }}
        >

            {/* <View className={`w-[100vw] h-[100vh] justify-center items-center`}>

                <View className="w-20 h-20 rounded-lg bg-black border border-secondary justify-center items-center">
                    <Text className=" text-lg text-secondary font-psemibold">Getting user data</Text>

                </View>

            </View> */}

            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider