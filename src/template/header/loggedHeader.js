import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import { storeObject, storeString } from "../../redux/storage";


export default function LoggedHeader({handleTheme, goBack, show=true}){

    const back= useSelector((state)=>state.themeReducer.back)
    const front= useSelector((state)=>state.themeReducer.front)
    const nav=  useNavigation()
    const dispatch = useDispatch()

    function handleLogout(){
        const login={user: "", token: "", connected: "disconnected"}
        storeObject("login", login).then(
            ()=>{
                storeString("connected", "disconnected").then(
                    ()=>{
                        const action={type: "logout"}
                        dispatch(action)
                    }
                )
            }
        )
    }

    function handleUser(){
        nav?.openDrawer()
    }

    const style= StyleSheet.create({
        content:{
            display: "flex", flexDirection: "row", justifyContent: "space-between",
            margin: 5, padding: 10, alignItems: "center"
        }
    })

    return (
        <SafeAreaView style={style.content}>
            {show?<TouchableOpacity onPress={goBack}>
                <Ionicons name="chevron-back-circle-sharp" size={35} color={front} />
            </TouchableOpacity>:<View></View>}
            <View style={style.content}>
                {/* <TouchableOpacity onPress={handleTheme} style={{marginLeft: 20}}>
                    <Ionicons name={back==="snow"? "moon" : "sunny-sharp"} size={35} color={back==="snow" ? front : "yellow"} />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={handleUser} style={{marginLeft: 20}}>
                    <Ionicons name="person-circle-sharp" size={35} color={front} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={{marginLeft: 20}}>
                    <Ionicons name="log-out" size={35} color={"red"} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}