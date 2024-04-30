
import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { ResizeMode, Video } from 'expo-av'

const VideoCard = ({ item }) => {

    const { title, thumbnail, video, creator } = item
    const { username, email, avatar } = creator

    const [play, setPlay] = useState(false)


    // console.log({ title, thumbnail, video, username, email, avatar })

    // console.log(video)
    // console.log(item.title)

    return (
        <View
            className=" flex-col items-center px-4 mb-14"
        >

            <View className={"flex-row gap-3 items-start"}>

                <View
                    className="flex-1 justify-center items-center flex-row"
                >

                    <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">

                        <Image source={{ uri: avatar }}
                            className="w-full h-full rounded-md "
                            resizeMode='contain'
                        />

                    </View>

                    <View
                        className='flex-1 justify-center ml-3 gap-y-1'
                    >
                        <Text
                            className="text-white font-psemibold text-sm"
                            numberOfLines={1}
                        >{title}</Text>
                        <Text
                            className="text-xs text-gray-100 font-pregular"
                            numberOfLines={1}
                        >{username}</Text>
                    </View>
                </View>

                <View className="mt-2">
                    <Image
                        source={icons.menu}
                        className="w5 h-5"
                        resizeMode="contain"
                    />

                </View>

            </View>


            {/* <></> */}

            {
                play
                    ?
                    <Video
                        source={{ uri: video }}
                        className="w-full h-60 rounded-xl mt-3"
                        resizeMode={ResizeMode.CONTAIN}
                        useNativeControls={true}
                        shouldPlay={true}
                        onPlaybackStatusUpdate={(status) => {
                            if (status.didJustFinish) {
                                setPlay(false)
                            }
                        }}
                    // onPress={setPlay(false)}
                    />
                    :
                    <TouchableOpacity
                        className="w-full h-60 rounded-xl relative justify-center items-center mt-3 border border-sky-500"
                        activeOpacity={0.7}
                        onPress={() => setPlay(true)}
                    >
                        <Image
                            source={{ uri: thumbnail }}
                            className="w-full h-full rounded-xl mt-3"
                            resizeMode='cover'
                        />

                        <Image
                            source={icons.play}
                            className={'w-12 h-12 absolute'}
                            resizeMode="contain"
                        />

                    </TouchableOpacity>
            }

        </View>
    )
}

export default VideoCard

