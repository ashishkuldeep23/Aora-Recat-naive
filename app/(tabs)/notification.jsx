import { View, Text, ScrollView, FlatList, RefreshControl, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { useGlobalContext } from '../../context/ContextProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { addFollow, createNewNotification, removeFollow } from '../../lib/appwrite'
import { Link, router } from 'expo-router'

const notification = () => {

    const {
        theme,
        user,
        fetchedNotification,
        allNotifications,
        createNotification
    } = useGlobalContext()



    // console.log(allNotifications)


    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = async () => {
        setRefreshing(true)

        // // // re call new videos ------>
        // await refetch();
        await fetchedNotification(user.$id)

        // // // Do something for refetch all notificaton
        setRefreshing(false)
    }



    // const createNotificationForTesting = async () => {
    //     // console.log("Clicked --------------->")
    //     let bakeDataObj = {
    //         whoSended: user.$id,
    //         notificationFor: user.$id,
    //         type: "Like",
    //         typeFollowingInfo: '',
    //         typeLikeInfo: '6656021d6e325ca22b7c',
    //     }
    //     // console.log(bakeDataObj)
    //     await createNotification(
    //         bakeDataObj.whoSended,
    //         bakeDataObj.type,
    //         bakeDataObj.typeLikeInfo,
    //         bakeDataObj.typeFollowingInfo,
    //         bakeDataObj.notificationFor
    //     )
    // }




    return (

        <SafeAreaView className={` relative px-4 h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}>
            {/* <ScrollView className='px-4 my-6'> */}

            <FlatList
                data={allNotifications}
                keyExtractor={(item, i) => item?.$id || i}

                ListHeaderComponent={() => {
                    return <View className="my-6 px-4 ">
                        {/* <View className="items-center justify-center"> */}
                        <Text
                            className="font-pmedium text-2xl text-gray-100"
                        >
                            Notifications
                        </Text>

                        <TouchableOpacity
                            onPress={onRefresh}
                        >
                            <Text
                                className="font-pmedium text-sm text-gray-100"
                            >Refresh the page.</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                            onPress={createNotificationForTesting}
                        >
                            <Text
                                className="font-pmedium text-sm text-gray-100 rounded-full bg-green-500 px-4"
                            >Create notification</Text>
                        </TouchableOpacity> */}

                    </View>
                }}


                renderItem={({ item }) => {
                    return <SingleNotifiaction data={item} />
                }}


                ListEmptyComponent={() => <View className='mt-20 flex justify-center items-center'>
                    <Text className="text-white text-center font-pbold text-2xl ">
                        No notification found for now for you.
                    </Text>
                    <Link className='text-white font-pregular border px-2 border-white rounded-md' href={'/home'}>Home</Link>
                </View>}

                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}
            />


            {/* </ScrollView> */}
        </SafeAreaView>
    )
}

export default notification



const SingleNotifiaction = ({ data }) => {

    // console.log(JSON.stringify(data, null, 4)).

    // console.log(data)


    const {
        theme,
        user,
        upadateFollowList

    } = useGlobalContext()



    const goToUser = () => {

        router.push(`/user/${data.whoSended.$id}`)

    }


    const goToPost = () => {
        router.push(`/post/${data.typeLikeInfo.$id}`)
    }


    // const followAndFollowingHandler = async () => {

    //     if (!user || !user.following) return Alert.alert("Please refresh your profile tab, your data is not loaded till now.")

    //     if (!user.$id || !data.whoSended.$id) return Alert.alert("Mandatory accounts not give. Please wait or reload app.")

    //     let result;

    //     if (user?.following?.includes(data?.whoSended?.$id)) {

    //         result = await addFollow(user.$id, data?.whoSended?.$id)

    //         // result = await addFollow(data?.whoSended?.$id, user.$id)
    //     }
    //     else {

    //         result = await removeFollow(user.$id, data?.whoSended?.$id)

    //         // result = await removeFollow(data?.whoSended?.$id, user.$id)
    //         // // Call here UnFollowing --------->
    //     }


    //     console.log(JSON.stringify(result, null, 4))


    //     if (result) {

    //         // // // Now upadte state ------>

    //         upadateFollowList(result.byUser, result.toUser)

    //     }


    // }



    return (
        <>
            {/* <Text className=' text-white'>Single notification</Text> */}


            <View className='flex flex-row gap-2 items-center my-1'>

                <TouchableOpacity
                    onPress={goToUser}
                    className='w-[73%] '
                >

                    <View className=" w-full flex flex-row items-center gap-0.5">


                        <Image source={{ uri: data?.whoSended?.avatar }}
                            className="w-8 h-8 rounded-full mr-2  "
                            resizeMode='contain'
                        />


                        <Text className="text-gray-100 font-semibold" >{data?.whoSended?.username}</Text>

                        {
                            data?.type === "Like"
                                ? <Text className="text-gray-100">liked your video</Text>
                                : <Text className="text-gray-100">started following you</Text>
                        }
                    </View>


                </TouchableOpacity>





                <View

                    className=' flex flex-row justify-end w-[20%] ml-auto'
                >
                    {
                        data?.type === "Like"
                            ?
                            // // // Post (Video thmnail pic here) details
                            <TouchableOpacity
                                className=" border border-white rounded "
                                onPress={goToPost}
                            >


                                <Image source={{ uri: data?.typeLikeInfo?.thumbnail }}
                                    className="w-8 h-8 rounded-md border border-secondary-200 p-0.5 "
                                    resizeMode='contain'
                                />

                            </TouchableOpacity>

                            :
                            // // // Here follow and following code present ---------->
                            <TouchableOpacity

                                onPress={goToUser}
                            >

                                {/* 
                                <View
                                    className=" border rounded border-white p-0.5 px-2"
                                >

                                    {

                                        user?.following?.includes(data?.whoSended?.$id)
                                            ?
                                            // // // u r following this user
                                            <Text
                                                className=" font-semibold text-red-500 "
                                            >Unfollow</Text>
                                            :
                                            <Text
                                                className=" text-green-500 font-semibold "
                                            >Follow</Text>
                                    }
                                </View> */}

                                <Text
                                    className=" border rounded border-white p-0.5 px-2 text-white text-[.6rem] font-semibold"
                                >Go To Profile</Text>

                            </TouchableOpacity>
                    }

                </View>



            </View>

        </>
    )
}

