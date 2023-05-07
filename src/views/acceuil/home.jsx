import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Header from "../../template/header/header";
import {ExpandableCalendar, CalendarProvider, CalendarUtils, TimelineList} from 'react-native-calendars';
import { groupBy } from "lodash";
import { EVENTS } from "../../api/data";
import { useSelector } from "react-redux";


const EVENT_COLOR = "#e6add8"
const INITIAL_TIME = {hour: 9, minutes: 0}
const today = new Date();
const getDate = (offset=0) => CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate()+offset))

export default function Home() {
    
    const nav=  useNavigation()
    const [currentDate, setCurrentDate] = useState(getDate());
    const onDateChange= (date)=>{
        setCurrentDate(date);
    }
    const back= useSelector((state)=>state.themeReducer.back)
    const front= useSelector((state)=>state.themeReducer.front)

    const [eventsByDate, setEventByDate]=useState(groupBy(EVENTS, e=>CalendarUtils.getCalendarDateString(e.start)))
    const prop= {
        format24: true,
        scrollToFirst: true,
        start: 7,
        end: 22,
        overlapEventsSpacing: 8,
        rightEdgeSpacing: 24
    }
    

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <Header show={false}  />
            }, 
            headerShown: true
        })
    }, [])
    
    
    const style = StyleSheet.create({
        container:{
            flex: 1
        }
    })

    return (
        <View style={style.container}>
            <CalendarProvider date={currentDate} onDateChanged={onDateChange} showTodayButton disabledOpacity={0.6}>
                <ExpandableCalendar refreshing scrollEnabled calendarStyle={{backgroundColor: back}} bounces enableSwipeMonths  firstDay={1} />
                <TimelineList events={eventsByDate} timelineProps={prop} scrollToFirst showNowIndicator initialTime={INITIAL_TIME}/>
            </CalendarProvider>
        </View>
    );
}