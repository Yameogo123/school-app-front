import React, { useEffect } from "react";

import AnimatedLottieView from "lottie-react-native";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AdminHeader from "../../template/header/adminHeader";


export default function Admin(){

    const nav=  useNavigation();

    useEffect(()=>{
        nav.setOptions({
            header : ()=> {
                return <AdminHeader />
            }, 
            headerShown: true
        })
    }, []);


    const style = StyleSheet.create({
        container:{
            flex:1, backgroundColor: "white", alignItems: "center", justifyContent: "center"
        },
        lottie:{width: "100%", height: 300 },
        text:{textAlign:"center", fontWeight: "bold", fontSize: 20, margin : 15}
    })

    return (
        <View style={style.container}>
            <Text style={style.text}>Gérer toute votre administration ici</Text>
            <AnimatedLottieView source={require("../../../assets/admin.json")} style={style.lottie} autoPlay loop />
        </View>
    );
}