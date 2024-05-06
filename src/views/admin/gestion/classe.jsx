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
import prompt from 'react-native-prompt-android';
import { useTranslation } from "react-i18next";

export default function Classe(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [libelle, setLibelle]= useState("");
    const [filter, setFilter]= useState("");
    const nav=  useNavigation();
    const [tbHead, setTbHead]= useState(["libellé", "edit", "action"]);
    const [tbData, setTbData]= useState([]);
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
        Get("/classe/all/school/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setTbData(rs?.classes)
                }
            }
        ).catch(()=>{})
    }, [libelle]);

    

    const handleRemove = (id) => {
        Alert.alert("validation", t("rappel1"), [
            {text: t("cancel")},
            {text: t("continue"), onPress: ()=>{
                setLibelle("..");
                Remove("/classe/"+id, token).then(
                    (rs)=>{
                        if(rs.error){
                            Toast.show({
                                text1: t('file4'), text2: t('file4'), topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message", text2: t("rappel8"), topOffset: 50
                            })
                            setLibelle("");
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: t('file4'), text2: t('file4'), topOffset: 50, type:"error"
                    })
                })
            }}
        ], {cancelable: true})
    }

    const handleNew = () => {
        prompt(t("admin60"), t("admin61"), [
            {text:t("cancel"), style: "cancel"},
            {text: t("continue"), onPress: (text)=>{
                const exist= tbData.find((val)=> val?.libelle=== text)!==undefined
                if(exist){
                    Toast.show({
                        text1: t('file4'), text2: t("admin62"), topOffset: 50, type:"error"
                    })
                }else{
                    setLibelle("..")
                    Send("/classe/new", {"classe": {"libelle": text, ecole: user?.ecole?._id}}, true, token).then(
                        (rs)=>{
                            if(rs?.error){ 
                                Toast.show({
                                    text1: t('file4'), text2: t('file4'),
                                    topOffset: 50, type:"error"
                                })
                            }else{
                                Toast.show({
                                    text1: "message", text2: t("admin5"),
                                    topOffset: 50
                                })
                                setLibelle("");
                            }
                        }
                    ).catch(()=>{
                        Toast.show({
                            text1: t('file4'), text2: t('file4'),
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
        prompt("modification", t("admin61"), [
            {text: t("cancel"), style: "cancel"},
            {text: t("continue"), onPress: (text)=>{
                setLibelle(".")
                Update("/classe/update", {"classe": {"libelle": text, ecole: user?.ecole?._id, _id: id}}, true, token).then(
                    (rs)=>{
                        if(rs?.error){
                            Toast.show({
                                text1: t('file4'), text2: t('file4'),
                                topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message", text2: t("admin58"),
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

    const element = (id) => (
        <TouchableOpacity onPress={() => handleRemove(id)} style={style.btn}>
            <Ionicons name="trash" size={25} color={chart} />
        </TouchableOpacity>
    );

    const element1 = (el) => (
        <TouchableOpacity onPress={() => handleEdit(el)} style={[style.btn, {backgroundColor: "blue"}]}>
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
        btnText: { textAlign: 'center', color: front, fontWeight: "bold" }
    });

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return (
        <>
            <View style={style.container}>
                <View style={style.block}>
                    <TextInput placeholder={t("cours5")} inputStyle={{color:"black"}} onChangeText={setFilter}
                        {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                    />
                </View>
                <View style={style.part2} onTouchStart={()=>Keyboard.dismiss()}>
                    <View style={[style.block, {marginBottom: 80}]}>
                        <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: 15}}>
                            <Text style={[style.text, {width: "64%"}]}>{t('admin63')}</Text>
                            <View style={{width: "24%"}}>
                                <TouchableOpacity onPress={() => handleNew()} style={[style.btn, {backgroundColor: back}]}>
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
            </View>
        </>
    );
}