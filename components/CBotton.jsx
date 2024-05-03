import { Text, TouchableOpacity, Pressable, Alert } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../context/ContextProvider'

const CBotton = ({ title, handlePress, containerStyle, textStyle, isLoading }) => {

    const { theme } = useGlobalContext()

    return (
        <TouchableOpacity
            className={` ${!theme ? "#FFA001" : "#d48500"} rounded-xl min-h-[62px] justify-center items-center focus:scale-75 ${containerStyle} ${isLoading && "opacity-50"}`}
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