import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '../../context/ContextProvider'

const Bookmark = () => {

  const { theme } = useGlobalContext()

  return (

    <SafeAreaView className={`  h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}>
      <ScrollView className='px-4 my-6'>

        <View>
          <Text>Bookmark</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Bookmark