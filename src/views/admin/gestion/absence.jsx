import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, ScrollView, Platform } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import AdminHeader from "../../../template/header/adminHeader";
import { useSelector } from "react-redux";
import { TextInput } from "@react-native-material/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Get, Remove, Send, Update } from "../../../api/service";
import Toast from "react-native-toast-message";
import RNModal from "react-native-modal";
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker'
import DropDownPicker from "react-native-dropdown-picker";
import { adaptSelect } from "../../../api/functions";
import prompt from 'react-native-prompt-android';


export default function Absence(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [status, setStatus]= useState("");
    const [date, setDate]= useState(new Date());
    const [eleve, setEleve]= useState("");
    const [cour, setCour]= useState("");
    const [item, setItem]= useState("");

    const [eleves, setEleves]= useState([]);
    const [cours, setCours]= useState([]);

    const [filter, setFilter]= useState("");
    const [show, setShow]= useState(false);
    const nav=  useNavigation();
    const [tbHead, setTbHead]= useState(["Élève", "status", "date", "action"]);
    const [tbData, setTbData]= useState([]);

    const [open1, setOpen1]= useState(false);
    const [open2, setOpen2]= useState(false);

    const handleJour=(event, selectedDate)=>{
        const currentDate = selectedDate || date
        setDate(currentDate);
    }

    useEffect(()=>{
        nav.setOptions({
            header : ()=> {
                return <AdminHeader />
            }, 
            headerShown: true
        })
    }, []);

    useMemo(()=>{
        Get("/absence/all/school/"+user?.ecole?._id+"/"+user?.ecole?.anneeScolaire, token).then(
            (rs)=>{
                if(!rs?.error){
                    setTbData(rs?.absences)
                }
            }
        ).catch(()=>{});
    }, [status, show]); 

    useMemo(()=>{
        Get("/user/all/Eleve/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setEleves(rs?.users);
                }
            }
        ).catch(()=>{});
    }, []); 


    useMemo(()=>{
        Get("/cours/all/ecole/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setCours(rs?.cours);
                }
            }
        ).catch(()=>{})
    }, []); 

    const pop= ()=>{
        return(
            <RNModal style={{backgroundColor: chart, margin: 15, marginTop: 150, marginBottom: 200}}
                isVisible={show} animationInTiming={500} animationOutTiming={500} 
                backdropTransitionInTiming={500} backdropTransitionOutTiming={500}>
                    <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                            <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 5, }}>
                                <View style={[style.block, {zIndex: 4, width: "45%"}]}>
                                    <Text style={style.text}>Quel élève ? </Text>
                                    <DropDownPicker placeholder="Veuillez choisir" //onSelectItem={(item)=> console.log(item)}
                                        open={open1} value={eleve} items={adaptSelect(eleves, 1)} searchable
                                        setOpen={setOpen1} setValue={setEleve} maxHeight={250}
                                        setItems={setEleves} //theme="DARK"
                                        //mode="BADGE"
                                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                    />
                                </View>
                                <View style={[style.block, {zIndex: 4, width: "45%"}]}>
                                    <Text style={style.text}>Quelle cours </Text>
                                    <DropDownPicker placeholder="Veuillez choisir" onSelectItem={setItem}
                                        open={open2} value={cour} items={adaptSelect(cours)} searchable
                                        setOpen={setOpen2} setValue={setCour} maxHeight={250}
                                        setItems={setCours} //theme="DARK"
                                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                    />
                                </View>
                            </View>

                            <View style={[style.block, {alignItems:"flex-start"}]}>
                                <Text style={style.text}>date du devoir  ? </Text>
                                <DateTimePicker 
                                    value={date} mode={"date"} is24Hour={true}
                                    onChange={handleJour}
                                />
                            </View>


                            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                                <View >
                                    <TouchableOpacity onPress={()=>{setShow(false); setStatus("")}} style={[style.btn2, {backgroundColor: "red"}]}>
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
                    </TouchableWithoutFeedback>
             </RNModal>
        );
    }

    const handleRemove = (id) => {
        Alert.alert("validation", "voulez vous vraiment supprimer cette absence", [
            {text: "annuler"},
            {text: "continuer", onPress: ()=>{
                setStatus("..")
                Remove("/absence/"+id, token).then(
                    (rs)=>{
                        if(rs?.error){
                            Toast.show({
                                text1: "erreur", text2: "la suppression a échoué",
                                topOffset: 50, type:"error"
                            });
                        }else{
                            Toast.show({
                                text1: "message", text2: "absence bien supprimée",
                                topOffset: 50
                            });
                            setStatus("");
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: "erreur", text2: "la suppression a échoué",
                        topOffset: 50, type:"error"
                    })
                })
            }}
        ], {cancelable: true})
    }

    const handleNew = () => {
        const exist= tbData.find((val)=> val?.user=== eleve && moment(val?.date).format("YYYY-MM-DD")===moment(date).format("YYYY-MM-DD") && val?.cours===cour)!==undefined
        if(exist){
            Toast.show({
                text1: "erreur", text2: "cette absence est déjà marquée déjà",
                topOffset: 50, type:"error"
            })
        }else{
            if(eleve!=="" && cour !==""){
                const dt= moment(date).format("YYYY-MM-DD");
                const lb= "absence au cours de "+item?.libelle
                const valeur={
                    status: lb, ecole: user?.ecole?._id, date: dt, anneeScolaire: user?.ecole?.anneeScolaire,
                    user: eleve, cours: cour
                }
                Send("/absence/new", {"absence": valeur}, true, token).then(
                    (rs)=>{
                        if(rs?.error){
                            Toast.show({
                                text1: "erreur", text2: "erreur d'ajout d'absence",
                                topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message", text2: "absence bien ajoutée",
                                topOffset: 50
                            })
                            setStatus(""); setEleve(""); setCour("");
                            setShow(false);
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: "erreur", text2: "erreur d'ajout de note",
                        topOffset: 50, type:"error"
                    })
                })
            }
        }
    }

    const handleEdit= (id) => {
        const abs= tbData.find((val)=> val?._id=== id)
        prompt("modification", "changement du status", [
            {text:"annuler", style: "cancel"},
            {text: "continuer", onPress: (text)=>{
                Update("/absence/update", {"absence": {...abs, status: text, _id: id}}, true, token).then(
                    (rs)=>{
                        if(rs?.error){
                            Toast.show({
                                text1: "erreur",
                                text2: "erreur de modification de l'absence",
                                topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message", text2: "absence modifiée", topOffset: 50
                            })
                            setStatus(".."); setEleve(""); setCour("");
                            setShow(false);
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: "erreur", text2: "erreur de modification de l'absence",
                        topOffset: 50, type:"error"
                    })
                })
            }}
        ], {
            type: "plain-text", cancelable: true
        });
    }

    const element = (id) => (
        <TouchableOpacity onPress={() => handleRemove(id)} style={style.btn}>
            <Ionicons name="trash" size={25} color={chart} />
        </TouchableOpacity>
    );

    const element1 = (id) => (
       <View>
            <TouchableOpacity onPress={() => handleEdit(id)} style={[style.btn, {backgroundColor: "blue"}]}>
                <Ionicons name="pencil" size={25} color={chart} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemove(id)} style={style.btn}>
                <Ionicons name="trash" size={25} color={chart} />
            </TouchableOpacity>
       </View>
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
                    <TextInput placeholder={"filtrer par nom élève"} inputStyle={{color:"black"}} onChangeText={setFilter}
                        {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                    />
                </View>
                <View style={style.part2} onTouchStart={()=>Keyboard.dismiss()}>
                    <View style={[style.block, {marginBottom: 80}]}>
                        <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: 15}}>
                            <Text style={[style.text, {width: "64%"}]}>Liste des absences</Text>
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
                                    tbData.filter((el)=> el?.user?.nom.toLowerCase().includes(filter.toLowerCase()) || el?.user?.prenom.toLowerCase().includes(filter.toLowerCase())).map((row) => (
                                        <TableWrapper key={Math.random()} style={style.row}>
                                            <Cell key={Math.random()} data={row?.user?.nom+" "+row?.user?.prenom} textStyle={style.text}/>
                                            <Cell key={Math.random()} data={row?.status} textStyle={style.text} style={{width: 90}} />
                                            <Cell key={Math.random()} data={moment(row?.date).format("YYYY-MM-DD")} style={{width: 110}} textStyle={style.text}/>
                                            <Cell key={Math.random()} data={element1(row?._id)} textStyle={style.text}/>
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