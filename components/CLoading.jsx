import { View, Text, Image } from 'react-native'
import React from 'react'
import { gifs } from '../constants'
import { ResizeMode } from 'expo-av'
import * as Animatable from 'react-native-animatable';

export default function CLoading({ isLoading }) {
    return (
        <>

            {/* Loading code use here ------> */}

            {
                isLoading
                &&
                <Animatable.View
                    className=" w-full h-[100vh] mt-[37vh] items-center absolute z-10"
                    animation='slideInDown'
                    duration={2000}
                    iterationCount="infinite"
                    direction='alternate'
                >

                    <View className={` relative overflow-hidden w-[45%] h-[20%] rounded-2xl justify-center items-center bg-white border border-double border-rose-200 shadow-lg shadow-rose-400`}>

                        <Image
                            source={gifs.loadingGif}
                            className="w-full h-full  rounded-2xl"
                            resizeMode={ResizeMode.COVER}
                            useNativeControls
                            isLooping
                        />

                    </View>


                </Animatable.View>
            }

        </>
    )
}