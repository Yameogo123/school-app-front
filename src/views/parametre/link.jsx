import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Linking, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AnimatedLottieView from "lottie-react-native";
import { LINK } from "../../api/data";
import SimpleHeader from "../../template/header/simpleHeader";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


export default function Liens(){

    const nav=  useNavigation();
    const front= useSelector((state)=>state.themeReducer.front);
    const back= useSelector((state)=>state.themeReducer.back);
    const chart= useSelector((state)=>state.themeReducer.chart);
    const loading= useSelector((state)=>state.userReducer.loading);
    const {t, _}=useTranslation();

    const handleLienPress = async (url) => {
        await Linking.openURL(url);
    };

    const style= StyleSheet.create({
        text:{textAlign: "center", fontSize: 15, fontWeight: "bold", margin: 1, color: front },
        lottie:{width: 100, height: 100},
        card:{borderWidth: 0.3, borderRadius: 30, margin: 10, padding: 5, borderColor: front }
    });

    function DisplayCard({item}){
        return (<TouchableOpacity style={style.card} onPress={()=>handleLienPress(item?.lien)} key={item?.id}>
            <AnimatedLottieView source={{uri: 'https://lottie.host/2d3f6e2a-58ba-46a0-ad76-6e06a445d201/et0Kdc4vWl.json'}} style={style.lottie} autoPlay loop />
            <Text style={style.text}>{item?.label}</Text>
        </TouchableOpacity>);
    }

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader />
            }, 
            headerShown: true
        });
    }, []);

    return (
        <View style={{flex:1}}>
            <Text style={style.text}>{t('link1')}</Text>
            <View style={{margin: 5, marginTop: 20}}>
                {
                    LINK.length > 0 ? 
                        <FlatList numColumns={3} data={LINK} showsVerticalScrollIndicator={false} scrollEnabled={LINK.length > 9}
                            contentContainerStyle={{alignItems: "center"}}
                            keyExtractor={(_, idx)=> idx} renderItem={({item})=> {
                                return <DisplayCard item={item} />
                            }} 
                        />
                    :
                        <View style={{alignItems: "center", margin: 50}}>
                            <AnimatedLottieView source={{uri: "https://assets2.lottiefiles.com/temp/lf20_Celp8h.json"}} style={style.lottie} autoPlay loop />
                        </View>
                }
            </View>
            
        </View>
    );
}