import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Linking, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AnimatedLottieView from "lottie-react-native";
import SimpleHeader from "../../template/header/simpleHeader";
import img from "../../../assets/icon.png"
import { useSelector } from "react-redux";
import { API } from "../../api/service";


export default function Information(){

    const nav=  useNavigation();
    const front= useSelector((state)=>state.themeReducer.front);
    const back= useSelector((state)=>state.themeReducer.back);
    const chart= useSelector((state)=>state.themeReducer.chart);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const loading= useSelector((state)=>state.userReducer.loading);

    //console.log(user);

    const handleLienPress = async (url) => {
        await Linking.openURL(url);
    };

    const style= StyleSheet.create({
        text:{textAlign: "center", fontSize: 15, color: front},
        title:{textAlign: "center", fontSize: 17, fontWeight: "bold", margin: 5},
        lottie:{width: 60, height: 60},
        card:{ borderRadius: 30, margin: 10, padding: 5, alignItems: "center"},
        img: {width: 150, height: 150, borderRadius: 30}
    });

    function DisplayCard({item, link}){
        return (<TouchableOpacity style={style.card} onPress={()=>handleLienPress(link)} key={item?.id}>
            <AnimatedLottieView source={{uri: item?.icon}} style={style.lottie} autoPlay loop />
        </TouchableOpacity>);
    }

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader  />
            }, 
            headerShown: true
        })
    }, [loading]);

    return (
        <View style={{flex:1}}>
            <View style={{alignItems:"center"}}>
                <Image source={user?.ecole?.logo ? { uri: API+"/document/show/"+user?.ecole?.logo}:img} style={style.img} />
            </View>
            <View style={{margin: 5, marginTop: 20}}>
                <View style={{flexDirection: "row", justifyContent: "center"}}>
                    <DisplayCard item={{id: 1, icon: 'https://assets6.lottiefiles.com/packages/lf20_nlavicvn.json'}} link={`tel:${user?.ecole?.telephone}`} />
                    <DisplayCard item={{id: 2, icon: 'https://assets8.lottiefiles.com/packages/lf20_0nr2fj7d.json'}} link={'mailto:'+user?.ecole?.email} />
                </View>
                <View style={{alignItems:"center", margin: 15}}>
                    <Text style={style.title}>A propos de l'établissement</Text>
                    <Text style={style.text}>{user?.ecole?.propos}</Text>
                </View>
            </View>
            
        </View>
    );
}