import { View, Text, Alert, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../context/ContextProvider'
import { getAllSavedPost } from '../../lib/appwrite'
import VideoCard from '../../components/VideoCard'
import CLoading from '../../components/CLoading'
import EmptyState from '../../components/Empty'
import useAppwrite from '../../lib/useAppwrite'

const Bookmark = () => {

  const { theme, user, allSavedPost, setAllSavedPost } = useGlobalContext()

  const { data: savedPosts, isLoading } = useAppwrite(() => getAllSavedPost(user.$id))



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

        ListEmptyComponent={() => <EmptyState title="No Video Found" subtite={`No saved posts found for you.`} />}

      />

    </SafeAreaView>
  )
}

export default Bookmark