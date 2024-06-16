
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { Fragment, useEffect, useState } from 'react'
import { icons } from '../constants'
import { ResizeMode, Video } from 'expo-av'
import { useGlobalContext } from '../context/ContextProvider'
import { deletePostById, disLikePost, likePost, savePostAdd, savePostRemove } from '../lib/appwrite'
import * as Animatable from 'react-native-animatable';
import { router, usePathname } from 'expo-router'
import { zoomIn, zoomOut } from './Tranding'
// import useAppwrite from '../lib/useAppwrite'
// import * as Animatable from 'react-native-animatable';

import Icons from "react-native-vector-icons/FontAwesome5"



// // Props comment ----------->
// item :- that we are showing 
// allData  :- whole arr that containing this item
// width :- a bool or str used in single page to show res post by user
// activeItem :- ID used in single page to show res post by user that currently visiable to user
// PostPgae :- single post main page (Upper post) (to prevent not open same page for same post).

const VideoCard = ({ item, allData, width, activeItem, postPage, pageName }) => {

    const pathname = usePathname()
    const { title, thumbnail, video, creator } = item
    // const { username, avatar } = creator
    const {
        theme,
        user,
        updateUser,
        updateAllData,
        setPlayingVideo,
        playingVideo,
        initialPlayingVideoState,
        updatingPostData,
        setUpdatingPostData,
        createNotification,
        VerifiedRankValue,
        setSinglePostGlobal
    } = useGlobalContext()


    // // // By below log i fixed a err when switch pages then don't play last video if both are same.
    // console.log({ pathname, pageName })
    // console.log("page in global data ------->", playingVideo.page)


    let lastPath = '';

    useEffect(() => {

        lastPath = pathname

        // if (lastPath !== pathname) setSinglePostGlobal({})

    }, [pathname])


    // const [play, setPlay] = useState(false)
    // // // Not usimg now, currently using a global state var that holds info which song should play. (Problem solve :- only one video play at a time.)

    const [openMenu, setOpenMenu] = useState(false)

    const [userPresentInSavedPost, setUserPresentInSavedPost] = useState(false)

    const [userInLikedBy, setUserInLikedBy] = useState(false)

    const [likeLoading, setLikeLoading] = useState(false)


    let currentlyPlaying = "";


    const playVideo = () => {

        currentlyPlaying = video

        // setPlay(true);
        setPlayingVideo({
            mode: true,
            videoId: item?.$id,
            videoUri: video,
            page: pageName
        })

        setOpenMenu(false);
    };


    const saveHandler = async () => {

        try {

            let result;

            if (!userPresentInSavedPost) {
                result = await savePostAdd(item?.$id, user)
            } else {
                result = await savePostRemove(item?.$id, user)
            }


            if (result) {

                // console.log(JSON.stringify(result))

                // // // Now upadte state ------>
                updateUser(result)

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

        // // // postPage is an true and false given in single post page to prevent show same page for multiple time.

        if (!postPage) {

            // // // stop playing current video now -------->>
            // setPlayingVideo({ ...playingVideo, mode: false })
            setPlayingVideo(initialPlayingVideoState)

            // // // Redirect user to single post page. ---------------->>
            router.push(`/post/${item?.$id}`)
        }

    }


    const likeHandler = async () => {

        // Alert.alert("Baad me")


        // console.log("osdjd-------------->")
        // // // Postponded now ------->

        if (likeLoading) return

        try {

            setLikeLoading(true)

            let result;

            if (!userInLikedBy) {
                // // Call here like post ------->
                result = await likePost(item?.$id, user?.$id)


                // // // Now call here to give notification ----------->


                let notificationData = {
                    whoSended: user.$id,
                    notificationFor: item?.creator?.$id,
                    type: "Like",
                    typeLikeInfo: item.$id,
                    typeFollowingInfo: ''
                }

                await createNotification(notificationData)

            } else {
                // // Call here dislike post ----->
                result = await disLikePost(item?.$id, user?.$id)
            }

            // console.log({ result })


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
            setLikeLoading(false)

        }

    }


    const commentHandler = () => {

        // // // Mtlb agr ap already post[id] page pr ho to user ko us page pr move nhi krna chahoge (Don't redirect to user on singlePost page if he/she already on that page.)
        if (!postPage) {
            router.push(`/post/${item?.$id}`)
        }

    }


    // // // Delete post handler here ---------->
    const deletePostHandler = async (postId) => {

        if (likeLoading) return

        try {

            setLikeLoading(true)

            let result = await deletePostById(postId);


            // console.log({ result })

            if (result) {

                // console.log(JSON.stringify(result))

                // // // Now upadte state ------>
                updateAllData({ $id: result }, true)

            }
            // console.log({ result })

        } catch (error) {
            Alert.alert(error)
        }
        finally {
            setLikeLoading(false)

        }



    }


    // // // Update post handler here ---------->
    const updatePostHandler = async (item) => {

        // Alert.alert("Update")


        setUpdatingPostData({
            mode: true,
            postData: item
        })


        router.push("/create")


        // if (likeLoading) return

        // try {

        //     setLikeLoading(true)

        //     let result;

        //     if (!userInLikedBy) {
        //         // // Call here like post ------->
        //         result = await likePost(item.$id, user.$id)
        //     } else {
        //         // // Call here dislike post ----->
        //         result = await disLikePost(item.$id, user.$id)
        //     }

        //     // console.log({ result })


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


    useEffect(() => {

        if (item?.$id && user?.$id) {
            let checkUserIdInSavedPost = user?.savedPost?.includes(item.$id)
            setUserPresentInSavedPost(checkUserIdInSavedPost || false)
        }


        if (item?.$id && user?.$id) {

            let checkUserIdInLikePost = item?.likes.includes(user.$id)
            setUserInLikedBy(checkUserIdInLikePost || false)
        }

    }, [item, user])


    useEffect(() => {

        // console.log("------------------>")
        // console.log(JSON.stringify(playingVideo, null, 5))

        // if (playingVideo.videoId !== item.$id) {


        setPlayingVideo(initialPlayingVideoState)


        // }    
    }, [])



    return (
        <Animatable.View
            className={` 
                ${width && `w-[32vh] pt-3`} 
                ${!postPage && "mb-10"}
                relative overflow-hidden flex-col items-center px-4
            `}
            animation={activeItem === item?.$id ? zoomIn : zoomOut}
            duration={700}
        >

            {/* User info dive here for vieo card ---------------------> */}

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
                            >By : {item?.creator?.username} {(item.creator?.rank || 0) >= VerifiedRankValue && "✅"} </Text>
                        </View>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity
                    className="mt-2 mx-0.5 py-1 px-1.5 rounded border border-white"
                    onPress={() => { setOpenMenu(!openMenu) }}
                >
                    {/* <Image
                        source={!openMenu ? icons.menu : icons.rightArrow}
                        className="w5 h-5"
                        resizeMode="contain"
                    /> */}

                    <Text className='text-white'>
                        {
                            !openMenu
                                ? '◀'
                                : '✕'
                        }
                    </Text>

                </TouchableOpacity>




                {
                    openMenu
                    &&
                    // // // Below div will open when every open menu btn clicked.
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
                            item?.creator?.$id === user?.$id
                            &&

                            <View className={` my-1 px-2 border rounded-xl  ${!theme ? " bg-black border-cyan-300 " : "bg-white border-cyan-600 "} `}>

                                {
                                    [
                                        {
                                            name: "Update",
                                            handler: (() => {
                                                updatePostHandler(item);
                                                // Alert.alert("Update")
                                            })
                                        },
                                        {
                                            name: "Delete",
                                            handler: (() => {
                                                deletePostHandler(item?.$id);
                                                // Alert.alert("Delete");
                                            })
                                        },
                                    ]
                                        .map((ele, i) => {
                                            return <Fragment key={i}>

                                                <TouchableOpacity
                                                    className="my-0.5"
                                                    onPress={() => ele?.handler ? ele.handler() : Alert.alert("I'm Dummy")}
                                                >

                                                    <Text
                                                        className={` 
                                                            text-lg font-psemibold
                                                                ${!theme
                                                                ? "text-white"
                                                                : "text-black"
                                                            }
                                                        `}
                                                    >{ele.name}</Text>

                                                </TouchableOpacity>
                                            </Fragment>
                                        })
                                }


                            </View>

                        }


                    </Animatable.View>
                }

            </View>


            {
                // play
                (
                    playingVideo.mode
                    &&
                    (
                        playingVideo.videoId === item?.$id
                        &&
                        currentlyPlaying !== item?.video
                        &&
                        // playingVideo.page.includes(`/${pageName}`)
                        // playingVideo.page.includes(`${pathname}`)
                        // pathname.includes(`${playingVideo.page}`)

                        pathname.includes(pageName)
                    )
                )
                    ?
                    // // // Playing Video here ------->
                    <Video
                        // source={{ uri: video }}
                        source={{ uri: playingVideo.videoUri }}
                        className="w-full h-60 rounded-xl mt-3 border border-sky-500/50 p-[2px]"
                        resizeMode={ResizeMode.CONTAIN}
                        useNativeControls={true}
                        shouldPlay={true}
                        onPlaybackStatusUpdate={(status) => {
                            if (status.didJustFinish) {
                                setPlayingVideo(initialPlayingVideoState);
                            }
                        }}
                    />
                    :
                    // // // Video Post showing here ------->
                    <TouchableOpacity
                        className="w-full h-60 rounded-xl relative justify-center items-center mt-3 overflow-hidden border border-sky-500/50 p-[2px]"
                        activeOpacity={0.7}
                        onPress={() => playVideo()}
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

            {/* Prompt for video here  */}

            <TouchableOpacity
                onPress={redirectToPost}
                className=" items-center"
            >

                <View>
                    <Text className={`${!theme ? "text-white" : "text-black"} text-xl text-start w-[90vw] `}>{item.prompt}</Text>
                </View>
            </TouchableOpacity>


            {/* Like and comment btn here -------> */}

            <View className=" h-11 mt-1 flex-1 justify-end items-start gap-x-5 w-[90%] flex-row px-1">

                <TouchableOpacity
                    className='justify-center items-center'
                    onPress={commentHandler}
                >
                    <Icons
                        name='comment'
                        size={27}
                        color="#FF9C01"
                        light
                    />


                    {
                        item?.comments?.length > 0
                        &&
                        <Text
                            className=' text-white text-xs'
                            style={{ color: "#FF9C01" }}
                        >{item?.comments?.length}</Text>
                    }

                </TouchableOpacity>


                <TouchableOpacity
                    className='justify-center items-center'
                    onPress={likeHandler}
                >
                    <Icons
                        name='heart'
                        size={27}
                        color="#FF9C01"
                        solid={userInLikedBy}
                    // light={false}
                    />

                    {
                        item?.likes?.length > 0
                        &&
                        <Text
                            style={{ color: "#FF9C01" }}
                            className=' text-white text-xs'
                        >{item.likes.length}</Text>
                    }


                </TouchableOpacity>


            </View>



        </Animatable.View>
    )
}

export default VideoCard

