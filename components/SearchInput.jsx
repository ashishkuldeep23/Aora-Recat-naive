
import { View, Text, TextInput, Pressable, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'

const SearchInput = ({ title, value, onChangeHander, placeholder, otherStyles }) => {


    return (

        <View className="relative flex-1 justify-between w-full h-16 px-4 rounded-2xl  bg-black-100 border-2 border-black-200 focus:border-secondary space-x-4">

            <TextInput
                className=" text-base mt-0.5 text-white flex-1 font-pregular"
                value={value}
                placeholder={'Search for a video topic.'}
                placeholderTextColor={'#7b7b8b'}
                onChangeText={(e) => {
                    onChangeHander(e);
                }}


            />

            <TouchableOpacity>
                <Image
                    source={icons.search}
                    className='w-5 h-5 absolute -top-10 -right-2'
                    resizeMode="contain"
                />
            </TouchableOpacity>



        </View>
    )
}

export default SearchInput

