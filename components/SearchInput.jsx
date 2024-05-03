
import { View, Text, TextInput, Pressable, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { router, usePathname } from 'expo-router'
import { useGlobalContext } from '../context/ContextProvider'

const SearchInput = ({ initialQuery }) => {

    const { theme } = useGlobalContext()

    const pathname = usePathname()

    const [query, setQuery] = useState(initialQuery || '')


    return (

        <View className={`relative flex-1 justify-between w-full h-16 px-4 rounded-2xl   border-2 focus:border-secondary space-x-4  border-black-200   ${!theme ? 'bg-black-100  ' : ' bg-gray-100 '
            }`}>

            <TextInput
                className={`text-base mt-0.5 flex-1 font-pregular ${!theme ? "text-white" : " text-black"}`}
                value={query}
                placeholder={'Search for a video topic.'}
                placeholderTextColor={`${!theme ? "#CDCDE0" : "#000"}`}
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
                        router.push(`/search/${query.trim()} `)
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

