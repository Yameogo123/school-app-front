import React, { useEffect, useState, useMemo } from "react";
import { Animated, StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Keyboard, TouchableWithoutFeedback, Platform } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AdminHeader from "../../../template/header/adminHeader";
import { CardThree } from "react-native-card-ui";
import { Swipeable } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Get, Remove } from "../../../api/service";
import Toast from "react-native-toast-message";
import moment from "moment";
import prompt from "react-native-prompt-android";

export default function AnnulerPlan(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [deleted, setDeleted]= useState(false);
    const [events, setEvents]= useState([]);

    const [jour, setJour] = useState(new Date());

    const handleJour=(event, selectedDate)=>{
        const currentDate = selectedDate || date;
        setJour(currentDate);
    }

    const showMode = (mode="date") => {
        DateTimePickerAndroid.open({
            value: jour,
            mode: mode, is24Hour: true, onChange: handleJour
        });
    };

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
        const j= moment(jour).format("YYYY-MM-DD");
        Get("/planCours/all/"+user?.ecole?._id+"/"+j+"/"+user?.ecole?.anneeScolaire, token).then(
            (rs)=>{
                if(!rs?.error){
                    Get("/planEvent/all/"+user?.ecole?._id+"/"+j+"/"+user?.ecole?.anneeScolaire, token).then(
                        (rp)=>{
                            if(!rp?.error){
                                setEvents([...rs?.events, ...rp?.events])
                            }
                        }
                    ).catch(()=>{})
                }
            }
        ).catch(()=>{})
    }, [jour, deleted]);

    const style= StyleSheet.create({
        container: {
            flex: 1, 
            margin: 5, backgroundColor: chart, borderBottomLeftRadius: 1000, borderBottomRightRadius: 600,
            borderTopLeftRadius: 100, borderTopRightRadius: 100, marginBottom: 50
        },
        text:{fontSize: 15, padding: 5, fontStyle: "italic", color: front},
        block:{marginLeft: 2, padding: 5, marginRight: 2, marginTop: 20},
        deleteButton: {backgroundColor: "transparent"},
        swipedRow: {alignItems: "center", justifyContent: "center"}
    });

    const renderLeftActions = ( progress, dragAnimatedValue, ev) => {
        const opacity = dragAnimatedValue.interpolate({
            inputRange: [-10, 0],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });
        return (
            <View style={style.swipedRow}>
                <Animated.View style={[style.deleteButton, {opacity}]}>
                    <TouchableOpacity onPress={()=>handleDelete(ev)}>
                        <Ionicons name="trash" color={"red"} size={30} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };

    function del(id, type="planEvent"){
        Remove("/"+type+"/"+id, token).then(
            (rp)=>{
                if(!rp?.error){
                    Toast.show({
                        text1: "message", text2: "évènement annulée", topOffset: 50
                    });
                    setDeleted(!deleted);
                }else{
                    Toast.show({
                        text1: "erreur",
                        text2: "erreur d'annulation de l'évènement",
                        topOffset: 50, type:"error"
                    })
                }
            }
        ).catch(()=>{
            Toast.show({
                text1: "erreur", text2: "erreur d'annulation de l'évènement",
                topOffset: 50, type:"error"
            })
        })
    }

    function handleDelete(ev){
        prompt("voulez vous vraiment continuer?", " si oui, veuillez saisir votre mot de passe",[
            {
                text: "valider", 
                onPress: (text)=>{
                    Get("/user/status/pass/"+text+"/"+user?._id, token).then(
                        (rs)=>{
                            if(!rs.error){
                                if(ev.cours){
                                    del(ev?._id, "planCours")
                                }else{
                                    del(ev?._id, "planEvent")
                                }
                            }else{
                                Toast.show({
                                    text1: "erreur",
                                    text2: "verifier votre mot de passe",
                                    topOffset: 50, type:"error"
                                })
                            }
                        }
                    ).catch(()=>{})
                }
            },
            {text: "annuler", style: "cancel"}
        ],{
            type: "secure-text", cancelable: true
        })
    }

    return (
        <>
            <View style={style.container}>

                <View style={[style.block, {zIndex: 5, alignItems:"flex-start"}]}>
                    <Text style={style.text}>Quel évènement (choix du jour) ? </Text>
                    {
                        Platform.OS==="android" ? <TouchableOpacity onPress={()=>showMode()} style={{backgroundColor: "white", padding: 15, borderRadius: 30}}>
                            <Text style={{color: chart}}>{moment(jour).format("YYYY-MM-DD")}</Text>
                        </TouchableOpacity> : <DateTimePicker 
                            value={jour} mode={"date"} is24Hour={true}
                            onChange={handleJour}
                        />
                    }
                </View>

                <ScrollView contentContainerStyle={style.block} scrollEnabled showsVerticalScrollIndicator={false}>
                    <Text style={[style.text, {color: "white"}]}>(glisser à droite pour supprimer) </Text>
                    {
                        events.length!==0 && 
                        events.map((ev, idx)=>{
                            return (
                                <Swipeable key={idx} cancelsTouchesInView containerStyle={{marginLeft: -5, marginRight: -5}}
                                    renderLeftActions={( progress, dragAnimatedValue)=>renderLeftActions( progress, dragAnimatedValue, ev)}>
                                    <CardThree title={ev?.title.substring(0, 60)+"..."} icon={"forward"} iconColor={"grey"}
                                        subTitle={ev?.start?.split(" ")[1]+ " - "+ ev?.end?.split(" ")[1]} 
                                        profile={require("../../../../assets/icon.png")} key={idx}/>
                                </Swipeable>
                            );
                        })
                    }
                </ScrollView>

            </View>
        </>
    );
}