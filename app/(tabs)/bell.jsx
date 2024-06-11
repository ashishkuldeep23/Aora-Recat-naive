import { View, Text, FlatList, RefreshControl, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
// import { addFollow, createNewNotification, removeFollow } from '../../lib/appwrite'

const Notification = () => {

    const {
        theme,
        user,
        fetchedNotification,
        allNotifications,
        // createNotification
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


    return (

        <SafeAreaView className={` relative px-4 h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}>
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


    // const { } = useGlobalContext()



    const goToUser = () => {

        router.push(`/user/${data?.whoSended.$id}`)

    }


    const goToPost = () => {
        router.push(`/post/${data?.typeLikeInfo.$id}`)
    }



    return (
        <View className='flex flex-row gap-2 items-center my-1'>

            <TouchableOpacity
                onPress={goToUser}
                className='w-[73%] '
            >

                <View
                    className=" w-full flex flex-row items-center gap-0.5"
                >


                    <Image
                        source={{ uri: data?.whoSended?.avatar }}
                        className="w-8 h-8 rounded-full mr-2  "
                        resizeMode='contain'
                    />


                    <Text className="text-gray-100 font-semibold" >{data?.whoSended?.username}</Text>

                    <View>

                        {
                            data?.type === "Like"
                                ? <Text className="text-gray-100">liked your video</Text>
                                : <Text className="text-gray-100">started following you</Text>
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
                            <Text
                                className=" border rounded border-white p-0.5 px-2 text-white  text-sm font-semibold"
                            >Profile</Text>

                        </TouchableOpacity>
                }

            </View>



        </View>
    )
}

