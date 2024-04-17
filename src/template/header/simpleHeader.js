import React from "react";
import { StyleSheet, TouchableOpacity, View, SafeAreaView, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from '@react-navigation/native';
import {  useSelector } from "react-redux";
import logo from "../../../assets/icon.png"


export default function SimpleHeader({show=true, lk=""}){

    const chart= useSelector((state)=>state.themeReducer.chart)
    const nav=  useNavigation()

    const style= StyleSheet.create({
        content:{
            display: "flex", flexDirection: "row",
            justifyContent: "space-between", margin: 10, padding: 10, alignItems: "center"
        },
        img:{
            width: 50, height: 50
        }
    })

    return (
        <SafeAreaView style={style.content}>
            {show?<TouchableOpacity onPress={()=> lk!="" ? nav.navigate(lk) :nav.goBack()}>
                <Ionicons name="chevron-back-circle-outline" size={40} color={chart} />
            </TouchableOpacity>:<View></View>}
            <Image source={logo} style={style.img} />
        </SafeAreaView>
    );
}