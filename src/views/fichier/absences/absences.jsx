import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import FichierHeader from "../../../template/header/fichierHeader";
import { useNavigation } from "@react-navigation/native";
import Timeline from 'react-native-simple-timeline';
import AnimatedLottieView from "lottie-react-native";
import { Get } from "../../../api/service";
import { useSelector } from "react-redux";


export default function Absences(){

    const nav=  useNavigation();
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const loading= useSelector((state)=>state.userReducer.loading);
    const [absences, setAbsences]= useState([]);

    const style= StyleSheet.create({
        text:{textAlign: "center", fontSize: 15, fontWeight: "bold", margin: 15},
        lottie:{width: 200, height: 200}
    });

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <FichierHeader sel="absences"  />
            }, 
            headerShown: true
        })
    }, []);

    useMemo(()=>{
        Get("/absence/all/school/"+user?.ecole?._id+"/"+user?._id+"/"+user?.ecole?.anneeScolaire, token).then(
            (rs)=>{
                if(!rs?.error){
                    setAbsences(rs?.absences);
                }
            }
        ).catch(()=>{})
    }, [nav, loading]);

    return (
        <View>
            <Text style={style.text} >La liste de vos absences</Text>
            <View style={{margin: 50}}>
                {
                    absences.length >0 ? <Timeline data={absences}  />:
                    <View style={{alignItems: "center", margin: 50}}>
                        <AnimatedLottieView source={{uri: "https://assets2.lottiefiles.com/temp/lf20_Celp8h.json"}} style={style.lottie} autoPlay loop />
                    </View>
                }
            </View>
        </View>
    );
}