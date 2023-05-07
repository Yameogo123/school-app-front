import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import FichierHeader from "../../template/header/fichierHeader";
import { WebView } from 'react-native-webview';
import Ionicons from "react-native-vector-icons/Ionicons"
import { ActivityIndicator } from "react-native-paper";
import AnimatedLottieView from "lottie-react-native";
import { TextInput } from "@react-native-material/core";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";


export default function File() {
    
    const nav=  useNavigation()
    const ref= useRef()
    const [search, setSearch]=useState("")
    const [files, setFiles]=useState([{id: 0}, {id: 1},{id: 2},{id: 4},{id: 5},{id: 6},{id: 7}])
    const front= useSelector((state)=>state.themeReducer.front)
    const chart= useSelector((state)=>state.themeReducer.chart)

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <FichierHeader   />
            }, 
            headerShown: true
        })
    }, [])

    function handleSearch(){
        if(files.length > 0){
            nav.navigate("file/result", {files: files})
        }else{
            Toast.show({
                text1: "remarques", text2: "veuillez spécifier votre recherche!", type:"info",
                topOffset: 60
            })
        }
    }

    const style = StyleSheet.create({
        container:{
            flex: 1
        },
        lottie:{
            width: 250, height: 200
        },
        input:{backgroundColor: chart, marginLeft: 30, marginRight: 30, marginTop: 20, borderRadius: 30},
        info:{color: front, margin: 30, fontSize: 20, textAlign: "justify", opacity: 0.4},

    })

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
            <View style={style.container}>
                <View style={{alignItems: "center"}}>
                    <AnimatedLottieView speed={2} autoPlay autoSize loop source={{uri: "https://assets3.lottiefiles.com/private_files/lf30_gd2unfh8.json"}}
                        style={style.lottie}
                    />
                </View>

                <TextInput 
                    leading={<Ionicons name="search" size={20} color={front} />}
                    onChangeText={setSearch} {...props} returnKeyLabel="recherche"
                    trailing={<TouchableOpacity onPress={handleSearch}>
                        <Ionicons name="md-enter" size={25} color={front} />
                    </TouchableOpacity>} onSubmitEditing={handleSearch}
                />

                <Text style={style.info}>
                    Trouver ici la banque de fichiers utiles à votre formation. 
                    Libre à vous de faire une recherche spécifique.
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );
}