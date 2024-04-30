import { Text, TouchableOpacity, Pressable, Alert } from 'react-native'
import React from 'react'

const CBotton = ({ title, handlePress, containerStyle, textStyle, isLoading }) => {
    return (
        <TouchableOpacity
            className={`  rounded-xl min-h-[62px] justify-center items-center focus:scale-75 ${containerStyle} ${isLoading && "opacity-50"}`}
            onPress={() => {
                // console.log("cccc") 
                handlePress();
            }}
            onLongPress={() => Alert.alert("On long press working well in Pressable.")}
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