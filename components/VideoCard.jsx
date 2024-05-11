
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { Fragment, useEffect, useState } from 'react'
import { icons } from '../constants'
import { ResizeMode, Video } from 'expo-av'
import { useGlobalContext } from '../context/ContextProvider'
import { savePost, savePostRemove } from '../lib/appwrite'
import * as Animatable from 'react-native-animatable';
import { router, usePathname } from 'expo-router'
import { zoomIn, zoomOut } from './Tranding'
// import useAppwrite from '../lib/useAppwrite'
// import * as Animatable from 'react-native-animatable';

import Icons from "react-native-vector-icons/FontAwesome5"



// // // Props comment ----------->
// // item :- that we are showing 
// // allData  :- whole arr that containing this item
// // width :- a bool or str used in single page to show res post by user
// // activeItem :- ID used in single page to show res post by user that currently visiable to user
// // PostPgae :- single post main page (Upper post) (to prevent not open same page for same post).

const VideoCard = ({ item, allData, width, activeItem, postPage }) => {

    const pathname = usePathname()
    const { title, thumbnail, video, creator } = item
    // const { username, avatar } = creator
    const { theme, user, updateAllData } = useGlobalContext()
    const [play, setPlay] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [userPresentInSavedPost, setUserPresentInSavedPost] = useState(false)

    const [userInLikedBy, setUserInLikedBy] = useState(false)
    const [likeLoading, setLikeLoading] = useState(false)

    // console.log({ title, thumbnail, video, username, email, avatar })

    // console.log(video)
    // console.log(item.title)

    // console.log(JSON.stringify(item.savedBy))

    // console.log("Render ---------------->")
    // console.log(JSON.stringify(item, null, 4))


    const saveHandler = async () => {

        try {

            let result;

            if (!userPresentInSavedPost) {
                result = await savePost(item, user.$id)
            } else {
                result = await savePostRemove(item, user.$id)
            }


            if (result) {

                // console.log(JSON.stringify(result))

                // // // Now upadte state ------>
                updateAllData(result)

            }
            // console.log({ result })

        } catch (error) {
            Alert.alert(error)
        }
        finally {
            setOpenMenu(false)
        }
    }


    const redirectToPost = () => {
        // // // Here set single post data ------------> 

        if (!postPage) {
            router.push(`/post/${item.$id}`)
        }

    }


    const likeHandler = async () => {

        Alert.alert("Baad me")

        // // // Postponded now ------->

        // if (likeLoading) return
        // try {

        //     setLikeLoading(true)

        //     let result;

        //     if (!userInLikedBy) {
        //         // // Call here like post ------->
        //         result = await savePost(item, user.$id)
        //     } else {
        //         // // Call here dislike post ----->
        //         result = await savePostRemove(item, user.$id)
        //     }


        //     if (result) {

        //         // console.log(JSON.stringify(result))

        //         // // // Now upadte state ------>
        //         updateAllData(result)

        //     }
        //     // console.log({ result })

        // } catch (error) {
        //     Alert.alert(error)
        // }
        // finally {
        //     setLikeLoading(false)

        // }

    }


    const commentHandler = () => {

    }


    useEffect(() => {

        if (item && item?.savedBy && item?.savedBy?.length > 0) {
            let checkUserIdInSavedPost = item?.savedBy?.map(ele => ele.$id).includes(user.$id)
            setUserPresentInSavedPost(checkUserIdInSavedPost || false)
        }


        if (item && item?.likedBy && item?.likedBy?.length > 0) {

            let checkUserIdInLikePost = item?.likedBy?.map(ele => ele.$id).includes(user.$id)

            setUserInLikedBy(checkUserIdInLikePost || false)
        }




    }, [item])


    // console.log(activeItem)


    return (
        <Animatable.View
            className={` 
                ${width && `w-[32vh]`} 
                relative overflow-hidden flex-col items-center px-4 mb-10
            `}
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={700}
        >

            <View className={"flex-row gap-3 items-center"}>

                <TouchableOpacity
                    className="w-[85%] mr-auto"
                    onPress={redirectToPost}
                >


                    <View
                        className="flex-1 justify-center items-center flex-row"
                    >

                        <View className="w-[46px] h-[46px] rounded-lg justify-center items-center p-0.5 border border-secondary">

                            <Image source={{ uri: item?.creator?.avatar }}
                                className="w-full h-full rounded-md "
                                resizeMode='contain'
                            />

                        </View>

                        <View
                            className='flex-1 justify-center ml-3 gap-y-1'
                        >
                            <Text
                                className={` font-psemibold text-sm ${!theme ? "text-white" : "text-black"}`}
                                numberOfLines={1}
                            >{title}</Text>
                            <Text
                                className={`text-xs font-pregular ${!theme ? "text-white" : "text-black"} `}
                                numberOfLines={1}
                            >By : {item?.creator?.username}</Text>
                        </View>
                    </View>
                </TouchableOpacity>


                {
                    openMenu
                    &&

                    <Animatable.View
                        className={`w-[40%] absolute  z-10  rounded-xl top-1  right-[26px] `}
                        animation='lightSpeedIn'
                        duration={500}
                        easing="ease-out"
                    >

                        {
                            (!pathname.startsWith("/profile"))
                            &&

                            <View
                                className={`border px-2 py-1  rounded-xl ${!theme ? " border-white bg-black" : " border-black bg-white"}`}
                            >

                                {

                                    [
                                        {
                                            name: "Save",
                                            handler: (() => saveHandler())
                                        },
                                        // {
                                        //     name: "Dummy",
                                        //     handler: (() => Alert.alert("I'm Dummy"))
                                        // },

                                    ].map((ele, i) => {
                                        return <Fragment key={i}>
                                            <TouchableOpacity
                                                onPress={() => ele?.handler ? ele.handler() : Alert.alert("I'm Dummy")}
                                                className="my-0.5 "
                                            >
                                                <Text
                                                    className={` text-lg font-psemibold ${!theme ? "text-white" : "text-black"}`}
                                                >
                                                    {
                                                        ele.name === "Save"
                                                            ?
                                                            userPresentInSavedPost ? "Remove" : "Save"

                                                            :
                                                            `${ele.name}`
                                                    }
                                                </Text>

                                            </TouchableOpacity>

                                        </Fragment>
                                    })



                                }



                            </View>
                        }




                        {
                            item?.creator?.$id === user.$id
                            &&

                            <View className={` my-1 px-2 border rounded-xl  ${!theme ? " bg-black border-cyan-300 " : "bg-white border-cyan-600 "} `}>

                                {
                                    [
                                        {
                                            name: "Update",
                                            handler: (() => { Alert.alert("Update") })
                                        },
                                        {
                                            name: "Delete",
                                            handler: (() => { Alert.alert("Delete") })
                                        },
                                    ]
                                        .map((ele, i) => {
                                            return <Fragment key={i}>

                                                <TouchableOpacity
                                                    className="my-0.5"
                                                    onPress={() => ele?.handler ? ele.handler() : Alert.alert("I'm Dummy")}
                                                >

                                                    <Text
                                                        className={` text-lg font-psemibold ${!theme ? "text-white" : "text-black"}`}
                                                    >{ele.name}</Text>

                                                </TouchableOpacity>
                                            </Fragment>
                                        })
                                }


                            </View>

                        }


                    </Animatable.View>
                }

                <TouchableOpacity
                    className="mt-2 mx-0.5 py-1 px-1.5 "
                    onPress={() => { setOpenMenu(!openMenu) }}
                >
                    <Image
                        source={!openMenu ? icons.menu : icons.rightArrow}
                        className="w5 h-5"
                        resizeMode="contain"
                    />

                </TouchableOpacity>

            </View>


            {
                play
                    ?
                    <Video
                        source={{ uri: video }}
                        className="w-full h-60 rounded-xl mt-3 border border-sky-500/50 p-[2px]"
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
                        className="w-full h-60 rounded-xl relative justify-center items-center mt-3 overflow-hidden border border-sky-500/50 p-[2px]"
                        activeOpacity={0.7}
                        onPress={() => {
                            setOpenMenu(false);
                            setPlay(true);
                        }}
                    >
                        <Image
                            source={{ uri: thumbnail }}
                            className="w-full h-full rounded-xl "
                            resizeMode='cover'
                        />

                        <Image
                            source={icons.play}
                            className={'w-12 h-12 absolute'}
                            resizeMode="contain"
                        />

                    </TouchableOpacity>
            }



            {
                // // // If width is not given then only show below div (With is give for only page in this app)
                !width
                &&

                <View className=" mt-1 flex-1 justify-end items-end gap-x-5 w-[90%] flex-row">

                    <TouchableOpacity
                        onPress={commentHandler}
                    >
                        <Icons
                            name='comment'
                            size={30}
                            color="#FF9C01"
                            light
                        />

                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={likeHandler}
                    >
                        <Icons
                            name='heart'
                            size={30}
                            color="#FF9C01"
                            solid={true}
                            light={false}
                        />
                    </TouchableOpacity>

                </View>

            }


        </Animatable.View>
    )
}

export default VideoCard

