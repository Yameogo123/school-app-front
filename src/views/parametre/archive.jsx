import { useNavigation } from "@react-navigation/native";
import AnimatedLottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Alert } from "react-native";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleHeader from "../../template/header/simpleHeader";

export default function Archive() {

    const nav=  useNavigation();
    const front= useSelector((state)=>state.themeReducer.front);
    const back= useSelector((state)=>state.themeReducer.back);
    const chart= useSelector((state)=>state.themeReducer.chart);

    const loading= useSelector((state)=>state.userReducer.loading);

    const [archives, setArchives]= useState([{type: "cours"}, {type: "exercice"}, {type: "cours"}]);

    function handleRestaure(el){
        Alert.alert("confirmation", "voulez vous vraiment restaurer cet élément?", [
            {text: "non"}, 
            {text: "oui", onPress:()=>{

            }}
        ], {cancelable: true})
    }

    function handleDelete(el){
        Alert.alert("confirmation", "voulez vous vraiment supprimer cet élément?", [
            {text: "non"}, 
            {text: "oui", onPress:()=>{
                
            }}
        ], {cancelable: true})
    }

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader />
            }, 
            headerShown: true
        })
    }, []);


    function DisplayBlock({item}){
        
        return (
            <View style={{padding: 20, borderWidth:0.4, borderRadius: 20, margin:5}} >
                <Text style={style.text}>{ "Type archive: "+ item?.type }</Text>
                <Text style={style.text}>{item?.libelle || "cours de physique chimie: molécules"}</Text>
                <View style={style.display}>
                    <TouchableOpacity style={{padding: 15}} onPress={()=>handleDelete(item)}>
                        <Ionicons name="trash-bin" color={"tomato"} size={50} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{padding: 15}} onPress={()=>handleRestaure(item)}>
                        <Ionicons name="refresh-circle" color={"green"} size={50} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    
    const style = StyleSheet.create({
        container:{flex:1, marginBottom: 50},
        lottie:{width: 200, height: 200 },
        display: {display: "flex", flexDirection: "row", justifyContent: "center"},
        text: {fontSize: 20, color: front, textAlign: "center", padding: 5},
        bottom: {justifyContent: "center"}
    });

    return (
        <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
            <View style={{alignItems: "center", margin: 50}}>
                <AnimatedLottieView source={{uri: "https://assets7.lottiefiles.com/private_files/lf30_EAEZkJ.json"}} style={style.lottie} autoPlay loop />
            </View>
            {
                archives.map((value, index)=> {

                    return <View key={index}>
                        <DisplayBlock item={value} />
                    </View>
                })
            }
        </ScrollView>
    );
}