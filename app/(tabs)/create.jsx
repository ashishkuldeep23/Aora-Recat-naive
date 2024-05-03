import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CInput from '../../components/CInput'
import { ResizeMode, Video } from 'expo-av'
import { icons } from '../../constants'
import CBotton from '../../components/CBotton'
import * as DocumentPicker from 'expo-document-picker'
import { router } from 'expo-router'
import { createVideoPost } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/ContextProvider'
import { gifs } from "../../constants"
import CLoading from '../../components/CLoading'



const Create = () => {

  const { user, theme } = useGlobalContext()
  const initialValue = {
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  }

  const [form, setForm] = useState(initialValue)

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

    setUploading(true)

    try {

      await createVideoPost({ ...form, userId: user.$id })

      Alert.alert("Sucess", "Video uploaded.")
      router.push("/home")

    } catch (error) {
      Alert.alert("Error", error?.message)
    }
    finally {
      setForm(initialValue)
      setUploading(false)
    }


  }


  return (

    <SafeAreaView className={` relative h-full ${!theme ? "bg-primary" : " bg-gray-100"}`}>
      <ScrollView className='px-4 my-6'>

        <CLoading isLoading={uploading} />


        <Text className={`text-2xl font-psemibold ${!theme ? "text-white" : " text-black"} `}>
          Upload Video
        </Text>


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
          <Text className={`ml-5 text-xs font-pregular ${!theme ? "text-white" : "text-blacak"} `}>Video should less then <Text className='font-psemibold'>10 MB</Text></Text>

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
          <Text className={`ml-5 text-xs font-pregular ${!theme ? "text-white" : "text-blacak"} `}>Image should less then <Text className='font-psemibold'>1 MB</Text></Text>

        </View>


        <CInput
          title={'*AI Prompt'}
          value={form.prompt}
          onChangeHander={(e) => setForm({ ...form, prompt: e })}
          placeholder={"The prompt you used to create this video"}
          otherStyles={'mt-7'}
        />


        <Text className=" text-center mt-1 text-xs font-pregular"> <Text className='font-psemibold'>*</Text> marked are <Text className='font-psemibold'>optional</Text></Text>


        <CBotton
          title="Submit & Publish"
          handlePress={submit}
          isLoading={uploading}
          containerStyle={"mt-5 bg-secondary"}
        />

      </ScrollView>
    </SafeAreaView >
  )
}

export default Create