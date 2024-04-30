import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CBotton from './CBotton'
import { router } from 'expo-router'

const EmptyState = ({ title, subtite }) => {
    return (
        <View className="justify-center items-center px-4 ">
            <Image
                source={images.empty}
                className=" w-[270px] h-[215px] "
                resizeMode='contain'
            />

            <Text className="text-xl font-psemibold text-white text-center mt-2">
                {title}
            </Text>
            <Text className="font-pmedium text-sm text-gray-100 text-center">
                {subtite}
            </Text>

            <CBotton
                title={"Create Video"}
                handlePress={() => { router.push("/create") }}
                containerStyle={'w-full my-5'}
            />


        </View>
    )
}

export default EmptyState