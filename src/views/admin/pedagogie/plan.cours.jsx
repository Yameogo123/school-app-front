import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { useSelector } from "react-redux";
import AdminHeader from "../../../template/header/adminHeader";
import DropDownPicker from 'react-native-dropdown-picker';
import { Get, Send } from "../../../api/service";
import Toast from "react-native-toast-message";
import { adaptSelect } from "../../../api/functions";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from "moment";



export default function PlanCours(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [cours, setCours]= useState([]);
    const [cour, setCour]= useState(null);
    const [classes, setClasses]= useState([]);
    const [classe, setClasse]= useState([]);

    const [professeurs, setProfesseurs]= useState([]);
    const [professeur, setProfesseur]= useState(null);
    const [salles, setSalles]= useState([]);
    const [salle, setSalle]= useState(null);

    const [open, setOpen]= useState(false);
    const [open1, setOpen1]= useState(false);
    const [open2, setOpen2]= useState(false);
    const [open3, setOpen3]= useState(false);

    const [item, setItem]= useState(null);
    const [item1, setItem1]= useState(null);
    const [item2, setItem2]= useState(null);

    const [jour, setJour] = useState(new Date());
    const [debut, setDebut] = useState(new Date());
    const [fin, setFin] = useState(moment().add(1, "hour").toDate());

    const [isSending, setIsSending]= useState(false);

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

    const nav=  useNavigation();

    const showMode = (mode="date", action) => {
        DateTimePickerAndroid.open({
            value: jour,
            mode: mode, is24Hour: true, onChange: action
        });
    };

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
        Get("/salle/all/ecole/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setSalles(rs?.salles)
                }
            }
        ).catch(()=>{})
    }, []);

    useMemo(()=>{
        Get("/cours/all/ecole/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setCours(rs?.cours)
                }
            }
        ).catch(()=>{})
    }, []);

    useMemo(()=>{
        Get("/user/all/Professeur/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setProfesseurs(rs?.users);
                }
            }
        ).catch(()=>{})
    }, []);


    function handleValider(){
        if(classe.length!==0 & salle !==null & cour!==null & professeur!==null){
            setIsSending(true)
            const titre= "cours de "+ item?.libelle+" avec professeur "+item1?.nom +" "+item1?.prenom
            const summary= "salle "+item2?.libelle
            const start= moment(jour).format("YYYY-MM-DD")+" "+moment(debut).format("HH:mm:ss")
            const end= moment(jour).format("YYYY-MM-DD")+" "+moment(fin).format("HH:mm:ss")
            const event= {classes: classe, cours: cour, professeur: professeur, salle: salle,
                jour: moment(jour).format("YYYY-MM-DD"), start: start, end: end, ecole: user?.ecole?._id, anneeScolaire: user?.ecole?.anneeScolaire,
                title: titre, summary: summary
            }
            Send("/planCours/new", {event: event}, true, token).then(
                (rs)=>{
                    if(rs?.error){
                        Toast.show({
                            text1: "erreur", text2: "erreur de programmation de cours",
                            topOffset: 50, type:"error"
                        })
                    }else{
                        Toast.show({
                            text1: "message", text2: "cours programmé avec succès", topOffset: 50
                        })
                        setProfesseur(null); setClasse([]); setCour(null); setSalle(null); 
                    }
                    setIsSending(false)
                }
            ).catch(()=>{
                setIsSending(false);
                Toast.show({
                    text1: "erreur", text2: "erreur de programmation de cours", topOffset: 50, type:"error"
                })
            })
        }else{
            Toast.show({text1: "Formulaire", text2: "Veuillez remplir tous les champs", type: "error", topOffset: 60})
        }
    }

    const style= StyleSheet.create({
        container: {
            flex: 1, backgroundColor: back
        },
        head:{
            margin: 15, padding: 10, paddingTop: 20, paddingBottom: 20
        },
        title:{fontWeight: "bold", fontSize: 25, padding: 5},
        text:{fontSize: 15, padding: 5, fontStyle: "italic", color: back},
        part2:{borderTopLeftRadius: 50, backgroundColor: chart, flex:1},
        block:{marginLeft: 20, padding: 10, marginRight: 20, marginTop: 10},
        input:{ marginTop: 20, borderRadius: 30},
        btn: {shadowColor: "black", shadowOffset: {width: 0.5, height: 1}, shadowOpacity: 0.4, shadowRadius: 20}
    });

    return (
        <KeyboardAvoidingView style={style.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            
                <View style={style.container}>
                    <View style={style.head}>
                        <Text style={style.title}>Planifier un cours</Text>
                        <Text style={[style.text, {color: front}]}>Veuillez remplir tous les champs</Text>
                    </View>
                    <View style={style.part2}>

                        <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 5}}>
                            <View style={[style.block, {zIndex: 5, width: "44%"}]}>
                                <Text style={style.text}>Quelles classes ? </Text>
                                <DropDownPicker placeholder="Veuillez choisir" //onSelectItem={setClasse}
                                    open={open} value={classe} items={adaptSelect(classes)}
                                    setOpen={setOpen} searchable maxHeight={250} setValue={setClasse}
                                    setItems={setClasses} multiple={true} mode="BADGE" listMode="SCROLLVIEW"
                                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                />
                            </View>

                            <View style={[style.block, {zIndex: 4, width: "44%"}]}>
                                <Text style={style.text}>Quel cours ? </Text>
                                <DropDownPicker placeholder="Veuillez choisir" onSelectItem={setItem}
                                    open={open1} value={cour} items={adaptSelect(cours)} searchable
                                    setOpen={setOpen1} setValue={setCour} listMode="SCROLLVIEW"
                                    setItems={setCours} maxHeight={150}
                                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                />
                            </View>
                        </View>

                        <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 3}}>
                            <View style={[style.block, {zIndex: 3, width: "44%"}]}>
                                <Text style={style.text}>Quel professeur</Text>
                                <DropDownPicker placeholder="Veuillez choisir" onSelectItem={setItem1}
                                    open={open3} value={professeur} items={adaptSelect(professeurs, 1)} searchable maxHeight={150}
                                    setOpen={setOpen3} setItems={setProfesseurs} setValue={setProfesseur} //theme="DARK"
                                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                    listMode="SCROLLVIEW"
                                />
                            </View>

                            <View style={[style.block, {zIndex: 2, width: "44%"}]}>
                                <Text style={style.text}>Quelle salle</Text>
                                <DropDownPicker placeholder="Veuillez choisir" onSelectItem={setItem2}
                                    open={open2} value={salle} items={adaptSelect(salles)} setValue={setSalle}
                                    setOpen={setOpen2} searchable
                                    setItems={setSalles} maxHeight={150}
                                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                    listMode="SCROLLVIEW"
                                />
                            </View>
                        </View>

                        <View style={[style.block, {zIndex: 1, alignItems:"flex-start"}]}>
                            <Text style={style.text}>le jour ? </Text>
                            {Platform.OS==="android" ? <TouchableOpacity onPress={()=>showMode("date", handleJour)} style={[style.btn, {backgroundColor: back, borderRadius: 30, paddin: 25}]}>
                                <Text style={[style.text, {color: chart, textAlign: "center"}]}>{ moment(jour).format("YYYY-MM-DD") }</Text>
                            </TouchableOpacity>: <DateTimePicker 
                                value={jour} mode={"date"} is24Hour={true}
                                onChange={handleJour}
                            />}
                        </View>

                        <View style={{flexDirection: "row", justifyContent: "space-between", zIndex: 1}}>
                            <View style={[style.block, {zIndex: 1, width: "45%", alignItems:"flex-start"}]}>
                                <Text style={style.text}>Heure de début ? </Text>
                                {Platform.OS==="android" ? 
                                    <TouchableOpacity onPress={()=>showMode("time", handleDateDebut)} style={[style.btn, {backgroundColor: back, borderRadius: 30, paddin: 15}]}>
                                        <Text style={[style.text, {color: chart, textAlign: "center"}]}>{moment(debut).format("HH:mm:ss")}</Text>
                                    </TouchableOpacity>: <DateTimePicker 
                                    value={debut} mode={"time"} is24Hour={true}
                                    onChange={handleDateDebut}
                                />}
                                
                            </View>

                            <View style={[style.block, {zIndex: 1, width: "45%", alignItems:"flex-start"}]}>
                                <Text style={style.text}>Heure de fin ? </Text>
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


                        <View style={[style.block, {zIndex: 1}]}>
                            <TouchableOpacity disabled={isSending} onPress={handleValider} style={[style.btn, {backgroundColor: chart, borderRadius: 30, margin: 40}]}>
                                <Text style={[style.title, {color: back, textAlign: "center"}]}>planifier</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}