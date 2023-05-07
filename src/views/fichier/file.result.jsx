import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"
import { ActivityIndicator } from "react-native-paper";
import AnimatedLottieView from "lottie-react-native";
import { useSelector } from "react-redux";
import SimpleHeader from "../../template/header/simpleHeader";
import { ScrollView } from "react-native";


export default function FileResult() {
    
    const nav=  useNavigation()
    const front= useSelector((state)=>state.themeReducer.front)
    const chart= useSelector((state)=>state.themeReducer.chart)
    const route= useRoute()
    const files= route.params?.files

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader   />
            }, 
            headerShown: true
        })
    }, [])

    const style = StyleSheet.create({
        container:{
            flex: 1, marginBottom: 50
        },
        lottie:{
            width: 150, height: 150
        },
        info:{color: front, fontSize: 20, opacity: 0.4, margin: 10},
        //scroll:{padding: 10},
        line:{display: "flex", flexDirection: "row", alignItems: "center", margin: 10, marginLeft: 35},
    })

    return (
        <View style={style.container}>
            <View style={{alignItems: "center"}}>
                <AnimatedLottieView speed={2} autoPlay autoSize loop 
                    source={{uri: "https://assets3.lottiefiles.com/packages/lf20_sbjamtbf.json"}}
                    style={style.lottie}
                />
            </View>

            <ScrollView contentContainerStyle={style.scroll} showsHorizontalScrollIndicator={false}>
                {
                    files.map(
                        ({item, id})=>{
                            return (
                                <TouchableOpacity style={style.line} key={id}>
                                    <Ionicons name="file-tray-full" size={35} color={front} />
                                    <Text style={style.info}>
                                        chapitre 1 : relativité restreinte 
                                    </Text>
                                </TouchableOpacity> 
                            );
                        }
                    )
                }
            </ScrollView>
        </View>
    );
}