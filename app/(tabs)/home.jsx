import { View, Text, Image, FlatList, RefreshControl } from 'react-native'
import React, {  useState } from 'react'
import { useGlobalContext } from "../../context/ContextProvider"
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants"
import SearchInput from '../../components/SearchInput'
import Tranding from '../../components/Tranding'
import EmptyState from '../../components/Empty'
import { getAllPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'

const Home = () => {

  const { user } = useGlobalContext()

  const { data: posts, isLoading, refetch } = useAppwrite(getAllPosts)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)

    // // // re call new videos ------>
    await refetch();

    setRefreshing(false)
  }


  return (

    <SafeAreaView
      className=' bg-primary h-[200vh]'
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
                  <Text className="font-pmedium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="text-xl font-psemibold text-white">
                    JSMastery
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

                <Text className="text-gray-100 text-lg font-pregular mb-3">
                  Lestest Videos
                </Text>

                <Tranding
                  // posts={[{ id: 1 }, { id: 2 }, { id: 3 }]} 
                  posts={posts}
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