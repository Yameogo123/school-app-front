import { useNavigation } from "@react-navigation/native";
import React, {useEffect, useMemo, useState} from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FichierHeader from "../../../template/header/fichierHeader";
import { useSelector } from "react-redux";
import { Get, Remove, Update } from "../../../api/service";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export default function Rappels(){

    const nav= useNavigation();
    const [elements, setElements]=useState([]);
    const front= useSelector((state)=>state.themeReducer.front);
    const back= useSelector((state)=>state.themeReducer.back);
    const chart= useSelector((state)=>state.themeReducer.chart);

    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const loading= useSelector((state)=>state.userReducer.loading);

    const [action, setAction]=useState(true);

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
                //console.log(rs);
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
        Alert.alert("confirmation", "voulez vous confirmer la suppression?", [
            {text:'annuler', style:"cancel"}, 
            {text: "confirmer", onPress: ()=>{
                Remove("/rappel/"+id, token).then(
                    (rp)=>{
                        if(rp?.error){
                            Toast.show({
                                text1: "erreur", text2: "la suppression a échoué",
                                topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message", text2: "rappel mémoire supprimé",
                                topOffset: 50
                            })
                            setAction(!action);
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: "erreur", text2: "problème de suppression",
                        topOffset: 50, type:"error"
                    })
                })
            }}
        ], {cancelable: true})
    }

    function handleArchive(el){
        Alert.alert("confirmation", "voulez vous archiver ce élément?", [
            {text:'annuler', style:"cancel"}, 
            {text: "confirmer", onPress: ()=>{
                const element= {...el, archive: true}
                Update("/rappel/update",{rappel: element}, true, token).then(
                    (rp)=>{
                        if(rp?.error){
                            Toast.show({
                                text1: "erreur", text2: "l'archivage a échoué",
                                topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message", text2: "rappel archivé",
                                topOffset: 50
                            })
                            setAction(!action);
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: "erreur", text2: "problème d'archivage",
                        topOffset: 50, type:"error"
                    })
                })
            }}
        ], {cancelable: true})
    }

    function Card({item}){

        return (
            <TouchableOpacity key={item?.id} style={style.card} onPress={()=>nav.navigate("rappel/add", {doc:item})}>
                <Text>{item?.libelle}</Text>
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
            <Text style={style.title}>Votre liste de rappel mémoire</Text>
            <ScrollView>
                {
                    elements?.map((el)=>{
                        return <View key={el?._id}>
                            <Card item={el} />
                        </View>
                    })
                }
            </ScrollView>
            {elements.length <50 && <TouchableOpacity style={{position: "absolute", bottom: 5, backgroundColor: "green", borderRadius: 15, padding: 5, left: 10}} onPress={()=>nav.navigate("rappel/add")}>
                <Ionicons name="add" color={back} size={35} />
            </TouchableOpacity>}
        </View>
    );
}