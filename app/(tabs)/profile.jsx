import { View, FlatList, TouchableOpacity, Image, Text, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
// import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/Empty'
import { SignOut, getUserPosts, updateUserData, uploadProfileImg } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
// import { useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../../context/ContextProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker'
import * as Animatable from 'react-native-animatable';
import { zoomIn, zoomOut } from '../../components/Tranding'
import ModalComponent from '../../components/Modal'



const LoggedInUserProfile = () => {


    const {
        user,
        setUser,
        setIsLoggedIn,
        theme,
        setTheme,
        updateUser,
        setModalVisible,
        setModalContent,
        fetchCurrentUserData
    } = useGlobalContext()

    const { data: posts, refetch } = useAppwrite(() => getUserPosts(user?.$id))


    // // // form of profilePic going to contain a object that have a key name called uri. That uri will hold path or url of profile picture.
    const [form, setForm] = useState({
        profilePic: null
    })


    const [uploading, setUploading] = useState(false)


    // // Logout Handler fn here -------------->
    const logOut = async () => {

        await SignOut();
        setUser(null)
        setIsLoggedIn(false)

        router.replace('/sign-in')
    }


    const openPicker = async (selectType) => {
        const result = await DocumentPicker.getDocumentAsync({
            type:
                selectType === "image"
                    ? ["image/png", "image/jpg"]
                    : ["video/mp4", "video/gif"],
        });

        if (!result.canceled) {
            if (selectType === "image") {
                setForm({
                    ...form,
                    profilePic: result.assets[0],
                });
            }

            if (selectType === "video") {
                setForm({
                    ...form,
                    video: result.assets[0],
                });
            }
        } else {
            setTimeout(() => {
                Alert.alert("Document picked", JSON.stringify(result, null, 2));
            }, 100);
        }
    };



    const uploadNewProfileImgHandler = async () => {

        if (!form.profilePic) {
            return Alert.alert('Please give new image.')
        }

        if (!user?.$id) return Alert.alert('User id not getting for some reason.Refresh application.')

        if (uploading) return

        setUploading(true)

        try {

            let result = await uploadProfileImg(form, user)

            // if (!updatingPostData.mode) {
            //     result = await createVideoPost({ ...form, userId: user.$id })
            // } else {
            //     result = await updatePostData(form, updatingPostAllData)
            // }


            // console.log(result)


            if (result) {
                await updateUser(result, "profilePic")
            }


        } catch (error) {
            Alert.alert("Error", error?.message)
        }
        finally {
            setForm({ profilePic: null })
            setUploading(false)
        }


    }


    // // // Show modal handler hare ----------->
    const ShowModalhandler = () => {

        let MODAL_CONTENT = <View
            className=" flex justify-center items-center"
        >
            <View
                className=" h-[30vh] w-[30vh] relative  border p-0.5 border-secondary rounded-lg flex justify-center items-center bg-secondary"
            >

                <Image
                    resizeMode="contain"
                    source={{ uri: `${form?.profilePic?.uri || user?.avatar}` }}
                    className=" w-full h-full rounded-lg "
                />

                {/* <Text>{user.username}</Text> */}

            </View>

            {/* <Text className="text-black text-center">Okay</Text> */}

        </View>

        setModalContent(MODAL_CONTENT)
        setModalVisible(true)

    }



    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = async () => {
        setRefreshing(true)

        // // // re call new videos ------>
        await refetch();
        await fetchCurrentUserData();

        setRefreshing(false)
    }



    useEffect(() => {

        if (user?.$id && user?.avatar) {
            setForm({ profilePic: { uri: user.avatar } })
        }

    }, [user])


    // console.log(JSON.stringify(user, null, 4))


    return (

        <SafeAreaView
            className={`h-full ${!theme ? "bg-primary " : " bg-gray-100"}`}
        >

            <ModalComponent />

            <FlatList

                // data={[{ id: 1 }, { id: 2 }, { id: 2 }, { id: 4 }]}
                // data={[]}
                data={posts}
                keyExtractor={(item) => item?.$id}

                renderItem={({ item }) => {
                    return <VideoCard item={item} />
                }}

                ListHeaderComponent={() => {
                    return <View className="w-full justify-center items-center mt-6 mb-12 px-4">

                        <View className='w-full mb-10 mt-0 flex-row items-center flex-1 '>

                            <TouchableOpacity
                                className=" items-end mr-auto "
                                onPress={() => { setTheme(pre => !pre) }}
                            >
                                <Text className={` border px-2 rounded-full ${!theme ? " text-white border-white" : " border-black text-black"}`}>
                                    {!theme ? "Light" : "Dark"}
                                </Text>
                            </TouchableOpacity>




                            <TouchableOpacity
                                className="flex-row justify-end items-end "
                                onPress={logOut}
                            >
                                <Text className={` text-lg mr-1 ${!theme ? " text-red-400" : " text-red-500"}`}>LogOut</Text>
                                <Image
                                    source={icons.logout}
                                    resizeMode='contain'
                                    className="w-6 h-6"
                                />

                            </TouchableOpacity>

                        </View>


                        <TouchableOpacity
                            onPress={() => ShowModalhandler()}
                        >

                            <View
                                className=" relative w-20 h-20 border p-1 border-secondary rounded-lg justify-center items-center"
                            >

                                <Image
                                    resizeMode="contain"
                                    source={{ uri: form?.profilePic?.uri }}
                                    className="w-full h-full rounded-lg"
                                />



                                {/* Cancel upload btn */}
                                {
                                    user?.avatar !== form?.profilePic?.uri
                                    &&
                                    <TouchableOpacity
                                        className="absolute z-10 top-[5%] left-[75%]"
                                        onPress={() => {
                                            setForm({ profilePic: { uri: user?.avatar } })
                                        }}
                                    >
                                        <Text className="text-red-300 border border-red-300 rounded px-2 text-xl  ">X</Text>
                                    </TouchableOpacity>
                                }


                                {/*  upload btn */}
                                {
                                    user?.avatar === form?.profilePic?.uri
                                    &&
                                    <TouchableOpacity
                                        onPress={() => openPicker("image")}
                                        className="absolute z-10 top-[75%] left-[75%]"
                                    >
                                        <Image
                                            source={icons.upload}
                                            // source={{ uri: form.profilePic.uri }}
                                            // source={{ uri: form.thumbnail }}
                                            resizeMode="contain"
                                            className="w-8 h-8 rounded-xl"
                                        />
                                    </TouchableOpacity>
                                }

                            </View>

                        </TouchableOpacity>



                        {
                            user?.avatar !== form?.profilePic?.uri
                            &&
                            <TouchableOpacity
                                className=" my-2 relative w-20 h-7 border p-1 border-green-500 rounded-lg justify-center items-center"
                                onPress={() => uploadNewProfileImgHandler()}
                            >

                                <Text className=" text-green-500 capitalize font-bold">
                                    Upload
                                </Text>

                            </TouchableOpacity>
                        }



                        <InfoBox
                            title={user?.username}
                            subtite=""
                            containerStyle={"mt-5"}
                            titleStyle="text-lg"
                        />

                        <InfoBox
                            title={user?.email}
                            subtite=""
                            containerStyle={" -mt-4"}
                            titleStyle="text-xs"
                        />

                        <View className="mt-5 flex-row ">

                            <InfoBox
                                title={posts?.length || 0}
                                subtite="Posts"
                                containerStyle={"mr-5"}
                                titleStyle="text-xl"
                            />

                            <InfoBox
                                title={user?.followers?.length}
                                subtite="Followers"
                                titleStyle="text-lg"
                            />

                        </View>


                        {/* Show all profile images here ------> */}
                        <AllProfilePhoto />

                    </View>
                }}

                ListEmptyComponent={() => <EmptyState title="No Video Found" subtite={`Seem like you have't share any video.`} />}

                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}

            />

        </SafeAreaView>
    )
}

