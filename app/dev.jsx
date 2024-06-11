

import { View, Linking, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useGlobalContext } from '../context/ContextProvider';

const Dev = () => {


    const theme = useGlobalContext().theme


    const openLink = (link) => {

        // if (typeof (link) !== "string") return

        Linking.openURL(`${link}`);
    }

    return (
        <>


            <SafeAreaView
                className="h-full bg-primary text-white px-2"
            >
                <ScrollView>

                    <View>

                        <TouchableOpacity
                            onPress={() => { router.back() }}
                        >
                            <Text className={`font-pmedium ml-1 text-gray-100 py-2 px-1 active:bg-red-800`}>
                                👈Back
                            </Text>

                        </TouchableOpacity>

                    </View>


                    <View className=" h-[70vh]  flex justify-center items-center">

                        <View className="border border-gray-100/30 rounded-full overflow-hidden mt-5 px-1">


                            <Image
                                source={{ uri: "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1692032164/utemmzfh8jy0w4bufdp4.png" }}
                                resizeMode='contain'
                                className={"w-[200px] h-[210px]  "}

                            />
                        </View>


                        <Text className=" text-white text-2xl">Ashish Kuldeep</Text>
                        <Text className=" text-white">A MERN and Recat Native Developer</Text>
                        <Text className=" text-white text-xs">React, NodeJs, TypeScript, MongoDB,React Native are main tech stack.</Text>

                        <View className=" pt-4  flex gap-2 flex-row justify-center items-center">
                            <TouchableOpacity
                                className=" px-2 rounded-full border border-white"
                                onPress={() => openLink("https://github.com/Ashishkuldeep23")}
                            >
                                <Text className=" text-white">GitHub</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => openLink("https://akp23.vercel.app/")}
                                className=" px-2 rounded-full border border-white"
                            >
                                <Text className=" text-white">Porfoilo</Text>
                            </TouchableOpacity>
                        </View>


                        {/* <Text className=" text-white text-3xl">Dev</Text> */}


                    </View>


                </ScrollView>

            </SafeAreaView>
        </>

    )
}

export default Dev

