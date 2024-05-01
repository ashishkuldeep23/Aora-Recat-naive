import { View, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
// import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/Empty'
import { SignOut, getUserPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
// import { useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../../context/ContextProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'

const SearchPage = () => {

    // const { user } = useGlobalContext()

    const { user, setUser, setIsLoggedIn } = useGlobalContext()

    const { data: posts } = useAppwrite(() => getUserPosts(user.$id))

    const logOut = async () => {

        await SignOut();
        setUser(null)
        setIsLoggedIn(false)

        router.replace('/sign-in')
    }


    return (

        <SafeAreaView
            className=' bg-primary h-full'
        >

            <FlatList

                // data={[{ id: 1 }, { id: 2 }, { id: 2 }, { id: 4 }]}
                // data={[]}
                data={posts}
                keyExtractor={(item) => item.$id}

                renderItem={({ item }) => {
                    return <VideoCard item={item} />
                }}

                ListHeaderComponent={() => {
                    return <View className="w-full justify-center items-center mt-6 mb-12 px-4">

                        <TouchableOpacity
                            className="w-full items-end mb-10"
                            onPress={logOut}
                        >
                            <Image
                                source={icons.logout}
                                resizeMode='contain'
                                className="w-6 h-6"
                            />

                        </TouchableOpacity>

                        <View className="w-20 h-20 border p-1 border-secondary rounded-lg justify-center items-center">
                            <Image
                                resizeMode="contain"
                                source={{ uri: user?.avatar }}
                                className="w-full h-full rounded-lg"
                            />
                        </View>

                        <InfoBox
                            title={user?.username}
                            subtite=""
                            containerStyle={"mt-5"}
                            titleStyle="text-lg"
                        />

                        <View className="mt-5 flex-row ">

                            <InfoBox
                                title={posts.length || 0}
                                subtite="Posts"
                                containerStyle={"mr-5"}
                                titleStyle="text-xl"
                            />

                            <InfoBox
                                title={'1.2k'}
                                subtite="Followers"
                                titleStyle="text-lg"
                            />

                        </View>

                    </View>
                }}

                ListEmptyComponent={() => <EmptyState title="No Video Found" subtite={`Seem like you have't share any video.`} />}

            />

        </SafeAreaView>
    )
}

export default SearchPage