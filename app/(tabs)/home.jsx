import { View, Text, Image, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { useGlobalContext } from "../../context/ContextProvider"
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants"
import SearchInput from '../../components/SearchInput'
import Tranding from '../../components/Tranding'
import EmptyState from '../../components/Empty'
import { fatch, getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/ContextProvider'

const Home = () => {

  const { user, theme } = useGlobalContext()

  const { data: posts, refetch } = useAppwrite(getAllPosts)

  const { data: latestPosts } = useAppwrite(getLatestPosts)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)

    // // // re call new videos ------>
    await refetch();

    setRefreshing(false)
  }



  // // // //  This is how we can get data in our dedicated server ------->
  // useEffect(() => {
  //   console.log("calling....")
  //   fatch()
  //     .then((res) => {
  //       console.log(res.data[0].feedbackMsg)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }, [])


  return (

    <SafeAreaView
      className={` min-h-[100vh] ${!theme ? "bg-primary " : "bg-gray-100"}`}
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
          return <View className="my-6 px-4 space-y-6">

            <View className="justify-between items-start flex-row mb-6">

              <View className="items-center justify-center">
                <Text className={`font-pmedium text-sm ${!theme ? 'text-gray-100' : "text-gray-800"} `}>
                  Welcome Back
                </Text>
                <Text className={`text-xl font-psemibold   ${!theme ? 'text-white' : "text-black"} `}>
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10 "
                  resizeMode='contain'

                />

              </View>

            </View>

            <SearchInput />

            {/* Tranding videos div here ---------> */}
            <View
              className="w-full flex-1 pt-5 pb-8"
            >

              <Text className={` text-lg font-pregular mb-3 ${!theme ? "text-gray-100" : "text-gray-900"}`}>
                Lestest Videos
              </Text>

              <Tranding
                // posts={[{ id: 1 }, { id: 2 }, { id: 3 }]} 
                posts={latestPosts}
              />

            </View>


          </View>
        }}


        ListEmptyComponent={() => <EmptyState title="No Video Found" subtite="Be the first one to upload a video" />}

        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />}

      />

    </SafeAreaView>

  )
}

export default Home