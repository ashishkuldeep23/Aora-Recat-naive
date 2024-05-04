import { View, Text, FlatList, ImageBackground, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { icons } from '../constants';
import { Video, ResizeMode } from 'expo-av';


const zoomIn = {
    0: {
        scale: 0.9
    },
    1: {
        scale: 1.0
    },
}

const zoomOut = {
    0: {
        scale: 1
    },
    1: {
        scale: 0.9
    },
}



const TrandingItem = ({ activeItem, item, index, posts }) => {

    const { title, thumbnail, video, creator } = item
    const { username, email, avatar } = creator

    const [play, setPlay] = useState(false)


    // console.log(activeItem === item.$id)

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
            {
                play
                    ?
                    // <Text className=" text-white">Playing...</Text>
                    <Video
                        source={{ uri: video }}
                        className="w-52 h-72 rounded-lg mt-3 bg-white/10 border border-rose-500/50 "
                        resizeMode={ResizeMode.CONTAIN}
                        useNativeControls={true}
                        shouldPlay={true}
                        onPlaybackStatusUpdate={(status) => {
                            if (status.didJustFinish) {
                                setPlay(false)
                            }
                        }}
                    />
                    :
                    <TouchableOpacity
                        className="rounded-xl relative justify-center items-center mt-3 p-[2px] overflow-hidden border border-rose-500/50"
                        activeOpacity={0.7}
                        onPress={() => setPlay(true)}
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

        </Animatable.View>
    )
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
            keyExtractor={posts => posts.$id}
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
            contentOffset={{ x: 170 }}

            horizontal={true}
        />
    )
}

export default Tranding