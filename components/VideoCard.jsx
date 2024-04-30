
import { View, Text } from 'react-native'
import React from 'react'

const VideoCard = ({ item }) => {

    // console.log(item)
    // console.log(item.title)

    return <Text className="text-3xl text-white px-1 my-1" >
        {/* {item?.id} */}
        {/* {JSON.stringify(item)} */}
        {item.title}
    </Text>
}

export default VideoCard

