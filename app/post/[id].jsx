import { View, Text, ScrollView, Alert, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../context/ContextProvider'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppwrite from '../../lib/useAppwrite'
import { addFollow, getSinglePostWithAllData, removeFollow } from '../../lib/appwrite'
import Tranding from '../../components/Tranding'
import VideoCard from '../../components/VideoCard'
import CLoading from '../../components/CLoading'
import InfoBox from '../../components/InfoBox'

const SinglePostPage = () => {

    const { theme, user, restPostGlobal, singlePostGlobal, updateSinglePostState, updateAllData, upadateFollowList } = useGlobalContext()

    const { id } = useLocalSearchParams()

    const { data: returnedData, refetch, isLoading } = useAppwrite(() => getSinglePostWithAllData(id))

    // console.log(JSON.stringify(returnedData.restPost, null, 2))
    // console.log(JSON.stringify(returnedData.singlePost, null, 2))

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

            if (!user?.followedBy.includes(toUser?.$id)) {
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
            Object.keys(returnedData?.singlePost).length > 0
            &&
            returnedData?.restPost.length > 0
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

    return (

        <SafeAreaView className={`  h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}>
            <ScrollView className='my-6'>

                <View >

                    <TouchableOpacity
                        onPress={() => { router.back() }}
                    >
                        <Text className="font-pmedium ml-1 text-gray-100 py-2 px-1 active:bg-red-800">
                            👈Back
                        </Text>

                    </TouchableOpacity>


                    {/* now show single video here --------->  */}

                    {
                        Object.keys(singlePostGlobal).length > 0
                        &&
                        <View className="my-7 w-[107%] -ml-3">
                            <VideoCard
                                item={singlePostGlobal}
                                postPage={true}
                            />
                        </View>
                    }



                </View>

                {
                    Object.keys(singlePostGlobal).length > 0
                    &&
                    <Text className="text-white text-center my-2 font-psemibold text-xl ">User Details & other posts</Text>
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

                                        <Text className='text-white'>{singlePostGlobal?.creator?.username}</Text>
                                        <Text className='text-white'>{singlePostGlobal?.creator?.email}</Text>

                                        <View className="mt-1 flex-row ">

                                            <InfoBox
                                                title={restPostGlobal.length + 1 || 0}
                                                subtite="Posts"
                                                containerStyle={"mr-5"}
                                                titleStyle="text-base"
                                            />

                                            <InfoBox
                                                title={singlePostGlobal?.creator?.followedBy?.length}
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
                                                                    
                                                                   ${(!user?.followedBy.includes(singlePostGlobal?.creator?.$id))
                                                                            ? "bg-blue-600"
                                                                            : "bg-red-600"}

                                                                    `}
                                                                >
                                                                    {
                                                                        (!user?.followedBy.includes(singlePostGlobal?.creator?.$id))
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
                                                className='text-white text-xs mt-2'
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




                {/* <Tranding posts={returnedData.restPost}  /> */}


            </ScrollView>
        </SafeAreaView >
    )
}

export default SinglePostPage