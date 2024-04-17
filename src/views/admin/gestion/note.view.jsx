import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import DropDownPicker from "react-native-dropdown-picker";
import * as DocumentPicker from 'expo-document-picker';
import { adaptSelect } from "../../../api/functions";
import prompt from 'react-native-prompt-android';


export default function NoteView(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [libelle, setLibelle]= useState("");
    const [note, setNote]= useState("");
    const [date, setDate]= useState(new Date());
    const [eleve, setEleve]= useState("");
    const [cour, setCour]= useState("");
    const [item, setItem]= useState("");
    const [copie, setCopie]= useState(undefined);
    const [correction, setCorrection]= useState(undefined);

    const [periodes, setPeriodes]= useState([{"libelle": "trimestre 1"}, {"libelle": "trimestre 2"}, {"libelle": "trimestre 3"}, {"libelle": "semestre 1"}, {"libelle": "semestre 2"}])
    const [periode, setPeriode]= useState("")

    const [eleves, setEleves]= useState([]);
    const [cours, setCours]= useState([]);

    const [filter, setFilter]= useState("");
    const [show, setShow]= useState(false);
    const nav=  useNavigation();
    const [tbHead, setTbHead]= useState(["Élève", "note", "edit", "action"]);
    const [tbData, setTbData]= useState([]);

    const [open1, setOpen1]= useState(false);
    const [open2, setOpen2]= useState(false);
    const [open3, setOpen3]= useState(false);

    const [isSending, setIsSending]= useState(false);

    const handleJour=(event, selectedDate)=>{
        const currentDate = selectedDate || date
        setDate(currentDate);
    }

    const showMode = () => {
        DateTimePickerAndroid.open({
            value: date, handleJour,
            mode: 'date', is24Hour: true,
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
        let root="/note/all/professeur/"+user?._id+"/"+user?.ecole?.anneeScolaire;
        if(user?.type!=="Professeur"){
            root="/note/all/ecole/"+user?.ecole?._id+"/"+user?.ecole?.anneeScolaire
        }
        Get(root, token).then(
            (rs)=>{
                if(!rs?.error){
                    setTbData(rs?.notes)
                }
            }
        ).catch(()=>{})
    }, [libelle, note, show]);

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
        Get("/cours/all/ecole/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setCours(rs?.cours);
                }
            }
        ).catch(()=>{})
    }, []); 

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.getDocumentAsync({});
            if(!response?.canceled){
                setCopie(response?.assets[0]);
            }
        } catch (err) {
            Toast.show({text1: "Information", text2: "aucun fichier sélectionné", type: "info"})
        }
    }, []);

    function upd(data){
        Update("/note/update", data, true, token).then(
            (rp)=>{
                if(rp.error){
                    Toast.show({
                        text1: "erreur", text2: "la mise à jour a échoué",
                        topOffset: 50, type:"error"
                    })
                }else{
                    Toast.show({
                        text1: "message", text2: "document joint avec succès",
                        topOffset: 50
                    })
                    setCopie(undefined); setLibelle(""); setNote(""); setDate(new Date()); setCour("");
                    setEleve(""); setShow(false)
                }
            }
        )
    }

    const pop= ()=>{
        return(
            <RNModal style={{backgroundColor: chart, margin: 15, marginTop: 200, marginBottom: 200}}
                isVisible={show} animationInTiming={500} animationOutTiming={500} 
                backdropTransitionInTiming={500} backdropTransitionOutTiming={500}>
                    <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                        <ScrollView contentContainerStyle={{alignItems: "center", justifyContent: "center"}}>
                            <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 5, }}>
                                <View style={[style.block, {zIndex: 4, width: "45%"}]}>
                                    <Text style={style.text}>Quelle élève ? </Text>
                                    <DropDownPicker placeholder="Veuillez choisir" //onSelectItem={(item)=> console.log(item)}
                                        open={open1} value={eleve} items={adaptSelect(eleves, 1)} searchable
                                        setOpen={setOpen1} setValue={setEleve} maxHeight={250} listMode="SCROLLVIEW"
                                        setItems={setEleves} //theme="DARK"
                                        //mode="BADGE"
                                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                    />
                                </View>
                                <View style={[style.block, {zIndex: 4, width: "45%"}]}>
                                    <Text style={style.text}>Quelle cours </Text>
                                    <DropDownPicker placeholder="Veuillez choisir" onSelectItem={setItem}
                                        open={open2} value={cour} items={adaptSelect(cours)} searchable
                                        setOpen={setOpen2} setValue={setCour} maxHeight={250} listMode="SCROLLVIEW"
                                        setItems={setCours} //theme="DARK"
                                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                    />
                                </View>

                            </View>

                            <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 3}}>
                                <View style={[style.block, {zIndex: 3, width: "45%"}]}>
                                    <TextInput placeholder={"note sur 20"} inputStyle={{color:"black"}} onChangeText={setNote}
                                        {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                                    />
                                </View>

                                <View style={[style.block, {zIndex: 2, width: "45%"}]}>
                                    <TouchableOpacity onPress={handleDocumentSelection} style={{backgroundColor:back, borderRadius: 20, padding: 5}}>
                                        <Text style={[style.text, {color: "black"}]}>{!copie ? "choix de la copie de l'élève" : "fichier choisi"}</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                            <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 3}}>
                                <View style={[style.block, {alignItems:"flex-start"}]}>
                                    <Text style={style.text}>date du devoir  ? </Text>
                                    {
                                        Platform.OS==='android' ? <TouchableOpacity onPress={showMode} style={{backgroundColor:back, borderRadius: 20, padding: 5}}>
                                            <Text style={[style.text, {color: "black"}]}>{moment(date).format("YYYY-MM-DD")}</Text>
                                        </TouchableOpacity> :
                                        <DateTimePicker 
                                            value={date} mode={"date"} is24Hour={true}
                                            onChange={handleJour} 
                                        />
                                    }
                                </View>

                                <View style={[style.block, {zIndex: 4, width: "45%"}]}>
                                    <Text style={style.text}>Choix de période </Text>
                                    <DropDownPicker placeholder="Veuillez choisir" onSelectItem={setItem}
                                        open={open3} value={periode} items={adaptSelect(periodes)}
                                        setOpen={setOpen3} setValue={setPeriode} maxHeight={100} listMode="SCROLLVIEW"
                                        setItems={setPeriodes} //theme="DARK"
                                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                    />
                                </View>

                            </View>


                            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                                <View >
                                    <TouchableOpacity onPress={()=>{setShow(false); setLibelle("")}} style={[style.btn2, {backgroundColor: "red"}]}>
                                        <Text style={style.text}>Annuler</Text>
                                    </TouchableOpacity>
                                </View>
                                <View >
                                    <TouchableOpacity disabled={isSending} onPress={handleNew} style={[style.btn2, {backgroundColor: "green"}]}>
                                        <Text style={style.text}>Ajouter</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
             </RNModal>
        );
    }

    const handleRemove = (id) => {
        Alert.alert("validation", "voulez vous vraiment supprimer cette note", [
            {text: "annuler"},
            {text: "continuer", onPress: ()=>{
                setLibelle("..")
                Remove("/note/"+id, token).then(
                    (rs)=>{
                        if(rs?.error){
                            Toast.show({
                                text1: "erreur", text2: "la suppression a échoué",
                                topOffset: 50, type:"error"
                            });
                        }else{
                            Toast.show({
                                text1: "message", text2: "note bien supprimée",
                                topOffset: 50
                            });
                            setLibelle("");
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
        const exist= tbData.find((val)=> val?.eleve=== eleve && val?.note===note && val?.date===date && val?.cours===cour &&val?.periode===periode)!==undefined
        if(exist){
            Toast.show({
                text1: "erreur", text2: "cette note existe déjà",
                topOffset: 50, type:"error"
            })
        }else{
            if(eleve!=="" && cour !=="" && note !=="" && periode!==""){
                setIsSending(true)
                const n= parseFloat(note)
                if(isNaN(n)){
                    Toast.show({
                        text1: "erreur", text2: "cette note n'est pas valide",
                        topOffset: 50, type:"error"
                    })
                }else{
                    const dt= moment(date).format("YYYY-MM-DD");
                    const lb= "devoir de "+item?.libelle+" du "+dt
                    const valeur={
                        libelle: lb, ecole: user?.ecole?._id, note: note, date: dt, anneeScolaire: user?.ecole?.anneeScolaire,
                        professeur: user?.type!=="Professeur" ? undefined : user?._id, eleve: eleve, cours: cour, periode: periode
                    }
                    Send("/note/new", {"note": valeur}, true, token).then(
                        (rs)=>{
                            if(rs?.error){
                                Toast.show({
                                    text1: "erreur", text2: "erreur d'ajout de note",
                                    topOffset: 50, type:"error"
                                })
                            }else{
                                if(copie){
                                    let file={
                                        name: copie?.name,
                                        type: copie?.mimeType,
                                        uri: Platform.OS === 'ios' ? copie.uri.replace('file://', '') : copie.uri,
                                    }
                                    let doc1= {
                                        type: "personnel", user: rs?.eleve, label: lb, ecole: user?.ecole?._id, cours: cour
                                    }
                                    const form0= new FormData()
                                    form0.append("document", JSON.stringify(doc1))
                                    form0.append("file", file)
                                    Send("/document/new", form0, false, token).then(
                                        (r)=>{
                                            if(!r?.error){
                                                const docu= {...rs, copie: r?.document?._id}
                                                upd(docu)
                                            }
                                        }
                                    ).catch(()=>{});
                                }

                                Toast.show({
                                    text1: "message", text2: "note bien ajouté",
                                    topOffset: 50
                                })
                                setLibelle("");
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
            }else{
                Toast.show({
                    text1: "erreur", text2: "veuillez remplir les champs", topOffset: 50, type:"error"
                })
            }
            setIsSending(false);
        }
    }

    const handleEdit= (id) => {
        const note= tbData.find((val)=> val?._id=== id)
        prompt("modification", "changement de la note", [
            {text:"annuler", style: "cancel"},
            {text: "continuer", onPress: (text)=>{
                setLibelle(".");
                const nt= parseFloat(text);
                if(isNaN(nt)){
                    Toast.show({
                        text1: "erreur", text2: "erreur de mise à jour", topOffset: 50, type:"error"
                    })
                }else{
                    Update("/note/update", {"note": {...note, note: nt, _id: id}}, true, token).then(
                        (rs)=>{
                            if(rs?.error){
                                Toast.show({
                                    text1: "erreur", text2: "erreur de modification de la note", topOffset: 50, type:"error"
                                })
                            }else{
                                Toast.show({
                                    text1: "message", text2: "note modifiée", topOffset: 50
                                })
                                setLibelle(""); setShow(false)
                            }
                        }
                    ).catch(()=>{
                        Toast.show({
                            text1: "erreur", text2: "erreur de modification de la note",
                            topOffset: 50, type:"error"
                        })
                    })
                }
                
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
                    <TextInput placeholder={"filtrer par nom élève"} inputStyle={{color:"black"}} onChangeText={setFilter}
                        {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                    />
                </View>
                <View style={style.part2} onTouchStart={()=>Keyboard.dismiss()}>
                    <View style={[style.block, {marginBottom: 80}]}>
                        <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: 15}}>
                            <Text style={[style.text, {width: "64%"}]}>Liste des notes</Text>
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
                                    tbData.filter((el)=> el?.eleve?.nom.toLowerCase().includes(filter.toLowerCase()) || el?.eleve?.prenom.toLowerCase().includes(filter.toLowerCase())).map((row) => (
                                        <TableWrapper key={Math.random()} style={style.row}>
                                            <Cell key={Math.random()} data={row?.eleve?.nom+" "+row?.eleve?.prenom} textStyle={style.text}/>
                                            <Cell key={Math.random()} data={row?.note} textStyle={style.text}/>
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