import React from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import NoLoggedHeader from "./noLoggedHeader";
import { storeString } from "../../redux/storage";
import LoggedHeader from "./loggedHeader";
import { useNavigation } from '@react-navigation/native';


export default function Header({show=true}){

    const dispatch = useDispatch()
    const user= useSelector((state)=>state.userReducer.user)
    const front= useSelector((state)=>state.themeReducer.front)
    const nav=  useNavigation()

    //console.log(user);

    const switchTheme = ()=>{
        const action={
            type: front==="black" ? "dark": "light"
        }
        storeString("theme", front==="black" ? "dark": "light").then(
            ()=>{
                dispatch(action)
            }
        )
    }

    const handleGoBack = ()=>{
        nav.goBack()
    }

    return (
        <View>
            <LoggedHeader handleTheme={switchTheme} goBack={handleGoBack} show={show} /> 
        </View>
    );

}