import React from "react";

import AnimatedLottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";


export default function NoInternet(){

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
            <AnimatedLottieView source={require("../../../assets/no_internet.json")} style={style.lottie} autoPlay loop />
        </View>
    );
}