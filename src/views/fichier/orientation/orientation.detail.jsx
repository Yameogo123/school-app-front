import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Linking, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import SimpleHeader from "../../../template/header/simpleHeader";
import { useSelector } from "react-redux";
import { API } from "../../../api/service";
import Video from 'react-native-video';
import translate from 'translate-google-api';

export default function OrientationDetail(){

    const nav=  useNavigation();
    const front= useSelector((state)=>state.themeReducer.front);
    const langue= useSelector((state)=>state.paramReducer.langue);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const [body, setBody]= useState("")

    const route= useRoute();
    const orientation= route.params?.orientation

    const handleLienPress = async (url) => {
        await Linking.openURL(url);
    };

    const style= StyleSheet.create({
        text:{textAlign: "center", fontSize: 15, color: front},
        title:{textAlign: "center", fontSize: 17, fontWeight: "bold", margin: 5},
        lottie:{width: 60, height: 60},
        card:{ borderRadius: 30, margin: 10, padding: 5, alignItems: "center"},
        img: {width: 280, height: 250, borderRadius: 30},
        video: {width: 180, height: 180, borderRadius: 30}
    });

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader  />
            }, 
            headerShown: true
        })
    }, []);

    useMemo(async () => {
        const result = await translate(orientation?.contenu, {
            tld: "com",
            to: langue,
        }); 
        if(result.length!==0){
            setBody(result[0])
        }
    }, [])

    return (
        <View style={{flex:1}}>
            <View style={{alignItems:"center"}}>
                {(orientation?.cover && !orientation?.video) && <Image source={{ uri: API+"/document/show/"+orientation?.cover?.libelle}} style={style.img} />}
                {orientation?.video && 
                    <Video source={{ uri: API+"/document/show/"+orientation?.video?.libelle}} 
                        paused={true} controls={true} style={style.img} />}
            </View>
            <View style={{margin: 5, marginTop: 20}}>
                <ScrollView contentContainerStyle={{alignItems:"center", margin: 15}}>
                    <Text style={style.title}>Detail</Text>
                    <Text style={style.text}>{body}</Text>
                </ScrollView>
            </View>
            
        </View>
    );
}