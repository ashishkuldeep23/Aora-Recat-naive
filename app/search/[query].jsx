import { View, Text, FlatList, Image } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/Empty'
import { searchPostByQuery } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { router, useLocalSearchParams } from 'expo-router'
import { TouchableOpacity } from 'react-native'

const SearchPage = () => {

  // const { user } = useGlobalContext()

  const { query } = useLocalSearchParams()

  const { data, refetch } = useAppwrite(() => searchPostByQuery(query))

  const posts = data.posts
  const users = data.users


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
        keyExtractor={(item) => item?.$id}

        renderItem={({ item }) => {
          return <VideoCard item={item} pageName="query/id" />
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


        ListFooterComponent={() => {
          return <View className=" my-10">

            {/* <Text className="text-white text-xl">
              {JSON.stringify(users)}
            </Text> */}


            <FlatList
              data={users}
              keyExtractor={(item) => item?.$id}
              ListHeaderComponent={() => {
                return (
                  <View>

                    {
                      users && users?.length > 0
                      &&
                      <Text className="text-2xl text-gray-100 text-center">
                        All Users are :
                      </Text>
                    }
                  </View>
                )
              }}

              renderItem={({ item }) => {
                return (
                  <View className=' flex mt-5 items-center'>

                    <TouchableOpacity
                      onPress={() => router.push(`/user/${item.$id}`)}

                      className=' flex flex-row items-center gap-2 border border-white  px-2 rounded-md py-1'
                    >

                      <Image
                        source={{ uri: item.avatar }}
                        resizeMode='contain'
                        className={"w-9 h-9 rounded"}
                      />

                      <View>

                        <Text className=" text-white font-psemibold -my-1">{item.username}</Text>
                        <Text className=" text-white">({item.email})</Text>
                      </View>

                    </TouchableOpacity>
                  </View>
                )
              }}


              ListEmptyComponent={() => <View>

                <Text className=' text-center text-gray-100 text-xl font-psemibold'>No User Found </Text>
                <Text className='text-center text-gray-100 text-base font-pregular'>No video found for your query({query})</Text>
              </View>}

            />


          </View>
        }}


        ListEmptyComponent={() => <EmptyState title="No Video Found" subtite={`No video found for your query(${query})`} />}

      />

    </SafeAreaView>
  )
}

export default SearchPage