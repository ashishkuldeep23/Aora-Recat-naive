// import { StatusBar } from 'expo-status-bar';
// import { Text, View } from 'react-native';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { Link, router } from "expo-router"

import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../constants';
import CBotton from '../components/CBotton';
import { StatusBar } from 'expo-status-bar';


export default function App() {


    return (
        // <View
        // // style={styles.container}
        // >

        // <View >
        //     <Text className={'text-5xl text-teal-400 '} >TESTING</Text>
        //     <Text className={'text-xl text-teal-100 '} >TESTING</Text>
        //     <Link href='/home' className=' text-blue-500 underline my-1.5'  >Go To Home</Link>
        // </View>


        <SafeAreaView className={"bg-primary h-full"} >

            <ScrollView
                contentContainerStyle={{
                    height: '100%'
                }}
            >

                <View
                    className='w-full min-h-[85vh] justify-center items-center px-4'
                >

                    <Image
                        source={images.logo}
                        resizeMode='contain'
                        className={"w-[130px] h-[84px] mt-5"}
                    />

                    <Image
                        source={images.cards}
                        resizeMode='contain'
                        className={"w-full max-w-[380px] h-[300px]"}
                    />

                    <View className="relative mt-5">
                        <Text className="text-3xl text-white font-bold text-center">
                            Discover Endless Possibilities {" "}
                            <Text className="text-secondary">Aora</Text>
                        </Text>

                        <Image
                            source={images.path}
                            className="w-[136px] h-[15px] absolute -bottom-2 -right-10"
                            resizeMode='contain'
                        />

                    </View>


                    <Text className='text-sm  font-pregular text-gray-100 mt-7 text-center'>Where creativity meets innovation: embark on a journey of limitless exploration with Aora</Text>

                    <CBotton
                        title={'Continue with Email'}
                        handlePress={() => {
                            router.push("/sign-in")
                        }}
                        containerStyle='w-full mt-7 bg-secondary'
                        textStyle={'text-primary'}
                    />

                    <CBotton
                        title={'Continue with Google'}
                        handlePress={() => {
                            router.push("/sign-in")
                        }}
                        textStyle={' text-red-300'}
                        containerStyle='w-full mt-2 border border-red-300'
                    />


                </View>

            </ScrollView>

            <StatusBar
                backgroundColor='#161622'
                style='light'
            />

        </SafeAreaView>

    );
}


