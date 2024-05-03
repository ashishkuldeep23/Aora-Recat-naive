// import { StatusBar } from 'expo-status-bar';
// import { Text, View } from 'react-native';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { Link, Redirect, router } from "expo-router"

import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../constants';
import CBotton from '../components/CBotton';
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from '../context/ContextProvider';

import CLoading from "../components/CLoading"


export default function App() {

    const { isLoggedIn, isLoading, theme } = useGlobalContext();


    // // // This line is reponsiable for sending user to home -------->
    if (!isLoading && isLoggedIn) return <Redirect href={'/home'} />

    return (

        <SafeAreaView className={` h-full ${!theme ? "bg-primary" : " bg-gray-100"}`} >

            <ScrollView
                contentContainerStyle={{
                    height: '100%'
                }}
            >

                <CLoading isLoading={isLoading} />

                <View
                    className='w-full min-h-[85vh] justify-center items-center px-4'
                >

                    <Image
                        source={images.logo}
                        resizeMode='contain'
                        className={"w-[130px] h-[84px] mt-5"}
                    />

                    <Image
                        source={images.cards}
                        resizeMode='contain'
                        className={"w-full max-w-[380px] h-[300px]"}
                    />

                    <View className="relative mt-5">
                        <Text className={`text-3xl font-bold text-center ${!theme ? "text-white" : "text-black"}`}>
                            Discover Endless Possibilities {" "}
                            <Text className="text-secondary">Aora</Text>
                        </Text>

                        <Image
                            source={images.path}
                            className="w-[136px] h-[15px] absolute -bottom-2 -right-10"
                            resizeMode='contain'
                        />

                    </View>


                    <Text className='text-sm  font-pregular text-gray-100 mt-7 text-center'>Where creativity meets innovation: embark on a journey of limitless exploration with Aora</Text>

                    <CBotton
                        title={'Continue with Email'}
                        handlePress={() => {
                            router.push("/sign-in")
                        }}
                        containerStyle='w-full mt-7 bg-secondary'
                        textStyle={'text-primary'}
                    />

                    <CBotton
                        title={'Continue with Google'}
                        handlePress={() => {
                            router.push("/sign-in")
                        }}
                        textStyle={` ${!theme ? "text-red-300" : "text-red-700"} `}
                        containerStyle={`w-full mt-2 border ${!theme ? "border-red-300" : "border-red-700"} `}
                    />


                </View>

            </ScrollView>

            <StatusBar
                backgroundColor='#161622'
                style='light'
            />

        </SafeAreaView>

    );
}


