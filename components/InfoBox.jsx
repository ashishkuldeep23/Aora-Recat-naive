import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({ title, subtite, containerStyle, titleStyle }) => {
    return (
        <View className={` ${containerStyle}`}>
            <Text className={` text-white text-center font-psemibold ${titleStyle}`}>{title}</Text>
            <Text className="text-sm text-gray-100 text-center font-pregular">{subtite}</Text>
        </View>
    )
}

export default InfoBox