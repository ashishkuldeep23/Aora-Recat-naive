import { View, Text, FlatList } from 'react-native'
import React from 'react'

const Tranding = ({ posts }) => {

    // console.log(posts[0])
    // console.log(posts[0].id)
    return (
        <FlatList
            data={posts}
            keyExtractor={item => item.$id}
            renderItem={({ item }) => {
                return <Text className=" text-xs text-white" >
                    {item?.title}
                </Text>
            }}

            horizontal={true}

        />
    )
}

export default Tranding