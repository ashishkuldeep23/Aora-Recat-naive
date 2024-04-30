
import { View, Text, TextInput, Pressable, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'

const CInput = ({ title, value, onChangeHander, placeholder, otherStyles }) => {

    const [showPass, setshowPass] = useState(false)

    return (
        <View
            className={`w-full  mt-2 ${otherStyles} `}
        >
            <Text className=" ml-2 text-base text-gray-100
             font-pmedium">{title}</Text>

            <View className="relative items-end w-full h-16 px-4 rounded-2xl  bg-black-100 border-2 border-black-200 focus:border-secondary">


                <TextInput
                    className=" w-full flex-1 text-white font-psemibold text-base text-start"
                    value={value}
                    placeholder={`${placeholder ? `${placeholder}` : `Enter your ${title}`}.`}
                    placeholderTextColor={'#7b7b8b'}
                    // onPress={() => { console.log("click") }}
                    onChangeText={(e) => {
                        onChangeHander(e);
                        // title === 'Password' && setshowPass(false)
                    }}

                    // // // Below is used to hide text by default ------->
                    // // Means if your input title is password then make true secureTextEntry prop.
                    secureTextEntry={title === "Password" && !showPass}
                />

                {
                    title === "Password"
                    &&
                    <TouchableOpacity
                        onPress={() => {
                            // console.log(e);
                            setshowPass(!showPass);
                        }}
                        // onPress={() => { Alert.alert("fdfdsffdaf") }}
                        className=" bg-red-500"
                    >
                        <Image
                            source={!showPass ? icons.eye : icons.eyeHide}
                            // source={icons.eye}
                            className='w-6 absolute bottom-0 right-0 z-[1]'
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                }

            </View>


        </View>
    )
}

export default CInput

