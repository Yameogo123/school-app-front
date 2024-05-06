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
import DropDownPicker from "react-native-dropdown-picker";
import { adaptSelect } from "../../../api/functions";
import prompt from 'react-native-prompt-android';
import { useTranslation } from "react-i18next";


export default function Cours(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [libelle, setLibelle]= useState("");
    const [filter, setFilter]= useState("");
    const [show, setShow]= useState(false);

    const [professeurs, setProfesseurs]= useState([]);
    const [professeur, setProfesseur]= useState(null);

    const [open1, setOpen1]= useState(false);

    const [cour, setCour]= useState(null);

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
        Get("/cours/all/ecole/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setTbData(rs?.cours)
                }
            }
        ).catch(()=>{})
    }, [libelle]);

    useMemo(()=>{
        Get("/user/all/Professeur/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setProfesseurs(rs?.users)
                }
            }
        ).catch(()=>{})
    }, [libelle]);

    const [tbHead, setTbHead]= useState(["libellé", "detail", "action"]);
    const [tbData, setTbData]= useState([]);

    const pop= ()=>{

        return(
            <RNModal style={{backgroundColor: chart, margin: 5, marginTop: 150, marginBottom: 200, borderRadius: 50}}
                isVisible={show} animationInTiming={500} animationOutTiming={500} 
                backdropTransitionInTiming={500} backdropTransitionOutTiming={500}>
                    <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>

                            <View style={[style.block, {zIndex: 4}]}>
                                <Text style={style.text}>{t('admin68')} ? </Text>
                                <DropDownPicker placeholder={t("comptabilite2")}  //onSelectItem={(item)=> console.log(item)}
                                    open={open1} value={professeur} items={adaptSelect(professeurs, 1)} searchable
                                    setOpen={setOpen1} setValue={setProfesseur} maxHeight={250} listMode="SCROLLVIEW"
                                    setItems={setProfesseurs} 
                                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                />
                            </View>

                            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: 20}}>
                                <View >
                                    <TouchableOpacity onPress={()=>{setShow(false); setProfesseur(null)}} style={[style.btn2, {backgroundColor: "red", width: 150}]}>
                                        <Text style={style.text}>{t("cancel")} </Text>
                                    </TouchableOpacity>
                                </View>
                                <View >
                                    <TouchableOpacity disabled={isSending} onPress={()=>handleUpdate(out=false)} style={[style.btn2, {backgroundColor: "green", width: 150}]}>
                                        <Text style={style.text}>{t("continue")} </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView style={[style.block, {zIndex: 3}]} showsVerticalScrollIndicator={false}>
                                <Text style={style.text}>{t('admin69')}</Text>
                                {
                                    cour?.professeurs?.map(
                                        (prof, id)=>{
                                            return (<View key={id} style={{flexDirection: "row", justifyContent: "space-around"}}>
                                                <View style={[style.block, {zIndex: 4, width: "45%"}]}>
                                                    <Text style={[style.text, {color: back}]}>{prof?.nom +" "+prof?.prenom}</Text>
                                                </View>
                                                <View style={[style.block, {zIndex: 4, width: "45%"}]}>
                                                    <TouchableOpacity onPress={()=>handleUpdate(out=true, prof?._id)} style={[style.btn2, {backgroundColor: "red"}]}>
                                                        <Text style={style.text}>{t('admin70')}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>)
                                        }
                                    )
                                }
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
             </RNModal>
        );
    }

    function handleUpdate(out,  prof_id=null){
        let id = prof_id
        if (prof_id==null) {
            id= professeur
        }
        if(id!==null && cour!=null){
            let profs =cour?.professeurs?.filter((pr)=>pr?._id!==id);
            const exist= cour?.professeurs?.find((pr)=>pr?._id===id)!==undefined && !out;
            if(exist){
                Toast.show({
                    text1: t('file4'), text2: t("admin71"),
                    topOffset: 50, type: "error"
                })
                return
            }
            if(!out){
                profs =[...profs, id];
            }
            const item= {...cour, professeurs: profs}
            setIsSending(true);
            Update("/cours/update", {"cours": item}, true, token).then(
                (rs)=>{
                    if(rs?.error){
                        Toast.show({
                            text1: t('file4'), text2: t('file4'),
                            topOffset: 50, type:"error"
                        })
                    }else{ 
                        Toast.show({ 
                            text1: "message", text2: t('admin58'),
                            topOffset: 50
                        })
                        setProfesseur(null); setShow(false)
                    }
                    setIsSending(false);
                } 
            ).catch(()=>{
                Toast.show({
                    text1: t('file4'), text2: t('file4'), topOffset: 50, type:"error"
                })
                setIsSending(false);
            })
        }else{
            Toast.show({
                text1: t('file4'), text2: t("comptabilite2"), topOffset: 50, type:"error"
            })
        }
    }


    const handleRemove = (id) => {
        Alert.alert("validation", t("rappel1"), [
            {text: t("cancel")},
            {text: t("continue"), onPress: ()=>{
                setLibelle("..")
                Remove("/cours/"+id, token).then(
                    (rs)=>{
                        if(rs.error){
                            Toast.show({
                                text1: t('file4'), text2: t('file4'), topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message", text2: t("rappel8"), topOffset: 50
                            })
                            setLibelle("")
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: t('file4'),
                        text2: t('file4'),
                        topOffset: 50, type:"error"
                    })
                })
            }}
        ], {cancelable: true})
    }

    const handleNew = () => {
        prompt(t('admin60'), t("admin61"), [
            {text: t("cancel"), style: "cancel"},
            {text: t("continue"), onPress: (text)=>{
                const exist= tbData.find((val)=> val?.libelle=== text)!==undefined
                if(exist){
                    Toast.show({
                        text1: t('file4'),
                        text2: t("cours9"),
                        topOffset: 50, type:"error"
                    })
                }else{
                    setLibelle("..")
                    Send("/cours/new", {"cours": {"libelle": text, ecole: user?.ecole?._id}}, true, token).then(
                        (rs)=>{
                            if(rs?.error){ 
                                Toast.show({
                                    text1:t('file4'), text2: t('file4'),
                                    topOffset: 50, type:"error"
                                })
                            }else{
                                Toast.show({
                                    text1: "message", text2: t('rappel8'),
                                    topOffset: 50
                                })
                                setLibelle("");
                            }
                        }
                    ).catch(()=>{
                        Toast.show({
                            text1: t('file4'),
                            text2:t('file4'),
                            topOffset: 50, type:"error"
                        })
                    })
                }
            }},
        ], {
            type: "plain-text", cancelable: true
        });
    }

    const handleEdit= (id) => {
        prompt("modification",t("admin61"), [
            {text: t("cancel"), style: "cancel"},
            {text: t("continue"), onPress: (text)=>{
                setLibelle(".")
                Update("/cours/update", {"cours": {"libelle": text, ecole: user?.ecole?._id, _id: id}}, true, token).then(
                    (rs)=>{
                        if(rs?.error){
                            Toast.show({
                                text1: t('file4'), text2: t('file4'),
                                topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message",
                                text2: t('admin58'),
                                topOffset: 50
                            })
                            setLibelle("")
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: t('file4'), text2: t('file4'),
                        topOffset: 50, type:"error"
                    })
                })
            }},
        ], {
            type: "plain-text", cancelable: true
        });
    }

    const element1 = (id) => (
        <View>
            <TouchableOpacity onPress={() => handleRemove(id)} style={style.btn}>
                <Ionicons name="trash" size={25} color={chart} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEdit(id)} style={[style.btn, {backgroundColor: "blue"}]}>
                <Ionicons name="pencil" size={25} color={chart} />
            </TouchableOpacity>
        </View>
    );

    const detail = (item) => (
        <TouchableOpacity 
            onPress={() =>{
                setCour(item); setShow(true)
            }} 
            style={[style.btn, {backgroundColor: back}]}>
            <Ionicons name="eye" size={25} color={chart} />
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
        part2:{borderTopLeftRadius:50, backgroundColor: chart, flex:1},
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
                {pop()}
                <View style={style.block}>
                    <TextInput placeholder={t("cours5")} inputStyle={{color:"black"}} onChangeText={setFilter}
                        {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                    />
                </View>
                <View style={style.part2}onTouchStart={()=>Keyboard.dismiss()} >
                    <View style={[style.block, {marginBottom: 80}]}>
                        <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: 15}}>
                            <Text style={[style.text, {width: "64%"}]}>{t('admin72')}</Text>
                            <View style={{width: "24%"}}>
                                <TouchableOpacity onPress={handleNew} style={[style.btn, {backgroundColor: back}]}>
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
                                            <Cell key={Math.random()} data={row?.libelle} style={{width: "40%"}} textStyle={style.text}/>
                                            <Cell key={Math.random()} data={detail(row)} textStyle={style.text}/>
                                            {/* <Cell key={Math.random()} data={element1(row?._id)} textStyle={style.text}/> */}
                                            <Cell key={Math.random()} data={element1(row?._id)} textStyle={style.text}/>
                                        </TableWrapper>
                                    ))
                                }
                            </Table>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </>
    );
}