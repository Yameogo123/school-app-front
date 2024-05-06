import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import AdminHeader from "../../../template/header/adminHeader";
import DropDownPicker from 'react-native-dropdown-picker';
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { adaptSelect } from "../../../api/functions";
import SwitchSelector from "react-native-switch-selector";
import { TextInput } from "@react-native-material/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as DocumentPicker from 'expo-document-picker';
import { launchImageLibrary } from "react-native-image-picker";
import { Send, Update } from "../../../api/service";
import { useTranslation } from "react-i18next";


export default function AddUser(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [civilites, setCivilites]= useState([{libelle: 'Mr'},{libelle: 'Mme'},{libelle: 'autre'}]);
    const [password, setPassword]= useState("");
    const [civilite, setCivilite]= useState("");
    const [ selected, setSelected] = useState("identité");

    const [types, setTypes]= useState([
        {libelle: 'Professeur'},{libelle: 'Eleve'},
        {libelle: 'Secretaire'},{libelle: 'Directeur'}]);
    const [type, setType]= useState(null)

    const [open, setOpen]= useState(false);
    const [open2, setOpen2]= useState(false);

    //
    const [nom, setNom]= useState("");
    const [prenom, setPrenom]= useState("");
    //
    const [adress, setAdress]= useState("");
    const [mail, setMail]= useState("");
    const [web, setWeb]= useState("");
    const [linkedIn, setLinkedIn]= useState("");
    const [numb, setNumb]= useState("");
    //
    const [passport, setPassport] = useState("");
    const [photo, setPhoto] = useState("");

    const [isSending, setIsSending]= useState(false);
    const {t, _}=useTranslation();

    let swit= [
        {label:"identité", value:"identité"}, {label:"adresse", value:"adresse"}, 
        {label:"document", value:"document"}
    ];

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
        let rand= Math.floor(100*Math.random());
        let ecole = user?.ecole?.titre?.split(" ")[0].toLowerCase()
        let fname= prenom?.split(" ")[0].toLowerCase()
        let lname= nom?.split(" ")[0].toLowerCase()
        let email= lname+"."+fname+""+rand+"@"+ecole+".school"
        let pass= nom?.toLowerCase()+"."+prenom?.toLowerCase()+""+rand
        if(nom!=="" && prenom!==""){
            setMail(email);
            setPassword(pass);
        }else{
            setMail("");
            setPassword("");
        }
    }, [nom, prenom]);

    function handlechoix(choix){
        setSelected(choix);
    }

    function upd(data){
        Update("/user/update", data, true, token).then(
            (rp)=>{
                if(rp?.error){
                    Toast.show({
                        text1: t("file4"), text2: t("admin2"),
                        topOffset: 50, type:"error"
                    })
                }else{
                    Toast.show({
                        text1: "message", text2: t("admin3"), topOffset: 50
                    })
                    setPassword(""); setNom(""); setPrenom(""); setNumb(""); setAdress("");
                    setPassport(""); setPhoto("");
                }
            }
        ).catch(()=>{

        })
    }

    function handleValider(){
        if(nom !=="" && prenom!=="" && adress!=="" && civilite!=="" && type!=="" && mail!=="" && password!=="" && numb!==""){
            let use= {
                civilite: civilite, type: type, nom: nom, prenom: prenom, mail: mail, telephone: numb,
                web: web, linkedIn: linkedIn, localisation: adress, ecole: user?.ecole?._id,
                password: password
            }
            setIsSending(true)
            const fdata= new FormData();
            fdata.append("user", JSON.stringify(use));

            Send("/user/signin", fdata, false, token).then(
                (rs)=>{
                    if(rs.error){
                        Toast.show({
                            text1: "erreur", text2: t("admin4"),
                            topOffset: 50, type:"error"
                        })
                    }else{

                        if(passport){
                            let file={
                                name: passport?.fileName,
                                type: passport?.type,
                                uri: Platform.OS === 'ios' ? passport.uri.replace('file://', '') : passport.uri,
                            }
                            let doc1= {
                                type: "personnel", user: rs?._id, label: "ID"
                            }
                            const form0= new FormData()
                            form0.append("document", JSON.stringify(doc1))
                            form0.append("file", file)
                            Send("/document/new", form0, false, token).then(
                                (r)=>{
                                    if(!r?.error){
                                        const use2= {...rs.user, identite: r?.document?._id}
                                        upd(use2)
                                    }
                                }
                            ).catch(()=>{});
                        }
            
                        if(photo){
                            let file={
                                name: photo?.fileName,
                                type: photo?.type,
                                uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
                            }
                            let doc2= {
                                type: "personnel",  user: rs?._id, label: "profil"
                            }
                            const form= new FormData();
                            form.append("document", JSON.stringify(doc2));
                            form.append("file", file);
                            Send("/document/new", form, false, token).then(
                                (r)=>{
                                    if(!r?.error){
                                        const use3= {...rs?.user, photo: r?.document?._id}
                                        upd(use3)
                                    }
                                }
                            ).catch(()=>{})
                        }

                        //envoie des identifiants par message 

                        Toast.show({
                            text1: "message", text2: t("admin5"), topOffset: 50
                        })
                        setPassword(""); setNom(""); setPrenom(""); setNumb(""); setAdress("");
                        setPassport(""); setPhoto(""); setSelected("identité");
                    }
                }
            )
            setIsSending(false);

        }else{
            Toast.show({text1: t("admin6"), text2: t("missing1"), type: "error", topOffset: 60})
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        launchImageLibrary({
                mediaType: 'photo',
                quality: 1,
            }, (rep)=>{
                if(!rep?.didCancel){
                    setPhoto(rep.assets[0])
                }
            }
        ); 
    }

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.getDocumentAsync({});
            if(!response?.canceled){
                setPassport(response?.assets[0]);
            }
        } catch (err) {
            //console.warn(err);
            Toast.show({text1: "Information", text2: t("file3"), type: "info"})
        }
    }, []);

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
        part2:{borderTopRightRadius: 50, backgroundColor: chart, height: 600},
        block:{marginLeft: 20, padding: 10, marginRight: 20, marginTop: 10},
        btn: {shadowColor: "black", shadowOffset: {width: 0.5, height: 1}, shadowOpacity: 0.4, shadowRadius: 20}
    });

    let behave = Platform.OS==="ios" ? {
        behavior:"height"
    }: {}

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return (
         //<TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <KeyboardAvoidingView {...behave} style={{flex: 1}}>
           
                <View>
                    <View style={style.coord}>
                        <SwitchSelector hasPadding options={swit} onPress={(v)=>handlechoix(v)} buttonColor={chart} initial={0} />
                    </View>
                    <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
                        <View style={style.head}>
                            <Text style={style.title}>{t("admin7")}</Text>
                            <Text style={[style.text, {color: front}]}>{t('admin8')}</Text>
                        </View>

                        { selected==="identité" && <View style={style.part2}>

                            <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 5}}>
                                <View style={[style.block, {zIndex: 4, width: "40%"}]}>
                                    <Text style={style.text}>{t('admin9')}* ? </Text>
                                    <DropDownPicker placeholder={t("comptabilite2")} //onSelectItem={(item)=> console.log(item)}
                                        open={open} value={civilite} items={adaptSelect(civilites)}
                                        setOpen={setOpen} setValue={setCivilite} maxHeight={250}
                                        setItems={setCivilites}  listMode="SCROLLVIEW"
                                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                    />
                                </View>
                                <View style={[style.block, {zIndex: 3, width: "45%"}]}>
                                    <Text style={style.text}>{t("admin10")}* </Text>
                                    <DropDownPicker placeholder={t("comptabilite2")} //onSelectItem={(item)=> console.log(item)}
                                        open={open2} value={type} items={adaptSelect(types)}
                                        setOpen={setOpen2} setValue={setType} listMode="SCROLLVIEW"
                                        setItems={setTypes} //theme="DARK"
                                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                    />
                                </View>

                            </View>
                            

                            <View style={[style.block, {zIndex: 2, flexDirection: "row", justifyContent: "space-between"}]}>
                                <View style={{width: "47%"}}>
                                    <Text style={style.text}>{t("admin11")} *</Text>
                                    <TextInput {...props} textContentType="name" onChangeText={setNom} value={nom} />
                                </View>
                                <View style={{width: "47%"}}>
                                    <Text style={style.text}>{t("admin12")}(s) *</Text>
                                    <TextInput {...props} textContentType="familyName" value={prenom} onChangeText={setPrenom} />
                                </View>
                            </View>
                            
                        </View>}

                        { selected==="adresse" && <View style={style.part2}>

                            <View style={[style.block, {zIndex: 3, flexDirection: "row", justifyContent: "space-between"}]}>
                                <View style={{width: "47%"}}>
                                    <Text style={style.text}>{t("drawer15")}*</Text>
                                    <TextInput editable={false} {...props} textContentType="emailAddress" value={mail} onChangeText={setMail} />
                                </View>
                                <View style={{width: "47%"}}>
                                    <Text style={style.text}>{t("drawer16")}* </Text>
                                    <TextInput {...props} placeholder="parent" textContentType="telephoneNumber" value={numb} onChangeText={setNumb} />
                                </View>
                            </View>

                            <View style={[style.block, {flexDirection: "row", justifyContent: "space-between"}]}>
                                <View style={{width: "47%"}}>
                                    <Text style={style.text}>{t("admin13")}</Text>
                                    <TextInput {...props} textContentType="URL" value={web} onChangeText={setWeb} />
                                </View>
                                <View style={{width: "47%"}}>
                                    <Text style={style.text}>{t("admin14")} </Text>
                                    <TextInput {...props} textContentType="URL" value={linkedIn} onChangeText={setLinkedIn} />
                                </View>
                            </View>

                            <View style={[style.block, {}]}>
                                <Text style={style.text}>{t("admin15")} *</Text>
                                <TextInput {...props} textContentType="URL" value={adress} onChangeText={setAdress} /> 
                            </View>
                            
                        </View>}

                        {
                            selected==="document" && <View style={style.part2}>

                                <View style={[style.block, {marginTop: 20}]}>
                                    <Text style={style.text}>{t('admin16')}</Text>
                                    {passport==="" ? <TouchableOpacity onPress={handleDocumentSelection} style={{backgroundColor: back, borderRadius: 10, margin: 10}}>
                                        <View style={{flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
                                            <Ionicons name="add-circle" color={chart} size={40} />
                                            <Text style={[style.text, {color: front}]}>{t('document8')}</Text>
                                        </View>
                                    </TouchableOpacity> : 
                                    <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
                                        <Text style={[style.text, {color: front}]}>{t('admin3')}</Text>
                                        <Ionicons name="trash" color={"tomato"} size={30} onPress={()=>setPassport("")} />
                                    </View>}
                                </View>

                                <View style={[style.block, {marginTop: 20}]}>
                                    <Text style={style.text}>{t("admin17")}</Text>
                                    {photo==="" ? <TouchableOpacity onPress={pickImage} style={{backgroundColor: back, borderRadius: 10, margin: 10}}>
                                        <View style={{flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
                                            <Ionicons name="add-circle" color={chart} size={40} />
                                            <Text style={[style.text, {color: front}]}>{t('document8')}</Text>
                                        </View>
                                    </TouchableOpacity>: 
                                    <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
                                        <Text style={[style.text, {color: front}]}>{t('admin3')}</Text>
                                        <Ionicons name="trash" color={"tomato"} size={30} onPress={()=>setPhoto("")} />
                                    </View>}
                                </View>

                                <View style={[style.block, {zIndex: 1, marginTop: 30}]}>
                                    <TouchableOpacity disabled={isSending} onPress={handleValider} style={[style.btn, {backgroundColor: chart, borderRadius: 30, margin: 40}]}>
                                        <Text style={[style.title, {color: back, textAlign: "center"}]}>{t('continue')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                    </ScrollView>
                </View>
            
            </KeyboardAvoidingView>
        //</TouchableWithoutFeedback>
    )
}