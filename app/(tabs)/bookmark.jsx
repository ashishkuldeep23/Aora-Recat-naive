import { View, Text, Alert, FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../context/ContextProvider'
import { getAllSavedPost } from '../../lib/appwrite'
import VideoCard from '../../components/VideoCard'
import CLoading from '../../components/CLoading'
import EmptyState from '../../components/Empty'
import useAppwrite from '../../lib/useAppwrite'
import { Link, router } from 'expo-router'
import { useSwipe } from '../../lib/swipe'

const Bookmark = () => {

  const { theme, user, allSavedPost, setAllSavedPost } = useGlobalContext()

  const { data: savedPosts, isLoading, refetch } = useAppwrite(() => getAllSavedPost(user?.$id))



  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)

    // // // re call new videos ------>
    await refetch();

    setRefreshing(false)
  }


  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 1)


  function onSwipeLeft() {
    // console.log('SWIPE_LEFT')
    router.push("/create")

  }

  function onSwipeRight() {
    // console.log('SWIPE_RIGHT')
    router.push("/home")

  }




  let firstTimeAllSavedPost = true;

  useEffect(() => {
    if (firstTimeAllSavedPost || savedPosts.length > 0) {
      setAllSavedPost(savedPosts)
      firstTimeAllSavedPost = false
    }

  }, [savedPosts])


  return (

    <SafeAreaView
      className={` relative h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >

      <CLoading isLoading={isLoading} />

      <FlatList
        data={allSavedPost}
        keyExtractor={(item) => item?.$id}

        renderItem={({ item }) => {
          return <VideoCard item={item} pageName="bookmark" />
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
          <Text className={` ${theme ? " text-black" : " text-white"} text-center font-pbold text-4xl `}>
            No saved post found.
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

    </SafeAreaView>
  )
}

export default Bookmark