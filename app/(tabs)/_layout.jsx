import { Text, View, Image } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Tabs } from 'expo-router'
import { icons } from '../../constants'
import { StatusBar } from 'expo-status-bar'
import { useGlobalContext } from '../../context/ContextProvider'
import * as Animatable from 'react-native-animatable';



const TabIcon = ({ icon, color, name, focused, scale }) => {

  // const { user: { avatar } } = useGlobalContext()

  // const { theme } = useGlobalContext()

  // console.log(avatar)

  return (
    <Animatable.View
      className={`justify-center items-center gap-1.5`}
    >
      <Image
        source={icon}
        resizeMode='contain'
        className={`w-5 h-5 relative
            ${scale}  
            ${focused
            ? "-translate-y-2 scale-150 top-1.5 w-6 h-6"
            : "translate-y-0 scale-100 top-0"}
            transition-all duration-1000
          `}
        tintColor={color}
      />
      <Text
        className={` ${focused
          ? `font-psemibold -translate-y-2 scale-125 hidden`
          : " font-pregular translate-y-0 scale-90 block"
          } transition-all duration-1000 text-xs`}
        style={{ color }}
      >{name}</Text>
    </Animatable.View>
  )
}


const TabsLayout = () => {

  const { theme } = useGlobalContext()


  return (
    <>
      <StatusBar
        backgroundColor='#161622'
        style='light'
      />



      <Tabs
        className=" bg-red-500"

        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: `${!theme ? "#FFA001" : "#d48500"}`,
          tabBarInactiveTintColor: `${!theme ? "#fff" : "#808080"}`,
          tabBarStyle: {
            backgroundColor: `${!theme ? "#161622" : "#c4cbd9"}`,
            // backgroundColor: `${!theme ? "#F9BEF9 " : "#F08080"}`,
            borderTopWidth: 1,
            borderTopColor: `${!theme ? "#232523" : "#c4cbd9"}`,
            height: 74,
            // marginHorizontal: 5,
            // borderRadius: 50
          },
        }}
      >

        <Tabs.Screen
          name='home'
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                name={"Home"}
                color={color}
                focused={focused}
              />
            )

          }}
        />

        <Tabs.Screen
          name='bookmark'
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                name={"Bookmark"}
                color={color}
                focused={focused}
              />
            )

          }}
        />

        <Tabs.Screen
          name='create'
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                name={"Create"}
                color={color}
                focused={focused}
              />
            )

          }}
        />


        <Tabs.Screen
          name='bell'
          options={{
            title: "Notification",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bell}
                name={"Notification"}
                color={color}
                focused={focused}
                scale={"scale-y-[1.25] scale-x-[1.3]"}
              />
            )

          }}
        />

        <Tabs.Screen
          name='profile'
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                name={"Profile"}
                color={color}
                focused={focused}
              />
            )

          }}
        />

      </Tabs>

    </>

  )


}

export default TabsLayout
