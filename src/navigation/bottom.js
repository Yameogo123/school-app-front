import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FileStack, ForumStack, HomeStack, ParametreStack, ProfilStack } from './stack';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from "react-native-vector-icons/Ionicons"
import LeftDrawer from './drawer';


const Tab = createBottomTabNavigator();
const names=["login", "file/result", "pdf"]

export default function BottomTab() {

    const user= useSelector((state)=>state.userReducer.user)
    const back= useSelector((state)=>state.themeReducer.back)
    const front= useSelector((state)=>state.themeReducer.front)


    const getRouteName = (route)=>{
        const n= getFocusedRouteNameFromRoute(route) 
        return names.includes(n) ? "none": "flex"
    }


    let opt={
        tabBarActiveTintColor: back,
        tabBarInactiveTintColor: back,
        //tabBarLabel: '---',
        //tabBarBadge:"user",
        //tabBarActiveBackgroundColor:"snow",
        headerTransparent: true,
        headerTitleAllowFontScaling:true,
        tabBarLabelStyle:{
            fontWeight: "bold",
            fontSize: 10
        }
    }

    let tstyle={
        backgroundColor: "grey",
        //borderRadius: 40,
        height: 100,
        padding:10,
        paddingBottom: 20,
        //alignItems:"center",
        //position: "absolute",
        //borderColor: chart,
    }

    return (
        <Tab.Navigator 
            initialRouteName="home"
            screenOptions={{
                tabBarHideOnKeyboard: true,
                //tabBarShowLabel: false,
                tabBarStyle: tstyle,
                headerShown: false
            }}
        >
            <Tab.Screen name="Home" component={user==="" ? HomeStack:LeftDrawer} 
                options={({ navigation, route }) =>({
                    //tabBarBadge:"...",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name="home" color={back} size={focused? size+20 :size+5} />
                    ),
                    ...opt,
                    tabBarStyle: {
                        ...tstyle,
                        display: getRouteName(route)
                    },
                    tabBarLabel: 'Acceuil'

                })} 
            />
            <Tab.Screen name="File" component={FileStack} options={({ navigation, route }) =>({
                    //tabBarBadge:"...",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused? "folder-open" : "folder"} color={back} size={focused? size+20 :size+5} />
                    ),
                    ...opt,
                    tabBarStyle: {
                        ...tstyle,
                        display: getRouteName(route)
                    },
                    tabBarLabel: 'Fichier'

                })} 
            />
            <Tab.Screen name="Forum" component={ForumStack} options={({ navigation, route }) =>({
                    //tabBarBadge:"...",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name="md-chatbubbles" color={back} size={focused? size+20 :size+5} />
                    ),
                    ...opt,
                    tabBarStyle: {
                        ...tstyle,
                        display: getRouteName(route)
                    },
                    tabBarLabel: 'Forum'

                })} 
            />
            <Tab.Screen name="Setting" component={ParametreStack} 
                options={({ navigation, route }) =>({
                    //tabBarBadge:"...",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name="settings" color={back} size={focused? size+20 :size+5} />
                    ),
                    ...opt,
                    tabBarStyle: {
                        ...tstyle,
                        display: getRouteName(route)
                    },
                    tabBarLabel: 'Paramètre'

                })} 
            />
        </Tab.Navigator>
    );
}