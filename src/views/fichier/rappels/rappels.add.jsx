import React, {useRef, useEffect, useState} from "react";
import { Text, View, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Alert, Keyboard } from "react-native";
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import SimpleHeader from "../../../template/header/simpleHeader";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { Send, Update } from "../../../api/service";
import { useTranslation } from "react-i18next";

const handleHead = ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>

const RappelAdd = () => {
	const richText = useRef();
    const route= useRoute();
    const nav= useNavigation();
    const [descHTML, setDescHTML] = useState(route?.params?.doc?.libelle || "");
    const back= useSelector((state)=>state.themeReducer.back);
    const dispatch= useDispatch();
    const action= {type: "loading"};

    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const loading= useSelector((state)=>state.userReducer.loading);
    const [isSending, setIsSending]= useState(false);
    const [updated, setUpdated]= useState(route?.params?.doc ? route?.params?.doc :null);

    const {t, _}=useTranslation();

    const submitContentHandle = () => {
        // const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, " ").trim();
        // const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, " ").trim();
        let replaceWhiteSpace= descHTML
        setIsSending(true);
        if(route?.params?.doc || updated!==null){
            //update
            const doc= {...updated, libelle: replaceWhiteSpace}
            Update("/rappel/update", {rappel: doc}, true, token).then(
                (rp)=>{
                    if(rp?.error){
                        Toast.show({
                            text1: "erreur", text2: "la mise à jour a échoué",
                            topOffset: 50, type:"error"
                        })
                    }else{
                        Toast.show({
                            text1: "message", text2: "rappel mémoire mise à jour",
                            topOffset: 50
                        })
                        
                        dispatch(action)
                    }
                }
            ).catch(()=>{
                Toast.show({
                    text1: "erreur", text2: "problème de mise à jour",
                    topOffset: 50, type:"error"
                })
            })
        }else{
            if(replaceWhiteSpace!==""){
                const rappel= {
                    user: user?._id, libelle: replaceWhiteSpace, anneeScolaire: user?.ecole?.anneeScolaire,
                    ecole: user?.ecole?._id
                }
                Send("/rappel/new", {rappel: rappel}, true, token).then(
                    (rp)=>{
                        if(rp?.error){
                            Toast.show({
                                text1: t("file4"), text2: t("file4"),
                                topOffset: 50, type:"error"
                            })
                        }else{
                            Toast.show({
                                text1: "message", text2: t("rappel8"),
                                topOffset: 50
                            })
                            setUpdated(rp?.rappel);
                            dispatch(action)
                        }
                    }
                ).catch(()=>{
                    Toast.show({
                        text1: t("file4"), text2: t("file4"),
                        topOffset: 50, type:"error"
                    })
                })
            }else{
                Toast.show({
                    text1: "erreur", text2: t("rappel9"),
                    topOffset: 50, type:"error"
                })
            }
        }
        setIsSending(false);
    };

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader />
            }, 
            headerShown: true
        })
    }, []);

	return (
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()} >
            {/* <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}} > */}
            
                <View style={{margin: 10, flex:1}}>
                    <RichToolbar 
                        editor={richText} pasteAsPlainText
                        selectedIconTint="#873c1e" iconTint="#312921"
                        actions={[ actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1, 
                            actions.undo, actions.insertBulletsList, actions.insertOrderedList,
                            actions.insertLink 
                        ]}
                        iconMap={{ [actions.heading1]: handleHead }}
                    />
                    <ScrollView style={{ height: "90%" }}>
                        
                        <View style={{display:"flex", flexDirection: "row", justifyContent: "space-between", margin: 5, alignItems: "center"}}>
                            <Text style={{fontSize: 15}}>Description:</Text>
                            <TouchableOpacity disabled={isSending} style={{ backgroundColor: route?.params?.doc?.content? "tomato": "blue", borderRadius: 15, padding: 5}} onPress={()=>submitContentHandle()}>
                                <Ionicons name="save" color={back} size={25} />
                            </TouchableOpacity>
                        </View>
                        <RichEditor androidLayerType="software" 
                            androidHardwareAccelerationDisabled={true} style={{ flex: 1, height: "50%" }}
                            ref={richText} pasteAsPlainText 
                            useContainer={false}
                            containerStyle={{ minHeight: "46%" }}
                            onChange={ descriptionText => {
                                setDescHTML(descriptionText);
                            }} placeholder={t("rappel9") + ".."}
                            initialContentHTML={descHTML}
                        />

                        {/* <KeyboardAccessoryNavigation
                            animateOn="all" 
                            avoidKeyboard androidAdjustResize
                        /> */}

                        
                    </ScrollView>
                    
                </View>
            {/* </KeyboardAvoidingView> */}
        </TouchableWithoutFeedback>
    );
};

export default RappelAdd;