import { View, Text } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../context/ContextProvider'

const InfoBox = ({ title, subtite, containerStyle, titleStyle }) => {

    const { theme } = useGlobalContext()

    return (
        <View className={` ${containerStyle}`}>
            <Text className={` ${!theme ? "text-white" : "text-black"} text-center font-psemibold ${titleStyle}`}>{title}</Text>
            <Text className={` ${!theme ? " text-gray-100" : "text-gray-900"} text-sm text-center font-pregular`}>{subtite}</Text>
        </View>
    )
}

export default InfoBox