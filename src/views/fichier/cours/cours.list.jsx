import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity, Keyboard, FlatList, Linking, Platform, KeyboardAvoidingView } from "react-native";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput } from "@react-native-material/core";
import SimpleHeader from "../../../template/header/simpleHeader";
import { API, Get, Send } from "../../../api/service";
import DropDownPicker from "react-native-dropdown-picker";
import { adaptSelect } from "../../../api/functions";
import * as DocumentPicker from 'expo-document-picker';
import Toast from "react-native-toast-message";
import RNModal from "react-native-modal";


export default function CoursListe() {
    
    const front= useSelector((state)=>state.themeReducer.front)
    const back= useSelector((state)=>state.themeReducer.back)
    const chart= useSelector((state)=>state.themeReducer.chart)

    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const loading= useSelector((state)=>state.userReducer.loading);

    const nav=  useNavigation()
    const route= useRoute()
    const [fichiers, setFichiers]= useState([]);
    const [filtre, setFilter] = useState('');

    const cours= route?.params?.cours

    const [open, setOpen] = useState(false);
    const [open2, setOpen2]= useState(false);
    const [show, setShow]= useState(false);
    const [classe, setClasse] = useState("");
    const [classes, setClasses] = useState([]);

    const [label, setLabel]= useState("");
    const [file, setFile]= useState(null);
    //const [item, setItem]= useState("");

    const [isSending, setIsSending]= useState(false);


    useMemo(()=>{
        Get("/classe/all/school/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setClasses(rs?.classes);
                }
            }
        ).catch(()=>{})
    }, [loading]);

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader  />
            }, 
            headerShown: true
        })
    }, []);

    useMemo(()=>{
        Get("/document/all/school/"+user?.ecole?._id+"/false/"+cours, token).then(
            (rs)=>{
                if(!rs?.error){
                    setFichiers(rs?.documents);
                }
            }
        ).catch(()=>{})
    }, [file, show, loading]);

    const pop= ()=>{
        return(
            <RNModal style={{backgroundColor: chart, margin: 15, marginTop: 150, marginBottom: 100, flex: 1}}
                isVisible={show} animationInTiming={500} animationOutTiming={500} 
                backdropTransitionInTiming={500} backdropTransitionOutTiming={500}>
                    <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()} style={{flex: 1}}>
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={300} >
                            <View>
                                
                                <View style={[style.block, {zIndex: 3}]}>
                                    <TextInput placeholder={"titre du document *"} inputStyle={{color:"black"}} onChangeText={setLabel}
                                        {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                                        multiline
                                    />
                                </View>

                                <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 3, alignItems: "center"}}>
                                
                                    <View style={[style.block, {zIndex: 4, width: "45%"}]}>
                                        <Text style={style.text}>Quelle classe </Text>
                                        <DropDownPicker placeholder="Veuillez choisir" //onSelectItem={setItem}
                                            open={open2} value={classe} items={adaptSelect(classes)} searchable listMode="SCROLLVIEW"
                                            setOpen={setOpen2} setValue={setClasse} maxHeight={250} setItems={setClasses} 
                                            //theme="DARK"
                                            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                        />
                                    </View>

                                    <View style={[style.block, {zIndex: 2, width: "45%"}]}>
                                        <Text style={style.text}>  </Text>
                                        <TouchableOpacity onPress={handleDocumentSelection} style={{backgroundColor:back, borderRadius: 20, padding: 5}}>
                                            <Text style={[style.text, {color: "black"}]}>{!file ? "choix du document" : "fichier choisi"}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                                    <View >
                                        <TouchableOpacity onPress={()=>{setShow(false); setLabel("")}} style={[style.btn2, {backgroundColor: "red"}]}>
                                            <Text style={style.text}>Annuler</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View >
                                        <TouchableOpacity disabled={isSending} onPress={handleAdd} style={[style.btn2, {backgroundColor: "green"}]}>
                                            <Text style={style.text}>Ajouter</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
            </RNModal>
        );
    }

    function handleAdd(){
        const exist= fichiers.find((val)=> val?.label=== label && val?.classe===classe)!==undefined
        if(exist){
            Toast.show({
                text1: "erreur", text2: "ce document existe déjà",
                topOffset: 50, type:"error"
            })
        }else{
            if(label!=="" && file !==null && classe !==""){
                setIsSending(true);
                let f={
                    name: file?.name,
                    type: file?.mimeType,
                    uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
                }
                let doc1= {
                    label: label, ecole: user?.ecole?._id, cours: cours, classe: classe,
                    anneeScolaire: user?.ecole?.anneeScolaire
                } 
                const form0= new FormData()
                form0.append("document", JSON.stringify(doc1))
                form0.append("file", f)
                Send("/document/new", form0, false, token).then(
                    (r)=>{
                        if(!r?.error){
                            Toast.show({
                                text1: "message", text2: "document bien sauvegardé",
                                topOffset: 50
                            })
                            setLabel(""); setFile(null); setClasse(""); setShow(false)
                        }else{
                            Toast.show({
                                text1: "erreur", text2: "fichier non sauvegardé",
                                topOffset: 50, type:"error"
                            })
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: "erreur", text2: "problème de sauvegarde",
                        topOffset: 50, type:"error"
                    })
                });
                setIsSending(false);
            }else{
                Toast.show({
                    text1: "erreur", text2: "veuillez saisir les champs", topOffset: 50, type:"error"
                })
            }
        }
    }

    function handleClick(item){
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

    const style = StyleSheet.create({
        container:{
            flex: 1
        },
        info:{color: front, fontSize: 15, opacity: 0.8, margin: 10, textAlign: "center", maxWidth: "80%"},
        head:{display: "flex", flexDirection: "row", justifyContent:"space-around", alignItems: "center"},
        btn:{padding: 10, backgroundColor: chart, color: "white", margin :10, borderRadius: 10},
        card:{
            backgroundColor: back, borderColor: front, borderWidth: 0.2, margin: 7, borderRadius: 30, 
            padding: 5, display: "flex", flexDirection: "row", alignItems: "center"
        },
        flat:{padding: 5, alignItems: "stretch"},
        block:{marginLeft: 20, padding: 10, marginRight: 20, marginTop: 5},
        input:{borderRadius: 30},
        lottie:{position:"absolute", width: "100%", height:"100%"}, 
        text: {fontSize: 15, padding: 5, fontStyle: "italic", color: back, fontWeight: "bold"},
        btn2:{backgroundColor: "red",  borderRadius: 2, justifyContent: "center", alignItems: "center", margin: 2}
    })

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.getDocumentAsync({});
            if(!response?.canceled){
                setFile(response?.assets[0]);
            }
        } catch (err) {
            Toast.show({text1: "Information", text2: "aucun fichier sélectionné", type: "info"})
        }
    }, []);

    function LibelleFilter(){
        const props={
            clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
            enablesReturnKeyAutomatically: true, variant:"outlined"
        }
        return (
            <View style={{zIndex: 5, display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
                <View style={{width: "45%"}}>
                    <TextInput placeholder="filtrer par libellé" {...props} onChangeText={setFilter} inputStyle={{color: front}}  
                        returnKeyLabel="filtrer" onSubmitEditing={()=>Keyboard.dismiss()}
                    />
                </View>
                <View style={{width: "45%"}}>
                    <DropDownPicker 
                        placeholder="trier par classe"
                        open={open} value={classe} items={adaptSelect(classes)}
                        setOpen={setOpen} setValue={setClasse} setItems={setClasses}
                    />
                </View>
            </View>
        );
    }

    function Card({item}){
        return (<TouchableOpacity key={Math.floor(Math.random() * 100)} style={[style.card,{justifyContent: "space-between"}]} onPress={()=> handleClick(item)}>
            <View style={[style.card, {borderWidth:0}]} key={Math.floor(Math.random() * 100)}>
                <Ionicons name="book" size={30} color={"skyblue"} />
                <Text style={style.info}>{item?.label?.slice(0, 20)+"..."}</Text>
            </View>
            <Ionicons name="md-arrow-forward" size={30} color={front} />
        </TouchableOpacity>);
    }

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return (
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}> 
            <View style={style.container}>
                {pop()}
                <View style={[style.head, {zIndex: 5}]}>
                    {LibelleFilter()}
                </View>
                <View style={{ marginBottom: 20, zIndex: 1 }}>
                    <FlatList key={"flat"} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} scrollEnabled={fichiers?.length >=7} 
                        contentContainerStyle={style.flat} data={fichiers?.filter((doc)=>doc?.libelle?.toLowerCase()?.includes(filtre?.toLowerCase())).filter((docu)=>docu?.classe?.includes(classe))} 
                        //keyExtractor={({index, item})=> index}
                        renderItem={({index, item})=> {
                            return (<View key={index}>
                                <Card item={item} key={item?.id} />
                            </View>);
                        }}
                    />
                </View>
                {user?.type!=="Eleve" && <View style={{position: "absolute", bottom: 25, right: 10}}>
                    <TouchableOpacity style={style.btn} onPress={()=>setShow(true)}>
                        <Ionicons name="add" size={35} color={back} />
                    </TouchableOpacity>
                </View>}
            </View>
        </TouchableWithoutFeedback>
    );
}