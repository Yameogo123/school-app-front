import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Dimensions, TouchableOpacity, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import AdminHeader from '../../../template/header/adminHeader';
import { useSelector } from 'react-redux';
import { Get, Send, Update } from "../../../api/service";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import DropDownPicker from "react-native-dropdown-picker";
import { adaptSelect } from "../../../api/functions";
import Svg, { Path } from 'react-native-svg';
import { launchImageLibrary } from "react-native-image-picker";
import { TextInput } from "@react-native-material/core";
import Ionicons from "react-native-vector-icons/Ionicons";



export default function Orientation(){

    const nav=  useNavigation();
    const front= useSelector((state)=>state.themeReducer.front);
    const back= useSelector((state)=>state.themeReducer.back);
    const chart= useSelector((state)=>state.themeReducer.chart);

    const user = useSelector((state)=>state.userReducer.user);
    const token= useSelector((state)=> state.userReducer.token);

    const [titre, setTitre] = useState("");
    const [contenu, setContenu]= useState("");
    const [video, setVideo]= useState("");
    const [cover, setCover]= useState("");

    const [classe, setClasse]= useState("");
    const [classes, setClasses]= useState([]);

    const [open, setOpen]= useState(false);
    const [isSending, setIsSending]= useState(false);
    

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <AdminHeader  />
            }, 
            headerShown: true
        }) 
    }, []); 

    useMemo(()=>{
        Get("/classe/all/school/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setClasses(rs?.classes)
                }
            }
        ).catch(()=>{})
    }, []);

    const pickVideo = async () => {
        // No permissions request is necessary for launching the image library
        launchImageLibrary({
                mediaType: 'video', quality: 1,
            }, (rep)=>{
                if(!rep?.didCancel){
                    setVideo(rep.assets[0])
                }
            }
        ); 
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        launchImageLibrary({
                mediaType: 'photo', quality: 1,
            }, (rep)=>{
                if(!rep?.didCancel){
                    setCover(rep.assets[0])
                }
            }
        ); 
    }

    function upd(data){
        Update("/orientation/update", data, true, token).then(
            (rp)=>{
                if(rp?.error){
                    Toast.show({
                        text1: "erreur", text2: "la mise à jour de l'orientation a échoué", topOffset: 50, type:"error"
                    })
                }else{
                    Toast.show({
                        text1: "message", text2: "document joint avec succès", topOffset: 50
                    })
                }
            }
        ).catch(()=>{

        })
    }

    function handleValider(){
        if(titre !=="" && contenu!=="" && classe!==""){
            let orientation= {
                titre: titre, contenu: contenu, classe: classe, ecole: user?.ecole?._id
            }
            setIsSending(true);

            Send("/orientation/new", {"orientation": orientation}, true, token).then(
                (rs)=>{
                    if(rs?.error){
                        Toast.show({
                            text1: "erreur", text2: "la création de l'orientation a échoué",
                            topOffset: 50, type:"error"
                        })
                    }else{

                        if(video){
                            let file={
                                name: video?.fileName,
                                type: video?.type,
                                uri: Platform.OS === 'ios' ? video.uri.replace('file://', '') : video.uri,
                            }
                            let doc1= {
                                type: "orientation", label: "video "+titre
                            }
                            const form0= new FormData()
                            form0.append("document", JSON.stringify(doc1))
                            form0.append("file", file)
                            Send("/document/new", form0, false, token).then(
                                (r)=>{
                                    if(!r?.error){
                                        const orient= {...rs?.orientation, video: r?.document?._id}
                                        upd({"orientation": orient})
                                    }
                                }
                            ).catch(()=>{});
                        }
            
                        if(cover){
                            let file={
                                name: cover?.fileName,
                                type: cover?.type,
                                uri: Platform.OS === 'ios' ? cover.uri.replace('file://', '') : cover.uri,
                            }
                            let doc2= {
                                type: "orientation", label: "cover "+titre
                            }
                            const form= new FormData();
                            form.append("document", JSON.stringify(doc2));
                            form.append("file", file);

                            Send("/document/new", form, false, token).then(
                                (r)=>{
                                    if(!r?.error){
                                        const orient2= {...rs?.orientation, cover: r?.document?._id}
                                        upd({"orientation": orient2})
                                    }
                                }
                            ).catch((err)=>{console.log("err: "+err);})
                        }

                        setTitre(""); setContenu(""); setClasse(""); setVideo(""); setCover("")

                        Toast.show({
                            text1: "message", text2: "orientation créée avec succès",
                            topOffset: 50
                        })
                        
                    }
                    setIsSending(false);
                }
            )

        }else{
            Toast.show({text1: "Formulaire", text2: "Veuillez remplir tous les champs", type: "error", topOffset: 60})
        }
    }

    const style = StyleSheet.create({
        container:{ flex: 1 },
        img:{ height: 110, width: 110, borderRadius: 50, padding: 20, margin: 5 },
        head:{ alignItems: "center", zIndex: 9 },
        txt:{ color: chart, fontSize: 15, fontWeight: "bold", textAlign: "center" },
        text:{ fontSize: 15, padding: 5, fontStyle: "italic", color: front},
        bottom: { position: 'absolute', width: Dimensions.get('screen').width, bottom: 0, zIndex: -1 },
        box: { backgroundColor: '#87CEEB', height: 60},
        bottomWavy: { position: 'absolute', bottom: 1},
        part2:{borderTopLeftRadius: 50, flex:1},
        title:{fontWeight: "bold", fontSize: 25, padding: 5},
        block:{marginLeft: 20, padding: 10, marginRight: 20, marginTop: 1},
        btn: {shadowColor: "black", shadowOffset: {width: 0.5, height: 1}, shadowOpacity: 0.4, shadowRadius: 20, padding: 5}
    });

    let behave= Platform.OS==="ios" ? {
        behavior:"padding"
    }: {}

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }
  
    return(
        <KeyboardAvoidingView {...behave} style={{flex: 1}}>
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={style.container}>

                    <View style={style.top}>
                        <View style={style.box}>
                            <Svg 
                                height={200} width={Dimensions.get('screen').width}
                                viewBox="0 0 1440 320" style={style.topWavy}>
                                <Path fill="#87CEEB"
                                    d='M0,96L18.5,106.7C36.9,117,74,139,111,154.7C147.7,171,185,181,222,192C258.5,203,295,213,332,224C369.2,235,406,245,443,256C480,267,517,277,554,277.3C590.8,277,628,267,665,234.7C701.5,203,738,149,775,133.3C812.3,117,849,139,886,144C923.1,149,960,139,997,122.7C1033.8,107,1071,85,1108,64C1144.6,43,1182,21,1218,16C1255.4,11,1292,21,1329,26.7C1366.2,32,1403,32,1422,32L1440,32L1440,0L1421.5,0C1403.1,0,1366,0,1329,0C1292.3,0,1255,0,1218,0C1181.5,0,1145,0,1108,0C1070.8,0,1034,0,997,0C960,0,923,0,886,0C849.2,0,812,0,775,0C738.5,0,702,0,665,0C627.7,0,591,0,554,0C516.9,0,480,0,443,0C406.2,0,369,0,332,0C295.4,0,258,0,222,0C184.6,0,148,0,111,0C73.8,0,37,0,18,0L0,0Z'
                                />
                            </Svg>
                        </View>
                    </View>

                    <View style={style.part2}>

                        <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 5}}>
                            <View style={[style.block, {zIndex: 5, width: "45%"}]}>
                                <Text style={style.text}>La classe concernée ? </Text>
                                <DropDownPicker placeholder="Veuillez choisir" //onSelectItem={(item)=> console.log(item)}
                                    open={open} value={classe} items={adaptSelect(classes)}
                                    setOpen={setOpen} setValue={setClasse} searchable maxHeight={150}
                                    setItems={setClasses} listMode="SCROLLVIEW" 
                                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                />
                            </View>

                            <View style={[style.block, {zIndex: 5, width: "40%"}]}>
                                <Text style={style.text}>Titre de l'orientation</Text>
                                <TextInput {...props} textContentType="name" onChangeText={setTitre} value={titre} />
                            </View>
                        </View>

                        <View style={[style.block, {zIndex: 4}]}>
                            <Text style={style.text}>Explications</Text>
                            <TextInput {...props} textContentType="name" onChangeText={setContenu} value={contenu} multiline />
                        </View>

                        <View style={{flexDirection: "row", justifyContent: "space-around", zIndex: 3}}>
                            <View style={[style.block, {zIndex: 3, width: "45%"}]}>
                                <Text style={style.text}>une vidéo ?</Text>
                                {video==="" ? <TouchableOpacity onPress={pickVideo} style={{backgroundColor: back, borderRadius: 10, padding: 10}}>
                                    <View style={{flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
                                        <Ionicons name="add-circle" color={chart} size={40} />
                                        <Text style={[style.text, {color: front}]}>cliquer pour choisir le document</Text>
                                    </View>
                                </TouchableOpacity> : 
                                <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
                                    <Text style={[style.text, {color: front}]}>document pris en compte</Text>
                                    <Ionicons name="trash" color={"tomato"} size={30} onPress={()=>setVideo("")} />
                                </View>}
                            </View>

                            <View style={[style.block, {zIndex: 3, width: "45%"}]}>
                                <Text style={style.text}>une couverture ?</Text>
                                {cover==="" ? <TouchableOpacity onPress={pickImage} style={{backgroundColor: back, borderRadius: 10, padding: 10}}>
                                    <View style={{flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
                                        <Ionicons name="add-circle" color={chart} size={40} />
                                        <Text style={[style.text, {color: front}]}>cliquer pour choisir le document</Text>
                                    </View>
                                </TouchableOpacity> : 
                                <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
                                    <Text style={[style.text, {color: front}]}>document pris en compte</Text>
                                    <Ionicons name="trash" color={"tomato"} size={30} onPress={()=>setCover("")} />
                                </View>}
                            </View>
                        </View>

                        <View style={[style.block, {zIndex: 1, marginTop: 30}]}>
                            <TouchableOpacity disabled={isSending} onPress={handleValider} style={[style.btn, {backgroundColor: chart, borderRadius: 30, margin: 40}]}>
                                <Text style={[style.title, {color: back, textAlign: "center"}]}>valider</Text>
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
        </KeyboardAvoidingView>
    )
  }