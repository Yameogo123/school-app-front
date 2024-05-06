import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useSelector } from "react-redux";
import AdminHeader from "../../../template/header/adminHeader";
import DropDownPicker from 'react-native-dropdown-picker';
import { adaptSelect } from "../../../api/functions";
import { TextInput } from "@react-native-material/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Get, SendMessage } from "../../../api/service";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useTranslation } from "react-i18next";


export default function Notifier(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [autre, setAutre]= useState(null);

    const [users, setUsers]= useState([]);
    const [util, setUtil]= useState(null);
    const [item, setItem]= useState(null);

    const [objects, setObjects]= useState([
        {libelle: 'bulletins disponibles'}, {libelle: 'rappel de paiement'},
        {libelle: 'renvoi temporaire'}, {libelle: 'autre'}
    ]);
    const [object, setObject]= useState(null);
    const [object1, setObject1]= useState(null);
    const [libelle, setLibelle]= useState("");

    const [open2, setOpen2]= useState(false);
    const [open3, setOpen3]= useState(false);

    const [isSending, setIsSending]= useState(false);

    const nav=  useNavigation();
    const {t, _}=useTranslation();

    useEffect(()=>{
        nav.setOptions({
            header : ()=> {
                return <AdminHeader />
            }, 
            headerShown: true
        })
    }, []);

    useMemo(()=>{
        Get("/user/all/ecole/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setUsers(rs?.users);
                }
            }
        ).catch(()=>{})
    }, []);

    function handleValider(){
        if(object !==null && item !== null && libelle !== "" ){
            let i= 0
            setIsSending(true);
            for(let x of item){
                const opt={
                    "app_key": "647606299B1A3647606299B1A4", "sender": "School",
                    "content": "objet du message: " + object || object1 + ". Message: " + libelle,
                    "msisdn":[
                        x?.telephone
                    ]
                }
                SendMessage(opt).then(
                    (rs)=>{
                        //console.log(rs);
                        if(!rs?.error){
                            i= i+1
                            Toast.show({text1: "Information", text2: t("admin47"), topOffset: 60});
                            
                        }else{
                            Toast.show({text1: t("file4"), text2: t("file4"), topOffset: 60, type: "error"});
                        }
                    }
                ).catch((err)=> {});
            }
            if(i!==0){
                setObject(null); setItem(null); setLibelle("");
            }
            setIsSending(false)
        }else{
            Toast.show({text1: t("admin6"), text2: t("missing1"), type: "error", topOffset: 60})
        }
    }

    const style= StyleSheet.create({
        container: {
            flex: 1, backgroundColor: back
        },
        head:{
            margin: 15, padding: 10, paddingTop: 20, paddingBottom: 20
        },
        title:{fontWeight: "bold", fontSize: 25, padding: 5},
        text:{fontSize: 15, padding: 5, fontStyle: "italic", color: back},
        part2:{borderTopRightRadius:50, backgroundColor: chart, height: 600},
        block:{marginLeft: 20, padding: 5, marginRight: 20, paddingTop: 20},
        input:{ borderRadius: 30},
        btn: {shadowColor: "black", shadowOffset: {width: 0.5, height: 1}, shadowOpacity: 0.4, shadowRadius: 20}
    });

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    let behave= Platform.OS==="ios" ? {
        behavior:"height"
    }: {}

    return (
        <KeyboardAvoidingView {...behave} style={{flex: 1}}>
            {/* <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}> */}
                <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
                    <View style={style.head}>
                        <Text style={style.title}>{t("admin48")}</Text>
                        <Text style={[style.text, {color: front}]}>{t('admin49')}</Text>
                    </View>
                    <View style={style.part2}>

                        <View style={[style.block, {zIndex: 5}]}>
                            <Text style={style.text}>{t('admin50')} ?</Text>
                            <DropDownPicker placeholder={t("comptabilite2")} onSelectItem={setItem}
                                open={open3} value={util} items={adaptSelect(users, 1)} searchable maxHeight={150}
                                setOpen={setOpen3} setValue={setUtil} setItems={setUsers} multiple //theme="DARK"
                                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                listMode="SCROLLVIEW"
                            />
                        </View>

                        <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 4}}>
                            <View style={[style.block, {zIndex: 4, width: "44%"}]}>
                                <Text style={style.text}>{t('admin51')}</Text>
                                <DropDownPicker placeholder={t("comptabilite2")}  onSelectItem={(item)=> setAutre(item.libelle==="autre")}
                                    open={open2} value={object} items={adaptSelect(objects)}
                                    setOpen={setOpen2} setValue={setObject} searchable
                                    setItems={setObjects} maxHeight={150} listMode="SCROLLVIEW"
                                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                />
                            </View>

                            <View style={[style.block, {zIndex: 4, width: "44%"}]}>
                                <Text style={style.text}></Text>
                                {
                                    autre && <TextInput placeholder={t("admin52")} inputStyle={{color:"black"}} onChangeText={setObject1}
                                        {...props} textContentType="name" multiline
                                    />
                                }
                            </View>
                        </View>

                        <View style={style.block}>
                            <Text style={style.text}>{t("admin53")} ? </Text>
                            <TextInput placeholder={t('rappel10')} inputStyle={{color:"black"}} onChangeText={setLibelle}
                                {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                                multiline
                            />
                        </View>

                        <View style={[style.block, {zIndex: 1}]}>
                            <TouchableOpacity disabled={isSending} onPress={handleValider} style={[style.btn, {backgroundColor: chart, borderRadius: 30, margin: 40}]}>
                                <Text style={[style.title, {color: back, textAlign: "center"}]}>{t('admin54')}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            {/* </TouchableWithoutFeedback> */}
        </KeyboardAvoidingView>
    )
}