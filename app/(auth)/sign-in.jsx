import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import CInput from '../../components/CInput'
import CBotton from '../../components/CBotton'
import { useRouter } from 'expo-router'
import { signIn } from "../../lib/appwrite"

const SignIn = () => {

    const router = useRouter()

    const [fromFields, setfromFields] = useState({
        email: "",
        password: ""
    })

    const [isLoading, setIsLoading] = useState(false)


    const submitForm = async () => {

        if (!fromFields.email || !fromFields.password) {
            return Alert.alert("Error", "Please give all feilds : Email, Password")
        }

        setIsLoading(true);

        try {
            await signIn(fromFields.email, fromFields.password)

            // // // Set it to global state -------->

            router.replace('/home')

        } catch (error) {
            Alert.alert('Error', `${error}`)
        } finally {
            setIsLoading(false);
        }

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
                            onChangeHander={(e) => setfromFields({ ...fromFields, password: e })}
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

                        <Text className=" font-pregular  text-gray-100 mt-4 text-center">
                            Don't have an account? {""}
                            <Text
                                className="text-secondary"
                                onPress={() => router.push("/sign-up")}
                            >Signup</Text>
                        </Text>


                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>


    )
}

export default SignIn