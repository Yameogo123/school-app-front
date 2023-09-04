import { FlashList } from "@shopify/flash-list";
import AnimatedLottieView from "lottie-react-native";
import React from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { TouchableOpacity} from 'react-native-gesture-handler'
import { useNavigation } from "@react-navigation/native";
import { useFonts } from 'expo-font';

export default function Page2(){

    const {height, width} = Dimensions.get("screen");
    const nav=  useNavigation();
    const [loaded] = useFonts({
        Pacifico: require('../../../assets/fonts/Pacifico.ttf'),
    }); 


    const datas=[
        {id: 1, lien: require("../../../assets/school3.json"), text: "Bienvenu à School votre espace école en ligne "},
        {id: 2, lien: require("../../../assets/school2.json"), text: "Soyez en contact permanent avec votre administration et vos professeurs"},
        {id: 3, lien: require("../../../assets/school4.json"), text: "Veuillez vous connecter pour accéder à votre espace!"},
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
        lottie:{width: 100, height: height/2 -100 },
        top: {backgroundColor: "green", padding: 10, borderRadius: 30},
        text: {padding: 15, fontSize: 25, maxWidth:  width-50, textAlign: "center", fontFamily: 'Pacifico'}
    });

    const FlatRender=({item})=>{

        return (
            <View style={style.flatlist} key={item?.id}>
                
                <Text style={style.text}>{item?.text}</Text>
                {
                    item?.id!==3 ?
                    <AnimatedLottieView source={{uri:'https://assets7.lottiefiles.com/packages/lf20_fyye8szy.json'}} style={{height: 100, width: 100}} autoPlay loop  />
                    : <TouchableOpacity style={style.top} onPress={()=> nav.navigate("login")}>
                        <Text style={{color: "white", fontWeight: "bold"}}>connexion</Text>
                    </TouchableOpacity>
                }
                <AnimatedLottieView source={item?.lien} style={style.lottie} autoPlay loop />
            </View>
        )
    }


    return (
        <View style={style.content}>
            <FlashList 
                scrollEnabled horizontal keyExtractor={(item, index)=> index+item?.id} pagingEnabled
                data={datas} renderItem={(item)=>{return <FlatRender item={item.item} />}} estimatedItemSize={3}
            />
            
        </View>
    );


}