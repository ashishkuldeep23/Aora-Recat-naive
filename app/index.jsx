// import { StatusBar } from 'expo-status-bar';
// import { Text, View } from 'react-native';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { Redirect, router } from "expo-router"

import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../constants';
import CBotton from '../components/CBotton';
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from '../context/ContextProvider';
import { useEffect, useState } from 'react';

// import NetInfo from '@react-native-community/netinfo'
import NetInfo from '@react-native-community/netinfo';

// import * as Linking from 'expo-linking';
import * as Animatable from 'react-native-animatable';
import ModalComponent from '../components/Modal';
import { signIn } from '../lib/appwrite';
import LogInByDefaultUser from '../components/LogInByDefaultUser';
// import { logInByGoogle } from '../lib/appwrite';


// // // Alert fn. for check User connection with network
export const connectionErrAlert = () => {
    Alert.alert(
        'Internet Connection',
        "You are offline. You can't use this application in offline mode.",

        // // // You can define btn and their action by giving in a arr -------------->

        // [
        //     {
        //         text: 'Cancel',
        //         onPress: () => console.log('Cancel Pressed'),
        //         style: 'cancel',
        //         className: " text-red-600"
        //     },
        //     {
        //         text: 'Open Setting',
        //         // onPress: () => Linking.openURL('https://expo.dev')
        //         // onPress: () => Linking.openURL('whatsapp://send?text=New msg&phone=9264981073')
        //         // onPress: () => Linking.openSettings()
        //         // onPress: () => Linking.openSettings('app-settings:')
        //         // onPress: () => Linking.openSettings('app-settings://notification')
        //         // onPress: async () => await Linking.openSettings('android-settings:')
        //         // onPress: async () => await Linking.openSettings()
        //         // onPress: async () => Linking.openURL('app-settings://notification')
        //         onPress: async () => await Linking.openURL('android-settings:')

        //     },
        // ]


    );
};



export default function App() {

    const { isLoggedIn, isLoading, theme, isInternetConnected, setInternetConnected } = useGlobalContext();


    // console.log({ isConnected })




    // // // Check Internet connection here -------------->>
    useEffect(() => {

        const unsubscribe = NetInfo.addEventListener((state) => {
            setInternetConnected(state.isConnected);
            if (!state.isConnected) {
                connectionErrAlert();
            }
        });

        return () => {
            unsubscribe();
        };


        // NetInfo.fetch().then(state => {
        //     console.log('Connection type', state.type);
        //     console.log('Is connected?', state.isConnected);
        // });

    }, []);

    // if (!isLoading && isLoggedIn) return <Redirect href={'/post/okay'} />
    // // // This line is reponsiable for sending user to home -------->
    if (isInternetConnected && (!isLoading && isLoggedIn)) return <Redirect href={'/home'} />

    return (

        <SafeAreaView className={` h-full ${!theme ? "bg-primary" : " bg-gray-100"}`} >

            <ScrollView
                contentContainerStyle={{
                    height: '100%'
                }}
            >
                {/* This is modal component ---------> */}
                <ModalComponent />


                {/* New loading added that shows checking user insted of showing loading gif. */}

                {
                    isLoading
                    &&
                    <Animatable.View
                        className=" w-full h-[100vh] mt-[0vh] items-center absolute z-10"
                        animation='fadeIn'
                        duration={700}
                        iterationCount="infinite"
                        direction='alternate'
                    >

                        <View className={` relative overflow-hidden rounded-2xl justify-center items-center bg-white border border-double border-rose-200 shadow-lg shadow-rose-400 px-2 py-1`}>
                            <Text className=" relative font-semibold">
                                Checking User Session
                            </Text>
                        </View>

                    </Animatable.View>
                }


                <View
                    className='w-full min-h-[85vh] justify-center items-center px-4'
                >

                    <View className='mt-5'>

                        <Text className={`text-3xl font-pbold text-center  ${!theme ? "text-white" : "text-black"}`}>
                            VidShare
                        </Text>
                    </View>

                    {/* <Image
                        source={images.logo}
                        resizeMode='contain'
                        className={"w-[130px] h-[84px] mt-5"}
                    /> */}

                    <Image
                        source={images.cards}
                        resizeMode='contain'
                        className={"w-full max-w-[380px] h-[300px]"}
                    />

                    <View className="relative mt-5">
                        <Text className={`text-3xl font-bold text-center ${!theme ? "text-white" : "text-black"}`}>
                            Discover Endless Possibilities {" "}
                            <Text className="text-secondary">VidShare</Text>
                        </Text>

                        <Image
                            source={images.path}
                            className="w-[160px] h-[15px] absolute -bottom-2 -right-9"
                            resizeMode='contain'
                        />

                    </View>


                    <Text className='text-sm  font-pregular text-gray-100 mt-7 text-center'>Share your momvements in the form of video.</Text>
                    <Text className='text-sm  font-pregular text-gray-100 mt-2 text-center'>Where creativity meets innovation: embark on a journey of limitless exploration with Aora</Text>

                    <CBotton
                        title={'LogIn with Email'}
                        handlePress={() => {
                            isInternetConnected && router.push("/sign-in")
                        }}
                        containerStyle='w-full mt-7 bg-secondary'
                        textStyle={'text-primary'}
                        isLoading={isLoading}
                    />

                    <LogInByDefaultUser />

                </View>

            </ScrollView>


            <StatusBar
                backgroundColor='#161622'
                style='light'
            />
        </SafeAreaView>

    );
}


