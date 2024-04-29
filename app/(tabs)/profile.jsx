
import {  StyleSheet, Text, View  } from 'react-native'
import React from 'react'
import { Link, useRouter  } from 'expo-router'

const Profile = () => {
    const router = useRouter();

    function OnPressHandler() {

        // router.push('/');
        router.back()
    }

    return (
        <View style={styles.container} >
            <Link className=' text-5xl text-red-400 underline' href={"/"}  onPress={() => OnPressHandler()}>Back</Link>
            <Text>Profile</Text>
        </View>
    )
}

export default Profile




export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        color:"white"
    },
});
