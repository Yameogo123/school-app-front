import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, Button, TouchableWithoutFeedback, Keyboard, FlatList } from "react-native";
import FichierHeader from "../../../template/header/fichierHeader";
import {Picker} from '@react-native-picker/picker';
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import DropDownPicker from 'react-native-dropdown-picker';

export default function Notes() {
    
    const front= useSelector((state)=>state.themeReducer.front)
    const back= useSelector((state)=>state.themeReducer.back)
    const chart= useSelector((state)=>state.themeReducer.chart)
    const [isVisible, setVisible] = useState(false);
    const nav=  useNavigation()
    const [matieres, setMatieres]= useState([
        {id: 1, label: "mathématiques", value: "mathématiques"},{id: 2, label: "P-C", value: "P-C"}, 
        {id: 3, label: "latin", value: "latin"}
    ])
    const [selectedMatiere, setSelectedMatiere] = useState();
    const pickerRef = useRef();
    /*function open() {
        pickerRef.current.focus();
    }
    function close() {
        pickerRef.current.blur();
    }*/
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'ascendant', value: 'ascendant'},
        {label: 'descendant', value: 'descendant'}
    ]);

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <FichierHeader sel="notes"  />
            }, 
            headerShown: true
        })
    }, [])

    const style = StyleSheet.create({
        container:{
            //flex: 1
        },
        info:{color: back, fontSize: 15, opacity: 0.8, margin: 10, textAlign: "center"},
        head:{display: "flex", flexDirection: "row", justifyContent:"space-around"},
        btn:{padding: 10, backgroundColor: chart, color: "white"},
        card:{backgroundColor: back, borderColor: front, borderWidth: 0.2, margin: 5, borderRadius: 30, padding: 10},
        flat:{padding: 5, alignItems: "stretch"},
    })

    function DropDownMat(){
        return (
            <View style={{width: "45%"}}>
                <DropDownPicker searchable
                    placeholder="filtre par matière"
                    open={isVisible}
                    value={selectedMatiere}
                    items={matieres}
                    setOpen={setVisible}
                    setValue={setSelectedMatiere}
                    setItems={setMatieres}
                />
            </View>
        );
    }

    function DropDownDate(){
        return (
            <View style={{width: "45%"}}>
                <DropDownPicker dropDownContainerStyle={{elevation: 999}}
                    placeholder="filtre par date"
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                />
            </View>
        )
    }

    function Card({item}){
        return (<View style={style.card}>
            <Text style={[style.info, {fontSize: 10, color: front}]}>devoir 20 mai</Text>
            <Text style={[style.info,{fontSize: 30, color: front}]}>15/20</Text>
            <Button title="correction" color={"green"} onPress={()=>nav.navigate("pdf", {document: item?.file})} />
        </View>);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
            <View style={style.container}>
                <View style={style.head}>
                    <DropDownDate />
                    <DropDownMat />
                </View>
                <View style={{ zIndex : -1, marginBottom: 120 }}>
                    <FlatList showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} scrollEnabled 
                        contentContainerStyle={style.flat} numColumns={3} data={[0,0,0,0,0,0,0,0,0,0]} 
                        keyExtractor={({item, index})=> index}
                        renderItem={({item, index})=> {
                            return <Card item={item} key={index} />
                        }}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}