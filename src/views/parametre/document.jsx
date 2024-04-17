import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Alert, SectionList, Keyboard, TouchableWithoutFeedback, Linking, Platform, KeyboardAvoidingView } from "react-native";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleHeader from "../../template/header/simpleHeader";
import { useNavigation } from "@react-navigation/native";
import RNModal from "react-native-modal";
import { TextInput } from "@react-native-material/core";
import SelectDropdown from 'react-native-select-dropdown';
import Toast from "react-native-toast-message";
//import DocumentPicker from 'react-native-document-picker';
import * as DocumentPicker from 'expo-document-picker';
import { API, Get, Remove, Send, Update } from "../../api/service";
import { groupBy } from "lodash";


export default function Document(){

    const nav=  useNavigation();
    const front= useSelector((state)=>state.themeReducer.front);
    const back= useSelector((state)=>state.themeReducer.back);
    const chart= useSelector((state)=>state.themeReducer.chart);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const loading= useSelector((state)=>state.userReducer.loading);

    const [show, setShow] = useState(false);
    const [type, setType]= useState("");
    const [libelle, setLibelle]= useState("");
    const [fileResponse, setFileResponse] = useState(null);

    const [update, setUpdate]=useState(false);

    const [datas, setDatas]= useState([]);

    const [isSending, setIsSending]= useState(false);

    function groupIt(array){
        let arr= groupBy(array, 'type')
        const keys= Object.keys(arr);
        let res=[];
        for(let k of keys){
            const obj= {title: k, data: arr[k]}
            res.push(obj)
        }
        return res
    }
 
    const types= ["personnel", "scolarite"];

    useMemo(()=>{
        //+user?._id
        Get("/document/all/user/"+user?._id, token).then(
            (rs)=>{
                //console.log(groupIt(rs?.documents));
                if(!rs?.error){
                    setDatas(groupIt(rs?.documents));
                }
            }
        ).catch(()=>{})
    }, [update, loading]); 

    const style = StyleSheet.create({
        container:{flex: 1, marginBottom: 50},
        text: {fontSize: 20, color: front, textAlign: "center", padding: 5, margin: 10},
        header: {
            fontSize: 20, backgroundColor: back, fontWeight: "bold", textAlign: "center",
            paddingTop: 20, paddingBottom: 10
        },
        title: {
            fontSize: 20, color: front, textAlign: "center"
        },
        item:{
            margin: 5, borderWidth: 0.3, borderRadius: 20, padding: 20, backgroundColor: back
        },
        input:{backgroundColor: back, marginLeft: 30, marginRight: 30, marginTop: 20, borderRadius: 30},
        item2:{
            flexDirection: "row", justifyContent: "space-around", padding: 20
        }
    });

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.getDocumentAsync({});
            if(!response?.canceled){
                setFileResponse(response?.assets[0]);
            }
        } catch (err) {
            //console.warn(err);
            Toast.show({text1: "Information", text2: "aucun fichier sélectionné", type: "info"});
        }
    }, []);

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    function handleSave(){
        if(type!=="" && libelle !=="" && fileResponse !==null){
            setIsSending(true);
            let file={
                name: fileResponse?.name,
                type: fileResponse?.mimeType,
                uri: Platform.OS === 'ios' ? fileResponse.uri.replace('file://', '') : fileResponse.uri,
            }
            const document= {type:type, label: libelle, ecole: user?.ecole?._id, user: user?._id}
            const form0= new FormData()
            form0.append("document", JSON.stringify(document))
            form0.append("file", file)
            Send("/document/new", form0, false, token).then(
                (r)=>{ 
                    if(!r?.error){
                        // const use2= {...rs.user, identite: r?.document?._id}
                        // upd(use2)
                        setShow(false);
                        Toast.show({
                            text1: "message", text2: "document créé avec succès", topOffset: 50
                        })
                        setLibelle(""); setType(""); setFileResponse(null); setUpdate(!update);
                    }else{
                        Toast.show({
                            text1: "erreur", text2: "problème d'ajout du fichier.",
                            topOffset: 50, type:"error"
                        })
                    }
                }
            ).catch(()=>{});
            setIsSending(false)
        }else{
            Toast.show({
                text1: "erreur", text2: "veuillez saisir les champs",
                topOffset: 50, type:"error"
            })
        }
        
    }

    const pop= ()=>{
        return (
            <RNModal onBackdropPress={()=>setShow(false)}
                isVisible={show} animationInTiming={500} animationOutTiming={500}
                backdropTransitionInTiming={500} backdropTransitionOutTiming={500}
            >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={200} >
                    <View style={{ justifyContent: 'center', backgroundColor: back, borderRadius: 20, padding: 20, height: 500}}>                        
                        <Text style={[style.text, {color: chart}]}>nouveau document</Text>

                        <TextInput placeholder={"libelle du fichier"} leading={<Ionicons name="md-pencil-outline" size={20} color={front} />} 
                            {...props} onChangeText={setLibelle} inputStyle={{color:front}}
                        />

                        <View style={{ justifyContent: "space-between", marginTop: 25, alignItems: "center"}}>
                            <SelectDropdown buttonStyle={{ width: "85%", backgroundColor: chart, color: "white", borderRadius: 20}} 
                                buttonTextStyle={{ color: "white"}}
                                data={types} defaultButtonText="Choix de la catégorie."
                                onSelect={(selectedItem, index) => {
                                    setType(selectedItem)
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item
                                }}
                            />
                            <TouchableOpacity onPress={handleDocumentSelection} style={{backgroundColor:chart, margin : 35, width: "85%", borderRadius: 20}}>
                                <Text style={[style.text, {color: "white"}]}>{!fileResponse ? "choix de fichier" : "fichier choisi"}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity disabled={isSending} onPress={handleSave} style={{backgroundColor: "green", margin : 35, borderRadius: 20}}>
                            <Text style={[style.text, {color: "white"}]}>Enregistrer</Text>
                        </TouchableOpacity>
                    </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </RNModal>
        )
    }

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader />
            }, 
            headerShown: true
        });
        //console.log()
    }, []);

    function handleDetail(item){
        const libelle= item?.libelle;
        const isPdf= libelle?.includes(".pdf");
        if(!isPdf){
            Linking.openURL(API+"/document/show/"+item?.libelle).then(
                (rs)=>{
                    //console.log(rs);
                }
            ).catch(()=> {})
        }else{
            nav.navigate("pdf", {document: API+"/document/show/"+libelle})
        }
    }

    function upd(data){
        Update("/user/update", data, true, token).then(
            (rp)=>{
                if(rp?.error){
                    Toast.show({
                        text1: "erreur", text2: "la mise à jour de l'utilisateur a échoué", topOffset: 50, type:"error"
                    })
                }else{
                    Toast.show({
                        text1: "message", text2: "document joint avec succès", topOffset: 50
                    })

                }
            }
        )
    }

    function handleDelete(item){
        Alert.alert(
            "confirmation", "Voulez vous vraiment supprimer ce fichier",
            [
                {text: "non"},
                {text: "oui", onPress: ()=>{
                    Remove("/document/delete/"+item?.libelle, token).then(
                        (rp)=>{
                            if(!rp?.error){
                                if(item?.label==="ID"){
                                    const use= {...user, identite: undefined}
                                    upd(use)
                                }else if(item?.label==="profil"){
                                    const use1= {...user, photo: undefined}
                                    upd(use1)
                                }
                                Toast.show({
                                    text1: "message", text2: "Fichier supprimé avec succès", topOffset: 50
                                })
                                setUpdate(!update)
                            }else{
                                Toast.show({
                                    text1: "erreur", text2: "erreur de suppression", topOffset: 50, type:"error"
                                })
                            }
                        }
                    ).catch((err)=>{
                        console.log();
                        Toast.show({
                            text1: "erreur", text2: "erreur de suppression du fichier", topOffset: 50, type:"error"
                        })
                    })
                    
                }}
            ]
        )
    }

    return (
        <View style={style.container}>
            <Text style={style.text}>Les documents</Text>

            <TouchableOpacity onPress={()=>setShow(true)} >
                <Text style={[style.text, {color: "blue"}]}>ajouter des documents</Text>
            </TouchableOpacity>

            <SectionList stickyHeaderHiddenOnScroll stickySectionHeadersEnabled
                sections={datas} showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => (
                    <View style={style.item}>
                        <Text style={style.title}>{item?.label}</Text>
                        <View style={style.item2}>
                            <TouchableOpacity style={{margin: 5}} onPress={()=>handleDetail(item)}>
                                <Ionicons name="eye" color={"green"} size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isSending} style={{margin: 5}} onPress={()=>handleDelete(item)}>
                                <Ionicons name="trash-bin" color={"tomato"} size={30} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                renderSectionHeader={({section: {title}}) => (
                    <Text style={style.header}>{title}</Text>
                )}
            />

            {pop()}
        </View>
    );
}