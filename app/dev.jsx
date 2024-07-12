

import { View, Linking, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGlobalContext } from '../context/ContextProvider';
import CInput from '../components/CInput';
import CBotton from '../components/CBotton';
import { createNewFeedback, deleteOneFeedback, getAllFeedbacks, submitReplyForFeed, updateSingleFeedback } from '../lib/appwrite';
import { FlatList } from 'react-native-gesture-handler';

const Dev = () => {


    const theme = useGlobalContext().theme


    const [controlCrud, setControlCrud] = useState({
        isDoing: false,
        whatDoing: "",
        data: null
    })

    const openLink = (link) => {
        // if (typeof (link) !== "string") return

        Linking.openURL(`${link}`);
    }

    return (
        <>


            <SafeAreaView
                className="h-full bg-primary text-white px-2"
            >
                <ScrollView>

                    <View>

                        <TouchableOpacity
                            onPress={() => { router.back() }}
                        >
                            <Text className={`font-pmedium ml-1 text-gray-100 py-2 px-1 active:bg-red-800`}>
                                👈Back
                            </Text>

                        </TouchableOpacity>

                    </View>


                    <View className=" h-[55vh]  flex justify-center items-center">

                        <Text className=" text-white text-3xl font-bold ">Dev Info</Text>


                        <View className="border border-gray-100/30 rounded-full overflow-hidden mt-5 px-1">


                            <Image
                                source={{ uri: "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1692032164/utemmzfh8jy0w4bufdp4.png" }}
                                resizeMode='contain'
                                className={"w-[200px] h-[210px]  "}

                            />
                        </View>


                        <Text className=" text-white text-2xl">Ashish Kuldeep</Text>
                        <Text className=" text-white">A MERN and Recat Native Developer</Text>
                        <Text className=" text-white text-xs">React, NodeJs, TypeScript, MongoDB,React Native are main tech stack.</Text>

                        <View className=" pt-4  flex gap-2 flex-row justify-center items-center">
                            <TouchableOpacity
                                className=" px-2 rounded-full border border-white"
                                onPress={() => openLink("https://github.com/Ashishkuldeep23")}
                            >
                                <Text className=" text-white">GitHub</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => openLink("https://akp23.vercel.app/")}
                                className=" px-2 rounded-full border border-white"
                            >
                                <Text className=" text-white">Porfoilo</Text>
                            </TouchableOpacity>
                        </View>


                        {/* <Text className=" text-white text-3xl">Dev</Text> */}


                    </View>

                    <View className=" w-full h-full border-t border-gray-100/30 pt-7">

                        <Text className="text-2xl text-center text-white ">Feedback Section 👇</Text>

                        <FeedbackFormDiv
                            controlCrud={controlCrud}
                            setControlCrud={setControlCrud}
                        />
                        <AllFeedbackSection
                            controlCrud={controlCrud}
                            setControlCrud={setControlCrud}
                        />
                    </View>


                </ScrollView>

            </SafeAreaView>
        </>

    )
}

export default Dev


