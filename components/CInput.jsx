
import { View, Text, TextInput, Pressable, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { useGlobalContext } from '../context/ContextProvider'


// // // forCommentVideo is a bool value that tells this box used for comment of post.

const CInput = ({ title, value, onChangeHander, placeholder, otherStyles, forCommentVideo, autoFocus, textWidth }) => {

    const { theme } = useGlobalContext()

    const [showPass, setshowPass] = useState(false)

    return (
        <View
            className={`mt-2 ${otherStyles} `}
        >
            <Text className={` ml-2 text-base ${!theme ? "text-gray-100" : "text-gray-900"} 
             font-pmedium`}>{title}</Text>

            <View className={` ${textWidth ? "w-[33vh]" : "w-full"}  relative overflow-hidden flex-1 items-end  h-16 px-4 rounded-2xl   border-2 border-black-200 focus:border-secondary ${!theme ? "bg-black-100" : "bg-gray-100"} `}>


                <TextInput
                    className={` w-full flex-1 font-psemibold text-base text-start ${!theme ? "text-white" : " text-black-200"}`}
                    value={value}
                    placeholder={`${placeholder ? `${placeholder}` : `Enter your ${title}`}.`}
                    placeholderTextColor={`${!theme ? "#7b7b8b" : "#474747"}`}
                    // onPress={() => { console.log("click") }}
                    onChangeText={(e) => {
                        onChangeHander(e);
                        // title === 'Password' && setshowPass(false)
                    }}
                    multiline={textWidth ? true : false}

                    autoFocus={autoFocus}
                    // // // Below is used to hide text by default ------->
                    // // Means if your input title is password then make true secureTextEntry prop.
                    secureTextEntry={title === "Password" && !showPass}
                />

                {
                    title === "Password"
                    &&
                    <TouchableOpacity

                        onPress={() => setshowPass(!showPass)}
                        // onPress={() => { Alert.alert("fdfdsffdaf") }}
                        className=" absolute right-0 w-10 h-14 rounded-r-full"
                    >
                        <Image
                            source={!showPass ? icons.eye : icons.eyeHide}
                            // source={icons.eye}
                            className='w-8 h-8 absolute left-[5%] top-[25%]  z-[10] '
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                }

            </View>


        </View >
    )
}

export default CInput

