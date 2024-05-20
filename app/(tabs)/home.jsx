import { View, Text, Image, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { useGlobalContext } from "../../context/ContextProvider"
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants"
import SearchInput from '../../components/SearchInput'
import Tranding from '../../components/Tranding'
import EmptyState from '../../components/Empty'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/ContextProvider'
import * as Animatable from 'react-native-animatable';

const Home = () => {

  const { user, theme, allPost, setAllPost, allLetestPost, setAllLetestPost } = useGlobalContext()

  const { data: posts, refetch, isLoading } = useAppwrite(getAllPosts)
  const { data: latestPosts, refetch: refetch2 } = useAppwrite(getLatestPosts)

  
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)

    // // // re call new videos ------>
    await refetch();
    await refetch2();

    setRefreshing(false)
  }


  // console.log(JSON.stringify(allPost[0], null, 4))


  // // // // These two var is very imp. if we remove this then when ever our data got change by user action then our state var also get fetched/updated by old data ---------->

  let firstTimeAllPost = true;
  let firstTimeLatestPost = true;


  // // // Set all post data ---------->>
  useEffect(() => {
    if (firstTimeAllPost || posts.length > 0) {
      setAllPost(posts)
      firstTimeAllPost = false
    }
  }, [posts])


  // // // Set lastest post data ---------->>
  useEffect(() => {
    if (firstTimeLatestPost || latestPosts.length > 0) {
      setAllLetestPost(latestPosts)
      firstTimeLatestPost = false
    }
  }, [latestPosts])




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

      {/* Loading text here --------> */}

      {
        isLoading
        &&
        <Animatable.View
          className=" w-full items-center absolute top-20 z-10 "
          animation='fadeIn'
          duration={700}
          iterationCount="infinite"
          direction='alternate'
        >

          <View className={` relative overflow-hidden rounded-2xl justify-center items-center bg-white border border-double border-rose-200 shadow-lg shadow-rose-400 px-2 py-1`}>
            <Text className=" relative font-semibold">
              Getting posts data...
            </Text>
          </View>

        </Animatable.View>
      }



      <FlatList

        // data={[{ id: 1 }, { id: 2 }, { id: 2 }, { id: 4 }]}
        // data={[]}
        data={allPost}
        keyExtractor={(item) => item.$id}

        // // // Here all data get render ---------->>
        renderItem={({ item }) => {
          return <VideoCard
            item={item}
            allData={allPost}
          />
        }}

        // // // This code will used as header of flatList ----->>
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
                posts={allLetestPost}
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