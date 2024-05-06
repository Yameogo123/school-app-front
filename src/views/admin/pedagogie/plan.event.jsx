import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import { useSelector } from "react-redux";
import DropDownPicker from 'react-native-dropdown-picker';
import { adaptSelect } from "../../../api/functions";
import { TextInput } from "@react-native-material/core";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { Get, Send } from "../../../api/service";
import Toast from "react-native-toast-message";
import moment from "moment";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleHeader from "../../../template/header/simpleHeader";
import { useTranslation } from "react-i18next";


export default function PlanEvent(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [libelle, setLibelle]= useState(null);
    const [classes, setClasses]= useState([]);
    const [classe, setClasse]= useState([]);

    const [salles, setSalles]= useState([]);
    const [salle, setSalle]= useState(null)

    const [open, setOpen]= useState(false);
    const [open2, setOpen2]= useState(false);

    const [item2, setItem2]= useState(null);

    const nav=  useNavigation();

    const [jour, setJour] = useState(new Date());
    const [debut, setDebut] = useState(new Date());
    const [fin, setFin] = useState(moment().add(1, "hour").toDate());

    const [isSending, setIsSending]= useState(false);
    const {t, _}=useTranslation();

    const handleJour=(event, selectedDate)=>{
        const currentDate = selectedDate || date
        setJour(currentDate);
    }

    const handleDateDebut = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setDebut(currentDate);
    };

    const handleDateFin = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setFin(currentDate);
    };

    const showMode = (mode="date") => {
        DateTimePickerAndroid.open({
            value: jour,
            mode: mode, is24Hour: true, onChange: handleJour
        });
    };

    useEffect(()=>{
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader lk="planifier" />
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
        Get("/salle/all/ecole/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setSalles(rs?.salles)
                }
            }
        ).catch(()=>{})
    }, []);

    function handleValider(){
        if(classe.length!==0 & salle !==null & libelle!==null){
            setIsSending(true);
            const titre= libelle
            const summary= "salle "+item2?.libelle
            const start= moment(jour).format("YYYY-MM-DD")+" "+moment(debut).format("hh:mm:ss")
            const end= moment(jour).format("YYYY-MM-DD")+" "+moment(fin).format("hh:mm:ss")
            const event= {classes: classe, salle: salle, jour: moment(jour).format("YYYY-MM-DD"), 
                start: start, end: end, ecole: user?.ecole?._id, anneeScolaire: user?.ecole?.anneeScolaire,
                title: titre, summary: summary
            }
            Send("/planEvent/new", {event: event}, true, token).then(
                (rs)=>{
                    if(rs?.error){
                        Toast.show({
                            text1: t("file4"),
                            text2: t("file4"),
                            topOffset: 50, type:"error"
                        })
                    }else{
                        Toast.show({
                            text1: "message", text2: t("admin38"), topOffset: 50
                        })
                        setClasse([]); setLibelle(null); setSalle(null); 
                    }
                }
            ).catch(()=>{
                Toast.show({
                    text1: t("file4"), text2: t("file4"), topOffset: 50, type:"error"
                })
            })
            setIsSending(false)
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
        input:{ marginTop: 20, borderRadius: 30},
        text:{fontSize: 15, padding: 5, fontStyle: "italic", color: back},
        part2:{borderTopLeftRadius: 50, backgroundColor: chart, flex:1},
        block:{marginLeft: 20, padding: 10, marginRight: 20, marginTop: 10},
        btn: {shadowColor: "black", shadowOffset: {width: 0.5, height: 1}, shadowOpacity: 0.4, shadowRadius: 20}
    });

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
            <ScrollView style={style.container}>
                <View style={style.head}>
                    <Text style={style.title}>{t('admin36')}</Text>
                    <Text style={[style.text, {color: front}]}>{t("admin8")}</Text>
                </View>
                <View style={style.part2}>

                    <View style={style.block}>
                        <Text style={[style.text, {color: "white"}]}>{t('admin45')} ? </Text>
                        <TextInput placeholder={t('rappel10')} inputStyle={{color:"black"}} onChangeText={setLibelle}
                            {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                            multiline value={libelle}
                        />
                    </View>

                    <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 7}}>
                        <View style={[style.block, {zIndex: 6, width: "44%"}]}>
                            <Text style={style.text}>{t('cours12')} ? </Text>
                            <DropDownPicker placeholder={t("comptabilite2")}
                                open={open} value={classe} items={adaptSelect(classes)}
                                setOpen={setOpen} setValue={setClasse} searchable maxHeight={250}
                                setItems={setClasses} multiple mode="BADGE" listMode="SCROLLVIEW"
                                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                            />
                        </View>

                        <View style={[style.block, {zIndex: 5, width: "44%"}]}>
                            <Text style={style.text}>{t("admin40")}</Text>
                            <DropDownPicker placeholder={t("comptabilite2")} onSelectItem={setItem2}
                                open={open2} value={salle} items={adaptSelect(salles)}
                                setOpen={setOpen2} setValue={setSalle} searchable
                                setItems={setSalles} maxHeight={150} listMode="SCROLLVIEW"
                                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                            />
                        </View>
                    </View>

                    <View style={[style.block, {alignItems:"flex-start"}]}>
                        <Text style={style.text}>{t('admin41')} ? </Text>
                        {Platform.OS==="android" ? <TouchableOpacity onPress={()=>showMode("date", handleJour)} style={[style.btn, {backgroundColor: back, borderRadius: 30, paddin: 25}]}>
                            <Text style={[style.text, {color: chart, textAlign: "center"}]}>{ moment(jour).format("YYYY-MM-DD") }</Text>
                        </TouchableOpacity>: <DateTimePicker 
                            value={jour} mode={"date"} is24Hour={true}
                            onChange={handleJour}
                        />}
                    </View>

                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <View style={[style.block, { width: "45%", alignItems:"flex-start"}]}>
                            <Text style={style.text}>{t('admin42')} ? </Text>
                            {Platform.OS==="android" ? 
                                <TouchableOpacity onPress={()=>showMode("time", handleDateDebut)} style={[style.btn, {backgroundColor: back, borderRadius: 30, paddin: 15}]}>
                                    <Text style={[style.text, {color: chart, textAlign: "center"}]}>{moment(debut).format("HH:mm:ss")}</Text>
                                </TouchableOpacity>: <DateTimePicker 
                                value={debut} mode={"time"} is24Hour={true}
                                onChange={handleDateDebut}
                            />}
                        </View>

                        <View style={[style.block, { width: "45%", alignItems:"flex-start"}]}>
                            <Text style={style.text}>{t('admin43')} ? </Text>
                            {Platform.OS==="android" ? 
                                <TouchableOpacity onPress={()=>showMode("time", handleDateFin)} style={[style.btn, {backgroundColor: back, borderRadius: 30, paddin: 15}]}>
                                    <Text style={[style.text, {color: chart, textAlign: "center"}]}>{moment(fin).format("HH:mm:ss")}</Text>
                                </TouchableOpacity>: <DateTimePicker 
                                    value={fin}
                                    mode={"time"}
                                    onChange={handleDateFin}
                                />
                            }
                        </View>
                    </View>

                    <View style={[style.block, {zIndex: 1, paddingBottom: 70}]}>
                        <TouchableOpacity disabled={isSending} onPress={handleValider} style={[style.btn, {backgroundColor: chart, borderRadius: 30, margin: 20}]}>
                            <Text style={[style.title, {color: back, textAlign: "center"}]}>{t('admin44')}</Text>
                        </TouchableOpacity>
                    </View>

                    
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}