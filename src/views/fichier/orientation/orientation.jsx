import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { API, Get } from "../../../api/service";
import DropDownPicker from "react-native-dropdown-picker";
import { adaptSelect } from "../../../api/functions";
import Svg, { Path } from 'react-native-svg';
import { CardEcomTwo } from "react-native-card-ui";
import moment from 'moment';
import FichierHeader from '../../../template/header/fichierHeader';
import { useTranslation } from "react-i18next";


export default function Orientation(){

    const nav=  useNavigation();
    const front= useSelector((state)=>state.themeReducer.front);
    const chart= useSelector((state)=>state.themeReducer.chart);

    const user = useSelector((state)=>state.userReducer.user);
    const token= useSelector((state)=> state.userReducer.token);
    const loading= useSelector((state)=>state.userReducer.loading);

    const [classe, setClasse]= useState("");
    const [classes, setClasses]= useState([]);
    const [orientations, setOrientations]= useState([]);
    const [open1, setOpen1]= useState(false);
    const {t, _}=useTranslation();

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <FichierHeader sel="orientation"  />
            }, 
            headerShown: true
        }) 
        //console.log(classe);
    }, [classe]); 

    useMemo(()=>{
        Get("/classe/all/school/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setClasses(rs?.classes)
                }
            }
        ).catch(()=>{})
    }, [loading]);

    useMemo(()=>{
        Get("/orientation/all", token).then(
            (rs)=>{
                if(!rs?.error){
                    setOrientations(rs?.orientations)
                }
            }
        ).catch(()=>{})
    }, [loading]);


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
        block:{marginLeft: 20, padding: 10, marginRight: 20, marginTop: 1, alignItems: "center"},
        btn: {shadowColor: "black", shadowOffset: {width: 0.5, height: 1}, shadowOpacity: 0.4, shadowRadius: 20, padding: 5}
    });
  

    return(
        <View style={style.container}>

            <View style={style.top}>
                <View style={style.box}>
                    <Svg height={200} width={Dimensions.get('screen').width}
                        viewBox="0 0 1440 320" style={style.topWavy}>
                        <Path fill="#87CEEB"
                            d='M0,96L18.5,106.7C36.9,117,74,139,111,154.7C147.7,171,185,181,222,192C258.5,203,295,213,332,224C369.2,235,406,245,443,256C480,267,517,277,554,277.3C590.8,277,628,267,665,234.7C701.5,203,738,149,775,133.3C812.3,117,849,139,886,144C923.1,149,960,139,997,122.7C1033.8,107,1071,85,1108,64C1144.6,43,1182,21,1218,16C1255.4,11,1292,21,1329,26.7C1366.2,32,1403,32,1422,32L1440,32L1440,0L1421.5,0C1403.1,0,1366,0,1329,0C1292.3,0,1255,0,1218,0C1181.5,0,1145,0,1108,0C1070.8,0,1034,0,997,0C960,0,923,0,886,0C849.2,0,812,0,775,0C738.5,0,702,0,665,0C627.7,0,591,0,554,0C516.9,0,480,0,443,0C406.2,0,369,0,332,0C295.4,0,258,0,222,0C184.6,0,148,0,111,0C73.8,0,37,0,18,0L0,0Z'
                        />
                    </Svg>
                </View>
            </View>

            <View style={style.part2}>

                <View style={[style.block, {zIndex: 5}]}>
                    <Text style={style.text}>{t('orientation1')}</Text>
                    <DropDownPicker placeholder={t('orientation2')} //onSelectItem={(item)=> console.log(item)}
                        open={open1} value={classe} items={adaptSelect([ {_id:"", libelle:""}, ...classes])}
                        setOpen={setOpen1} setValue={setClasse} maxHeight={150} setItems={setClasses} listMode="SCROLLVIEW"
                        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                    />
                </View>

                <View style={{zIndex: 4, marginBottom: 100}}>
                    <FlatList data={orientations.filter((o)=> o?.classe?._id?.includes(classe))} keyExtractor={({_})=> Math.floor(Math.random() * 100)} 
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, index})=>{
                            return (
                                <TouchableOpacity key={Math.floor(Math.random() * 100)} onPress={() => nav.navigate("orientation/detail", {orientation: item})}>
                                    <CardEcomTwo 
                                        //onClicked={() => nav.navigate("orientation/detail", {orientation: item})}
                                        image={{ uri: API+"/document/show/"+item?.cover?.libelle }}
                                        price={moment(item?.date).format("YYYY-MM-DD")}
                                        subTitle={item?.classe?.libelle} title={item?.titre}
                                        //buttonText={"Consulter"}
                                    />
                                </TouchableOpacity> 
                            )
                        }}
                    />
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
    )
  }