import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import AdminHeader from "../../../template/header/adminHeader";
import { useSelector } from "react-redux";
import { TextInput } from "@react-native-material/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Get, Remove, Send, Update } from "../../../api/service";
import Toast from "react-native-toast-message";
import RNModal from "react-native-modal";
import prompt from 'react-native-prompt-android';


export default function Salle(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [libelle, setLibelle]= useState("");
    const [filter, setFilter]= useState("");
    const [show, setShow]= useState(false);
    const nav=  useNavigation();
    const [tbHead, setTbHead]= useState(["libellé", "edit", "action"]);
    const [tbData, setTbData]= useState([]);

    useEffect(()=>{
        nav.setOptions({
            header : ()=> {
                return <AdminHeader />
            }, 
            headerShown: true
        })
    }, []);

    useMemo(()=>{
        Get("/salle/all/ecole/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setTbData(rs?.salles)
                }
            }
        ).catch(()=>{})
    }, [libelle]);

    const pop= ()=>{
        return(
            <RNModal
                isVisible={show} animationInTiming={500} animationOutTiming={500} 
                backdropTransitionInTiming={500} backdropTransitionOutTiming={500}>
                    <View>
                        <View style={style.block}>
                            <TextInput placeholder={"saisir un libelle"} inputStyle={{color:"black"}} onChangeText={setLibelle}
                                {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                            />
                        </View>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                            <View >
                                <TouchableOpacity onPress={()=>{setShow(false); setLibelle("")}} style={[style.btn2, {backgroundColor: "red"}]}>
                                    <Text style={style.text}>Annuler</Text>
                                </TouchableOpacity>
                            </View>
                            <View >
                                <TouchableOpacity onPress={handleNew} style={[style.btn2, {backgroundColor: "green"}]}>
                                    <Text style={style.text}>Ajouter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
             </RNModal>
        );
    }

    const handleRemove = (id) => {
        Alert.alert("validation", "voulez vous vraiment supprimer cette salle", [
            {text:"annuler"},
            {text: "continuer", onPress: ()=>{
                setLibelle("..")
                Remove("/salle/"+id, token).then(
                    (rs)=>{
                        if(rs.error){
                            Toast.show({
                                text1: "erreur",
                                text2: "la suppression a échoué",
                                topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message",
                                text2: "salle bien supprimée",
                                topOffset: 50
                            })
                            setLibelle("")
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: "erreur",
                        text2: "la suppression a échoué",
                        topOffset: 50, type:"error"
                    })
                })
            }}
        ], {cancelable: true})
    }

    const handleNew = () => {
        const exist= tbData.find((val)=> val?.libelle=== libelle)!==undefined
        if(exist){
            Toast.show({
                text1: "erreur",
                text2: "cette salle existe déjà",
                topOffset: 50, type:"error"
            })
        }else{
            Send("/salle/new", {"salle": {"libelle": libelle, ecole: user?.ecole?._id}}, true, token).then(
                (rs)=>{
                    if(rs?.error){
                        Toast.show({
                            text1: "erreur",
                            text2: "erreur d'ajout de salle",
                            topOffset: 50, type:"error"
                        })
                    }else{
                        Toast.show({
                            text1: "message",
                            text2: "salle bien ajoutée",
                            topOffset: 50
                        })
                        setLibelle("")
                        setShow(false)
                    }
                }
            ).catch(()=>{
                Toast.show({
                    text1: "erreur", text2: "erreur d'ajout de salle",
                    topOffset: 50, type:"error"
                })
            })
        }
    }

    const handleEdit= (id) => {
        const salle= tbData.find((val)=> val?._id=== id)
        prompt("modification", "changement du libellé de la salle "+salle?.libelle, [
            {text:"annuler", style: "cancel"},
            {text: "continuer", onPress: (text)=>{
                setLibelle(".");
                Update("/salle/update", {"salle": {"libelle": text, ecole: user?.ecole?._id, _id: id}}, true, token).then(
                    (rs)=>{
                        if(rs?.error){
                            Toast.show({
                                text1: "erreur",
                                text2: "erreur de modification de la salle",
                                topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message",
                                text2: "salle modifié",
                                topOffset: 50
                            })
                            setLibelle("")
                            setShow(false)
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: "erreur",
                        text2: "erreur de modification de la salle",
                        topOffset: 50, type:"error"
                    })
                })
            }},
        ],
        {
            cancelable: true,
            type: "plain-text",
            //defaultValue: 'test',
            placeholder: 'saisir le nouveau libellé'
        });
    }

    const element = (id) => (
        <TouchableOpacity onPress={() => handleRemove(id)} style={style.btn}>
            <Ionicons name="trash" size={25} color={chart} />
        </TouchableOpacity>
    );

    const element1 = (id) => (
        <TouchableOpacity onPress={() => handleEdit(id)} style={[style.btn, {backgroundColor: "blue"}]}>
            <Ionicons name="pencil" size={25} color={chart} />
        </TouchableOpacity>
    );

    const style= StyleSheet.create({
        container:{
            flex: 1
        },
        title:{fontWeight: "bold", fontSize: 25, padding: 5},
        text:{fontSize: 15, padding: 5, fontStyle: "italic", color: back, fontWeight: "bold"},
        block:{marginLeft: 20, padding: 10, marginRight: 20, marginTop: 5},
        input:{ marginTop: 2, borderRadius: 30},
        part2:{borderTopRightRadius:50, backgroundColor: chart, flex:1},
        row: { flexDirection: 'row', backgroundColor: chart },
        btn: { width: 58, height: 28, backgroundColor: "red",  borderRadius: 2, justifyContent: "center", alignItems: "center", margin: 2 },
        btnText: { textAlign: 'center', color: front, fontWeight: "bold" }, 
        btn2:{backgroundColor: "red",  borderRadius: 2, justifyContent: "center", alignItems: "center", margin: 2}
    });

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return (
        <>
            <View style={style.container}>
                <View style={style.block}>
                    <TextInput placeholder={"filtrer par libelle"} inputStyle={{color:"black"}} onChangeText={setFilter}
                        {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                    />
                </View>
                <View style={style.part2} onTouchStart={()=>Keyboard.dismiss()}>
                    <View style={[style.block, {marginBottom: 80}]}>
                        <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: 15}}>
                            <Text style={[style.text, {width: "64%"}]}>Liste des salles disponibles</Text>
                            <View style={{width: "24%"}}>
                                <TouchableOpacity onPress={()=> setShow(true)} style={[style.btn, {backgroundColor: back}]}>
                                    <Ionicons name="add" size={25} color={chart} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Table borderStyle={{borderColor: 'transparent'}}>
                                <Row data={tbHead} style={style.head} textStyle={style.text}/>
                                {
                                    tbData.filter((el)=> el?.libelle.toLowerCase().includes(filter.toLowerCase())).map((row) => (
                                        <TableWrapper key={Math.random()} style={style.row}>
                                            <Cell key={Math.random()} data={row?.libelle} textStyle={style.text}/>
                                            <Cell key={Math.random()} data={element1(row?._id)} textStyle={style.text}/>
                                            <Cell key={Math.random()} data={element(row?._id)} textStyle={style.text}/>
                                        </TableWrapper>
                                    ))
                                }
                            </Table>
                        </ScrollView>
                    </View>
                </View>
                {pop()}
            </View>
        </>
    );
}