
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Dimensions, ScrollView } from "react-native";
import { TextInput } from "@react-native-material/core";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Get, SendMessage, Update } from "../../../api/service";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Svg, { Path } from 'react-native-svg';
import SimpleHeader from "../../../template/header/simpleHeader";
import { adaptSelect } from "../../../api/functions";
import DropDownPicker from "react-native-dropdown-picker";


export default function Montant(){

    const chart= useSelector((state)=> state.themeReducer.chart);
    const front= useSelector((state)=> state.themeReducer.front);
    const back= useSelector((state)=> state.themeReducer.back);
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);

    const [montant, setMontant]= useState("");

    const [classes, setClasses]= useState([]);
    const [classe, setClasse] = useState([]);

    const [item, setItem]= useState([])

    const nav=  useNavigation();

    const [open1, setOpen1]= useState(false);

    useEffect(()=>{
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader />
            }, 
            headerShown: true
        });
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

    function handleSend(){
        let mt= parseFloat(montant);
        if(isNaN(mt)){
            Toast.show({text1: "Erreur", text2: "Veuillez saisir un montant valide", type: "error", topOffset: 60})
        }else{
            if(item?.length > 0){
                item?.map((cl)=>{
                    const cls= {...cl, scolarite: mt}
                    Update("/classe/update", {classe: cls}, true, token).then(
                        (rs)=>{
                            if(rs?.error){
                                Toast.show({
                                    text1: "erreur", text2: "erreur d'affectation de montant'",
                                    topOffset: 50, type:"error"
                                });
                            }else{
                                Toast.show({
                                    text1: "message", text2: "classe mise à jour", topOffset: 50
                                });
                                setClasse([]); setMontant(null); setItem([])
                            }
                        }
                    ).catch(()=>{});
                })
            }else{
                Toast.show({
                    text1: "erreur", text2: "Veuillez choisir au moins une classe",
                    topOffset: 50, type:"error"
                })
            }
        }
    }


    const style = StyleSheet.create({
        container: {
            flex: 1
        },
        top: {},
        bottom: {
            position: 'absolute', width: Dimensions.get('screen').width, bottom: 0,
        },
        box: {
            backgroundColor: '#87CEEB', height: 80,
        },
        bottomWavy: {
            position: 'absolute', bottom: 20,
        },
        input:{ marginTop: 20, borderRadius: 30},
        title:{fontWeight: "bold", fontSize: 25, padding: 5},
        text:{fontSize: 15, padding: 5, fontStyle: "italic", color: front},
        part2:{borderTopLeftRadius: 50,},
        block:{marginLeft: 20, padding: 10, marginRight: 20, marginTop: 10 },
        btn: {shadowColor: "black", shadowOffset: {width: 0.5, height: 1}, shadowOpacity: 0.4, shadowRadius: 20}
    });

    const props={
        clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
        enablesReturnKeyAutomatically: true, variant:"outlined"
    }

    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
            <View style={style.container}>
                <View style={style.top}>
                    <View style={style.box}>
                        <Svg 
                            height={200} width={Dimensions.get('screen').width}
                            viewBox="0 0 1440 320" style={style.topWavy}>
                            <Path fill="#87CEEB"
                                d='M0,32L6.5,74.7C13,117,26,203,39,213.3C51.9,224,65,160,78,117.3C90.8,75,104,53,117,48C129.7,43,143,53,156,69.3C168.6,85,182,107,195,117.3C207.6,128,221,128,234,128C246.5,128,259,128,272,144C285.4,160,298,192,311,208C324.3,224,337,224,350,240C363.2,256,376,288,389,277.3C402.2,267,415,213,428,213.3C441.1,213,454,267,467,272C480,277,493,235,506,208C518.9,181,532,171,545,186.7C557.8,203,571,245,584,224C596.8,203,610,117,623,74.7C635.7,32,649,32,662,32C674.6,32,688,32,701,58.7C713.5,85,726,139,739,160C752.4,181,765,171,778,192C791.4,213,804,267,817,293.3C830.3,320,843,320,856,309.3C869.2,299,882,277,895,229.3C908.1,181,921,107,934,112C947,117,960,203,973,240C985.9,277,999,267,1012,266.7C1024.9,267,1038,277,1051,277.3C1063.8,277,1077,267,1090,245.3C1102.7,224,1116,192,1129,176C1141.6,160,1155,160,1168,160C1180.5,160,1194,160,1206,144C1219.5,128,1232,96,1245,74.7C1258.4,53,1271,43,1284,69.3C1297.3,96,1310,160,1323,186.7C1336.2,213,1349,203,1362,186.7C1375.1,171,1388,149,1401,144C1414.1,139,1427,149,1434,154.7L1440,160L1440,0L1433.5,0C1427,0,1414,0,1401,0C1388.1,0,1375,0,1362,0C1349.2,0,1336,0,1323,0C1310.3,0,1297,0,1284,0C1271.4,0,1258,0,1245,0C1232.4,0,1219,0,1206,0C1193.5,0,1181,0,1168,0C1154.6,0,1142,0,1129,0C1115.7,0,1103,0,1090,0C1076.8,0,1064,0,1051,0C1037.8,0,1025,0,1012,0C998.9,0,986,0,973,0C960,0,947,0,934,0C921.1,0,908,0,895,0C882.2,0,869,0,856,0C843.2,0,830,0,817,0C804.3,0,791,0,778,0C765.4,0,752,0,739,0C726.5,0,714,0,701,0C687.6,0,675,0,662,0C648.6,0,636,0,623,0C609.7,0,597,0,584,0C570.8,0,558,0,545,0C531.9,0,519,0,506,0C493,0,480,0,467,0C454.1,0,441,0,428,0C415.1,0,402,0,389,0C376.2,0,363,0,350,0C337.3,0,324,0,311,0C298.4,0,285,0,272,0C259.5,0,246,0,234,0C220.5,0,208,0,195,0C181.6,0,169,0,156,0C142.7,0,130,0,117,0C103.8,0,91,0,78,0C64.9,0,52,0,39,0C25.9,0,13,0,6,0L0,0Z'
                            />
                        </Svg>
                    </View>
                </View>

                <View style={style.part2}>

                    <View style={[style.block, {zIndex: 4}]}>
                        <Text style={style.text}>Choisir la classe ? </Text>
                        <DropDownPicker placeholder="Veuillez choisir" onSelectItem={setItem}
                            open={open1} value={classe} items={adaptSelect(classes)} searchable
                            setOpen={setOpen1} setValue={setClasse} maxHeight={250} multiple 
                            setItems={setClasses} mode="BADGE" //theme="DARK" 
                            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                        />
                    </View>

                    <View style={[style.block, {zIndex: 3}]}>
                        <Text style={style.text}>Le montant de la scolarité</Text>
                        <TextInput {...props} value={montant} onChangeText={setMontant} onSubmitEditing={handleSend} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{margin: 5}}>
                        {
                            item?.length !== 0 && item?.map(
                                (c, k)=>{
                                    return (
                                        <View style={[style.block, {zIndex: 3}]} key={k}>
                                            <Text style={style.text}>{c?.libelle +" a pour scolarité "+c?.scolarite}</Text>
                                        </View>
                                    );
                                }
                            )
                        }

                        <View style={[style.block, {zIndex: 1}]}>
                            <TouchableOpacity onPress={handleSend} style={[style.btn, {backgroundColor: chart, borderRadius: 30, margin: 40}]}>
                                <Text style={[style.title, {color: back, textAlign: "center"}]}>valider</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    

                            
                </View>

                <View style={style.bottom}>
                    <View style={style.box}>
                        <Svg
                            height={200} width={Dimensions.get('screen').width}
                            viewBox="0 0 1440 320" style={style.bottomWavy} >
                            <Path fill="#87CEEB"
                                d='M0,0L11.4,37.3C22.9,75,46,149,69,186.7C91.4,224,114,224,137,197.3C160,171,183,117,206,128C228.6,139,251,213,274,218.7C297.1,224,320,160,343,133.3C365.7,107,389,117,411,106.7C434.3,96,457,64,480,64C502.9,64,526,96,549,133.3C571.4,171,594,213,617,218.7C640,224,663,192,686,192C708.6,192,731,224,754,197.3C777.1,171,800,85,823,85.3C845.7,85,869,171,891,186.7C914.3,203,937,149,960,154.7C982.9,160,1006,224,1029,229.3C1051.4,235,1074,181,1097,144C1120,107,1143,85,1166,117.3C1188.6,149,1211,235,1234,261.3C1257.1,288,1280,256,1303,229.3C1325.7,203,1349,181,1371,181.3C1394.3,181,1417,203,1429,213.3L1440,224L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z'
                            />
                        </Svg>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )

}