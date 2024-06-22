import { View, Text, Alert } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../context/ContextProvider';
import CBotton from './CBotton';
import { signIn } from '../lib/appwrite';
import { router } from 'expo-router';
import { Default_user_email, Default_user_pass } from '../lib/logInRelatedImpCode';

const LogInByDefaultUser = () => {


    const { isLoading, setIsLoading, setIsLoggedIn, setUser, isInternetConnected } = useGlobalContext();



    async function logInDefaultUser() {

        try {
            const result = await signIn(Default_user_email, Default_user_pass)

            // // // Set it to global state -------->
            setUser(result)
            setIsLoggedIn(true)

            router.replace('/home')

        } catch (error) {
            Alert.alert('Error', `${error}`)
        } finally {
            setIsLoading(false);
        }


    }


    return (
        <CBotton
            title={'LogIn by Default User'}
            handlePress={() => {
                isInternetConnected && !isLoading && logInDefaultUser();
                // isConnected && router.push("/sign-in")
            }}
            containerStyle='w-full mt-2 bg-secondary'
            textStyle={'text-primary'}
            isLoading={isLoading}
        />
    )
}

export default LogInByDefaultUser