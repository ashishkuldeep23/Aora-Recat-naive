import { View, Text, Image } from 'react-native'
import React from 'react'
import { gifs } from '../constants'
import { ResizeMode } from 'expo-av'

export default function CLoading({ isLoading }) {
    return (
        <>

            {/* Loading code use here ------> */}

            {
                isLoading
                &&
                <View className=" w-full h-[100vh] justify-center items-center absolute z-10">

                    <View className={` relative overflow-hidden w-[80%] h-[35%] rounded-2xl justify-center items-center bg-white border border-double border-rose-200 shadow-lg shadow-rose-400`}>

                        <Image
                            source={gifs.loadingGif}
                            className="w-full h-full  rounded-2xl"
                            resizeMode={ResizeMode.CONTAIN}
                            useNativeControls
                            isLooping
                        />

                    </View>


                </View>
            }

        </>
    )
}