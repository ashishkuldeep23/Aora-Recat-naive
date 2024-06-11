

import { View, Text, ScrollView, TouchableOpacity, FlatList, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../../context/ContextProvider'
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import VideoCard from '../../components/VideoCard';
import useAppwrite from '../../lib/useAppwrite';
import { addFollow, getSearchUserData, getUserPosts, removeFollow } from '../../lib/appwrite';
import InfoBox from '../../components/InfoBox';

const UserProfile = () => {


    const {
        theme,
        user,
        upadateFollowList,
        setModalContent,
        setModalVisible
    } = useGlobalContext()



    const { id } = useLocalSearchParams();

    const { data: posts, isLoading, refetch } = useAppwrite(() => getUserPosts(id))

    // const { data: searchUser, isLoading: isLoading2 } = useAppwrite(() => getSearchUserData(id))



    const [searchUser, setSearchUser] = useState(null)

    const [isLoading2, setIsLoading2] = useState(false)

    const [follwingLoad, setFollowingLoad] = useState(false)



    const fetchSearchUserData = async (id) => {

        try {
            setIsLoading2(true)

            // const response = await getAllPosts()
            const response = await getSearchUserData(id)
            // setData(response)

            // console.log(JSON.stringify(response, null, 4))
            // console.log("Remove me -----> ", response)

            setSearchUser(response)

        } catch (error) {
            Alert.alert('Error', error.message)
        }
        finally {
            setIsLoading2(false)
        }

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
                result = await addFollow(user.$id, toUser.$id)
            } else {
                result = await removeFollow(user.$id, toUser.$id)

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


    // // // Show modal handler hare ----------->
    const ShowModalhandler = () => {

        let MODAL_CONTENT = <View
            className=" flex justify-center items-center w-full"
        >
            <View
                className={`h-[50vh] w-full relative  border p-0.5  rounded-lg flex justify-center items-center ${!theme ? " bg-primary" : "bg-gray-100"}`}
            >

                <Image
                    resizeMode="contain"
                    source={{ uri: `${searchUser?.avatar}` }}
                    className=" w-full h-full rounded-lg"
                />

                {/* <Text>{user.username}</Text> */}

            </View>

            {/* <Text className="text-black text-center">Okay</Text> */}

        </View>

        setModalVisible(true)
        setModalContent(MODAL_CONTENT)

    }



    useEffect(() => {


        // console.log(id)


        if (id) {
            fetchSearchUserData(id)
        }

    }, [id])



    useEffect(() => {

        if (searchUser && searchUser?.$id) {
            if (searchUser?.$id === user?.$id) {
                router.push("/profile")
            }
        }

    }, [searchUser])



    // console.log(JSON.stringify(posts))
    // console.log(JSON.stringify(searchUser, null, 4))
    // console.log(id)

    return (

        <SafeAreaView className={`  h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}>

            {/* <ScrollView className='my-6'> */}

            {
                (isLoading || isLoading2)
                &&
                <Animatable.View
                    className=" w-full h-[100vh] items-center absolute top-14 z-[1] "
                    animation='fadeIn'
                    duration={700}
                    iterationCount="infinite"
                    direction='alternate'
                >

                    <View className={` relative overflow-hidden rounded-2xl justify-center items-center bg-white border border-double border-rose-200 shadow-lg shadow-rose-400 px-2 py-1`}>
                        <Text className=" relative font-semibold ">
                            Getting user profile...
                        </Text>
                    </View>

                </Animatable.View>
            }


            <View className=" relative w-full flex justify-center items-center mt-6 mb-10 px-4">


                <TouchableOpacity
                    onPress={() => { router.back() }}
                    className=" absolute left-0 -top-5 "
                >
                    <Text className={`font-pmedium ml-1 ${!theme ? "text-gray-100" : "text-black-100"} py-2 px-1 active:bg-red-800`}>
                        👈Back
                    </Text>

                </TouchableOpacity>



                <TouchableOpacity

                    onPress={ShowModalhandler}
                >

                    <View className="w-20 h-20 border p-1 border-secondary rounded-lg justify-center items-center">
                        <Image
                            resizeMode="contain"
                            source={{ uri: searchUser?.avatar }}
                            className="w-full h-full rounded-lg"
                        />
                    </View>

                </TouchableOpacity>


                <InfoBox
                    title={searchUser?.username}
                    subtite=""
                    containerStyle={"mt-5"}
                    titleStyle="text-lg"
                />

                <InfoBox
                    title={searchUser?.email}
                    subtite=""
                    containerStyle={" -mt-4"}
                    titleStyle="text-xs"
                />

                <View className="mt-5 flex-row ">

                    <InfoBox
                        title={posts.length || 0}
                        subtite="Posts"
                        containerStyle={"mr-5"}
                        titleStyle="text-xl"
                    />

                    <InfoBox
                        title={searchUser?.followers.length}
                        subtite="Followers"
                        titleStyle="text-lg"
                    />

                </View>




                {

                    searchUser
                    &&
                    searchUser.$id
                    &&

                    <View>
                        {
                            (searchUser.$id !== user?.$id)
                                ?
                                <View>



                                    {
                                        follwingLoad

                                            ?
                                            <Text className=" text-xs text-white font-psemibold text-center">
                                                {
                                                    (!user?.following?.includes(searchUser?.$id))
                                                        ? "Following..."
                                                        : "Unfollowing..."
                                                }
                                            </Text>

                                            :
                                            <TouchableOpacity
                                                onPress={() => { followClickHandler(searchUser) }}
                                                disabled={follwingLoad}
                                            >
                                                <Text
                                                    className={`
                                                            font-pmedium text-gray-100 px-2 rounded-full my-1
                                                            ${(!user?.following?.includes(searchUser?.$id))
                                                            ? "bg-blue-600"
                                                            : "bg-red-600"
                                                        }

                                                                    `}
                                                >
                                                    {
                                                        (!user?.following?.includes(searchUser.$id))
                                                            ? "Follow"
                                                            : "Unfollow"

                                                    }
                                                </Text>
                                            </TouchableOpacity>
                                    }

                                    {/* <TouchableOpacity
                                        className="my-2"
                                        onPress={() => { followClickHandler(searchUser) }}
                                    >
                                        <Text
                                            className={`
                                                font-pmedium text-gray-100 px-2 rounded-full my-1
                                                ${(!user?.following?.includes(searchUser?.$id))
                                                    ? "bg-blue-600"
                                                    : "bg-red-600"
                                                }

                                            `}
                                        >
                                            {
                                                (!user?.following?.includes(searchUser.$id))
                                                    ? "Follow"
                                                    : "Unfollow"

                                            }
                                        </Text>
                                    </TouchableOpacity> */}


                                </View>

                                :
                                <Text className=" text-blue-600 border border-blue-600 px-2 rounded-full mt-1 font-psemibold text-xs ">You</Text>

                        }
                    </View>

                }




            </View>


            <FlatList

                horizontal

                data={posts}

                keyExtractor={(item) => item.$id}

                renderItem={({ item }) => {
                    return <VideoCard
                        item={item}
                        width={true}
                    />
                }}

                ListEmptyComponent={() => <View>
                    <Text className="text-2xl text-white text-center">No post found by this user.</Text>
                </View>}

            />


        </SafeAreaView>

    )
}

export default UserProfile

