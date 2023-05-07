import React, { useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native";
import BottomTab from "./src/navigation/bottom";
import { useDispatch, useSelector } from "react-redux";
import { getObjectValue, getStringValue } from "./src/redux/storage";
import { NavigationContainer } from "@react-navigation/native";
import Toast from 'react-native-toast-message';

export default function PreApp(){

    const dispatch= useDispatch()

    function loadData(){
        getStringValue("profil").then((res)=>{
            const action={type: "profil", value: res}
            dispatch(action)
        }) 
        getStringValue("theme").then((res)=>{
            const action={type: res}
            dispatch(action)
        }) 
        getObjectValue("login").then(
            (login)=>{
                const action={type: "login", value: login}
                dispatch(action)
            }
        )
    }

    useEffect(()=>{
        loadData() 
    },[])


    return (
        <NavigationContainer>
            <BottomTab />
            <Toast />
        </NavigationContainer>
    );
}