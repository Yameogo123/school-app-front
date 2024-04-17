import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, TouchableWithoutFeedback, View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from 'react-redux';
import AdminHeader from '../../../template/header/adminHeader';
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput } from "@react-native-material/core";
import { Toast } from "react-native-toast-message/lib/src/Toast";


export default function Reglement() {
    
    //StatusBar.setHidden(true);

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);

    const [raison, setRaison]= useState("");
    const [montant, setMontant]= useState("");

    const [isSending, setIsSending]= useState(false);

    const nav=  useNavigation();

    useEffect(()=>{
        nav.setOptions({
            header : ()=> {
                return <AdminHeader lk="admin/rapport" />
            }, 
            headerShown: true
        })
    }, []);

    function handleSend(){
        if(raison!=="" && montant!==""){
            const mt= parseFloat(montant);
            const rs= ["scolarité", "don", "sortie scolaire"]
            if(!isNaN(mt)){
                if(rs?.includes(raison.toLocaleLowerCase())){
                    setIsSending(true);
                    //redirect to payment page
                    
                    setIsSending(false);
                }else{
                    Toast.show({text1: "Erreur", text2: "veuillez saisir une raison valide", topOffset: 60, type: "error"});
                }
            }else{
                Toast.show({text1: "Erreur", text2: "veuillez saisir un montant valide", topOffset: 60, type: "error"});
            }
        }else{
            Toast.show({text1: "Erreur", text2: "veuillez remplir les champs s'il vous plait", topOffset: 60, type: "error"});
        }
    }


    const style = StyleSheet.create({
        container: {
            flex: 1
        },
        top: {},
        bottom: {
            position: 'absolute', width: Dimensions.get('screen').width, bottom: 0,
        },
        box: {
            backgroundColor: '#87CEEB', height: 80,
        },
        bottomWavy: {
            position: 'absolute', bottom: 20,
        },
        input:{ marginTop: 20, borderRadius: 30},
        text:{fontSize: 15, padding: 5, fontStyle: "italic", color: front},
        part2:{borderTopLeftRadius: 50, backgroundColor: chart, flex:1},
        block:{marginLeft: 20, padding: 10, marginRight: 20, marginTop: 10},
    });

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return(
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <View style={style.container}>
                <View style={style.top}>
                    <View style={style.box}>
                        <Svg 
                            height={200} width={Dimensions.get('screen').width}
                            viewBox="0 0 1440 320" style={style.topWavy}>
                            <Path fill="#87CEEB"
                                d='M0,192L60,170.7C120,149,240,107,360,112C480,117,600,171,720,197.3C840,224,960,224,1080,208C1200,192,1320,160,1380,144L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'
                            />
                        </Svg>
                    </View>
                </View>

                <View style={style.container}>
                
                    <View style={style.block}>
                        <Text style={[style.text, ]}>Raison de paiement ? </Text>
                        <TextInput placeholder={"ecrire..."} inputStyle={{color:"black"}} onChangeText={setRaison}
                            {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                            helperText='scolarité ou sortie scolaire ou don'
                        />
                    </View>

                    <View style={style.block}>
                        <Text style={[style.text, {}]}>Quel montant ? </Text>
                        <TextInput placeholder={"ecrire..."} inputStyle={{color:"black"}} onChangeText={setMontant}
                            {...props} textContentType="name" leading={<Ionicons name="pencil" size={25} color={chart} />} 
                        />
                    </View>

                    <View style={[style.block, {zIndex: 1}]}>
                        <TouchableOpacity disabled={isSending} onPress={handleSend} style={[style.btn, {backgroundColor: chart, borderRadius: 30, margin: 40, padding: 20}]}>
                            <Text style={[style.title, {color: back, textAlign: "center"}]}>envoyer</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={style.bottom}>
                    <View style={style.box}>
                        <Svg
                            height={200} width={Dimensions.get('screen').width}
                            viewBox="0 0 1440 320" style={style.bottomWavy} >
                            <Path fill="#87CEEB"
                                d='M0,64L40,96C80,128,160,192,240,202.7C320,213,400,171,480,149.3C560,128,640,128,720,154.7C800,181,880,235,960,218.7C1040,203,1120,117,1200,74.7C1280,32,1360,32,1400,32L1440,32L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z'
                            />
                        </Svg>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

