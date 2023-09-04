
import React, { useEffect, useState } from "react";
import Lottie from 'lottie-react-native';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "@react-native-material/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Keyboard } from "react-native";
import { storeObject, storeString } from "../../redux/storage";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { Send } from "../../api/service";
import { ActivityIndicator } from "react-native-paper";
import moment from "moment";



export default function Login(){

    const back= useSelector((state)=>state.themeReducer.back)
    const front= useSelector((state)=>state.themeReducer.front)
    const chart= useSelector((state)=>state.themeReducer.chart)
    const [email, setMail]= useState("")
    const [password, setPassword]= useState("")
    const [message, setMessage]= useState("")
    const [secure, setSecure]= useState(true)
    const dispatch= useDispatch()
    const nav= useNavigation()

    const [loading, setLoading]= useState(false)

    useEffect(()=>{
        const tim= setTimeout(()=>setMessage(""), 5000)
        return ()=> clearTimeout(tim)
    },[message])

    function handleLogin(){
        if(email!=="" && password!==""){
            setLoading(true)
            const user={
                mail: email, password: password
            }
            Send("/user/login", user).then(
                (rs)=>{
                    if(rs?.error){
                        Toast.show({
                            text1: "Attention", text2: "Vérifier vos identifiants ",
                            topOffset: 50, type: "error"
                        })
                    }else{
                        storeObject("login", rs).then(
                            ()=>{
                                const action={type: "login", value: rs}
                                dispatch(action);
                                storeString("log", moment().add(12, "hours").toISOString()).then(()=>{})
                                storeString("connected", "connected").then(
                                    ()=>{
                                        const act={type: "connexion", value: "connected"}
                                        dispatch(act);
                                        Toast.show({
                                            text1: "connexion", text2: "bienvenue à vous "+rs?.user?.civilite+" "+rs?.user?.nom,
                                            topOffset: 50
                                        })
                                    }
                                )
                            }
                        )
                    }
                    setLoading(false)
                }
            ).catch(()=>{
                Toast.show({
                    text1: "Attention", text2: "Vérifier vos identifiants ",
                    topOffset: 50, type: "error"
                })
            })
        }else{
            setMessage("veuillez saisir les données")
        }
    }



    const style= StyleSheet.create({
        title:{
            fontSize: 30, color: front, fontWeight: "bold"
        },
        text:{
            fontSize: 20, color: front
        },
        lotti:{
            width: 150, height: 150,
        },
        head:{
            alignItems: "center", margin: 45
        },
        input:{ marginLeft: 30, marginRight: 30, marginTop: 20, borderRadius: 30},
        btn:{
            backgroundColor: "green", padding: 10, borderRadius: 5, margin: 30, display: "flex", flexDirection: "row", 
            justifyContent: "space-around", alignItems: "center", marginLeft: 70, marginRight: 70,
        },
        bottom:{
            //position: "absolute", bottom: 0, left: 10, right: 10, 
            alignItems: "center"
        },
    })

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return (
        <ScrollView >    
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <SafeAreaView >
                    <View style={style.head}>
                        <Lottie source={{uri: "https://assets9.lottiefiles.com/packages/lf20_pk7nnxpm.json"}} autoPlay loop style={style.lotti} />
                    </View>

                    <Text style={{color: "red", textAlign: "center", marginTop: 20}}>{message}</Text>

                    <View>
                        <TextInput placeholder={"email"} leading={<Ionicons name="at-circle-sharp" size={20} color={"green"} />} 
                            {...props} textContentType="emailAddress" onChangeText={setMail} inputStyle={{color:"black"}}
                        />

                        <TextInput placeholder={"password"} leading={<Ionicons name="key-sharp" size={20} color={"green"} />}
                            secureTextEntry={secure}  textContentType="password"
                            onChangeText={setPassword} {...props} inputStyle={{color:"black"}}
                            trailing={<TouchableOpacity onPress={()=>setSecure(!secure)}>
                                <Ionicons name="eye" size={20} color={"green"} />
                            </TouchableOpacity>} 
                        />

                        {loading ? <ActivityIndicator color={chart} size={"small"} /> : <TouchableOpacity style={style.btn} onPress={handleLogin}>
                            <Text style={[style.text,{color: "white"}]}>connexion</Text>
                            <Ionicons name="log-in" size={30} color={"white"} />
                        </TouchableOpacity>}

                    </View>
                    <TouchableOpacity style={style.bottom}>
                        <Text style={{color: front}}>mot de passe oublié?</Text>
                    </TouchableOpacity>    

                </SafeAreaView>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}