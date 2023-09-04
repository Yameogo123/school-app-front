import React, { useEffect } from "react";

import AnimatedLottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function Page1(){

    const nav=  useNavigation();

    useEffect(()=>{
        setTimeout(()=>nav.navigate("page2"), 5000);
    }, []);


    const style = StyleSheet.create({
        container:{
            flex:1,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center"
        },
        lottie:{width: "100%", height: 300 },
    })

    return (
        <View style={style.container}>
            <AnimatedLottieView source={require("../../../assets/school.json")} style={style.lottie} autoPlay loop />
        </View>
    );
}