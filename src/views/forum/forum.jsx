import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Image, Text, TouchableWithoutFeedback, Keyboard, Alert, Platform, FlatList } from "react-native";
import SimpleHeader from "../../template/header/simpleHeader";
import img from "../../../assets/avatar.png";
import { useSelector } from "react-redux";
import { TextInput } from "@react-native-material/core";
import { Get, Send } from "../../api/service";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import DropDownPicker from "react-native-dropdown-picker";
import { adaptSelect } from "../../api/functions";
import Svg, { Path } from 'react-native-svg';
import { useTranslation } from "react-i18next";


export default function Forum() {

    const ref= useRef();
    const [conv, setConv]= useState([]);
    const nav=  useNavigation();
    const front= useSelector((state)=>state.themeReducer.front);
    //const back= useSelector((state)=>state.themeReducer.back);
    const chart= useSelector((state)=>state.themeReducer.chart);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const loading= useSelector((state)=>state.userReducer.loading);
    const [filtre, setFilter] = useState('');

    const [open, setOpen]= useState(false);
    const [users, setUsers]= useState([]);
    const [selected, setSelected]= useState(null);
    const [item, setItem]= useState(null);
    const [isSending, setIsSending]= useState(false);

    const {t, _}=useTranslation();

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader show={false}  />
            }, 
            headerShown: true
        }) 
    }, []); 

    useMemo(() => {
        Get("/conversation/all/user/"+user?._id+"/"+user?.ecole?._id, token).then(   
            (rs)=>{
                if(!rs.error){
                    setConv(rs?.conversations)
                }
            }
        )
    }, [item, loading]);  

    useEffect(() => {
        const unsubscribe = nav.addListener('focus', () => {
            Get("/conversation/all/user/"+user?._id+"/"+user?.ecole?._id, token).then(   
                (rs)=>{
                    if(!rs.error){
                        setConv(rs?.conversations)
                    }
                }
            ).catch(()=>{})
        });
        return unsubscribe;
    }, [nav, loading]);

    useMemo(()=>{     
        if(user?.type==="Directeur"){
            Get("/user/all/ecole/"+user?.ecole?._id, token).then( 
                (rs)=>{
                    if(!rs?.error){
                        setUsers(rs?.users);
                    }
                }
            ).catch(()=>{})
        }else{
            Get("/user/all/"+user?.type+"/"+user?.ecole?._id, token).then(
                (rs)=>{
                    if(!rs?.error){
                        setUsers(rs?.users);
                    }
                }
            ).catch(()=>{})
        }
    }, [loading]);

    function createConv(us){
        setItem(us);
        const id1= us?._id;
        const id2= user?._id;
        const title= us?.nom +" "+ us?.prenom
        const conversation={users:[id1, id2], title: title, messages:[], ecole: user?.ecole?._id, read: []}
        const exist= conv?.find((c)=> c?.users.includes(id1)) !==undefined
        Alert.alert("confirmation", t('forum1')+ " ("+title+")", [
            {text: t("cancel"), style: "cancel"},
            {text: t("continue"), onPress: ()=>{
                if(exist){
                    Toast.show({
                        text1: t("file4"), text2: t("forum2"),
                        topOffset: 50, type:"error"
                    });
                }else{
                    setIsSending(true)
                    Send("/conversation/new", {conversation: conversation}, true, token).then(
                        (rs)=>{
                            if(!rs?.error){
                                setItem(null);
                                Toast.show({
                                    text1: "message", text2: t("forum3"),
                                    topOffset: 50, type:"success"
                                });
                            }else{
                                Toast.show({
                                    text1: t("file4"), text2: t("forum4"),
                                    topOffset: 50, type:"error"
                                });
                            }
                        }
                    ).catch(()=>{})
                    setIsSending(false)
                }
            }}
        ])
    }

    function LibelleFilter(){
        const props={
            clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
            enablesReturnKeyAutomatically: true, variant:"outlined"
        }
        return (
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around", zIndex: 10}}>
                <View style={{width: "40%", margin: 10, zIndex: 11}}>
                    <Text style={style.text}>{t('forum5')} ?</Text>
                    <TextInput placeholder={t('cours3')} {...props} onChangeText={setFilter} inputStyle={{color: front}}  
                        returnKeyLabel="filtre" onSubmitEditing={()=>Keyboard.dismiss()}
                    />
                </View>
                <View style={{width: "40%", margin: 10, zIndex: 12}}>
                    <Text style={style.text}>{t('forum6')} ?</Text>
                    <DropDownPicker placeholder={t('comptabilite2')} onSelectItem={createConv}
                        open={open} value={selected} items={adaptSelect(users?.filter((u)=> u?._id!==user?._id), 1)}
                        setOpen={setOpen} setValue={setSelected} searchable maxHeight={250}
                        setItems={setUsers} listMode="SCROLLVIEW" disabled={isSending}
                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                    /> 
                </View>
            </View>
        );
    }
     
    const style = StyleSheet.create({
        container:{
            flex: 1
        },
        square: {
            height: 120, width: 120,      
            borderRadius: 60, backgroundColor: chart,
            padding: 20, margin: 5, marginBottom: 30
            //position: Platform.OS==="ios" ? 'absolute' : "relative"
        }, 
        img:{
            height: 110, width: 110, borderRadius: 50, padding: 20, margin: 5
        },
        head:{
            alignItems: "center", zIndex: 9
        },
        txt:{
            color: chart, fontSize: 12, fontWeight: "bold", textAlign: "center"
        },
        text:{fontSize: 15, padding: 5, fontStyle: "italic", color: front},
        bottom: {
            position: 'absolute', width: Dimensions.get('screen').width, bottom: 0, zind: -1
        },
        box: {
            backgroundColor: '#87CEEB', height: 60,
        },
        bottomWavy: {
            position: 'absolute', bottom: 1,
        }
    });

    function DisplayBulle({item, index}){

        const utilisateur= item?.users?.find((us)=> us?._id!==user?._id)

        return (
            <TouchableOpacity style={[style.square, {}]} key={item?._id} onPress={()=>nav.navigate("forum/detail", {conversation: item})}>
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Image source={img} style={style.img} />
                </View>
                <View style={{ bottom: 15, backgroundColor: item?.read?.includes(user?._id) ? "white" : "tomato", left: 0, right: 0, borderRadius: 20, padding: 5}}>
                    <Text style={[style.txt, {padding: 3}]}>{(utilisateur?.nom+" "+utilisateur?.prenom).substring(0, 14)+'..'}</Text>
                </View>
            </TouchableOpacity>
        );
    }


    return (
        <View style={style.container} ref={ref}>
            
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()} > 
                <View style={{flex: 1}}>
                    <View style={style.head}>
                        {LibelleFilter()}
                    </View>
                    {/* <ScrollView>
                        {
                            conv?.filter((c)=> c?.title?.toLowerCase()?.includes(filtre?.toLowerCase())).map((el, index)=>{
                                return (<View key={index}>
                                    <DisplayBulle item={el} index={index} key={index} />
                                </View>);
                            })
                        }
                    </ScrollView> */}
                    <FlatList numColumns={3} data={conv?.filter((c)=> c?.title?.toLowerCase()?.includes(filtre?.toLowerCase()))} 
                        renderItem={({item, index})=>{
                            return (<View key={index}>
                                <DisplayBulle item={item} index={index} key={index} />
                            </View>);
                        }} 
                        keyExtractor={({index})=>{index}} style={{zIndex: 2}} showsVerticalScrollIndicator={false}
                    />
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
        </View>
    );
}