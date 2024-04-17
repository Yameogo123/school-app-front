import React, { useEffect, useMemo, useRef, useState } from "react";
import { AppState, SafeAreaView } from "react-native";
import BottomTab from "./src/navigation/bottom";
import { useDispatch, useSelector } from "react-redux";
import { getObjectValue, getStringValue } from "./src/redux/storage";
import { NavigationContainer } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import { PreloadingStack } from "./src/navigation/stack";
import Loading from "./src/template/component/loading";
import moment from "moment";
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import french from "./src/translation/fr.json"
import english from "./src/translation/en.json"

export default function PreApp(){

    const dispatch= useDispatch();
    const log= useSelector((state)=>state.userReducer.log);
    const connexion= useSelector((state)=>state.userReducer.connected);
    const langue= useSelector((state)=>state.paramReducer.langue)

    const [loading, setLoading]= useState(true);
    const appState = useRef(AppState.currentState);

    useMemo(()=>{
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                //console.log('App has come to the foreground!');
            }
            appState.current = nextAppState;
            const action= {type:"loading"};
            dispatch(action)
        });

        const diff=Math.abs(moment().diff(moment(log), "h"))
        const action2 = {"type": "logout"}
        if(diff< 0){
            dispatch(action2);
        }
    
        return () => {
          subscription.remove(); 
        };
    }, []);

    useEffect(()=>{
        setTimeout(
            ()=>{
                setLoading(false)
            }, 5000
        )
        //clearInterval(time)
    }, [])

    function loadData(){
        getStringValue("langue").then(
            (val)=>{
              if(val){
                const action2={
                    type:"langue", value: val
                }
                dispatch(action2)
              }
            }
        )
        getStringValue("log").then((res)=>{
            const action={type: "log", value: res}
            dispatch(action)
        }) 
        getStringValue("theme").then((res)=>{
            const action={type: res}
            dispatch(action)
        }) 
        getStringValue("connected").then((res)=>{ 
            let val= "connected"
            if(res===null || res==="disconnected"){
                val="disconnected"
            }
            const action={type: "connexion", value: val}
            dispatch(action)
        }) 
        getObjectValue("login").then(
            (login)=>{
                const action={type: "login", value: login}
                dispatch(action);
            }
        )
    }

    useEffect(()=>{
        loadData();
        i18next.use(initReactI18next).init({
            compatibilityJSON: 'v3', lng: langue,
            resources:{ en: english, fr: french },
            react:{ useSuspense: false }
        })
    },[langue])

 
    return (
        <NavigationContainer>
            {connexion === "connected" && <Loading load={loading} />}
            {connexion==="connected" ? <BottomTab /> : <PreloadingStack />}
            <Toast />
        </NavigationContainer>
    );
}