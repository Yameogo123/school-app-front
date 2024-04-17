import React, { useEffect, useState, useMemo } from "react";
import { Animated, StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, TouchableWithoutFeedback, Keyboard, Dimensions } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { adaptSelect } from "../../../api/functions";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AdminHeader from "../../../template/header/adminHeader";
import { CardThree } from "react-native-card-ui";
import { Swipeable } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons"
import { Get, Remove } from "../../../api/service";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Svg, { Path } from 'react-native-svg';
import prompt from "react-native-prompt-android";


export default function AnnulerInscription(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [eleves, setEleves]= useState([]);
    const [eleve, setEleve]= useState(null);
    const [inscriptions, setInscriptions]= useState([]);
    const [open, setOpen]= useState(false);

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
        Get("/user/all/Eleve/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setEleves(rs?.users);
                }
            }
        ).catch(()=>{})
    }, []);

    const style= StyleSheet.create({
        container: {
            flex: 1, //margin: 5
        },
        input:{ marginLeft: 30, marginRight: 30, marginTop: 20, borderRadius: 30},
        text:{fontSize: 15, padding: 5, fontStyle: "italic", color: front},
        part2:{borderTopLeftRadius: 50, backgroundColor: chart, flex:1},
        block:{marginLeft: 2, padding: 5, marginRight: 2, marginTop: 20},
        deleteButton: {backgroundColor: "transparent"},
        swipedRow: {alignItems: "center", justifyContent: "center"},
        box: {
            backgroundColor: '#87CEEB', height: 120,
        },
        bottomWavy: {
            position: 'absolute', bottom: 20,
        }
    });

    const renderLeftActions = ( progress, dragAnimatedValue, id) => {
        const opacity = dragAnimatedValue.interpolate({
            inputRange: [-10, 0],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });
        return (
            <View style={style.swipedRow}>
                <Animated.View style={[style.deleteButton, {opacity}]}>
                    <TouchableOpacity onPress={()=>handleDelete(id)}>
                        <Ionicons name="trash" color={"red"} size={30} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };

    function getInsc(id){
        Get("/inscription/all/eleve/"+id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setInscriptions(rs?.inscriptions);
                }else{
                    Toast.show({
                        text1: "erreur", text2: "aucune inscription pour cet étudiant",
                        topOffset: 50, type:"error"
                    })
                }
            }
        ).catch(()=>{}) 
    }

    function handleDelete(id){
        prompt("voulez vous vraiment continuer?", " si oui, veuillez saisir votre mot de passe",[
            {
                text: "valider", 
                onPress: (text)=>{
                    Get("/user/status/pass/"+text+"/"+user?._id, token).then(
                        (rs)=>{
                            if(!rs.error){
                                Remove("/inscription/"+id, token).then(
                                    (rp)=>{
                                        if(!rp?.error){
                                            Toast.show({
                                                text1: "message", text2: "Inscription annulée", topOffset: 50
                                            })
                                            setEleve(null); setInscriptions([]);
                                        }else{
                                            Toast.show({
                                                text1: "erreur", text2: "erreur d'annulation de l'inscription",
                                                topOffset: 50, type:"error"
                                            })
                                        }
                                    }
                                ).catch(()=>{
                                    Toast.show({
                                        text1: "erreur", text2: "erreur de annulation de l'inscription",
                                        topOffset: 50, type:"error"
                                    })
                                })
                            }else{
                                Toast.show({
                                    text1: "erreur", text2: "verifier votre mot de passe",
                                    topOffset: 50, type:"error"
                                })
                            }
                        }
                    ).catch(()=>{})
                }
            },
            {text: "annuler", style: "cancel"}
        ], {
            type: "secure-text", cancelable: true
        })
    }

    return (
        <>
            <View style={style.container}>
            
                <View style={[style.block, {zIndex: 4}]}>
                    <Text style={style.text}>Quel élève ? </Text>
                    <DropDownPicker placeholder="Veuillez choisir" onSelectItem={(item)=> getInsc(item?._id)}
                        open={open} value={eleve} items={adaptSelect(eleves, 1)}
                        setOpen={setOpen} setValue={setEleve} searchable maxHeight={250}
                        setItems={setEleves} listMode="SCROLLVIEW" 
                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                    />
                </View>

                <ScrollView contentContainerStyle={[style.block, {zIndex: 3}]}>
                    <Text style={style.text}>(glisser à droite pour annuler) </Text>
                    {
                        inscriptions.length!==0 && 
                        inscriptions.map((ins, _)=>{
                            return (
                                <Swipeable key={Math.floor(Math.random() * 100)} cancelsTouchesInView containerStyle={{marginLeft: -5, marginRight: -5}}
                                    renderLeftActions={(progress, dragAnimatedValue)=>renderLeftActions(progress, dragAnimatedValue, ins?._id)}>
                                    <CardThree title={"année scolaire "+ins?.anneeScolaire} icon={"forward"} iconColor={"grey"}
                                        subTitle={"Classe de "+ins?.classe?.libelle} 
                                        profile={require("../../../../assets/icon.png")} key={Math.floor(Math.random() * 100)}/>
                                </Swipeable>
                            );
                        })
                    }
                </ScrollView>

                <View style={style.bottom}>
                    <View style={style.box}>
                        <Svg
                            height={250} width={Dimensions.get('screen').width}
                            viewBox="0 0 1440 320" style={style.bottomWavy} >
                            <Path fill="#87CEEB"
                                d='M0,0L11.4,37.3C22.9,75,46,149,69,186.7C91.4,224,114,224,137,197.3C160,171,183,117,206,128C228.6,139,251,213,274,218.7C297.1,224,320,160,343,133.3C365.7,107,389,117,411,106.7C434.3,96,457,64,480,64C502.9,64,526,96,549,133.3C571.4,171,594,213,617,218.7C640,224,663,192,686,192C708.6,192,731,224,754,197.3C777.1,171,800,85,823,85.3C845.7,85,869,171,891,186.7C914.3,203,937,149,960,154.7C982.9,160,1006,224,1029,229.3C1051.4,235,1074,181,1097,144C1120,107,1143,85,1166,117.3C1188.6,149,1211,235,1234,261.3C1257.1,288,1280,256,1303,229.3C1325.7,203,1349,181,1371,181.3C1394.3,181,1417,203,1429,213.3L1440,224L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z'
                            />
                        </Svg>
                    </View>
                </View>

            </View>
        </>
    );
}