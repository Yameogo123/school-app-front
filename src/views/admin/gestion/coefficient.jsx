import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Keyboard, ScrollView, Platform } from 'react-native';
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


export default function Coefficient(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);

    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [libelle, setLibelle]= useState("");
    const [coef, setCoef]= useState("");
    const [classe, setClasse]= useState("");
    const [cour, setCour]= useState("");

    const [classes, setClasses]= useState([]);
    const [cours, setCours]= useState([]);

    const [filter, setFilter]= useState("");
    const [show, setShow]= useState(false);
    const nav=  useNavigation();
    const [tbHead, setTbHead]= useState(["Classe", "Cours", "valeur", "action"]);
    const [tbData, setTbData]= useState([]);  

    const [open1, setOpen1]= useState(false);
    const [open2, setOpen2]= useState(false);

    const [isSending, setIsSending]= useState(false);

    useEffect(()=>{
        nav.setOptions({
            header : ()=> {
                return <AdminHeader />
            }, 
            headerShown: true
        });
    }, []);

    useMemo(()=>{
        let root="/coefficient/all/ecole/"+user?.ecole?._id
        Get(root, token).then(
            (rs)=>{
                if(!rs?.error){
                    setTbData(rs?.coefficients)
                }
            }
        ).catch(()=>{})
    }, [libelle, coef, show]);

    useMemo(()=>{
        Get("/classe/all/school/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setClasses(rs?.classes);
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

    const pop= ()=>{
        let behave= Platform.OS==="ios" ? {
            behavior:"height"
        }: {}

        return(
            <RNModal style={{backgroundColor: chart, margin: 15, marginTop: 150, marginBottom: 200, paddingTop:  100}}
                isVisible={show} animationInTiming={500} animationOutTiming={500} 
                backdropTransitionInTiming={500} backdropTransitionOutTiming={500}>
                    <KeyboardAvoidingView {...behave} style={{flex: 1}}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 5 }}>
                                <View style={[style.block, {zIndex: 4, width: "47%"}]}>
                                    <Text style={style.text}>Quelle classe ? </Text>
                                    <DropDownPicker placeholder="Veuillez choisir" //onSelectItem={(item)=> console.log(item)}
                                        open={open1} value={classe} items={adaptSelect(classes)} searchable
                                        setOpen={setOpen1} setValue={setClasse} maxHeight={150} listMode="SCROLLVIEW"
                                        setItems={setClasses} //theme="DARK"
                                        //mode="BADGE"
                                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                    />
                                </View>
                                <View style={[style.block, {zIndex: 4, width: "47%"}]}>
                                    <Text style={style.text}>Quelle matière </Text>
                                    <DropDownPicker placeholder="Veuillez choisir" //onSelectItem={setItem}
                                        open={open2} value={cour} items={adaptSelect(cours)} searchable setItems={setCours}
                                        setOpen={setOpen2} setValue={setCour} maxHeight={150} //theme="DARK"
                                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                        listMode="SCROLLVIEW"
                                    />
                                </View>

                            </View>

                            <View style={[style.block, {zIndex: 3}]}>
                                <TextInput placeholder={"coefficient de la matière"} inputStyle={{color:"black"}} onChangeText={setCoef}
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
                                    <TouchableOpacity disabled={isSending} onPress={handleNew} style={[style.btn2, {backgroundColor: "green"}]}>
                                        <Text style={style.text}>Ajouter</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
             </RNModal>
        );
    }

    const handleRemove = (id) => {
        Alert.alert("validation", "voulez vous vraiment supprimer ce coefficient", [
            {text: "annuler"},
            {text: "continuer", onPress: ()=>{
                setLibelle("..")
                Remove("/coefficient/"+id, token).then(
                    (rs)=>{
                        if(rs?.error){
                            Toast.show({
                                text1: "erreur", text2: "la suppression a échoué",
                                topOffset: 50, type:"error"
                            });
                        }else{
                            Toast.show({
                                text1: "message", text2: "coefficient bien supprimé",
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
        const exist= tbData.find((val)=> val?.classe=== classe && val?.valeur===coef && val?.cours===cour)!==undefined
        if(exist){
            Toast.show({
                text1: "erreur", text2: "ce coefficient existe déjà",
                topOffset: 50, type:"error"
            })
        }else{
            if(classe!=="" && cour !=="" && coef !==""){
                const n= parseFloat(coef)
                if(isNaN(n)){
                    Toast.show({
                        text1: "erreur", text2: "ce coefficient n'est pas valide",
                        topOffset: 50, type:"error"
                    })
                }else{
                    const valeur={
                        ecole: user?.ecole?._id, valeur: coef, classe: classe, cours: cour
                    }
                    setIsSending(true);
                    Send("/coefficient/new", {"coefficient": valeur}, true, token).then(
                        (rs)=>{
                            if(rs?.error){
                                Toast.show({
                                    text1: "erreur", text2: "erreur d'ajout de coefficient",
                                    topOffset: 50, type:"error"
                                })
                            }else{

                                Toast.show({
                                    text1: "message", text2: "coefficient bien ajouté",
                                    topOffset: 50
                                })
                                setShow(false); setClasse(""); setCour(""); setCoef("")
                            }
                            setIsSending(false);
                        }
                    ).catch(()=>{
                        Toast.show({
                            text1: "erreur", text2: "erreur d'ajout de coefficient", topOffset: 50, type:"error"
                        })
                        setIsSending(false)
                    })
                }
            }else{
                Toast.show({
                    text1: "erreur", text2: "veuillez remplir les champs", topOffset: 50, type:"error"
                })
            }
        }
    }

    const handleEdit= (id) => {
        const coeff= tbData.find((val)=> val?._id=== id)
        prompt("modification", "changement de la valeur du coefficient", [
            {text:"annuler", style: "cancel"},
            {text: "continuer", onPress: (text)=>{
                setLibelle(".");
                const nt= parseFloat(text);
                if(isNaN(nt)){
                    Toast.show({
                        text1: "erreur", text2: "erreur de mise à jour",
                        topOffset: 50, type:"error"
                    })
                }else{
                    Update("/coefficient/update", {"coefficient": {...coeff, valeur: nt, _id: id}}, true, token).then(
                        (rs)=>{
                            if(rs?.error){
                                Toast.show({
                                    text1: "erreur", text2: "erreur de modification de la coefficient",
                                    topOffset: 50, type:"error"
                                })
                            }else{
                                Toast.show({
                                    text1: "message", text2: "coefficient modifié", topOffset: 50
                                })
                                setLibelle("")
                                setShow(false)
                            }
                        }
                    ).catch(()=>{
                        Toast.show({
                            text1: "erreur", text2: "erreur de modification de la coef",
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
        <View>
            <TouchableOpacity onPress={() => handleEdit(id)} style={[style.btn, {backgroundColor: "blue"}]}>
                <Ionicons name="pencil" size={25} color={chart} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemove(id)} style={style.btn}>
                <Ionicons name="trash" size={25} color={chart} />
            </TouchableOpacity>
        </View>
    );

    // const element1 = (id) => (
    //     <TouchableOpacity onPress={() => handleEdit(id)} style={[style.btn, {backgroundColor: "blue"}]}>
    //         <Ionicons name="pencil" size={25} color={chart} />
    //     </TouchableOpacity>
    // );

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
                    <TextInput placeholder={"filtrer par classe"} inputStyle={{color:"black"}} onChangeText={setFilter}
                        {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                    />
                </View>
                <View style={style.part2} onTouchStart={()=>Keyboard.dismiss()}>
                    <View style={[style.block, {marginBottom: 80}]}>
                        <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: 15}}>
                            <Text style={[style.text, {width: "64%"}]}>Liste des coefficients</Text>
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
                                    tbData?.filter((el)=> el?.classe?.libelle?.toLowerCase().includes(filter?.toLowerCase())).map((row) => (
                                        <TableWrapper key={Math.random()} style={style.row}>
                                            <Cell key={Math.random()} data={row?.classe?.libelle} style={{width: "25%"}} textStyle={style.text}/>
                                            <Cell key={Math.random()} data={row?.cours?.libelle} style={{width: "30%"}} textStyle={style.text}/>
                                            <Cell key={Math.random()} data={row?.valeur} textStyle={style.text}/>
                                            {/* <Cell key={Math.random()} data={element1(row?._id)} textStyle={style.text}/> */}
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