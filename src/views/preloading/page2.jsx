import { FlashList } from "@shopify/flash-list";
import AnimatedLottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import { TouchableOpacity} from 'react-native-gesture-handler'
import { useNavigation } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { useTranslation } from "react-i18next";
import RNModal from "react-native-modal";
import { getStringValue, storeString } from "../../redux/storage";
import { useDispatch, useSelector } from "react-redux";

export default function Page2(){

    const {height, width} = Dimensions.get("screen");
    const chart= useSelector((state)=>state.themeReducer.chart)
    const back= useSelector((state)=>state.themeReducer.back)
    const nav=  useNavigation();
    const {t, _}=useTranslation()
    const [loaded] = useFonts({
        Pacifico: require('../../../assets/fonts/Pacifico.ttf'),
    }); 
    const dispatch= useDispatch()
    const [show, setShow] = useState(true)
    const hideDialog = (rep) => {setShow(false); handleLanguage(rep)};


    const datas=[
        {id: 1, lien: require("../../../assets/school3.json"), text: t("welcome1")},
        {id: 2, lien: require("../../../assets/school2.json"), text: t("welcome2")},
        {id: 3, lien: require("../../../assets/school4.json"), text: t("welcome3")},
    ]

    const style= StyleSheet.create({
        flatlist:{
            height: height, width: width,
            justifyContent: "center",
            alignItems: "center",
        },
        content:{
            flex: 1,
            backgroundColor: "white"
        },
        lottie:{width: width-100, height: height/2 -100 },
        top: {backgroundColor: "green", padding: 10, borderRadius: 30},
        text: {padding: 15, fontSize: 25, maxWidth:  width-50, textAlign: "center", fontFamily: 'Pacifico'}
    });

    function handleLanguage(lg){
        const action={
          type: "langue",
          value: lg
        }
        if(lg!=null){
             storeString("langue", lg).then(
                ()=>{
                    dispatch(action)
                }
            ).catch(()=>{})
        }
    }

    const FlatRender=({item})=>{

        return (
            <View style={style.flatlist} key={item?.id}>
                
                <Text style={style.text}>{item?.text}</Text>
                {
                    item?.id!==3 ?
                    <AnimatedLottieView source={{uri:'https://assets7.lottiefiles.com/packages/lf20_fyye8szy.json'}} style={{height: 100, width: 100}} autoPlay loop  />
                    : <TouchableOpacity style={style.top} onPress={()=> nav.navigate("login")}>
                        <Text style={{color: "white", fontWeight: "bold"}}>{t("login")}</Text>
                    </TouchableOpacity>
                }
                <AnimatedLottieView source={item?.lien} style={style.lottie} autoPlay loop />
            </View>
        )
    }

    const pop= ()=>{
        return (
            <RNModal
                isVisible={show} animationInTiming={500} animationOutTiming={500}
                backdropTransitionInTiming={500} backdropTransitionOutTiming={500}
            >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={{ justifyContent: 'center', backgroundColor: back, borderRadius: 20, padding: 20, height: 200}}>                        
                        <View>
                            <Text style={[style.text, {color: chart}]}>{t("language")}</Text>
                        </View>
                        <View style={{display: "flex", flexDirection:"row", justifyContent: "space-around", marginTop: 25}}>
                            <TouchableOpacity onPress={()=>hideDialog("fr")} >
                                <Text style={[style.text, {color: "blue"}]}>{t("french")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>hideDialog("en")}>
                                <Text style={[style.text, {color: "green"}]}>{t("english")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </RNModal>
        )
    }

    useEffect(()=>{
        getStringValue("langue").then(
            (val)=>{
                if(val===""){
                    setShow(true)
                }else{
                    handleLanguage(val)
                }
            }
        )
    }, [])


    return (
        <View style={style.content}>
            
            <FlashList 
                scrollEnabled horizontal keyExtractor={(item, index)=> index+item?.id} pagingEnabled
                data={datas} renderItem={(item)=>{return <FlatRender item={item.item} />}} estimatedItemSize={3}
            />
            {pop()}
        </View>
    );


}