function FeedbackFormDiv({ controlCrud, setControlCrud }) {

    const { user } = useGlobalContext()

    const initialForm = {
        name: "",
        message: ""
    }
    const [formFields, setformFields] = useState(initialForm)

    const [isLoading, setIsLoading] = useState(false)

    const submitForm = async () => {

        if (!formFields.name || !formFields.message) {
            Alert.alert("ERROR:400", "Please give your name and message.")
        }

        setIsLoading(true);

        try {


            let result = null

            // // // check upateing first --------->
            if (controlCrud.isDoing && controlCrud.whatDoing === "updating") {

                result = await updateSingleFeedback({
                    feedId: controlCrud.data.$id,
                    username: formFields.name,
                    feedback: formFields.message
                })
            } else {

                result = await createNewFeedback(formFields.message, formFields.name, user.$id)
            }


            // console.log({ result })
            // console.log("Now add into all feedback list ---------->")

            if (result) {

                if (controlCrud.isDoing && controlCrud.whatDoing === "updating") {

                    // console.log({ result })

                    setControlCrud({
                        isDoing: true,
                        whatDoing: "updated",
                        data: result
                    })


                } else {
                    setControlCrud({
                        isDoing: true,
                        whatDoing: "ceated",
                        data: result
                    })
                }
            }

        } catch (error) {
            Alert.alert('Error', `${error}`)
        } finally {
            setIsLoading(false);
            setformFields(initialForm)
        }

    }

    useEffect(() => {

        if (user.$id) {
            setformFields({ ...formFields, name: user.username })
        }

    }, [user])

    useEffect(() => {

        if (controlCrud.isDoing && controlCrud.whatDoing === "updating") {

            // console.log(controlCrud.data)

            setformFields({
                name: controlCrud.data.username,
                message: controlCrud.data.feedback
            })
        }

    }, [controlCrud])


    return (
        <View className="my-5 border border-gray-100/30 py-2 px-1 rounded-lg " >

            <Text className=" ml-2 text-sm text-white font-pregular ">Give your true feedback for this applitaion.</Text>

            <View>
                {
                    isLoading && <Text className=" text-rose-600 text-center text-xl">Loading...</Text>
                }
            </View>

            <CInput
                title={'Your Name'}
                value={formFields.name}
                onChangeHander={(e) => setformFields({ ...formFields, name: e })}
                placeholder={''}
                otherStyles={''}
                numberOfLines={4}
            />

            <CInput
                title={'Your Feedback'}
                value={formFields.message}
                onChangeHander={(e) => setformFields({ ...formFields, message: e })}

                placeholder={''}
                otherStyles={''}
            />


            <CBotton
                isLoading={isLoading}
                title={controlCrud.isDoing && controlCrud.whatDoing === "updating" ? "Update" : "Submit"}
                containerStyle={" bg-secondary mt-4 w-[40%] bg-teal-800 "}
                textStyle={' text-white'}
                handlePress={() => {
                    console.log("Now call sign in fn");
                    submitForm();
                }}
            />

        </View>
    )
}


function AllFeedbackSection({ controlCrud, setControlCrud }) {

    const [allFeedbacks, setAllFeedbacks] = useState([])

    const [isLoading, setIsLoading] = useState(false)


    async function fetchAllFeedbacks() {

        try {
            const result = await getAllFeedbacks()

            // console.log({ result })
            // console.log("Now add into all feedback list ---------->")

            setAllFeedbacks(result)

        } catch (error) {
            Alert.alert('Error', `${error}`)
        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        fetchAllFeedbacks()
    }, [])


    useEffect(() => {

        if (controlCrud.isDoing && controlCrud.whatDoing === "ceated") {
            setAllFeedbacks([controlCrud.data, ...allFeedbacks])
        }

        if (controlCrud.isDoing && controlCrud.whatDoing === "updated") {
            // setAllFeedbacks([controlCrud.data, ...allFeedbacks])


            let index = allFeedbacks.findIndex((item) => item.$id === controlCrud.data.$id)

            // console.log({ index })

            if (index !== -1) {

                allFeedbacks.splice(index, 1, controlCrud.data)
                setAllFeedbacks(allFeedbacks)
            }


            setControlCrud({
                isDoing: false,
                whatDoing: "",
                data: null
            })
        }


        if (controlCrud.isDoing && controlCrud.whatDoing === "deleted") {


            let index = allFeedbacks.findIndex((item) => item.$id === controlCrud.data)

            // console.log({ index })

            if (index !== -1) {
                allFeedbacks.splice(index, 1)
                setAllFeedbacks(allFeedbacks)
            }


            setControlCrud({
                isDoing: false,
                whatDoing: "",
                data: null
            })

        }


    }, [controlCrud])


    return (
        <View className=" my-10">
            <View>
                <Text className=' text-center font-pregular text-xl text-white'>All feedbacks about this application.</Text>
            </View>

            <View>
                {
                    isLoading && <Text className=" text-rose-600 text-center text-xl">Getting feeds...</Text>
                }
            </View>

            <View className=" flex flex-row flex-wrap justify-center">
                {

                    allFeedbacks.length > 0
                        ?
                        allFeedbacks.map((item, i) => {
                            return <SingleFeedback
                                item={item}
                                key={i}
                                controlCrud={controlCrud}
                                setControlCrud={setControlCrud}
                            />
                        })
                        :
                        <View className='mt-20 flex justify-center items-center'>
                            <Text className={`text-white text-center font-pbold text-4xl `}>
                                No feedback found. Give first feedback to this application.
                            </Text>
                        </View>
                }

            </View>

        </View>
    )

}


