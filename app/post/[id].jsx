import { View, Text, ScrollView, Alert, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../context/ContextProvider'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppwrite from '../../lib/useAppwrite'
import { addFollow, createComment, deleteComment, getAllCommentsForThisPost, getAllLikes, getSinglePostWithAllData, removeFollow, updateCommentApi } from '../../lib/appwrite'
// import Tranding from '../../components/Tranding'
import VideoCard from '../../components/VideoCard'
// import CLoading from '../../components/CLoading'
import InfoBox from '../../components/InfoBox'
import CInput from '../../components/CInput'
import CBotton from '../../components/CBotton'
import Icons from "react-native-vector-icons/FontAwesome5"
import * as Animatable from 'react-native-animatable';

const SinglePostPage = () => {

    const {
        theme,
        user,
        restPostGlobal,
        singlePostGlobal,
        updateSinglePostState,
        updateAllData,
        upadateFollowList
    } = useGlobalContext()

    const { id } = useLocalSearchParams()

    const { data: returnedData, refetch, isLoading } = useAppwrite(() => getSinglePostWithAllData(id))

    // console.log(JSON.stringify(returnedData.restPost, null, 2))
    // console.log(JSON.stringify(singlePostGlobal, null, 2))

    const post = [returnedData?.singlePost]

    const [activeItem, setActiveItem] = useState('');

    const [refreshing, setRefreshing] = useState(false);

    const [follwingLoad, setFollowingLoad] = useState(false)

    const ViewableItemsChanges = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key)
        }

    }

    const onRefresh = async () => {
        setRefreshing(true)

        // // // re call new videos ------>
        await refetch();

        setRefreshing(false)
    }

    const followClickHandler = async (toUser) => {

        if (follwingLoad) return

        if (!user || !toUser) return Alert.alert("Mandatory accounts not give. Please wait or reload app.")

        // console.log({ user, toUser })

        // return

        try {
            setFollowingLoad(true)
            let result;

            // if (!userPresentInSavedPost) {
            //     result = await savePost(item, user.$id)
            // } else {
            //     result = await savePostRemove(item, user.$id)
            // }

            if (!user?.following?.includes(toUser?.$id)) {
                result = await addFollow(user, toUser)
            } else {
                result = await removeFollow(user, toUser)

                // Alert.alert("Now remove from following list.")
                // console.log("Now remove from following list --------->")
            }


            if (result) {

                // console.log(JSON.stringify(result, null, 4))

                // // // Now upadte state ------>
                // updateAllData(result)

                upadateFollowList(result.byUser, result.toUser)


            }
            // console.log({ result })

        } catch (error) {
            Alert.alert(error)
        }
        finally {
            setFollowingLoad(false)
        }


    }


    // console.log(singlePostGlobal)
    // console.log(restPostGlobal)


    // // // // These two var is very imp. if we remove this then when ever our data got change by user action then our state var also get fetched/updated by old data ---------->
    let firstUpdating = true;

    useEffect(() => {
        // console.log(JSON.stringify(returnedData.singlePost, null, 4))
        // console.log(JSON.stringify(user, null, 4))

        if (
            firstUpdating
            &&
            Object.keys(returnedData).length > 0
            &&
            (Object.keys(returnedData?.singlePost).length > 0 || returnedData?.restPost.length > 0)
        ) {

            // // upadte single post state from global
            updateSinglePostState(returnedData.singlePost, returnedData.restPost)

            // // Also upadte single post data from all
            updateAllData(returnedData.singlePost)

            firstTimeAllPost = false
        }

    }, [returnedData])


    // // // Set user info here ----------->>

    useEffect(() => {
        refetch()
    }, [id])

    // console.log({ isLoading })

    return (

        <SafeAreaView className={`  h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}>

            {/* Loading text here ----------> */}
            {
                isLoading
                &&
                <Animatable.View
                    className=" w-full h-[100vh] items-center absolute top-14 -z-[1] "
                    animation='fadeIn'
                    duration={700}
                    iterationCount="infinite"
                    direction='alternate'
                >

                    <View className={` relative overflow-hidden rounded-2xl justify-center items-center bg-white border border-double border-rose-200 shadow-lg shadow-rose-400 px-2 py-1`}>
                        <Text className=" relative font-semibold ">
                            Getting posts data...
                        </Text>
                    </View>

                </Animatable.View>
            }


            <ScrollView className='my-6'>
                <View >

                    <TouchableOpacity
                        onPress={() => { router.back() }}
                    >
                        <Text className={`font-pmedium ml-1 ${!theme ? "text-gray-100" : "text-black-100"} py-2 px-1 active:bg-red-800`}>
                            👈Back
                        </Text>

                    </TouchableOpacity>


                    {/* now show single video here --------->  */}

                    {
                        Object.keys(singlePostGlobal).length > 0
                        &&
                        <View>
                            <View className="mt-7 w-[107%] -ml-3">
                                <VideoCard
                                    item={singlePostGlobal}
                                    postPage={true}
                                />
                            </View>

                            <SeeAllLikesDiv
                                singlePostGlobal={singlePostGlobal}
                            />

                            <CommentDivGiveCmntAndAllCmnt
                                singlePostGlobal={singlePostGlobal}
                            />

                        </View>
                    }

                </View>

                {
                    Object.keys(singlePostGlobal).length > 0
                    &&
                    <Text className={`${!theme ? "text-white" : "text-black"} text-center my-2 font-psemibold text-xl `}>User Details & other posts</Text>
                }


                <FlatList
                    // data={[{ id: 1 }, { id: 2 }, { id: 2 }, { id: 4 }]}
                    // data={[]}
                    data={restPostGlobal || []}
                    // data={post}
                    keyExtractor={(item) => item?.$id}

                    ListHeaderComponent={() => {
                        return (
                            <View className=' w-[25vh] ml-7'>

                                {
                                    returnedData?.singlePost
                                    &&

                                    <View className=" flex-1 justify-center items-center mt-2 " >

                                        <View
                                            className="w-[15vh] h-[15vh] rounded-full my-1 overflow-hidden  border-2 border-secondary p-1"
                                        >

                                            <Image
                                                source={{ uri: singlePostGlobal?.creator?.avatar }}
                                                className="w-full h-full rounded-full"
                                                resizeMode='contain'
                                            />

                                        </View>

                                        <Text className={`${!theme ? "text-white" : "text-black"}`}>{singlePostGlobal?.creator?.username}</Text>
                                        <Text className={`${!theme ? "text-white" : "text-black"} `}>{singlePostGlobal?.creator?.email}</Text>

                                        <View className="mt-1 flex-row ">

                                            <InfoBox
                                                title={restPostGlobal.length + 1 || 0}
                                                subtite="Posts"
                                                containerStyle={"mr-5"}
                                                titleStyle="text-base"
                                            />

                                            <InfoBox
                                                title={singlePostGlobal?.creator?.followers?.length}
                                                subtite="Followers"
                                                titleStyle="text-base"
                                            />

                                        </View>


                                        {

                                            singlePostGlobal && singlePostGlobal?.creator
                                            &&

                                            <View>
                                                {
                                                    (singlePostGlobal?.creator?.$id !== user?.$id)
                                                        ?
                                                        <View>
                                                            <TouchableOpacity
                                                                onPress={() => { followClickHandler(singlePostGlobal?.creator) }}
                                                            >
                                                                <Text
                                                                    className={`
                                                                        font-pmedium text-gray-100 px-2 rounded-full my-1
                                                                        ${(!user?.following?.includes(singlePostGlobal?.creator?.$id))
                                                                            ? "bg-blue-600"
                                                                            : "bg-red-600"
                                                                        }

                                                                    `}
                                                                >
                                                                    {
                                                                        (!user?.following?.includes(singlePostGlobal?.creator?.$id))
                                                                            ? "Follow"
                                                                            : "Unfollow"

                                                                    }
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                        :
                                                        <Text className=" text-blue-600 border border-blue-600 px-2 rounded-full mt-1 font-psemibold text-xs ">You</Text>

                                                }
                                            </View>

                                        }




                                        {
                                            restPostGlobal.length > 0
                                            &&

                                            <Text
                                                className={`${!theme ? "text-white" : "text-black"} text-xs mt-2`}
                                                numberOfLines={1}
                                            >See more videos by him/her 👉</Text>
                                        }

                                    </View>
                                }

                            </View>
                        )
                    }}

                    // // // Here all data get render ---------->>
                    renderItem={({ item }) => {
                        return <VideoCard
                            item={item}
                            allData={post}
                            width={true}
                            activeItem={activeItem}
                        />
                    }}
                    onViewableItemsChanged={ViewableItemsChanges}
                    viewabilityConfig={{
                        // viewAreaCoveragePercentThreshold: 0,
                        itemVisiblePercentThreshold: 50
                    }}
                    contentOffset={{ x: 20 }}

                    horizontal

                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
                />

            </ScrollView>
        </SafeAreaView >
    )
}

export default SinglePostPage


const CommentDivGiveCmntAndAllCmnt = ({ singlePostGlobal }) => {

    const { theme, user, updateComment } = useGlobalContext()

    const initialValue = {
        usersId: "",
        postId: "",
        textComment: ""
    }

    const [cmntForm, setCmntForm] = useState(initialValue)

    const [uploading, setUploading] = useState(false)


    const intitialUpdatingVal = {
        mode: false,
        commentId: ""
    }

    const [isUpdating, setIsUpdating] = useState(intitialUpdatingVal)

    const [allCommentData, setAllCommentData] = useState([])


    // console.log(singlePostGlobal)


    const submit = async () => {

        // if (!cmntForm.usersId || !cmntForm.postId || !cmntForm.textComment) {
        //     return Alert.alert('Please fill in all the fields.')
        // }

        setUploading(true)

        try {

            //     await createVideoPost({ ...form, userId: user.$id })

            // Alert.alert("Sucess", "Comment")
            //     router.push("/home")

            let result

            let bodyData = {
                usersId: user.$id,
                postId: singlePostGlobal.$id,
                textComment: cmntForm.textComment
            }


            // console.log({ bodyData })


            if (!isUpdating.mode) {

                result = await createComment(bodyData, singlePostGlobal)
            } else {

                // console.log({ cmntForm, isUpdating })

                result = await updateCommentApi(bodyData, isUpdating.commentId)

            }


            // console.log(JSON.stringify(result), null, 4)

            if (result) {
                // console.log("Now call fn to update state.")

                if (!isUpdating.mode) {

                    await updateComment(result, "created")

                    setAllCommentData(per => ([result, ...per]))

                } else {

                    // await updateComment(result, "updated")

                    cancelUpdating()       // // // Back To normal now.


                    // // Now upadte arr of all comment ------->

                    let index = allCommentData.findIndex(ele => ele.$id === result.$id)

                    allCommentData.splice(index, 1, result)

                    setAllCommentData(allCommentData)
                }

            }

        } catch (error) {
            Alert.alert("Error", error?.message)
        }
        finally {
            setCmntForm({ ...cmntForm, textComment: "" })
            setUploading(false)
        }


    }

    function editClickHandler(commentData) {

        setIsUpdating({
            mode: true,
            commentId: commentData.$id,
        })

        setCmntForm({
            ...cmntForm,
            textComment: commentData.textComment
        })

    }

    function cancelUpdating() {

        setIsUpdating(intitialUpdatingVal)

        setCmntForm({
            ...cmntForm,
            textComment: ""
        })

    }

    function deleteClickHandler(commentData) {
        Alert.alert(
            "Are your ??",
            "Do you really want to delete this comment.",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel delete comment pressed'),
                    style: 'cancel',
                    className: " text-red-600"
                },
                {
                    text: 'Delete',
                    onPress: () => actualDeleteCmntFn(commentData.$id)

                },
            ]
        )
    }

    async function actualDeleteCmntFn(commentId) {
        if (!commentId) {
            return Alert.alert('Please try again.')
        }

        setUploading(true)

        try {

            //     await createVideoPost({ ...form, userId: user.$id })

            // Alert.alert("Sucess", "Comment")
            //     router.push("/home")

            let result = await deleteComment(commentId, singlePostGlobal)

            // console.log(JSON.stringify(result), null, 4)

            if (result) {
                // console.log("Now call fn to update state.")

                await updateComment(result, "deleted")

                // // // now update state here -------->

                let index = allCommentData.findIndex(ele => ele.$id === result)

                allCommentData.splice(index, 1)

                setAllCommentData(allCommentData)

            }

        } catch (error) {
            Alert.alert("Error", error?.message)
        }
        finally {
            setCmntForm({ ...cmntForm, textComment: "" })
            setUploading(false)
        }


    }

    function fetchAndSetAllComments(postId) {

        // console.log("Called for ---------->", singlePostGlobal.title)

        getAllCommentsForThisPost(postId)
            .then((res) => {
                // console.log(JSON.stringify(res))

                if (res.length > 0) {
                    setAllCommentData(res)
                }
            })
            .catch((err) => Alert.alert("Error", JSON.stringify(err)))
    }

    function goToProfileHandler(userId) {

        // console.log("-------------------------->",userId)
        // console.log($id, username)
        // console.log(userId, user.$id)
        // console.log(userId === user.$id)

        if (userId === user.$id) {
            return router.push(`/profile`)
        }

        router.push(`/user/${userId}`)
    }



    // useState(() => {

    //     if (Object.keys(singlePostGlobal).length > 0) {
    //         setCmntForm({ ...cmntForm, postId: singlePostGlobal.$id })
    //     }


    //     if (singlePostGlobal && singlePostGlobal.$id) {

    //         if (singlePostGlobal?.comments.length > 0) {

    //             fetchAndSetAllComments(singlePostGlobal.$id)
    //         } else {
    //             setAllCommentData([])
    //         }

    //     }


    // }, [singlePostGlobal])


    // useEffect(() => {

    //     if (user) {
    //         setCmntForm({ ...cmntForm, usersId: user.$id })
    //     }

    // }, [user])


    // console.log(JSON.stringify(singlePostGlobal.comments), null, 4)


    return (

        <View
            className="mb-10"
        >

            {
                isUpdating.mode
                &&
                <>

                    <Text
                        className={`${!theme ? "text-white" : "text-black"}text-start ml-5 font-pregular`}
                    >Update this :-</Text>

                    <View
                        className=" w-[70%] mx-auto border border-secondary rounded-full flex-row items-center overflow-hidden "
                    >

                        <Text className={`${!theme ? "text-white" : "text-black"} ml-1 font-psemibold`}>{cmntForm.textComment}</Text>


                        {/* Update and detele present here -----> */}
                        <View
                            className=' h-full flex-row items-end gap-x-1 ml-auto -mr-1 w-[20%] pr-4 py-1 border border-secondary '
                        >


                            <TouchableOpacity
                                className="w-[85%] flex flex-col items-center justify-center  "
                                // onPress={deleteClickHandler}
                                onPress={cancelUpdating}
                            >

                                <Icons
                                    name='times-circle'
                                    size={20}
                                    color="#ef4444"
                                    light
                                />
                                {/* <Text className="text-red-500 text-[8px]">Remove</Text> */}
                            </TouchableOpacity>

                        </View>

                    </View>

                </>


            }



            <View className='flex-1 flex-row  justify-evenly items-end'>

                <CInput
                    title={'Comment input.'}
                    value={cmntForm.textComment}
                    onChangeHander={(e) => setCmntForm({ ...cmntForm, textComment: e })}
                    placeholder={"Give your comment to this post"}
                    textWidth={true}
                // autoFocus={true}
                // // // Give above true if you want your input alwase focused.
                />

                <CBotton
                    title={!isUpdating.mode ? "Add" : "Up"}
                    handlePress={submit}
                    isLoading={uploading}
                    containerStyle={"mt-5 bg-secondary w-[20%]"}
                />

            </View>


            {
                singlePostGlobal?.comments.length > 0 && allCommentData.length <= 0
                &&

                <TouchableOpacity
                    className="my-3 flex"
                    onPress={() => fetchAndSetAllComments(singlePostGlobal.$id)}
                >
                    <Text className={`${!theme ? "text-white" : "text-black"} text-center font-psemibold`}>Click to see all comments</Text>
                </TouchableOpacity>
            }


            <View>
                {

                    allCommentData.length > 0

                    &&

                    <>
                        <Text className={`text-xl ${!theme ? "text-white" : "text-black"} mt-5 ml-6 font-pregular`}>All Comments about this post</Text>

                        {/* <Text className="text-white text-center">
                            {
                                JSON.stringify(singlePostGlobal.comments)
                            }
                        </Text> */}


                        {

                            allCommentData.map((ele, i) => {
                                // console.log(JSON.stringify(ele.usersId.$id) , null , 4)
                                return <View
                                    key={i}
                                    className=" w-[70%] mx-auto my-3  border border-secondary rounded-full flex-row items-center overflow-hidden "
                                >
                                    <TouchableOpacity

                                        onPress={() => {
                                            goToProfileHandler(ele?.usersId?.$id)
                                        }}
                                    >


                                        <Image
                                            source={{ uri: ele?.usersId?.avatar }}
                                            className="w-7 h-7 rounded-full"
                                            resizeMode='contain'
                                        // className={"w-full max-w-[380px] h-[300px]"}
                                        />


                                    </TouchableOpacity>


                                    <Text className={`${!theme ? "text-white" : "text-black"} ml-1 font-psemibold`}>{ele.textComment}</Text>


                                    {/* Update and detele present here -----> */}

                                    {
                                        user.$id === ele?.usersId?.$id
                                        &&

                                        <View
                                            className=' h-full flex-row items-end gap-x-1 ml-auto -mr-1 w-[20%] pr-4 pt-1 border border-secondary '
                                        >

                                            <TouchableOpacity
                                                className="w-[45%] flex flex-col items-center justify-center "
                                                onPress={() => editClickHandler(ele)}
                                            >

                                                <Icons
                                                    name='pen'
                                                    size={12}
                                                    color="#FF9C01"
                                                    light
                                                />


                                                <Text className="text-secondary text-[8px]">Edit</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                className="w-[45%] flex flex-col items-center justify-center  "
                                                onPress={() => deleteClickHandler(ele)}
                                            >

                                                <Icons
                                                    name='trash'
                                                    size={12}
                                                    color="#ef4444"
                                                    light
                                                />
                                                <Text className="text-red-500 text-[8px]">Del</Text>
                                            </TouchableOpacity>

                                        </View>
                                    }


                                </View>

                            })

                        }

                    </>


                }
            </View>

        </View>

    )
}


const SeeAllLikesDiv = ({ singlePostGlobal }) => {



    const { theme, user } = useGlobalContext()

    const [allLikesData, setAllLikesData] = useState([])


    function fetchAndSetAllLikes(postId) {

        // console.log("Called for ---------->", singlePostGlobal.title)

        getAllLikes(postId)
            .then((res) => {
                // console.log(JSON.stringify(res))

                if (res.length > 0) {
                    setAllLikesData(res)
                }
            })
            .catch((err) => Alert.alert("Error", JSON.stringify(err)))
    }


    function goToProfileHandler(userId) {

        // console.log("-------------------------->",userId)
        // console.log($id, username)
        console.log(userId, user.$id)
        console.log(userId === user.$id)

        if (userId === user.$id) {
            return router.push(`/profile`)
        }

        router.push(`/user/${userId}`)
    }



    // console.log(JSON.stringify(allLikesData))



    return (
        <View>

            {
                singlePostGlobal?.likes.length > 0 && allLikesData.length <= 0
                &&

                <TouchableOpacity
                    className="my-3 flex"
                    onPress={() => fetchAndSetAllLikes(singlePostGlobal.$id)}
                >
                    <Text className={`${!theme ? "text-white" : "text-black"} text-center font-psemibold`}>Click to see all Likes</Text>
                </TouchableOpacity>
            }



            {/* Show all comments here -------------> */}
            <View>
                {

                    allLikesData.length > 0

                    &&

                    <>

                        <View className="flex flex-row items-center justify-between">

                            <Text
                                className={`w-auto text-xl ${!theme ? "text-white" : "text-black"} mt-5 ml-6 font-pregular`}
                            >Total likes are : {allLikesData.length}</Text>

                            <TouchableOpacity
                                className=" mr-4 mt-5"
                                onPress={() => setAllLikesData([])}
                            >
                                <Text className=" text-2xl text-red-500  text-center font-bold">X</Text>
                            </TouchableOpacity>
                        </View>

                        {/* <Text className="text-white text-center">
                            {
                                JSON.stringify(singlePostGlobal.comments)
                            }
                        </Text> */}

                        <View
                            className=' flex items-start px-6 flex-wrap flex-row gap-0.5'
                        >


                            {

                                allLikesData.map((ele, i) => {
                                    // console.log(JSON.stringify(ele) , null , 4)
                                    return <TouchableOpacity
                                        key={i}
                                        className=" h-7  border border-secondary rounded-full flex-row items-center overflow-hidden "
                                        onPress={() => { goToProfileHandler(ele?.$id); }}
                                        activeOpacity={0.2}
                                    >

                                        <Image
                                            source={{ uri: ele?.avatar }}
                                            className="w-7 h-7 rounded-full"
                                            resizeMode='contain'
                                        // className={"w-full max-w-[380px] h-[300px]"}
                                        />

                                    </TouchableOpacity>
                                })

                            }

                        </View>


                    </>


                }
            </View>



        </View>
    )
}

