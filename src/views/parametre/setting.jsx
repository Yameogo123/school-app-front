import { useNavigation } from "@react-navigation/native";
import AnimatedLottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleHeader from "../../template/header/simpleHeader";
import { storeObject, storeString } from "../../redux/storage";
import { useTranslation } from "react-i18next";

export default function Setting() {

    const nav=  useNavigation();
    const back= useSelector((state)=>state.themeReducer.back);
    const chart= useSelector((state)=>state.themeReducer.chart);
    const langue= useSelector((state)=>state.paramReducer.langue);
    const {t, _}=useTranslation()

    const dispatch = useDispatch()

    function handleLogout(){
        const login={user: "", token: "", connected: "disconnected"}
        storeObject("login", login).then(
            ()=>{
                storeString("connected", "disconnected").then(
                    ()=>{
                        const action={type: "logout"}
                        dispatch(action)
                    }
                )
            }
        )
    }

    function handleLink(link){
        if(link==="langue"){
            Alert.alert("Attention", t("param4"), [
                {
                    text: t('continue'),
                    onPress: () => {
                        let val= langue === "fr" ? "en" : "fr"
                        const action={
                            type: "langue",
                            value: val
                        }
                        storeString("langue", val).then(
                            ()=>{
                                dispatch(action)
                            }
                        )
                    }
                },
                {
                    text: t('cancel'),
                    style: 'cancel',
                }
            ])
        }else{
            nav.navigate(link);
        }
        
    }

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader show={false} />
            }, 
            headerShown: true
        })
    }, []);

    const elements=[
        {id: 1, libelle: "Documents", action: ()=>handleLink("documents"), icon: "attach"},
        // {id: 2, libelle: "liste des archives", action: ()=>handleLink("archives"), icon: "archive-outline"},
        {id: 3, libelle: "Informations", action: ()=>handleLink("informations"), icon: "information-circle-outline"},
        {id: 4, libelle: t("param1"), action: ()=>handleLink("scolarite"), icon: "school-outline"},
        {id: 5, libelle: t("param2"), action: ()=>handleLink("liens"), icon: "globe-outline"},
        {id: 6, libelle:t("param3"), action: ()=>handleLink("langue"), icon: "language"}
    ];

    function displayBlock(item, key){
        return (
            <TouchableOpacity style={style.display} key={key} onPress={item?.action}>
                <Ionicons name={item?.icon} size={40} color={back} />
                <Text style={style.text}>{item?.libelle}</Text>
            </TouchableOpacity>
        );
    }
    
    const style = StyleSheet.create({
        container:{
            flex:1
        },
        lottie:{width: 200, height: 200 },
        display: {
            flexDirection: "row", alignItems: "center", borderRadius: 30, borderColor: chart,
            margin: 15,  borderWidth: 0.7, padding: 15, backgroundColor: "skyblue"
        },
        text: {fontSize: 20, marginLeft: 40, color: back, fontWeight: "bold", alignItems:"center"},
        bottom: {justifyContent: "center"}
    })

    return (
        <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
            <View style={{alignItems: "center", margin: 50}}>
                <AnimatedLottieView source={require("../../../assets/params.json")} style={style.lottie} autoPlay loop />
            </View>
            {elements.map((el, idx)=>{
                return displayBlock(el, idx);
            })}
            <View style={style.bottom}>
                <TouchableOpacity style={{backgroundColor: "red", margin: 40, borderRadius: 30}} onPress={handleLogout}>
                    <Text style={{textAlign: "center", fontSize: 15, padding: 20, color: back, fontWeight: "bold"}}>Déconnexion</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}