
import { View, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback} from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import ForumBottom from "./forum.bottom";
import { useNavigation, useRoute } from "@react-navigation/native";
import SimpleHeader from "../../template/header/simpleHeader";
import { useSelector } from "react-redux";
import ForumContent from "./forum.content";
import { Get, Update } from "../../api/service";


export default function ForumDetail(){

    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const nav=  useNavigation();
    const route= useRoute()
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [heightOfMessageBox, setHeightOfMessageBox] = useState(0);
    const [conversation, setConversation]= useState(route.params?.conversation)
    const mess= conversation?.messages
    const conv= {...conversation, "read": [...conversation?.read?.filter((c)=> c!==user?._id), user?._id]}

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader />
            }, 
            headerShown: true
        })
    }, []);

    useMemo(() => {
        const unsubscribe = nav.addListener('focus', () => {
            Update("/conversation/update", {conversation: conv}, true, token).then(   
                (rs)=>{
                    //console.log(rs);
                }
            ).catch(()=>{})
        });
        return unsubscribe;
    }, []);

    // useMemo(()=>{
    //     Get("/conversation/one/"+conversation?._id, token).then(
    //         (rs)=>{
    //             if(!rs?.error){
    //                 setConversation(rs?.conversation);
    //             }
    //         }
    //     ).catch(()=>{})
    //     //return clearInterval(time)
    // }, [isTyping]); 

    useEffect(()=>{
        if(!isSending){
            setInterval(() => {
                Get("/conversation/one/"+conversation?._id, token).then(
                    (rs)=>{
                        if(!rs?.error){
                            setConversation(rs?.conversation);
                        }
                    }
                ).catch(()=>{})
            }, 3000);
        }
        //return clearInterval(time)
    }, []); 


    return (
            <KeyboardAvoidingView style={{flex:1}}>
                <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()} >
                    <View style={{flex:1}}>
                        <ForumContent heightOfMessageBox={heightOfMessageBox} messages={mess} />
                        <ForumBottom setIsTyping={setIsTyping} isTyping={isTyping} 
                            setHeightOfMessageBox={setHeightOfMessageBox} thisConversation={conversation}
                            setIsSending={setIsSending} isSending={isSending} />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        
        
    )
}
