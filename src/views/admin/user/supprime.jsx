import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Keyboard, TouchableWithoutFeedback } from "react-native";
import { TextInput } from "@react-native-material/core";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AdminHeader from "../../../template/header/adminHeader";
import { CardThree } from "react-native-card-ui";
import { Swipeable } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Get, Update } from "../../../api/service";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import prompt from "react-native-prompt-android";
import { useTranslation } from "react-i18next";


export default function SupprimeUser(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [search, setSearch]= useState("");
    const [users, setUsers]= useState([]);

    const nav=  useNavigation();

    const [isSending, setIsSending]= useState(false);
    const {t, _}=useTranslation();

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
            flex: 1, 
            margin: 5, backgroundColor: chart, borderBottomLeftRadius: 1000, borderBottomRightRadius: 600,
            borderTopLeftRadius: 100, borderTopRightRadius: 100, marginBottom: 50
        },
        input:{ marginTop: 20, borderRadius: 30},
        text:{fontSize: 15, padding: 5, fontStyle: "italic", color: front},
        part2:{borderTopLeftRadius: 50, backgroundColor: chart, flex:1},
        block:{marginLeft: 2, padding: 5, marginRight: 2, marginTop: 20},
        deleteButton: {backgroundColor: "transparent"},
        swipedRow: {alignItems: "center", justifyContent: "center"}
    });

    const renderLeftActions = ( progress, dragAnimatedValue, us) => {
        const opacity = dragAnimatedValue.interpolate({
            inputRange: [-10, 0],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });
        return (
            <View style={style.swipedRow}>
                <Animated.View style={[style.deleteButton, {opacity}]}>
                    <TouchableOpacity disabled={isSending} onPress={ () =>handleDelete(us)}>
                        <Ionicons name="trash" color={"red"} size={30} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };

    function handleDelete(us){
        prompt(t("rappel1"), t("admin18"),[
            {
                text: t("continue"), 
                onPress: (text)=>{
                    Get("/user/status/pass/"+text+"/"+user?._id, token).then(
                        (rs)=>{
                            if(!rs.error){
                                const util= {...us, archive: true}
                                if(util?.type==="Directeur"){
                                    Toast.show({
                                        text1: t("file4"), text2: t("admin19"),
                                        topOffset: 50, type:"error"
                                    })
                                    setSearch(""); setUsers([]);
                                }else{
                                    setIsSending(true);
                                    Update("/user/update", util, true, token).then(
                                        (rp)=>{
                                            if(!rp?.error){
                                                Toast.show({
                                                    text1: "message", text2: t("admin20"), topOffset: 50
                                                })
                                                setSearch(""); setUsers([]);
                                            }else{
                                                Toast.show({
                                                    text1: t("file4"),text2: t("file4"),
                                                    topOffset: 50, type:"error"
                                                })
                                            }
                                        }
                                    ).catch(()=>{
                                        Toast.show({
                                            text1: t("file4"), text2: t("file4"),
                                            topOffset: 50, type:"error"
                                        })
                                    })
                                    setIsSending(false);
                                }
                            }else{
                                Toast.show({
                                    text1: t("file4"), text2: t("admin21"), topOffset: 50, type:"error"
                                })
                            }
                        }
                    ).catch(()=>{})
                }
            },
            {text: t("cancel"), style:"cancel"}
        ], {type: "secure-text"})
    }

    function handleSearch(){
        Keyboard.dismiss();
        Get("/user/filter/"+search+"/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setUsers(rs?.users);
                }else{
                    Toast.show({
                        text1: t("file4"),
                        text2: t("admin22"),
                        topOffset: 50, type:"error"
                    })
                }
            }
        ).catch(()=>{
            Toast.show({
                text1: t("file4"), text2: t("admin22"), topOffset: 50, type:"error"
            })
        }) 
    }

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return (
        <>
            <View style={style.container}>
                
                <View style={style.block}>
                    <Text style={[style.text, {color: "white"}]}>{t("admin23")} ? </Text>
                    <TextInput placeholder={t("admin24")} inputStyle={{color:"black"}} onChangeText={setSearch}
                        {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                        value={search} trailing={<TouchableOpacity onPress={handleSearch}>
                            <Ionicons name="search" size={30} color={chart} />
                        </TouchableOpacity>} onSubmitEditing={handleSearch}
                    />
                </View>

                <ScrollView contentContainerStyle={style.block} onTouchStart={()=>Keyboard.dismiss()}>
                    <Text style={[style.text, {color: "white"}]}>({t("admin25")}) </Text>
                    {
                        users.length!==0 && 
                        users.map((us, idx)=>{
                            return (
                                <Swipeable key={idx} cancelsTouchesInView containerStyle={{marginLeft: -5, marginRight: -5}}
                                    renderLeftActions={( progress, dragAnimatedValue)=>renderLeftActions( progress, dragAnimatedValue, us)}>
                                    <CardThree title={us?.nom+" "+us.prenom} icon={"forward"} iconColor={"grey"}
                                        subTitle={us?.type+" ("+us?.mail+")"} 
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