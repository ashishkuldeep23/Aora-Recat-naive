import { View, Text, FlatList, RefreshControl, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router, usePathname } from 'expo-router';
import { makeNotiSeen } from '../../lib/appwrite';
import { useSwipe } from '../../lib/swipe';
// import { addFollow, createNewNotification, removeFollow } from '../../lib/appwrite'

const Notification = () => {

    const {
        theme,
        user,
        fetchedNotification,
        allNotifications,
        setAllNotifications
        // createNotification
    } = useGlobalContext()



    const pathname = usePathname()

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


    const callToUpdateSeenValue = async (arrOfNoti) => {

        try {

            let result = await makeNotiSeen(arrOfNoti, user.$id);

            // console.log(result.length)
            // console.log({ result })
            if (result && result.length > 0) {
                setAllNotifications(result)
            }

        } catch (error) {
            Alert.alert("Error", error?.message)
        }

    }


    useEffect(() => {

        if (allNotifications.length > 0) {

            let makeUnSeenArr = allNotifications.filter((ele) => {
                if (!ele.seen) return ele
            })

            if (makeUnSeenArr.length > 0 && pathname === "/bell") {
                // Alert.alert("Now call to seen false.")

                callToUpdateSeenValue(makeUnSeenArr)
            }
        }

    }, [allNotifications])


    const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 1)


    function onSwipeLeft() {
        // console.log('SWIPE_LEFT')
        router.push("/profile")

    }

    function onSwipeRight() {
        // console.log('SWIPE_RIGHT')
        router.push("/create")

    }




    return (

        <SafeAreaView
            className={` relative px-4 h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* <ScrollView className='px-4 my-6'> */}

            <FlatList
                data={allNotifications || []}
                keyExtractor={(item) => item?.$id || ""}

                renderItem={({ item }) => <SingleNotifiaction data={item} />}

                ListHeaderComponent={() => {
                    return <View className="my-6 px-4 ">
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
                    </View>
                }}

                ListEmptyComponent={() => <View className='mt-20 flex justify-center items-center'>
                    <Text className="text-white text-center font-psemibold text-2xl ">
                        No notification found for now for you.
                    </Text>
                    <Link
                        href={'/home'}
                        className='text-white font-pregular border px-2 border-white rounded-md'
                    >Home</Link>
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

export default Notification


const SingleNotifiaction = ({ data }) => {

    // console.log(JSON.stringify(data, null, 4)).

    // console.log(data)


    const { theme } = useGlobalContext()



    const goToUser = () => {
        router.push(`/user/${data?.whoSended.$id}`)
    }


    const goToPost = () => {
        router.push(`/post/${data?.typeLikeInfo.$id}`)
    }



    return (
        <View className={`flex flex-row gap-2 items-center my-1 rounded ${!data.seen && " bg-emerald-800/80"}`}>

            <TouchableOpacity
                onPress={goToUser}
                className='w-[73%] '
            >

                <View
                    className="w-full flex flex-row items-center gap-0.5"
                >

                    <View className=" rounded-full w-8 h-8 mr-2  p-0.5 overflow-hidden">

                        <Image
                            source={{ uri: data?.whoSended?.avatar }}
                            className="h-full w-full "
                            resizeMode='contain'
                        />
                    </View>


                    <Text className={`${!theme ? "text-white " : "text-black "}font-semibold`}>{data?.whoSended?.username}</Text>

                    <View>

                        {
                            data?.type === "Like"
                                ? <Text className={`${!theme ? "text-white" : " text-black"}`}>liked your video</Text>
                                : data?.type === "Comment"
                                    ? <Text className={`${!theme ? "text-white" : "text-black"}`}>commented on your video</Text>
                                    : <Text className={`${!theme ? "text-white" : "text-black"}`}>started following you</Text>
                        }
                    </View>

                </View>


            </TouchableOpacity>

            <View
                className=' flex flex-row justify-end w-[20%] ml-auto'
            >
                {
                    (data?.type === "Like")
                        ?
                        // // // Post (Video thmnail pic here) details
                        <TouchableOpacity
                            className={`border rounded ${!theme ? "border-white " : " border-black"} `}
                            onPress={goToPost}
                        >

                            <Image source={{ uri: data?.typeLikeInfo?.thumbnail }}
                                className="w-8 h-8 rounded-md border border-secondary-200 p-0.5 "
                                resizeMode='contain'
                            />

                        </TouchableOpacity>
                        :

                        (data?.type === "Comment")
                            ?
                            // // // Post (Video thmnail pic here) details
                            <TouchableOpacity
                                className={`border rounded ${!theme ? "border-white " : " border-black"} `}
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
                                <Text
                                    className={`border rounded p-0.5 px-2  text-sm font-semibold ${!theme ? "text-white border-white " : " text-black border-black"}`}
                                >Profile</Text>

                            </TouchableOpacity>
                }

            </View>

        </View>
    )
}

