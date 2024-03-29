import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity, Keyboard, FlatList } from "react-native";
import FichierHeader from "../../../template/header/fichierHeader";
import { useSelector } from "react-redux";
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput } from "@react-native-material/core";
import { Get } from "../../../api/service";

export default function Cours() {
    
    const front= useSelector((state)=>state.themeReducer.front);
    const back= useSelector((state)=>state.themeReducer.back);
    const chart= useSelector((state)=>state.themeReducer.chart);
    const nav=  useNavigation();
    const [matieres, setMatieres]= useState([]);

    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const loading= useSelector((state)=>state.userReducer.loading);

    const [filtre, setFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {id: 1, label: 'ordre croissant', value: 'ascendant'},
        {id: 2, label: 'ordre décroissant', value: 'descendant'},
    ]);

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <FichierHeader sel="cours"  />
            }, 
            headerShown: true
        })
    }, [])

    const style = StyleSheet.create({
        container:{
            //flex: 1
        },
        info:{color: front, fontSize: 15, opacity: 0.8, margin: 10, textAlign: "center"},
        head:{display: "flex", flexDirection: "row", justifyContent:"space-around", alignItems: "center"},
        btn:{padding: 10, backgroundColor: chart, color: "white"},
        card:{
            backgroundColor: back, borderColor: front, borderWidth: 0.2, margin: 7, borderRadius: 30, 
            padding: 5, display: "flex", flexDirection: "row", alignItems: "center"
        },
        flat:{padding: 5, alignItems: "stretch"},
        input:{backgroundColor: "transparent", borderRadius: 30},
    })

    function order(){
        let m= matieres
        if(value==="ascendant"){
            m = matieres.sort((a, b) => (a.libelle.toLowerCase() > b.libelle.toLowerCase()) ? 1 : -1)
        }else if(value==="descendant"){
            m = matieres.sort((a, b) => (a.libelle.toLowerCase() > b.libelle.toLowerCase()) ? -1 : 1)
        }
        setMatieres(m)
    }

    useMemo(() => {
        order()
    }, [value]);

    useMemo(()=>{
        setMatieres([])
        Get("/cours/all/ecole/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setMatieres(rs?.cours);
                }
            }
        ).catch(()=>{})
    }, [loading]);

    function LibelleFilter(){
        const props={
            clearButtonMode:"while-editing", selectionColor:front, cursorColor:front, color:front, inputContainerStyle:style.input,
            enablesReturnKeyAutomatically: true, variant:"outlined"
        }
        return (
            <View style={{width: "45%"}}>
                <TextInput placeholder="filtrer par nom" {...props} onChangeText={setFilter} inputStyle={{color: front}}  
                    returnKeyLabel="filtrer" onSubmitEditing={()=>Keyboard.dismiss()}
                />
            </View>
        );
    }

    function DropDown(){
        return (
            <View style={{width: "45%"}}>
                <DropDownPicker 
                    placeholder="trier par"
                    open={open} value={value} items={items}
                    setOpen={setOpen} setValue={setValue} setItems={setItems}
                />
            </View>
        )
    }

    function Card({item}){
        return (<TouchableOpacity key={Math.floor(Math.random() * 100)} style={[style.card,{justifyContent: "space-between"}]} onPress={()=>nav.navigate("cours/liste", {cours: item?._id})}>
            <View style={[style.card, {borderWidth:0}]}>
                <Ionicons name="folder" size={30} color={"skyblue"} />
                <Text style={style.info}>{item.libelle}</Text>
            </View>
            <Ionicons name="md-arrow-forward" size={30} color={front} />
        </TouchableOpacity>);
    }

    return (
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <View style={style.container}>
                <View style={style.head}>
                    {LibelleFilter()}
                    <DropDown />
                </View>
                <View style={{ zIndex : -1, marginBottom: 120 }}>
                    <FlatList key={"flat"} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} scrollEnabled={matieres.length >=7} 
                        contentContainerStyle={style.flat} data={matieres?.filter((mat)=>mat?.libelle?.toLowerCase().includes(filtre?.toLowerCase()))} 
                        //keyExtractor={({index, item})=> index}
                        renderItem={({index, item})=> {
                            return (
                                <Card item={item} />
                            );
                        }}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}