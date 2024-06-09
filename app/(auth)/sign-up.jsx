import { Alert, Image, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants"
import CInput from '../../components/CInput'
import { useRouter } from 'expo-router'
import CBotton from '../../components/CBotton'
import { createNewUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/ContextProvider'
import LogInByDefaultUser from '../../components/LogInByDefaultUser'


const SignUp = () => {

  const { setUser, setIsLoggedIn } = useGlobalContext();

  const router = useRouter()

  const [fromFields, setfromFields] = useState({
    username: "",
    email: "",
    password: ""
  })

  const [isLoading, setIsLoading] = useState(false)


  const submitForm = async () => {

    if (!fromFields.email || !fromFields.password || !fromFields.username) {
      return Alert.alert("Error", "Please give all feilds : Email, Password, Username")
    }

    setIsLoading(true);

    try {

      const result = await createNewUser(fromFields.email, fromFields.password, fromFields.username)

      // // // Set it to global state -------->
      setUser(result)
      setIsLoggedIn(true)

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


            <Text className=' text-white text-lg font-psemibold my-5 '>Sign Up</Text>


            <CInput
              title={'Name'}
              value={fromFields.username}
              onChangeHander={(e) => {
                setfromFields({ ...fromFields, username: e });
                // console.log(e)
              }}
              placeholder={''}
              otherStyles={''}
            />

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


            {/* <Text
              className="text-gray-100  text-right font-pregular mt-4"
              onPress={() => { Alert.alert("Forgot Pass logic here ------>") }}
            >
              Forgot Password
            </Text> */}

            <CBotton
              isLoading={isLoading}
              title={"Sign Up"}
              containerStyle={" bg-secondary mt-4"}
              handlePress={() => {
                console.log("Now call sign up fn")
                submitForm();
              }}
            />


            <Text
              className=" font-pregular  text-gray-100 mt-4 text-center"
              onPress={() => router.push("/sign-in")}
            >
              I have an account? {""}
              <Text
                className="text-secondary"
              >Signin</Text>
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

export default SignUp
