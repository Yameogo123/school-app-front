import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Header from "../../template/header/header";
import {ExpandableCalendar, CalendarProvider, CalendarUtils, TimelineList} from 'react-native-calendars';
import { groupBy } from "lodash";
import { useSelector } from "react-redux";
import { Get } from "../../api/service";

const INITIAL_TIME = {hour: 9, minutes: 0}
const today = new Date();
const getDate = (offset=0) => CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate()+offset))

export default function Home() {
    
    const nav=  useNavigation();
    const token= useSelector((state)=> state.userReducer.token);
    const user= useSelector((state)=> state.userReducer.user);
    const loading= useSelector((state)=>state.userReducer.loading);

    const [currentDate, setCurrentDate] = useState(getDate());
    const onDateChange= (date)=>{
        setCurrentDate(date);
    }
    const back= useSelector((state)=>state.themeReducer.back);

    const [eventsByDate, setEventByDate]=useState({})
    const prop= {
        format24: true, scrollToFirst: true, start: 7, end: 22,
        overlapEventsSpacing: 8, rightEdgeSpacing: 24, onEventPress: (e)=> Alert.alert("évènement", e?.title, [], {cancelable: true})
    }   
 
    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <Header show={false}  />
            }, 
            headerShown: true
        })
    }, []);

    useMemo(()=>{
        let root1 = "/planCours/all/"+user?.ecole?._id+'/'+user?.ecole?.anneeScolaire
        let root2 = "/planEvent/all/"+user?.ecole?._id+'/'+user?.ecole?.anneeScolaire
        setEventByDate([]);
        if(user?.type==="Eleve"){
            Get("/inscription/all/eleve/"+user?._id, token).then(
                (rs)=>{ 
                    if(!rs?.error){
                        root1= "/planCours/all/ecole/"+user?.ecole?._id+"/"+rs?.inscriptions[0].classe+'/'+user?.ecole?.anneeScolaire
                        root2 = "/planEvent/all/ecole/"+user?.ecole?._id+"/"+rs?.inscriptions[0].classe+'/'+user?.ecole?.anneeScolaire
                        Get(root1, token).then(
                            (rp)=>{
                                if(!rp?.error){
                                    setEventByDate([...groupBy(rp?.events, e=>CalendarUtils.getCalendarDateString(e?.start)), eventsByDate])
                                }else{
                                    // Toast.show({
                                    //     text1: "erreur",
                                    //     text2: "erreur de récupération des évènements",
                                    //     topOffset: 50, type:"error"
                                    // })
                                }
                            }
                        ).catch(()=>{})

                        Get(root2, token).then(
                            (rp)=>{
                                if(!rp?.error){
                                    setEventByDate([...groupBy(rp?.events, e=>CalendarUtils.getCalendarDateString(e?.start)), eventsByDate])
                                }else{
                                    // Toast.show({
                                    //     text1: "erreur",
                                    //     text2: "erreur de récupération des évènements",
                                    //     topOffset: 50, type:"error"
                                    // })
                                }
                            }
                        ).catch(()=>{})
                    }else{
                        // Toast.show({
                        //     text1: "erreur",
                        //     text2: "aucune inscription pour cet étudiant",
                        //     topOffset: 50, type:"error"
                        // })
                    }
                }
            ).catch(()=>{}) 
        }else{
            if(user?.type==="Professeur"){
                root1= "/planCours/all/professeur/"+user?._id+"/"+user?.ecole?._id+'/'+user?.ecole?.anneeScolaire
            }
            Get(root1, token).then(
                (rp)=>{
                    if(!rp?.error){
                        //console.log(groupBy(rp?.events, e=>CalendarUtils.getCalendarDateString(e?.start)))
                        //setEventByDate({...groupBy(rp?.events, e=>CalendarUtils.getCalendarDateString(e?.start)), ...eventsByDate})
                        Get(root2, token).then(
                            (r)=>{
                                if(!r?.error){
                                    setEventByDate({...groupBy(r?.events, e=>CalendarUtils.getCalendarDateString(e?.start)), ...groupBy(rp?.events, e=>CalendarUtils.getCalendarDateString(e?.start))})
                                }else{
                                    // Toast.show({
                                    //     text1: "erreur", text2: "erreur de récupération des évènements",
                                    //     topOffset: 50, type:"error"
                                    // })
                                }
                            }
                        ).catch(()=>{})
                    }else{
                        // Toast.show({
                        //     text1: "erreur", text2: "erreur de récupération des évènements",
                        //     topOffset: 50, type:"error"
                        // })
                    }
                }
            ).catch(()=>{}) 
            
            if(user?.type==="Professeur"){
                //setEvents([])
            }
        }
    }, [loading]);
    
    
    const style = StyleSheet.create({
        container:{
            flex: 1
        }
    })
 
    return (
        <View style={style.container}>
            <CalendarProvider date={currentDate} onDateChanged={onDateChange} showTodayButton disabledOpacity={0.6}>
                <ExpandableCalendar refreshing scrollEnabled calendarStyle={{backgroundColor: back}} bounces enableSwipeMonths  firstDay={1} pagingEnabled />
                <TimelineList events={eventsByDate} timelineProps={prop} scrollToFirst showNowIndicator initialTime={INITIAL_TIME}  />
            </CalendarProvider>
        </View>
    );
}
