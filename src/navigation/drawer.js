import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { HomeStack } from './stack';
import img from "../../assets/icon.png"
import React, { useEffect, useMemo, useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "react-native-paper";
import { VERSION } from "../api/constante";
import Ionicons from "react-native-vector-icons/Ionicons"
import { storeString } from "../redux/storage";
import { useNavigation } from "@react-navigation/native";

const Drawer = createDrawerNavigator()



function Menu(props){
  const back = useSelector((state)=>state.themeReducer.back)
  const dispatch = useDispatch()
  const profil = useSelector((state)=>state.userReducer.profil)
  const nav= useNavigation()
  const [image, setImage] = useState(profil);
 

  useMemo(() => setImage(profil), [profil])

  function handleReport(){
    //nav.navigate("profile")
  }

  function saveImg(img){
    const action= {
      type: "profil", value: img
    }
    storeString("profil", img).then(()=>{
      dispatch(action)
    })
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    }, (rep)=>{
      if(!rep?.didCancel){
        //console.log(rep.assets[0].uri);
        saveImg(rep.assets[0].uri)
        setImage(rep.assets[0].uri)
      }
    });

    //console.log(image);

  }

  const style= StyleSheet.create({
    content: {
      flex: 1,
      backgroundColor: "skyblue",
      //paddingTop: 10
    },
    imgcontainer: {
      alignItems: "center",
      marginBottom: 20,
      marginTop: 20,
    },
    img:{
      width: "60%",
      height: 150,
      borderRadius: 50
    },
    text: {
      fontSize: 18,
      color: back,
      textAlign: "center"
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: back,
      textAlign: "center"
    },
    button: {
      backgroundColor: "orange",
      padding: 10,
      borderRadius: 10,
      position: "absolute",
      bottom: -10
    },
    block: {
      margin: 10,
      alignItems: "center"
    },
    divider :{
      height: 1,
      width: "90%",
      backgroundColor: back,
      alignItems: "center",
      //margin: 20
    },
    bottom: {
      position: "absolute",
      bottom: 0,
      right: 10,
      left: 10
    },
    btn:{
      display:"flex",
      flexDirection: "row",
      backgroundColor: "red",
      justifyContent: "space-around",
      alignItems: "center",
      padding: 10,
      margin :10
    }
  })

  return (
    <SafeAreaView style={style.content}>
      <View style={style.block}>
        <Text style={style.title}>Yameogo Wendyam Ivan</Text>
      </View>

      <View style={style.imgcontainer}>
        <Image source={image ? { uri: image } : img} style={style.img}  />
        <TouchableOpacity onPress={pickImage} style={style.button}>
          <Text style={style.text}>mettre à jour</Text>
        </TouchableOpacity>
      </View>

      <View style={style.block}>
        <Divider style={style.divider} />
      </View>

      <Text style={style.title}>Adresse mail:</Text>
      <Text style={style.text}>yameogoivan10@gmail.com</Text>

      <View style={style.block}>
        <Divider style={style.divider} />
      </View>

      <Text style={style.title}>Numéro de téléphone:</Text>
      <Text style={style.text}>+221 77 359 55 96</Text>

      <View style={style.block}>
        <Divider style={style.divider} />
      </View>

      <Text style={style.title}>Adresse domicile:</Text>
      <Text style={style.text}>Zone 1</Text>

      <View style={style.block}>
        <Divider style={style.divider} />
      </View>

      <Text style={style.title}>Classe:</Text>
      <Text style={style.text}>Tle</Text>

      <View style={style.block}>
        <Divider style={style.divider} />
      </View>

      <Text style={style.title}>Année scolare:</Text>
      <Text style={style.text}>2023-2024</Text>

      <View style={style.block}>
        <Divider style={style.divider} />
      </View>

      <View style={style.bottom}>
        <TouchableOpacity style={style.btn} onPress={handleReport}>
          <Ionicons name="information-circle" color={back} size={20} />
          <Text style={style.text}>Reporter un souci ?</Text>
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
    </Drawer.Navigator>
  );
};

export default LeftDrawer;

