import React from "react";
import { StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";


export default function NoLoggedHeader({handleTheme, goBack, show=true}){

    const back= useSelector((state)=>state.themeReducer.back);
    const front= useSelector((state)=>state.themeReducer.front);
    const nav=  useNavigation()

    function handleLoginPage(){
        nav.navigate("login");
    }


    const style= StyleSheet.create({
        content:{
            //position: "absolute",
            display: "flex", flexDirection: "row",
            justifyContent: "space-between",
            margin: 5, padding: 10, alignItems: "center"
        }
    })

    return (
        <SafeAreaView style={style.content}>
            {show ? <TouchableOpacity onPress={goBack} >
                <Ionicons name="chevron-back-circle-sharp" size={40} color={front} />
            </TouchableOpacity>:<View></View>}
            <View style={style.content}>
                <TouchableOpacity onPress={handleTheme} style={{marginLeft: 20}}>
                    <Ionicons name={back==="snow" ? "md-moon" : "sunny-sharp"} size={35} color={back==="snow" ? front : "yellow"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLoginPage} style={{marginLeft: 20}}>
                    <Ionicons name="log-in" size={35} color={"blue"} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}