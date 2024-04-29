

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthRoute = () => {
  return (
    <>
      <Stack>

        <Stack.Screen
          name='sign-in'
          options={{
            headerShown: false,
            headerShadowVisible: false,
          }}
        />

        <Stack.Screen
          name='sign-up'
          options={{
            headerShown: false,
            headerShadowVisible: false,
          }}
        />

      </Stack>

      <StatusBar
        backgroundColor='#161622'
        style='light'
      />

    </>

  )
}

export default AuthRoute

const styles = StyleSheet.create({})