export default LoggedInUserProfile


const AllProfilePhoto = () => {


    const { user } = useGlobalContext()

    const [activeItem, setActiveItem] = useState('');


    const ViewableItemsChanges = ({ viewableItems }) => {
        if (viewableItems.length > 0) {

            // console.log(viewableItems[0].item)

            setActiveItem(viewableItems[0].item)
        }

    }

    return (

        <>

            <Text className=" text-white font-psemibold  mt-7">Your all uploaded images.</Text>

            <FlatList
                // data={[{ id: 1 }, { id: 2 }, { id: 2 }, { id: 4 }]}
                // data={[]}
                data={user?.allProfilePic || []}
                // data={post}
                keyExtractor={(item, index) => index}

                // // // Here all data get render ---------->>
                renderItem={({ item }) => {
                    return <SinglePhotoCard
                        item={item}
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
            />

        </>


    )
}


const SinglePhotoCard = ({ item, activeItem }) => {

    const { user, updateUser } = useGlobalContext()

    const [uploading, setUploading] = useState(false)



    const makeThisProfilePicHandler = async (newUrl) => {

        if (uploading) return

        setUploading(true)

        try {

            let result = await updateUserData({ avatar: newUrl }, user)

            if (result) {
                // await updateUser(result, "profilePic")
                await updateUser(result)
            }

        } catch (error) {
            Alert.alert("Error", error?.message)
        }
        finally {
            setUploading(false)
        }
    }


    return (

        <Animatable.View
            animation={activeItem === item ? zoomIn : zoomOut}
            duration={700}
        >

            <View className=" relative w-48 h-48 border p-1 border-secondary rounded-lg justify-center items-center">
                <Image
                    resizeMode="contain"
                    source={{ uri: item }}
                    className="w-full h-full rounded-lg"
                />

            </View>


            {
                user?.avatar !== item
                &&
                <TouchableOpacity
                    className=" border border-green-500 rounded-full my-2 mx-auto px-2  "
                    onPress={() => makeThisProfilePicHandler(item)}
                >
                    <Text className=" text-xs text-green-500">Make Profile</Text>
                </TouchableOpacity>
            }





        </Animatable.View>

    )

}
