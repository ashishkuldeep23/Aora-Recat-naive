import { useEffect, useState } from "react"
import { Alert } from "react-native"

const useAppwrite = (fn) => {
    const [data, setData] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {

        try {
            setIsLoading(true)

            // const response = await getAllPosts()
            const response = await fn()
            setData(response)

            // console.log("Remove me -----> ", response)

        } catch (error) {
            Alert.alert('Error', error.message)
        }
        finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {

        if (fn) {
            fetchData()
        }

    }, []);


    const refetch = () => fetchData()


    // // // upadte allData here ----->>


    return { data, isLoading, refetch }

}


export default useAppwrite;
