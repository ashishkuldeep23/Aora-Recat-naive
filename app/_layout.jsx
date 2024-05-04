import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useFonts } from 'expo-font'

// // // we can define our paths by two type ----->
// // 1st. by using slots --->
// // 2nd.
import { Slot, Stack, SplashScreen } from "expo-router"
import GlobalProvider from '../context/ContextProvider'


SplashScreen.preventAutoHideAsync()

const RootLayout = () => {

  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);


  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }



  // // 1st way: By using <Slot /> form expo router ------>
  // return (
  //   <>
  //     <Slot />
  //   </>
  // )


  // // 2nd way: By using Stack of different screen coming from expo router ----->

  return (

    <GlobalProvider>

      <Stack >

        <Stack.Screen
          name='index'
          options={{
            headerShadowVisible: false,
            headerShown: false
          }}
        />

        <Stack.Screen
          name='(tabs)'
          options={{
            headerShadowVisible: false,
            headerShown: false
          }}
        />

        <Stack.Screen
          name='(auth)'
          options={{
            headerShadowVisible: false,
            headerShown: false
          }}
        />

        <Stack.Screen
          name='search/[query]'
          options={{
            // headerShadowVisible: false,
            headerShown: false
          }}
        />

        <Stack.Screen
          name='post/[id]'
          options={{
            // headerShadowVisible: false,
            headerShown: false
          }}
        />

      </Stack>

    </GlobalProvider>

  )

}

export default RootLayout

