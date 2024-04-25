import { View, TextInput, Pressable, ImageBackground, Dimensions} from "react-native";
import React, { useState, useRef, useContext, useEffect } from "react";
// import { Transition, Transitioning, TransitioningView } from "react-native-reanimated";
// import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import styles from "./detail.style";

import whatsappBackgroundImg from "../../../assets/splash.png";
import useKeyboardOffsetHeight from "../../template/component/useKeyboardOffsetHeight";
import { Send, Update } from "../../api/service";
import { Toast } from "react-native-toast-message/lib/src/Toast";




export default function ForumBottom({ setIsTyping, isTyping, setHeightOfMessageBox, thisConversation, isSending, setIsSending }) {

    const [newMsg, setNewMsg] = useState("");
    //const ref = useRef(null);
    const keyBoardOffsetHeight = useKeyboardOffsetHeight();
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    //const { sendMessage } = useContext(ConversationsContext);
  
    const windowHeight = Dimensions.get("window").height;

    function sendMessage(){
        if(newMsg!==""){
            setIsSending(true);
            const message={userID: user?._id, text: newMsg};
            Send("/message/new", {message: message}, true, token).then(
                (rs)=>{
                    if(!rs?.error){
                        const conversation= {...thisConversation, messages: [...thisConversation?.messages, rs?.message], read: [ user?._id]}
                        Update("/conversation/update", {conversation: conversation}, true, token).then(
                            (rp)=>{
                                if(!rp?.error){
                                    setNewMsg(""); setIsTyping(false); setIsSending(false);
                                }else{
                                    Toast.show({
                                        text1: "error", text2: "conversation non mise à jour!", topOffset: 50, type:"error"
                                    });
                                }
                            }
                        ).catch(()=>{})
                    }else{
                        Toast.show({
                            text1: "erreur", text2: "erreur de sauvegarde de message", topOffset: 50, type:"error"
                        });
                    }
                }
            )
        }
    }
    
  
    return (
        <View
            style={{
                ...styles.sendBtnContainer,
                bottom: Math.max(keyBoardOffsetHeight, windowHeight * 0.02),
            }}
        >
            <ImageBackground
                style={{ flex: 1, flexDirection: "row", width: "100%" }}
                source={whatsappBackgroundImg} resizeMode="cover"
            >
                <View style={styles.textBoxContainer}>
                    {/* <Entypo
                        name="emoji-happy" size={24} color={"grey"}
                        style={{ position: "absolute", bottom: 10, left: 10 }}
                    /> */}
                    <TextInput
                        editable multiline style={styles.textInput} clearButtonMode="while-editing"
                        value={newMsg} placeholder="Message"
                        onContentSizeChange={(e) => {
                            //setHeightOfMessageBox(e?.nativeEvent.contentSize.height);
                        }}
                        onChangeText={(_msg) => {
                            if (_msg !== "" && isTyping === false) {
                                setIsTyping(true);
                                //ref.current?.animateNextTransition();
                            } else if (isTyping === true && _msg === "") {
                                setIsTyping(false);
                                //ref.current?.animateNextTransition();
                            }
                            setNewMsg(_msg);
                        }} 
                    />
                    {/* <Entypo name="camera" size={24} color={"grey"}
                        style={{position: "absolute", bottom: 10, right: 10}}
                    /> */}
                </View>
                <View
                    style={{...styles.voiceButtonContainer, position: "absolute", right: 0, bottom: 6}}
                >
                    <Pressable style={styles.voiceButton}
                        onPress={sendMessage} disabled={isSending}
                    >
                       <Ionicons name="send" size={16} color={"white"} />
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    );
}
  
// const msgTypeTransition = (
//     <Transition.Together>
//       <Transition.Out type="scale" durationMs={100} />
//       <Transition.Change interpolation="easeInOut" />
//       <Transition.In type="scale" durationMs={100} />
//     </Transition.Together>
// );




