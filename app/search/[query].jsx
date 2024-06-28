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
import { useGlobalContext } from '../../context/ContextProvider'

const SearchPage = () => {

  const { theme } = useGlobalContext()

  const { query } = useLocalSearchParams()

  const { data, refetch } = useAppwrite(() => searchPostByQuery(query))

  const posts = data.posts
  const users = data.users


  useEffect(() => {
    refetch()
  }, [query])


  return (

    <SafeAreaView
      className={` h-full ${!theme ? " bg-black-100" : " bg-gray-100"}`}
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
          return <View className={`my-6 px-4 `}>
            {/* <View className="items-center justify-center"> */}
            <Text className={`font-pmedium text-sm ${!theme ? " text-gray-100" : " text-black-100"}`}>
              Searching...
            </Text>
            <Text className={`text-xl font-psemibold text-white ${!theme ? " text-gray-100" : " text-black-100"}`}>
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
                      <Text className={`text-2xl text-center font-psemibold ${!theme ? " text-gray-100" : " text-black-100"}`}>
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

                      className={`flex flex-row items-center gap-2 border px-2 rounded-md py-1 ${!theme ? " border-gray-100" : " border-black-100"}`}
                    >

                      <Image
                        source={{ uri: item.avatar }}
                        resizeMode='contain'
                        className={"w-9 h-9 rounded"}
                      />

                      <View>

                        <Text className={` font-psemibold -my-1 ${!theme ? " text-gray-100" : " text-black-100"}`}>{item.username}</Text>
                        <Text className={` ${!theme ? " text-gray-100" : " text-black-100"}`}>({item.email})</Text>
                      </View>

                    </TouchableOpacity>
                  </View>
                )
              }}


              ListEmptyComponent={() => <View>

                <Text className={` text-center text-xl font-psemibold ${!theme ? " text-gray-100" : " text-black-100"}`}>No User Found with ({query}) </Text>
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