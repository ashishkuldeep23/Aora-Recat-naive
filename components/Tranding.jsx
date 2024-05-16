import { View, Text, FlatList, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { icons } from '../constants';
import { Video, ResizeMode } from 'expo-av';
import { useGlobalContext } from '../context/ContextProvider';
import { router } from 'expo-router';


export const zoomIn = {
    0: {
        scale: 0.9
    },
    1: {
        scale: 1.0
    },
}

export const zoomOut = {
    0: {
        scale: 1
    },
    1: {
        scale: 0.9
    },
}


const Tranding = ({ posts }) => {
    const [activeItem, setActiveItem] = useState(posts[1]);

    const ViewableItemsChanges = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key)
        }

    }

    // console.log(posts)
    // console.log(posts[0].id)
    return (
        <FlatList
            // className="px-5"
            data={posts}
            keyExtractor={post => post.$id}
            renderItem={({ item, index }) => {
                return <TrandingItem
                    activeItem={activeItem}
                    item={item}
                    index={index}
                    posts={posts}
                />
            }}
            onViewableItemsChanged={ViewableItemsChanges}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70
            }}
            contentOffset={{ x: 10 }}

            horizontal={true}
        />
    )
}

export default Tranding




const TrandingItem = ({ activeItem, item, index, posts }) => {

    const userId = useGlobalContext().user.$id

    const { title, thumbnail, video, creator } = item
    const { username, email, avatar, $id } = creator


    const [playingTrandingVidHere, setPlayingTrandingVidHere] = useState({
        mode: false,
        videoId: "",
        videoUri: ""
    })

    // // // Go to profile handler ---------->

    function goToProfileHandler() {

        // console.log("-------------------------->",userId)
        console.log($id, username)

        if (userId === $id) {
            return router.push(`profile`)
        }

        router.push(`/user/${$id}`)
    }




    return (
        <Animatable.View
            className={` relative -mx-[6px]
                ${activeItem === item.$id ? 'z-10' : "-z-[10]"} 
                ${index === 0 && " ml-2"}
                ${index === posts.length - 1 && "mr-2 -z-50"}
            `}
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={700}
        >

            {/* User image here --------> */}
            <TouchableOpacity
                className="w-[46px] h-[46px] rounded-full justify-center items-center p-[1px] border border-secondary absolute top-1 -left-1 z-[2]"
                onPress={() => {
                    goToProfileHandler();
                    // Alert.alert("GOTO", `Goto profile. ${username} ${$id}`)
                }}
            >

                <Image source={{ uri: avatar }}
                    className="w-full h-full rounded-full "
                    resizeMode='contain'
                />

            </TouchableOpacity>


            {
                (
                    playingTrandingVidHere.mode
                    &&
                    playingTrandingVidHere.videoId === item.$id

                    // play
                )
                    ?
                    // <Text className=" text-white">Playing...</Text>
                    <Video
                        // source={{ uri: playingTrandingVidHere.videoUri }}
                        source={{ uri: playingTrandingVidHere.videoUri }}
                        className="w-52 h-72 rounded-lg mt-3 bg-white/10 border border-rose-500/50 "
                        resizeMode={ResizeMode.CONTAIN}
                        useNativeControls={true}
                        shouldPlay={true}
                        onPlaybackStatusUpdate={(status) => {
                            if (status.didJustFinish) {
                                setPlayingTrandingVidHere({
                                    mode: false,
                                    videoId: "",
                                    videoUri: ""
                                })
                            }
                        }}
                    />
                    :
                    <TouchableOpacity
                        className="justify-center  rounded-lg items-center mt-3 p-[2px] overflow-hidden border border-rose-500/50"
                        activeOpacity={0.7}
                        onPress={() => {

                            setPlayingTrandingVidHere({
                                mode: true,
                                videoId: item.$id,
                                videoUri: video
                            })
                        }}
                    >
                        <ImageBackground
                            source={{ uri: thumbnail }}
                            className=" w-52 h-72 rounded-lg overflow-hidden shadow-lg shadow-black/40"
                            resizeMode='cover'
                        />

                        <Image
                            source={icons.play}
                            className={'w-12 h-12 absolute'}
                            resizeMode="contain"
                        />

                    </TouchableOpacity>
            }

        </Animatable.View >
    )
}

