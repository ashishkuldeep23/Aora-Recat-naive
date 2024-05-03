
import { View, Text, TextInput, Pressable, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { useGlobalContext } from '../context/ContextProvider'

const CInput = ({ title, value, onChangeHander, placeholder, otherStyles }) => {

    const { theme } = useGlobalContext()

    const [showPass, setshowPass] = useState(false)

    return (
        <View
            className={`w-full  mt-2 ${otherStyles} `}
        >
            <Text className={` ml-2 text-base ${!theme ? "text-gray-100" : "text-gray-900"} 
             font-pmedium`}>{title}</Text>

            <View className={`relative items-end w-full h-16 px-4 rounded-2xl   border-2 border-black-200 focus:border-secondary ${!theme ? "bg-black-100" : "bg-gray-100"} `}>


                <TextInput
                    className={`w-full flex-1 font-psemibold text-base text-start ${!theme ? "text-white" : " text-black-200"}`}
                    value={value}
                    placeholder={`${placeholder ? `${placeholder}` : `Enter your ${title}`}.`}
                    placeholderTextColor={`${!theme ? "#7b7b8b" : "#474747"}`}
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

