import { useNavigation } from "@react-navigation/native";
import React, {useEffect, useMemo, useState} from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FichierHeader from "../../../template/header/fichierHeader";
import { useSelector } from "react-redux";
import { Get, Remove, Update } from "../../../api/service";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useTranslation } from "react-i18next";

export default function Rappels(){

    const nav= useNavigation();
    const [elements, setElements]=useState([]);
    const back= useSelector((state)=>state.themeReducer.back);
    const chart= useSelector((state)=>state.themeReducer.chart);

    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const loading= useSelector((state)=>state.userReducer.loading);

    const [action, setAction]=useState(true);
    const {t, _}=useTranslation();

    useEffect(() => {
        nav.setOptions({ 
            header : ()=> {
                return <FichierHeader sel="rappels"  />
            }, 
            headerShown: true
        })
    }, []);

    useEffect(() => {
        const unsubscribe = nav.addListener('focus', () => {
            setAction(!action);
        });
     
        return unsubscribe;
    }, [nav, loading]);

    useMemo(()=>{
        Get("/rappel/all/user/"+user?._id+"/false", token).then(
            (rs)=>{
                if(!rs?.error){ 
                    setElements(rs?.rappels)
                }
            }
        ).catch(()=>{})
    }, [action, nav, loading]);

    const style= StyleSheet.create({
        container: {
            flex: 1 
        },
        title:{
            textAlign: "center", fontWeight: "bold", fontSize: 20, margin: 10
        },
        text:{
            textAlign: "center", fontSize: 15
        },
        card:{
            padding: 10, paddingBottom: 100, width: "95%", backgroundColor:"snow", borderWidth: 0.5, borderRadius: 20,
            margin :10
        }
    })

    function handleSupp(id){
        Alert.alert("confirmation", t("rappel1"), [
            {text:t("cancel"), style:"cancel"}, 
            {text: t("continue"), onPress: ()=>{
                Remove("/rappel/"+id, token).then(
                    (rp)=>{
                        if(rp?.error){
                            Toast.show({
                                text1: t("file4"), text2: t("rappel2"),
                                topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message", text2: t("rappel3"),
                                topOffset: 50
                            })
                            setAction(!action);
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: t("file4"), text2: t("file4"),
                        topOffset: 50, type:"error"
                    })
                })
            }}
        ], {cancelable: true})
    }

    function handleArchive(el){
        Alert.alert("confirmation", t("rappel4"), [
            {text:t("cancel"), style:"cancel"}, 
            {text: t("continue"), onPress: ()=>{
                const element= {...el, archive: true}
                Update("/rappel/update",{rappel: element}, true, token).then(
                    (rp)=>{
                        if(rp?.error){
                            Toast.show({
                                text1: t("file4"), text2: t("rappel5"),
                                topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message", text2: t("rappel6"),
                                topOffset: 50
                            })
                            setAction(!action);
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: t("file4"), text2: t("file4"),
                        topOffset: 50, type:"error"
                    })
                })
            }}
        ], {cancelable: true})
    }

    function Card({item}){

        const replaceHTML = item?.libelle?.replace(/<(.|\n)*?>/g, " ").trim();
        const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, "").trim();

        return (
            <TouchableOpacity key={Math.floor(Math.random() * 100)} style={style.card} onPress={()=>nav.navigate("rappel/add", {doc:item})}>
                <Text>{replaceWhiteSpace?.slice(0, 100) + "..."}</Text>
                <TouchableOpacity style={{position: "absolute", top: -5, right:-5, backgroundColor: "red", borderRadius: 15, padding: 5}} onPress={()=>handleSupp(item?._id)}>
                    <Ionicons name="trash-bin" color={back} size={30} />
                </TouchableOpacity>
                <TouchableOpacity style={{position: "absolute", bottom: -5, right:-5, backgroundColor: "blue", borderRadius: 15, padding: 5}} onPress={()=>handleArchive(item)}>
                    <Ionicons name="eye-off" color={back} size={30} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    return (
        <View style={style.container}>
            <Text style={style.title}>{t('rappel7')}</Text>
            <ScrollView>
                {
                    elements?.map((el)=>{
                        return <View key={Math.floor(Math.random() * 100)}>
                            <Card item={el} />
                        </View>
                    })
                }
            </ScrollView>
            {elements.length <50 && <TouchableOpacity style={{position: "absolute", bottom: 5, backgroundColor: chart, borderRadius: 15, padding: 5, left: 10}} onPress={()=>nav.navigate("rappel/add")}>
                <Ionicons name="add" color={back} size={35} />
            </TouchableOpacity>}
        </View>
    );
}