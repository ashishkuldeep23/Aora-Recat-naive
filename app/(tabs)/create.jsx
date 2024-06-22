import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CInput from '../../components/CInput'
import { ResizeMode, Video } from 'expo-av'
import { icons } from '../../constants'
import CBotton from '../../components/CBotton'
import * as DocumentPicker from 'expo-document-picker'
import { router } from 'expo-router'
import { createVideoPost, updatePostData } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/ContextProvider'
import CLoading from '../../components/CLoading'
import { useSwipe } from '../../lib/swipe'



const Create = () => {

  const { user, theme, updatingPostData, setUpdatingPostData, updateAllData } = useGlobalContext()
  const initialValue = {
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  }

  const [form, setForm] = useState(initialValue)


  const [updatingPostAllData, setUpdateingPostAllData] = useState(null)


  const [uploading, setUploading] = useState(false)

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {

    if (!form.title || !form.video) {
      return Alert.alert('Please fill in all the fields.')
    }

    if (!user.$id) return Alert.alert('User id not getting for some reason.')

    setUploading(true)

    try {

      let result;

      if (!updatingPostData.mode) {
        result = await createVideoPost({ ...form, userId: user.$id })
      } else {
        result = await updatePostData(form, updatingPostAllData)
      }


      // console.log(result)


      if (updatePostData.mode) {
        // // Upadte list of post in state ------>
        updateAllData(result)

        // // set updating to initial data ------>
        setUpdatingPostData({ mode: false, postData: null })
      }


      Alert.alert("Sucess", `Video ${updatingPostData.mode ? "updated" : "uploaded"}.`)
      router.push("/home")

    } catch (error) {
      Alert.alert("Error", error?.message)
    }
    finally {
      setForm(initialValue)
      setUploading(false)
    }


  }


  // // // Update video code here ------>
  useEffect(() => {

    if (updatingPostData.mode) {
      // // // set data into form ----->
      setForm({
        title: updatingPostData.postData.title,
        video: { uri: updatingPostData.postData.video },
        thumbnail: { uri: updatingPostData.postData.thumbnail },
        prompt: updatingPostData.postData.prompt,
      })

      // // // set updating data item -------->

      setUpdateingPostAllData(updatingPostData.postData)


    }

  }, [updatingPostData])



  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 1)


  function onSwipeLeft() {
    // console.log('SWIPE_LEFT')
    router.push("/bell")

  }

  function onSwipeRight() {
    // console.log('SWIPE_RIGHT')
    router.push("/bookmark")

  }




  // // // If user data is not getting by any reason then prevent to create new video.
  if (!user.$id) {
    return (
      <SafeAreaView className={` relative h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}>
        <Text className={`${!theme ? " text-white" : " text-black"} text-4xl my-10 mx-5`}>Refesh the application because not getting user data for now.</Text>
      </SafeAreaView>
    )
  }

  return (

    <SafeAreaView
      className={` relative h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >

      <ScrollView
        className='px-4 my-6'
      >

        {/* Universal loader heer ------------> */}
        <CLoading isLoading={uploading} />


        <Text className={`text-2xl font-psemibold ${!theme ? "text-white" : " text-black"} `}>
          {!updatingPostData.mode ? "Upload" : "Update"} Video
        </Text>


        {/* Show user info to insure user data is comming */}
        <View
          className="flex-1 justify-center items-center flex-row my-4"
        >

          <View className="w-[46px] h-[46px] rounded-lg justify-center items-center p-0.5 border border-secondary">

            <Image
              source={{ uri: user?.avatar }}
              className="w-full h-full rounded-md "
              resizeMode='contain'
            />

          </View>

          <View
            className='flex-1 justify-center ml-3 gap-y-1'
          >
            <Text
              className={` font-psemibold text-sm ${!theme ? "text-white" : "text-black"}`}
              numberOfLines={1}
            >{user?.username}</Text>

            <Text
              className={`text-xs font-pregular ${!theme ? "text-white" : "text-black"} `}
              numberOfLines={1}
            >Create new post by filling below form.</Text>

          </View>
        </View>


        <CInput
          title={'Video Title'}
          value={form.title}
          onChangeHander={(e) => setForm({ ...form, title: e })}
          placeholder={"Give your video a catchy title..."}
          otherStyles={'mt-10'}
        />


        <View className="mt-7 ">
          <Text className={`text-base font-pmedium ml-2 ${!theme ? "text-gray-100" : "text-gray-900"}`}>Upload Video</Text>

          <TouchableOpacity
            onPress={() => openPicker("video")}
          >
            {
              form.video
                ?
                <Video
                  source={{ uri: form.video.uri }}
                  className="w-full h-64 rounded-2xl"
                  resizeMode={ResizeMode.COVER}
                // useNativeControls
                // isLooping
                />

                :
                <View className={`w-full h-40  px-4 rounded-2xl justify-center items-center border-2 border-black-100 ${!theme ? "bg-black-100" : "bg-gray-100"} `}>
                  <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-1/2 h-1/2"
                    />
                  </View>
                </View>
            }
          </TouchableOpacity>
          <Text className={`ml-5 text-xs font-pregular ${!theme ? "text-white" : "text-black"} `}>Video should less then <Text className='font-psemibold'>10 MB</Text></Text>

        </View>


        <View className="mt-7 ">
          <Text className={`text-base font-pmedium ml-2 ${!theme ? "text-gray-100" : "text-gray-900"}`}>Thumbnail Image</Text>

          <TouchableOpacity
            onPress={() => openPicker("image")}
          >
            {
              form.thumbnail
                ?
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  // source={{ uri: form.thumbnail }}
                  resizeMode="contain"
                  className="w-full h-64 rounded-2xl"
                />

                :
                <View className={`w-full h-16  px-4 rounded-2xl justify-center items-center border-2 border-black-100 flex-row space-x-2 ${!theme ? "bg-black-100" : "bg-gray-100"}`}>
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-5 h-5"
                  />
                  <Text className={`text-sm font-psemibold ${!theme ? "text-gray-100" : "text-gray-900"}`}>Choose a file</Text>
                </View>
            }
          </TouchableOpacity>
          <Text className={`ml-5 text-xs font-pregular ${!theme ? "text-white" : "text-black"} `}>Image should less then <Text className='font-psemibold'>1 MB</Text></Text>

        </View>


        <CInput
          title={'*About Post'}
          value={form.prompt}
          onChangeHander={(e) => setForm({ ...form, prompt: e })}
          placeholder={"About your video, originally form etc"}
          otherStyles={'mt-7'}
        />


        <Text className={`text-center mt-1 text-xs font-pregular ${!theme ? "text-white" : "text-black"}`}> <Text className='font-psemibold'>*</Text> marked are <Text className='font-psemibold'>optional</Text></Text>


        <CBotton
          title={!updatingPostData.mode ? "Submit & Publish" : "Update post"}
          handlePress={submit}
          isLoading={uploading}
          containerStyle={"mt-5 bg-secondary"}
        />

      </ScrollView>
    </SafeAreaView >
  )
}

export default Create