import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { StyleSheet, View, Text, Button, TouchableWithoutFeedback, Keyboard, FlatList, Dimensions, TouchableOpacity } from "react-native";
import FichierHeader from "../../../template/header/fichierHeader";
import { useSelector } from "react-redux";
import DropDownPicker from 'react-native-dropdown-picker';
import moment from "moment";
import { Get } from "../../../api/service";
import { adaptSelect } from "../../../api/functions";

export default function Notes() {
    
    const front= useSelector((state)=>state.themeReducer.front)
    const back= useSelector((state)=>state.themeReducer.back)
    const chart= useSelector((state)=>state.themeReducer.chart)
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const loading= useSelector((state)=>state.userReducer.loading);
    
    const [isVisible, setVisible] = useState(false);
    const nav=  useNavigation();
    const [matieres, setMatieres]= useState([]);
    const [notes, setNotes]= useState([
        {note: 4, id: 1, matiere: "mathématiques", date :"2023-06-01"},{note: 10, id: 2, matiere: "P-C", date :"2023-06-11"},
        {note: 14, id: 3, matiere: "latin", date :"2023-07-01"},{note: 18, id: 4, matiere: "latin", date :"2023-06-21"},
    ]);
    const [selectedMatiere, setSelectedMatiere] = useState("");
    const pickerRef = useRef();
    /*function open() {
        pickerRef.current.focus();
    }
    function close() {
        pickerRef.current.blur();
    }*/
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("descendant");
    const [items, setItems] = useState([
        {id: 1, label: 'ascendant', value: 'ascendant'},
        {id: 2, label: 'descendant', value: 'descendant'}
    ]);

    const width= Math.floor(Dimensions.get("screen").width /3 - 13);

    useMemo(()=>{
        setMatieres([])
        Get("/cours/all/ecole/"+user?.ecole?._id, token).then(
            (rs)=>{
                if(!rs?.error){
                    setMatieres([{id: 0, label: "aucun", value: ""}, ...adaptSelect(rs?.cours)])
                }
            }
        ).catch(()=>{})
    }, [loading]);

    useMemo(()=>{
        //setMatieres([])
        let root="/note/all/eleve/"+user?._id+"/"+user?.ecole?.anneeScolaire;
        if(user?.type==="Eleve"){
            root="/note/all/eleve/"+user?._id+"/"+user?.ecole?.anneeScolaire;
        }else if(user?.type==="Professeur"){
            root="/note/all/professeur/"+user?._id+"/"+user?.ecole?.anneeScolaire;
        }else{
            root="/note/all/ecole/"+user?.ecole?._id+"/"+user?.ecole?.anneeScolaire
        }

        Get(root, token).then(
            (rs)=>{
                //console.log(rs);
                if(!rs?.error){
                    setNotes(rs?.notes)
                }
            }
        ).catch(()=>{});
        
    }, [loading]);

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
            flex: 1
        },
        info:{color: back, fontSize: 15, opacity: 0.8, margin: 10, textAlign: "center"},
        head:{display: "flex", flexDirection: "row", justifyContent:"space-around"},
        btn:{padding: 10, backgroundColor: chart, color: "white"},
        card:{backgroundColor: back, borderColor: front, borderWidth: 0.2, margin: 5, borderRadius: 30, padding: 10, width: width},
        flat:{padding: 5, alignItems: "stretch"},
    })

    function DropDownMat(){
        return (
            <View style={{width: "45%"}} key={"mat"}>
                <DropDownPicker searchable key={"ddm"}
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
            <View style={{width: "45%"}} key={"date"}>
                <DropDownPicker dropDownContainerStyle={{elevation: 999}}
                    placeholder="filtre par date" key={"ddd"}
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
        return (<View style={style.card} key={item?.id}>
            <Text style={[style.info, {fontSize: 10, color: front, maxWidth: "80%"}]}>devoir de {item?.cours?.libelle} du {moment(item?.date).format("DD/MM")}</Text>
            <Text style={[style.info,{fontSize: 30, color: front}]}>{item?.note}</Text>
            {!item?.copie ? <Text style={[style.info, { color: front}]}>....................</Text> : <Button title="votre copie" color={"green"} onPress={()=>nav.navigate("pdf", {document:  API+"/document/show/"+item?.copie?.libelle})} />}
        </View>);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
            <View style={style.container}>
                <View style={style.head}>
                    <DropDownDate />
                    <DropDownMat />
                </View>
                <View style={{ zIndex : -1, marginBottom: 50, alignItems: "center" }}>
                    <FlatList key={"flat"} scrollEnabled={notes.length > 9} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}  
                        contentContainerStyle={style.flat} numColumns={3} data={notes?.sort((a, b)=>value==="descendant" ? moment(b?.date) - moment(a?.date)  : moment(a?.date) - moment(b?.date))?.filter((x)=> x?.cours?._id?.includes(selectedMatiere)) } 
                        keyExtractor={({index, _})=> index}
                        renderItem={({index, item})=> {
                            return (
                                <View key={index}>
                                    <Card item={item} key={item?.id} />
                                </View>
                            );
                        }}
                    /> 
                </View>
                {/* <View style={{position: "absolute", bottom: 25, right: 10}}>
                    <TouchableOpacity style={style.btn}>
                        <Ionicons name="add" size={35} color={back} />
                    </TouchableOpacity>
                </View> */}
            </View>
        </TouchableWithoutFeedback>
    );
} 