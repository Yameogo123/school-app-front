import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Platform } from "react-native";
import { HomeStack } from './stack';
import img from "../../assets/icon.png"
import React, { useMemo, useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "react-native-paper";
import { VERSION } from "../api/constante";
import Ionicons from "react-native-vector-icons/Ionicons"
import { storeObject } from "../redux/storage";
import { useNavigation } from "@react-navigation/native";
import { API, Get, Remove, Send, Update } from "../api/service";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Issu from "../views/security/issu";
import { useTranslation } from "react-i18next";

const Drawer = createDrawerNavigator()



function Menu(props){
  const back = useSelector((state)=>state.themeReducer.back)
  const dispatch = useDispatch()
  //const profil = useSelector((state)=>state.userReducer.profil)
  const user = useSelector((state)=>state.userReducer.user);
  const token= useSelector((state)=> state.userReducer.token);
  const nav= useNavigation();
  const [insc, setInsc]= useState(null);
  const {t, _}=useTranslation();
 
  useMemo(() => {
    if(user?.type==="Eleve"){
      Get("/inscription/all/eleve/"+user?._id, token).then(
        (rp)=>{
          if(!rp?.error){
            const s= rp?.inscriptions.length 
            setInsc(rp?.inscriptions[s])
          }else{
            Toast.show({
              text1: "erreur", text2: "erreur de récupération des inscriptions",
              topOffset: 50, type:"error"
            })
          }
        }
      ).catch(()=>{});
    }
  }, [])

  function handleReport(){
    nav.navigate("issu", {back: true});
  }

  function upd(data){
    Update("/user/update", data, true, token).then(
      (rp)=>{
        if(rp?.error){
          Toast.show({
            text1: "erreur", text2: "la mise à jour du profil a échoué",
            topOffset: 50, type:"error"
          })
        }else{
          const val= {user: rp?.user, token: token}
          storeObject("login", val).then(
            ()=>{
              const action={type: "login", value: val}
              dispatch(action)
              Toast.show({
                text1: "message", text2: "Image mise à jour",
                topOffset: 50
              })
            }
          )
        }
      }
    ).catch(()=>{

    })
  }

  function handleSave(form){
    Send("/document/new", form, false, token).then(
      (r)=>{
        if(!r?.error){
          const use3= {...user, photo: r?.document?._id}
          upd(use3)
        }else{
          if(r?.error?.includes("errMongoServerError")){
            Toast.show({
              text1: "erreur", text2: "cette image est déjà en profil.", topOffset: 50
            })
          }
        }
      }
    ).catch((err)=>{
      console.log("--"+err);
    })
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    }, (rep)=>{
      if(!rep?.didCancel){
        const result= rep.assets[0]
        Toast.show({
          text1: "message", text2: "Mise à jour de l'image en cours!", topOffset: 50
        })
        let file={
          name: result?.fileName,
          type: result?.type,
          uri: Platform.OS === 'ios' ? result.uri.replace('file://', '') : result.uri,
        }
        let doc2= { type: "personnel",  user: user?._id, label: "profil"}
        const form= new FormData();
        form.append("document", JSON.stringify(doc2));
        form.append("file", file);
        if(user?.photo){
          Remove("/document/delete/"+user?.photo?.libelle, token).then(
            (re)=>{
              if(!re?.error){
                handleSave(form)
              } 
            }
          )
        }else{
          handleSave(form)
        }
        //saveImg(rep.assets[0].uri)
      }
    });
  }

  const style= StyleSheet.create({
    content: {
      flex: 1, backgroundColor: "skyblue"
    },
    imgcontainer: {
      alignItems: "center", marginBottom: 20, marginTop: 20,
    },
    img:{
      width: "60%", height: 150, borderRadius: 50
    },
    text: {
      fontSize: 18, color: back, textAlign: "center"
    },
    title: {
      fontSize: 20, fontWeight: "bold", color: back, textAlign: "center"
    },
    button: {
      backgroundColor: "orange",
      padding: 10, borderRadius: 10, position: "absolute", bottom: -10
    },
    block: {
      margin: 10, alignItems: "center"
    },
    divider :{
      height: 1, width: "90%", backgroundColor: back, alignItems: "center",
    },
    bottom: {
      position: "absolute", bottom: 0, right: 10, left: 10
    },
    btn:{
      display:"flex", flexDirection: "row", backgroundColor: "red",
      justifyContent: "space-around", alignItems: "center",
      padding: 10, margin :10
    }
  })

  return (
    <SafeAreaView style={style.content}>
      <View style={style.block}>
        <Text style={style.title}>{user?.nom +" "+ user?.prenom}</Text>
      </View>

      <View style={style.imgcontainer}>
        <Image source={user?.photo ? { uri: API+"/document/show/"+user?.photo?.libelle } : img} style={style.img}  />
        <TouchableOpacity onPress={pickImage} style={style.button}>
          <Text style={style.text}>{t('drawer14')}</Text>
        </TouchableOpacity>
      </View>

      <View style={style.block}>
        <Divider style={style.divider} />
      </View>

      <Text style={style.title}>{t('drawer15')}:</Text>
      <Text style={style.text}>{user?.mail}</Text>

      <View style={style.block}>
        <Divider style={style.divider} />
      </View>

      <Text style={style.title}>{t('drawer16')}:</Text>
      <Text style={style.text}>{user?.telephone}</Text>

      <View style={style.block}>
        <Divider style={style.divider} />
      </View>

      <Text style={style.title}>{t('drawer17')}:</Text>
      <Text style={style.text}>{user?.localisation}</Text>

      <View style={style.block}>
        <Divider style={style.divider} />
      </View>

      {
        user?.type==="Eleve" && <View>
          <Text style={style.title}>{t('drawer20')}:</Text>
          <Text style={style.text}>{insc?.classe}</Text>

          <View style={style.block}>
            <Divider style={style.divider} />
          </View>
        </View>
      }

      <Text style={style.title}>{t('drawer18')}:</Text>
      <Text style={style.text}>{user?.ecole?.anneeScolaire}</Text>

      <View style={style.block}>
        <Divider style={style.divider} />
      </View>

      <View style={style.bottom}>
        <TouchableOpacity style={style.btn} onPress={handleReport}>
          <Ionicons name="information-circle" color={back} size={20} />
          <Text style={style.text}>{t("drawer19")} ?</Text>
        </TouchableOpacity>
        <Text style={style.text}>{VERSION}</Text>
      </View>

    </SafeAreaView>
  );
}


const LeftDrawer = () => {

  return (
    <Drawer.Navigator screenOptions={{headerShown: false}} drawerContent={(props)=> <Menu {...props} />}>
      <Drawer.Screen name="H" component={HomeStack} />
      <Drawer.Screen name="issu" component={Issu} />
    </Drawer.Navigator>
  );
};

export default LeftDrawer;

