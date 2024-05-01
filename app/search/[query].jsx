import { View, Text,  FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/Empty'
import { searchPostByQuery } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

const SearchPage = () => {

  // const { user } = useGlobalContext()

  const { query } = useLocalSearchParams()

  const { data: posts, refetch } = useAppwrite(() => searchPostByQuery(query))

  useEffect(() => {
    refetch()
  }, [query])


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
          return <View className="my-6 px-4 ">
            {/* <View className="items-center justify-center"> */}
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-xl font-psemibold text-white">
              {query}
            </Text>
            {/* </View> */}

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>

          </View>
        }}

        ListEmptyComponent={() => <EmptyState title="No Video Found" subtite={`No video found for your query(${query})`} />}

      />

    </SafeAreaView>
  )
}

export default SearchPage