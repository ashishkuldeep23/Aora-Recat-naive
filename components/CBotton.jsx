import {  Text, TouchableOpacity , Pressable , Button } from 'react-native'
import React from 'react'

const CBotton = ({ title, handlePress, containerStyle, textStyle, isLoading }) => {
    return (
        <TouchableOpacity
            className={`  rounded-xl min-h-[62px] justify-center items-center ${containerStyle} ${isLoading && "opacity-50"}`}
            onPress={handlePress}
            activeOpacity={0.7}
            disabled={isLoading}

        >
            <Text className={`  font-psemibold  text-lg ${textStyle}`}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default CBotton