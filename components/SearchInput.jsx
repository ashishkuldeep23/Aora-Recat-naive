
import { View, Text, TextInput, Pressable, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { router, usePathname } from 'expo-router'

const SearchInput = ({ initialQuery }) => {

    const pathname = usePathname()

    const [query, setQuery] = useState(initialQuery || '')


    return (

        <View className="relative flex-1 justify-between w-full h-16 px-4 rounded-2xl  bg-black-100 border-2 border-black-200 focus:border-secondary space-x-4">

            <TextInput
                className=" text-base mt-0.5 text-white flex-1 font-pregular"
                value={query}
                placeholder={'Search for a video topic.'}
                placeholderTextColor={'#CDCDE0'}
                onChangeText={(e) => {
                    setQuery(e)
                }}
            />

            <TouchableOpacity

                className=""
                onPress={() => {
                    if (!query) {
                        return Alert.alert("Missing query", 'Please input something to search results across database.')
                    }

                    if (pathname.startsWith("/search")) {

                        let modQuery = query.trim()

                        router.setParams({ query: modQuery })
                    }
                    else {
                        router.push(`/search/${query.trim()}`)
                    }

                }}
            >
                <Image
                    source={icons.search}
                    className='w-5 h-5 absolute -top-10 -right-1 p-3 z-[1]'
                    resizeMode="contain"
                />
            </TouchableOpacity>



        </View>
    )
}

export default SearchInput

