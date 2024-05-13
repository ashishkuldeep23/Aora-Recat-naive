import { View, Text, Alert, FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../context/ContextProvider'
import { getAllSavedPost } from '../../lib/appwrite'
import VideoCard from '../../components/VideoCard'
import CLoading from '../../components/CLoading'
import EmptyState from '../../components/Empty'
import useAppwrite from '../../lib/useAppwrite'
import { Link } from 'expo-router'

const Bookmark = () => {

  const { theme, user, allSavedPost, setAllSavedPost } = useGlobalContext()

  const { data: savedPosts, isLoading, refetch } = useAppwrite(() => getAllSavedPost(user.$id))



  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)

    // // // re call new videos ------>
    await refetch();

    setRefreshing(false)
  }




  let firstTimeAllSavedPost = true;

  useEffect(() => {
    if (firstTimeAllSavedPost || savedPosts.length > 0) {
      setAllSavedPost(savedPosts)
      firstTimeAllSavedPost = false
    }

  }, [savedPosts])


  return (

    <SafeAreaView className={` relative h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}>

      <CLoading isLoading={isLoading} />

      <FlatList
        data={allSavedPost}
        keyExtractor={(item) => item.$id}

        renderItem={({ item }) => {
          return <VideoCard item={item} />
        }}

        ListHeaderComponent={() => {
          return <View className="my-6 px-4 ">
            {/* <View className="items-center justify-center"> */}
            <Text className="font-pmedium text-2xl text-gray-100">
              Your saved posts
            </Text>

          </View>
        }}

        ListEmptyComponent={() => <View className='mt-20 flex justify-center items-center'>
          <Text className="text-white text-center font-pbold text-4xl ">
            No saved post found
          </Text>
          <Link className='text-white font-pregular border px-2 border-white rounded-md' href={'/home'}>Home</Link>
        </View>}

        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />}

      />

    </SafeAreaView>
  )
}

export default Bookmark