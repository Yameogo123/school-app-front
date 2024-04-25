import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import FichierHeader from "../../template/header/fichierHeader";
import Ionicons from "react-native-vector-icons/Ionicons"
import AnimatedLottieView from "lottie-react-native";
import { TextInput } from "@react-native-material/core";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { Get } from "../../api/service";
import { useTranslation } from "react-i18next";

export default function File() {
    
    const nav=  useNavigation();
    //const ref= useRef();
    const [search, setSearch]=useState("");
    const front= useSelector((state)=>state.themeReducer.front);
    const back= useSelector((state)=>state.themeReducer.back);
    const chart= useSelector((state)=>state.themeReducer.chart);

    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const {t, _}=useTranslation();

    const [isSending, setIsSending]= useState(false);

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <FichierHeader />
            }, 
            headerShown: true
        })
    }, [])

    function handleSearch(){
        setIsSending(true);
        Get("/document/all/search/"+user?.ecole?._id+"/"+search, token).then(
            (rs)=>{
                //console.log(rs);
                if(!rs?.error){
                    if(rs?.documents?.length > 0){
                        nav.navigate("file/result", {files: rs?.documents})
                    }else{
                        Toast.show({
                            text1: t("file2"), text2: t("file3"), type:"info",
                            topOffset: 60
                        })
                    }
                }else{
                    Toast.show({
                        text1: t("file4"), text2: t("file5"), type:"error",
                        topOffset: 60
                    })
                }
            }
        ).catch(()=>{
            Toast.show({
                text1: t("file4"), text2: t("file5"), type:"error", topOffset: 60
            })
        });
        setIsSending(false);
    }

    const style = StyleSheet.create({
        container:{ flex: 1 },
        lottie:{ width: 250, height: 200 },
        input:{backgroundColor: chart, marginLeft: 30, marginRight: 30, marginTop: 20, borderRadius: 30},
        info:{color: front, margin: 30, fontSize: 20, textAlign: "justify", opacity: 0.4},

    })

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return (
        //<TouchableWithoutFeedback >
            <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
                <View style={{alignItems: "center"}}>
                    <AnimatedLottieView speed={2} autoPlay autoSize loop source={{uri: "https://lottie.host/654cbbc7-6443-479c-a373-41eb18e11940/Wfh3fRxovo.json"}}
                        style={style.lottie}
                    />
                </View>

                <TextInput 
                    leading={<Ionicons name="search" size={20} color={back} />} inputStyle={{color:"white"}}
                    onChangeText={setSearch} {...props} returnKeyLabel="recherche"
                    trailing={<TouchableOpacity disabled={isSending} onPress={handleSearch}>
                        <Ionicons name="enter" size={25} color={back} />
                    </TouchableOpacity>} onSubmitEditing={handleSearch}
                />

                <Text style={style.info}>
                    {t('file1')}
                </Text>

                
            </ScrollView>
            
        //</TouchableWithoutFeedback>
    );
}