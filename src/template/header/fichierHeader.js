import React, { useState, useEffect, useMemo } from "react";
import { FlatList, StyleSheet, View, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { storeString } from "../../redux/storage";
import { useNavigation } from '@react-navigation/native';
import { Chip } from "react-native-paper";


export default function FichierHeader({sel= ""}){

    const dispatch = useDispatch()
    const user= useSelector((state)=>state.userReducer.user)
    const chart= useSelector((state)=>state.themeReducer.chart)
    const nav=  useNavigation()

    const [files, setFiles]= useState(["notes", "cours", "tableau", "rappels"])
    const [selected, setSelected]= useState(sel)

    useMemo(()=>{
        if(selected!==""){
            setFiles([sel, ...files.filter((x)=> x!==selected)])
        }
    }, [sel])

    useEffect(()=>{

    }, [])

    const style=StyleSheet.create({
        chip:{
            padding: 5,
            margin: 5
        }
    })

    const handleSelect = (element)=>{
        if(sel!==element){
            nav.navigate(element)
        }
    }


    return (
        <SafeAreaView>
            <FlatList horizontal showsHorizontalScrollIndicator={false} data={files} keyExtractor={(item)=> item} renderItem={
                ({item, key})=> {
                    return (
                        <Chip style={style.chip} key={key}
                            selectedColor={item===selected ? "grey":"green"} 
                            mode={item===selected ? "flat":"outlined"}  selected={item===selected} onPress={()=>handleSelect(item)}>
                            {item}
                        </Chip>
                    );
                }
            } />
        </SafeAreaView>
    );

}