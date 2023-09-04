import { useNavigation } from "@react-navigation/native";
import React, { useEffect} from "react";
import { useSelector } from "react-redux";
import AdminHeader from "../../../template/header/adminHeader";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import AnimatedLottieView from "lottie-react-native";


export default function Planifier(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);

    const nav=  useNavigation();

    const plans=[
        {id:1, libelle: "planifier un cours", uri: require("../../../../assets/calendar1.json"), link: "plan/cours"},
        {id:2, libelle: "planifier un évènement", uri: require("../../../../assets/calendar2.json"), link: "plan/event"},
        {id:2, libelle: "annuler planification", uri: require("../../../../assets/calendar3.json"), link: "plan/annuler"},
    ]

    useEffect(()=>{
        nav.setOptions({
            header : ()=> {
                return <AdminHeader />
            }, 
            headerShown: true
        })
    }, []);

    const style= StyleSheet.create({
        container: {
            flex: 1, margin: 15, marginBottom: 50
        },
        card:{ margin:15, borderRadius: 20, borderWidth: 0.3, backgroundColor: chart,},
        text:{fontSize: 15, padding: 15, fontStyle: "italic", color: front, textAlign: "center", fontWeight: "bold"},
        lottie: {alignItems: "center", justifyContent: "center", height: 200, width: 100},
        shadow: {shadowColor: front, shadowOffset: {width: 0.1, height: 0.1}, shadowOpacity: 0.1, shadowRadius: 20}
    });

    function Card({card}){

        return (
            <TouchableOpacity style={[style.card, style.shadow]} key={card.id} onPress={()=> nav.navigate(card.link)}>
                <View style={{alignItems: "center", margin: 50}}>
                    <AnimatedLottieView source={card.uri} style={style.lottie} autoPlay loop />
                </View>
                <Text style={style.text}>{card.libelle}</Text>
            </TouchableOpacity>
        )
    }


    return (
        <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
            {
                plans.map((plan, idx)=>{
                    return (<View key={idx}>
                        <Card card={plan} />
                    </View>)
                })
            }
        </ScrollView>
    );


}