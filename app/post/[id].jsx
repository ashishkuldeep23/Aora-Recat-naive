import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context/ContextProvider'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const Bookmark = () => {

    const { theme, user } = useGlobalContext()




    return (

        <SafeAreaView className={`  h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}>
            <ScrollView className='px-4 my-6'>

                <View>


                    <TouchableOpacity
                        onPress={() => { router.back() }}
                    >
                        <Text className=" text-white">
                            Back
                        </Text>

                    </TouchableOpacity>

                    <View>
                        <Text>Post</Text>
                    </View>

                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

export default Bookmark