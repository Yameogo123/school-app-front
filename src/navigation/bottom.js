import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FileStack, ForumStack, HomeStack, ParametreStack, ProfilStack } from './stack';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons"
import LeftDrawer from './drawer';
import AdminDrawer from './drawer.admin';
import { useTranslation } from "react-i18next";


const Tab = createBottomTabNavigator();
const names=[
    "login", "file/result", "pdf", "cours/liste", "rappel/add", "liens",
    "scolarite", "informations", "archives", "documents", 'forum/detail', 'inscription/add',
    "inscription/annuler", "user/add", "user/supprimer", "planifier", "plan/cours", 
    "plan/event", "plan/annuler", "notifier", "salle", "admin/cours", "admin/classe",
    "admin/note", "admin/absence", "issu", "tableau", "admin/reglement", "admin/rapport",
    "admin/montant", "admin/impaye", "admin/coefficient", "bulletin", "orientation/detail",
    "admin/orientation"
]

export default function BottomTab() {

    const user= useSelector((state)=>state.userReducer.user)
    const back= useSelector((state)=>state.themeReducer.back)
    const front= useSelector((state)=>state.themeReducer.front)
    const chart= useSelector((state)=>state.themeReducer.chart)
    const {t, _}=useTranslation()


    const getRouteName = (route)=>{
        const n= getFocusedRouteNameFromRoute(route) 
        return names.includes(n) ? "none": "flex"
    }

    let opt={
        tabBarActiveTintColor: back,
        tabBarInactiveTintColor: back,
        headerTransparent: true,
        headerTitleAllowFontScaling:true,
        tabBarLabelStyle:{
            fontWeight: "bold",
            fontSize: 10
        }
    }

    const tstyle={
        //backgroundColor: "transparent",
        height: 100, padding:10, paddingBottom: 20,
        shadowColor: 'black', shadowOffset: {width: -2, height: -1},
        shadowOpacity: 0.3, shadowRadius: 3,
    }

    return (
        <Tab.Navigator 
            initialRouteName="Home"
            screenOptions={{
                tabBarHideOnKeyboard: true,
                tabBarStyle: tstyle, headerShown: false
            }}
        >
            <Tab.Screen name="Forum" component={ForumStack} options={({ navigation, route }) =>({
                //tabBarBadge:"...",
                tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons name="chatbubbles" color={chart} size={focused? size+20 :size+5} />
                ),
                ...opt,
                tabBarStyle: {
                    ...tstyle,
                    display: getRouteName(route)
                },
                tabBarLabel: 'Forum',
                tabBarLabelStyle: {color: chart}
            })} 
            />
            <Tab.Screen name="File" component={FileStack} options={({ navigation, route }) =>({
                    //tabBarBadge:"...",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused? "folder-open" : "folder"} color={chart} size={focused? size+20 :size+5} />
                    ),
                    ...opt,
                    tabBarStyle: {
                        ...tstyle,
                        display: getRouteName(route)
                    },
                    tabBarLabel: t('bottom1'),
                    tabBarLabelStyle: {color: chart}
                })} 
            />
            <Tab.Screen name="Home" component={user==="" ? HomeStack : LeftDrawer} 
                options={({ navigation, route }) =>({
                    //tabBarBadge:"...",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name="home" color={chart} size={focused? size+20 :size+5} />
                    ),
                    ...opt,
                    tabBarStyle: {
                        ...tstyle,
                        display: getRouteName(route)
                    },
                    tabBarLabel:  t('bottom2'),
                    tabBarLabelStyle: {color: chart}
                })} 
            />
            <Tab.Screen name="Setting" component={ParametreStack} 
                options={({ navigation, route }) =>({
                    //tabBarBadge:"...",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name="settings" color={chart} size={focused? size+20 :size+5} />
                    ),
                    ...opt,
                    tabBarStyle: {
                        ...tstyle,
                        display: getRouteName(route)
                    },
                    tabBarLabel:  t('bottom3'),
                    tabBarLabelStyle: {color: chart}

                })} 
            />
            {
                user!=="" && <Tab.Screen name="Admin" component={AdminDrawer} 
                options={({ navigation, route }) =>({
                    //tabBarBadge:"...",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name="clipboard" color={chart} size={focused? size+20 :size+5} />
                    ),
                    ...opt,
                    tabBarStyle: {
                        ...tstyle,
                        display: getRouteName(route)
                    },
                    tabBarLabel: 'Admin',
                    tabBarLabelStyle: {color: chart}

                })} 
            />
            }
        </Tab.Navigator>
    );
}