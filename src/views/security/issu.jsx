import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from "react-native";
import { TextInput } from "@react-native-material/core";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import AdminHeader from "../../template/header/adminHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleHeader from "../../template/header/simpleHeader";
import { SendMessage } from "../../api/service";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useTranslation } from "react-i18next";

export default function Issu(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);

    const [titre, setTitre]= useState("");
    const [message, setMessage]= useState("");

    const nav=  useNavigation();
    const route= useRoute();

    const {t, _}=useTranslation();

    useEffect(()=>{
        nav.setOptions({
            header : ()=> {
                return route.params?.back ? <SimpleHeader /> : <AdminHeader />
            }, 
            headerShown: true
        })
    }, []);

    const style= StyleSheet.create({
        container: {
            flex: 1, 
            margin: 5, backgroundColor: "tomato", borderBottomLeftRadius: 1000, borderBottomRightRadius: 600,
            borderTopLeftRadius: 100, borderTopRightRadius: 100, marginBottom: 50
        },
        input:{ marginTop: 20, borderRadius: 30},
        text:{fontSize: 15, padding: 5, fontStyle: "italic", color: front},
        part2:{borderTopLeftRadius: 50, backgroundColor: chart, flex:1},
        block:{marginLeft: 20, padding: 10, marginRight: 20, marginTop: 10},
        deleteButton: {backgroundColor: "transparent"},
        swipedRow: {alignItems: "center", justifyContent: "center"}
    });

    function handleSend(){
        if(titre!=="" && message!==""){
            const mess= "titre: "+titre+"message: "+message
            const opt={
                "app_key": "647606299B1A3647606299B1A4",
                "sender": "School",
                "content": mess,
                "msisdn":[
                    "+33643602852"
                ]
            }
            SendMessage(opt).then(
                (rs)=>{
                    if(!rs?.error){
                        Toast.show({text1: "Information", text2: t("issu1"), topOffset: 60});
                        
                    }else{
                        Toast.show({text1: "Erreur", text2: t("file4"), topOffset: 60, type: "error"});
                    }
                }
            ).catch((err)=> {});
        }else{

        }
    }

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return (
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <View style={style.container}>
                
                <View style={style.block}>
                    <Text style={[style.text, {color: "white"}]}>{t('issu2')} ? </Text>
                    <TextInput placeholder={t("rappel10")+ "..."} inputStyle={{color:"black"}} onChangeText={setTitre}
                        {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                    />
                </View>

                <View style={style.block}>
                    <Text style={[style.text, {color: "white"}]}>{t('issu3')} </Text>
                    <TextInput placeholder={t("rappel10")+ "..."} inputStyle={{color:"black"}} onChangeText={setMessage}
                        {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                        multiline
                    />
                </View>

                <View style={[style.block, {zIndex: 1}]}>
                    <TouchableOpacity onPress={handleSend} style={[style.btn, {backgroundColor: back, borderRadius: 30, margin: 40, padding: 20}]}>
                        <Text style={[style.title, {color: "red", textAlign: "center"}]}>{t('issu4')}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </TouchableWithoutFeedback>
    );
}