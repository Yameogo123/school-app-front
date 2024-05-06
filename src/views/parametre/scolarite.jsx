import React, { useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AnimatedLottieView from "lottie-react-native";
import SimpleHeader from "../../template/header/simpleHeader";
import img from "../../../assets/icon.png"
import { useSelector } from "react-redux";
import { Get } from "../../api/service";
import { useTranslation } from "react-i18next";

export default function Scolarite(){

    const nav=  useNavigation();
    const front= useSelector((state)=>state.themeReducer.front);
    const back= useSelector((state)=>state.themeReducer.back);
    const chart= useSelector((state)=>state.themeReducer.chart);
    const user= useSelector((state)=> state.userReducer.user);
    const token= useSelector((state)=> state.userReducer.token);
    const loading= useSelector((state)=>state.userReducer.loading);
    const {t, _}=useTranslation();

    const [directeur, setDirecteur]= useState(null);

    useMemo(()=>{
        //+user?._id
        Get("/user/all/Directeur/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setDirecteur(rs?.users[0]);
                }
            }
        ).catch(()=>{})
    }, [loading]); 

    const handleLienPress = async (url) => {
        const supported = await Linking.canOpenURL(url);
    
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Le lien suivant : ${url} ne s'ouvre pas`);
        }
    };

    const style= StyleSheet.create({
        text:{textAlign: "center", fontSize: 15, color: front },
        title:{textAlign: "center", fontSize: 17, fontWeight: "bold", margin: 1, color: front },
        lottie:{width: 60, height: 60},
        card:{ borderRadius: 30, margin: 10, padding: 5, alignItems: "center"},
        img: {width: 150, height: 150, borderRadius: 30}
    });

    function DisplayCard({item, link}){
        return (<TouchableOpacity style={style.card} onPress={()=>handleLienPress(link)} key={item?.id}>
            <AnimatedLottieView source={{uri: item?.icon}} style={style.lottie} autoPlay loop />
        </TouchableOpacity>);
    }

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader  />
            }, 
            headerShown: true
        })
    }, []);

    return (
        <View style={{flex:1}}>
            <View style={{alignItems:"center"}}>
                <Image source={img} style={style.img} />
            </View>
            <View style={{margin: 5, marginTop: 20}}>
                <View style={{flexDirection: "row", justifyContent: "center"}}>
                    <DisplayCard item={{id: 1, icon: 'https://assets10.lottiefiles.com/private_files/lf30_lghsciar.json'}} link={'whatsapp://send?text=Bonjour&phone='+user?.ecole?.whatsapp} />
                    <DisplayCard item={{id: 2, icon: 'https://assets1.lottiefiles.com/private_files/lf30_pb3we3yk.json'}} link={user?.ecole?.facebook} />
                    <DisplayCard item={{id: 3, icon: 'https://assets1.lottiefiles.com/packages/lf20_rLfMZE.json'}} link={user?.ecole?.web} />
                </View>
                <View style={{alignItems:"center", margin: 15}}>
                    <Text style={style.title}>{t('scolaire1')}</Text>
                    <Text style={style.text}>{user?.ecole?.titre}</Text>
                </View>
                <View style={{alignItems:"center", margin: 15}}>
                    <Text style={style.title}>{t('scolaire2')}</Text>
                    <Text style={style.text}>{directeur?.nom+" "+directeur?.prenom}</Text>
                </View>
                <View style={{alignItems:"center", margin: 15}}>
                    <Text style={style.title}>{t('scolaire3')}</Text>
                    <Text style={style.text}>{user?.ecole?.localisation}</Text>
                </View>
                <View style={{alignItems:"center", margin: 15}}>
                    <Text style={style.title}>Contact</Text>
                    <Text style={style.text}>Tel: {user?.ecole?.telephone}</Text>
                    <Text style={style.text}>Mail: {user?.ecole?.email}</Text>
                </View>
                <View style={{alignItems:"center", margin: 15}}>
                    <Text style={style.title}>Type</Text>
                    <Text style={style.text}>{user?.ecole?.type}</Text>
                </View>
            </View>
            
        </View>
    );
}