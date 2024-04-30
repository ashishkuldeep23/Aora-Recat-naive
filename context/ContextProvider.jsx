import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from '../lib/appwrite'

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
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider