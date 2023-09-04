import React from "react";

import AnimatedLottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RNModal from "react-native-modal";

export default function Loading({load=false}){

    const nav=  useNavigation();

    const style = StyleSheet.create({
        container:{
            flex:1, backgroundColor: "transparent", alignItems: "center", justifyContent: "center"
        },
        lottie:{width: "80%", height: 300 },
    })

    return (
        <RNModal
            isVisible={load} animationInTiming={500} animationOutTiming={500} 
            backdropTransitionInTiming={500} backdropTransitionOutTiming={500}
        >
            <View style={style.container}>
                <AnimatedLottieView source={require("../../../assets/loading.json")} style={style.lottie} autoPlay loop />
            </View>
        </RNModal>
    );
}