function SingleFeedback({ item, controlCrud, setControlCrud }) {

    // console.log(JSON.stringify(item, null, 4))

    const { user } = useGlobalContext()


    const initialForm = {
        reply: ""
    }
    const [formFields, setformFields] = useState(initialForm)

    const [isLoading, setIsLoading] = useState(false)


    const updatingReady = () => {
        setControlCrud({
            isDoing: true,
            whatDoing: 'updating',
            data: item
        })
    }

    const deletingFeed = async () => {

        try {

            setIsLoading(true)

            const result = await deleteOneFeedback(item.$id)

            // console.log({ result })

            if (result) {
                setControlCrud({
                    isDoing: true,
                    whatDoing: "deleted",
                    data: item.$id
                })
            }

        } catch (err) {
            Alert.alert('Error', `${err}`)
        } finally {
            setIsLoading(false)
        }


    }

    const submitReply = async () => {

        try {


            setIsLoading(true)

            const result = await submitReplyForFeed(formFields.reply, item.$id)

            // console.log({ result })

            if (result) {
                setControlCrud({
                    isDoing: true,
                    whatDoing: "updated",
                    data: result
                })
            }

        } catch (err) {
            Alert.alert('Error', `${err}`)
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {

        if (controlCrud.isDoing && controlCrud.whatDoing === "") {

            setformFields({ ...formFields })
        }

    }, [controlCrud])


    return (
        <View
            style={{
                borderColor: item.color || "gray",
            }}
            className={`border rounded px-2.5 py-1.5 m-3`}>

            <Text className=' text-white text-lg'>
                {item.username}, saying...
            </Text>
            <Text className=' text-white text-xl'>
                {item.feedback}
            </Text>
            <Text className=' text-white text-sm'>
                Reply , {item.reply}
            </Text>


            {
                user?.email === "ashishkuldeep08@gmail.com"
                &&

                <>

                    <View>
                        {
                            isLoading
                            &&
                            <Text className=" text-rose-600 text-center text-xl">Loading...</Text>
                        }
                    </View>

                    <View className=' py-1 flex flex-row justify-around items-end px-0.5'>

                        <CInput
                            title={'Reply'}
                            value={formFields.reply}
                            onChangeHander={(e) => setformFields({ ...formFields, reply: e })}
                            placeholder={''}
                            otherStyles={'w-[85%] h-[7vh] rounded-md'}
                            numberOfLines={4}
                        />

                        <TouchableOpacity
                            className=" !h-[4vh] mt-4 p-1 rounded-md bg-teal-800"
                            onPress={submitReply}
                        >
                            <Text className=" text-whit">✍️</Text>
                        </TouchableOpacity>


                    </View>

                </>
            }


            {
                user?.$id === item?.user?.$id
                &&
                <View className=' pt-1 flex flex-row gap-1 justify-around px-0.5'>

                    <TouchableOpacity
                        className=" border border-cyan-700 px-0.5 rounded"
                        onPress={updatingReady}
                    >
                        <Text className=" text-cyan-700 font-psemibold text-xs ">Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className=" border border-red-700 px-0.5 rounded"
                        onPress={deletingFeed}
                    >
                        <Text className=" text-red-700 font-psemibold text-xs">Delete</Text>
                    </TouchableOpacity>
                </View>
            }


        </View>
    )
}