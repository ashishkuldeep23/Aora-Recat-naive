import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import CInput from '../../components/CInput'
import CBotton from '../../components/CBotton'
import { useRouter } from 'expo-router'
import { signIn } from "../../lib/appwrite"
import { useGlobalContext } from '../../context/ContextProvider'
import LogInByDefaultUser from '../../components/LogInByDefaultUser'
import { ADMIN_EMAILS, checkEmailValueWithRegex, checkPassValueWithRegex } from '../../lib/logInRelatedImpCode'


const SignIn = () => {

    const { setUser, setIsLoggedIn } = useGlobalContext();

    const router = useRouter()

    const [fromFields, setfromFields] = useState({
        email: "",
        password: ""
    })

    const [isLoading, setIsLoading] = useState(false)

    const [err, setErr] = useState('')


    const submitForm = async () => {

        if (!fromFields.email || !fromFields.password) {
            setErr("Please fill all feilds : Email, Password")
            return Alert.alert("Error", "Please fill all feilds : Email, Password")
        }

        if (!checkEmailValueWithRegex(fromFields.email)) {
            setErr("Given email is invalid")
            return Alert.alert("Error", "Given email is invalid.")
        }

        if (!ADMIN_EMAILS.includes(fromFields.email) && !checkPassValueWithRegex(fromFields.password)) {
            setErr("Use strong password.")
            return Alert.alert("Error", "Use strong password.")
        }

        setIsLoading(true);

        try {
            setErr("")
            const result = await signIn(fromFields.email, fromFields.password)

            // // // Set it to global state -------->
            setUser(result)
            setIsLoggedIn(true)

            router.replace('/home')

        } catch (error) {
            setErr(`${error}`)
            Alert.alert('Error', `${error}`)
        } finally {
            setIsLoading(false);
        }

    }


    const passwordOnChangeHandler = (e) => {

        if (!checkPassValueWithRegex(e)) setErr("Use strong password.(Use combination of characters, numbers and symbols.)");
        setfromFields({ ...fromFields, password: e })
    }

    return (

        <SafeAreaView
            className="bg-primary h-full"
        >

            <ScrollView>

                <View
                    className="w-full min-h-[85vh] justify-center items-center px-4"
                >

                    <View className='w-full min-h-[50vh]'>

                        <Image
                            source={images.logo}
                            resizeMode='contain'
                            className='w-20 mt-0 '
                        />


                        <Text className=' text-white text-lg font-psemibold my-5 '>Sign in</Text>

                        {
                            err
                            &&
                            <Text className=" text-center text-red-500">Error : {err}</Text>
                        }


                        <CInput
                            title={'Email'}
                            value={fromFields.email}
                            onChangeHander={(e) => setfromFields({ ...fromFields, email: e })}
                            placeholder={''}
                            otherStyles={''}
                        />

                        <CInput
                            title={'Password'}
                            value={fromFields.password}
                            onChangeHander={(e) => passwordOnChangeHandler(e)}
                            placeholder={''}
                            otherStyles={''}
                        />


                        <Text
                            className="text-gray-100  text-right font-pregular mt-4"
                            onPress={() => { Alert.alert("Forgot Pass logic here ------>") }}
                        >
                            Forgot Password
                        </Text>

                        <CBotton
                            isLoading={isLoading}
                            title={"Sign In"}
                            containerStyle={" bg-secondary mt-4"}
                            handlePress={() => {
                                console.log("Now call sign in fn");
                                submitForm();
                            }}
                        />


                        <Text
                            className=" font-pregular  text-gray-100 mt-4 text-center"
                            onPress={() => router.push("/sign-up")}
                        >
                            Don't have an account? {""}
                            <Text
                                className="text-secondary"
                            >Signup</Text>
                        </Text>

                        <View
                            className=" mt-7"
                        >
                            <LogInByDefaultUser />

                        </View>

                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>


    )
}

export default SignIn