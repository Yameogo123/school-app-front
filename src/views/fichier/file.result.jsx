import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"
import AnimatedLottieView from "lottie-react-native";
import { useSelector } from "react-redux";
import SimpleHeader from "../../template/header/simpleHeader";
import { ScrollView } from "react-native";
import { API } from "../../api/service";


export default function FileResult() {
    
    const nav=  useNavigation()
    const front= useSelector((state)=>state.themeReducer.front)
    const chart= useSelector((state)=>state.themeReducer.chart)
    const route= useRoute()
    const files= route.params?.files

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader   />
            }, 
            headerShown: true
        })
    }, [])

    const style = StyleSheet.create({
        container:{
            flex: 1, marginBottom: 50
        },
        lottie:{
            width: 200, height: 200
        },
        info:{color: front, fontSize: 20, opacity: 0.4, margin: 10},
        //scroll:{padding: 10},
        line:{
            display: "flex", flexDirection: "row", alignItems: "center", margin: 10, 
            marginLeft: 35, borderBottomWidth: 1
        }
    })

    function handleOpen(item){
        const libelle= item?.libelle;
        const isPdf= libelle?.includes(".pdf");
        if(!isPdf){
            Linking.openURL(API+"/document/show/"+item?.libelle).then(
                (rs)=>{
                    //console.log(rs);
                }
            ).catch(()=> {})
        }else{
            nav.navigate("pdf", {document: API+"/document/show/"+libelle})
        }
    }

    return (
        <View style={style.container}>
            <View style={{alignItems: "center"}}>
                <AnimatedLottieView speed={2} autoPlay autoSize loop 
                    source={{uri: "https://lottie.host/9234b0ab-cea4-46e3-833d-81062ea9c848/z67p60r5rJ.json"}}
                    style={style.lottie}
                />
            </View>

            <ScrollView contentContainerStyle={style.scroll} showsHorizontalScrollIndicator={false}>
                {
                    files.map(
                        (item, id)=>{
                            return (
                                <TouchableOpacity style={style.line} key={id} onPress={()=>handleOpen(item)}>
                                    <Ionicons name="file-tray-full" size={35} color={front} />
                                    <Text style={style.info}>
                                        {item?.label?.slice(0, 200)}
                                    </Text>
                                </TouchableOpacity> 
                            );
                        }
                    )
                }
            </ScrollView>
        </View>
    );
}