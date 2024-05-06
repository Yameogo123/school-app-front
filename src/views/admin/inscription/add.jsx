import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { useSelector } from "react-redux";
import AdminHeader from "../../../template/header/adminHeader";
import DropDownPicker from 'react-native-dropdown-picker';
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { adaptSelect } from "../../../api/functions";
import { Get, Send } from "../../../api/service";
import { TextInput } from "@react-native-material/core";
import { useTranslation } from "react-i18next";

export default function AddInscription(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    
    const [eleves, setEleves]= useState([]);
    const [classes, setClasses]= useState([]);
    const [eleve, setEleve]= useState(null);
    const [classe, setClasse]= useState(null);

    const [inscriptions, setInscriptions]= useState([]);
    const [montant, setMontant]= useState("");

    const [reglements, setReglements]= useState([{libelle: 'mensuel'},{libelle: 'trimestriel'},{libelle: 'semestriel'},{libelle: 'annuel'}]);
    const [reglement, setReglement]= useState(null)

    const [open, setOpen]= useState(false);
    const [open1, setOpen1]= useState(false);
    const [open2, setOpen2]= useState(false);

    const [isSending, setIsSending]= useState(false);
    const {t, _}=useTranslation();

    const nav=  useNavigation();

    useEffect(()=>{
        nav.setOptions({
            header : ()=> {
                return <AdminHeader />
            }, 
            headerShown: true
        })
        
    }, []);

    useMemo(()=>{
        Get("/classe/all/school/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setClasses(rs?.classes)
                }
            }
        ).catch(()=>{})
    }, []);

    useMemo(()=>{
        Get("/user/all/Eleve/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setEleves(rs?.users);
                }
            }
        ).catch(()=>{})
    }, []); 

    useMemo(()=>{
        Get("/inscription/all/ecole/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setInscriptions(rs?.inscriptions);
                }
            }
        ).catch(()=>{})
    }, []);

    function handleValider(){
        if(classe!==null & eleve !==null & reglement!==null & montant!==""){
            let mt= parseFloat(montant);
            if(isNaN(mt)){
                Toast.show({text1: t("file4"), text2: t("admin26"), type: "error", topOffset: 60})
                return 
            }
            let inscrip= {
                classe: classe, eleve: eleve, reglement: reglement, ecole: user?.ecole?._id,
                anneeScolaire: user?.ecole?.anneeScolaire, paye: montant
            }
            const exist= inscriptions.find((ins)=> ins?.eleve===eleve && ins?.anneeScolaire===user?.ecole?.anneeScolaire)!==undefined;
            if(exist){
                Toast.show({
                    text1: t("file4"), text2: t("admin27"),
                    topOffset: 50, type:"error"
                })
            }else{
                setIsSending(true);
                Send("/inscription/new", {"inscription": inscrip}, true, token).then(
                    (rs)=>{
                        if(rs?.error){
                            Toast.show({
                                text1: t("file4"), text2: t("admin28"),
                                topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message", text2: t("admin29"), topOffset: 50
                            })
                            setClasse(null); setEleve(null); setReglement(null);
                        }
                        setIsSending(false)
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: t("file4"), text2: t("admin28"), topOffset: 50, type:"error"
                    })
                    setIsSending(false);
                })
            }
        }else{
            Toast.show({text1: t("admin6"), text2: t("missing1"), type: "error", topOffset: 60})
        }
    }


    const style= StyleSheet.create({
        container: {
            //flex: 1, 
            backgroundColor: back
        },
        head:{
            margin: 15, padding: 10, paddingTop: 20, paddingBottom: 20
        },
        title:{fontWeight: "bold", fontSize: 25, padding: 5},
        text:{fontSize: 15, padding: 5, fontStyle: "italic", color: back},
        part2:{borderTopLeftRadius: 50, backgroundColor: chart, height: 600},
        block:{marginLeft: 20, padding: 15, marginRight: 20, marginTop: 10},
        btn: {shadowColor: "black", shadowOffset: {width: 0.5, height: 1}, shadowOpacity: 0.4, shadowRadius: 20}
    })

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return (
        
            //<TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                    <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
                        <View style={style.head}>
                            <Text style={style.title}>{t('admin30')}</Text>
                            <Text style={[style.text, {color: front}]}>{t("admin8")}</Text>
                        </View>

                        <View style={style.part2}>

                            <View style={[style.block, {zIndex: 5}]}>
                                <Text style={style.text}>{t('admin31')} ? </Text>
                                <DropDownPicker placeholder={t("comptabilite2")} //onSelectItem={(item)=> console.log(item)}
                                    open={open1} value={eleve} items={adaptSelect(eleves, 1)} searchable
                                    setOpen={setOpen1} setValue={setEleve} maxHeight={150} listMode="SCROLLVIEW"
                                    setItems={setEleves} //theme="DARK"
                                    //mode="BADGE"
                                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                />
                            </View>

                            <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 4}}>
                                <View style={[style.block, {zIndex: 4, width: "45%"}]}>
                                    <Text style={style.text}>{t("cours12")} ? </Text>
                                    <DropDownPicker placeholder={t("comptabilite2")}
                                        open={open} value={classe} items={adaptSelect(classes)}
                                        setOpen={setOpen} setValue={setClasse} searchable maxHeight={150}
                                        setItems={setClasses} listMode="SCROLLVIEW" 
                                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                    />
                                </View>

                                <View style={[style.block, {zIndex: 3, width: "45%"}]}>
                                    <Text style={style.text}>{t("admin32")}</Text>
                                    <TextInput {...props} value={montant} onChangeText={setMontant} />
                                </View>
                            </View>

                            <View style={[style.block, {zIndex: 2}]}>
                                <Text style={style.text}>{t('comptabilite1')} </Text>
                                <DropDownPicker placeholder={t("comptabilite2")} //onSelectItem={(item)=> console.log(item)}
                                    open={open2} value={reglement} items={adaptSelect(reglements)}
                                    setOpen={setOpen2} setValue={setReglement} maxHeight={100}
                                    setItems={setReglements} listMode="SCROLLVIEW" //theme="DARK"
                                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                />
                            </View>

                            <View style={[style.block, {zIndex: 1}]}>
                                <TouchableOpacity disabled={isSending} onPress={handleValider} style={[style.btn, {backgroundColor: chart, borderRadius: 30, margin: 40}]}>
                                    <Text style={[style.title, {color: back, textAlign: "center"}]}>{t('continue')}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        
                    </ScrollView>
                </KeyboardAvoidingView>
            //</TouchableWithoutFeedback>
        
        
    )
}