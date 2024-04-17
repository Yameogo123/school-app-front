import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Setting from '../views/parametre/setting';
import Profil from '../views/profil/profil';
import Forum from '../views/forum/forum';
import File from '../views/fichier/file';
import Home from '../views/acceuil/home';
import { useSelector } from 'react-redux';
import Login from '../views/security/login';
import Notes from '../views/fichier/note/notes';
import FileResult from '../views/fichier/file.result';
import PdfView from '../template/component/pdf.view';
import Cours from '../views/fichier/cours/cours';
import CoursListe from '../views/fichier/cours/cours.list';
import Tableau from '../views/fichier/tableau/tableau';
//import TableauAdd from '../views/fichier/tableau/tableau.add';
import Rappels from '../views/fichier/rappels/rappels';
import RappelAdd from '../views/fichier/rappels/rappels.add';
import Absences from '../views/fichier/absences/absences';
import Liens from '../views/parametre/link';
import Scolarite from '../views/parametre/scolarite';
import Information from '../views/parametre/information';
import Archive from '../views/parametre/archive';
import Document from '../views/parametre/document';
import ForumDetail from '../views/forum/chat';
import Page1 from '../views/preloading/page1';
import Page2 from '../views/preloading/page2';
import Admin from '../views/admin/admin';
import AddInscription from '../views/admin/inscription/add';
import Orientation from '../views/fichier/orientation/orientation';
import OrientationDetail from '../views/fichier/orientation/orientation.detail';


const screenOpt=  {
    headerShown: false,
    cardStyle: {
        backgroundColor: 'transparent',
        animationEnabled: false
    }
}

export function HomeStack() {
    const Stack= createStackNavigator()
    const back= useSelector((state)=>state.themeReducer.back)


    return (
        <Stack.Navigator
            initialRouteName='home'
            screenOptions={{
                ...screenOpt,
                cardStyle: {
                    ...screenOpt.cardStyle,
                    backgroundColor: back
                }
            }}
        >
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="profile" component={Profil} />
            <Stack.Screen name="settings" component={Setting} />
        </Stack.Navigator>
    );
}


export function FileStack() {
    const FStack= createStackNavigator()
    const back= useSelector((state)=>state.themeReducer.back)


    return (
        <FStack.Navigator
            initialRouteName='file'
            screenOptions={{
                ...screenOpt,
                cardStyle: {
                    ...screenOpt.cardStyle,
                    backgroundColor: back
                }
            }}
        >
            <FStack.Screen name="file" component={File} />
            <FStack.Screen name="file/result" component={FileResult} />
            <FStack.Screen name="pdf" component={PdfView} />
            <FStack.Screen name="notes" component={Notes} />
            <FStack.Screen name="absences" component={Absences} />
            <FStack.Screen name="cours" component={Cours} />
            <FStack.Screen name="tableau" component={Tableau} options={{ gestureEnabled: false }} />
            <FStack.Screen name="rappel/add" component={RappelAdd} />
            <FStack.Screen name="rappels" component={Rappels} />
            <FStack.Screen name="cours/liste" component={CoursListe} />
            <FStack.Screen name="profile" component={Profil} />
            <FStack.Screen name="settings" component={Setting} />
            <FStack.Screen name="orientation" component={Orientation} />
            <FStack.Screen name="orientation/detail" component={OrientationDetail} />
        </FStack.Navigator>
    );
}


export function ForumStack() {
    const Stack= createStackNavigator()
    const back= useSelector((state)=>state.themeReducer.back)

    return (
        <Stack.Navigator
            initialRouteName='forum'
            screenOptions={{
                ...screenOpt,
                cardStyle: {
                    ...screenOpt.cardStyle,
                    backgroundColor: back
                },
            }}
        >
            <Stack.Screen name="forum" component={Forum} />
            <Stack.Screen name="forum/detail" component={ForumDetail} />
            <Stack.Screen name="profile" component={Profil} />
            <Stack.Screen name="settings" component={Setting} />
        </Stack.Navigator>
    );
}

export function ProfilStack() {
    const Stack= createStackNavigator()
    const back= useSelector((state)=>state.themeReducer.back)


    return (
        <Stack.Navigator
            initialRouteName='profile'
            screenOptions={{
                ...screenOpt,
                cardStyle: {
                    ...screenOpt.cardStyle,
                    backgroundColor: back
                },
            }}
        >
            <Stack.Screen name="profile" component={Profil} />
            <Stack.Screen name="Settings" component={Setting} />
        </Stack.Navigator>
    );
}

export function ParametreStack() {
    const Stack= createStackNavigator()
    const back= useSelector((state)=>state.themeReducer.back)

    return (
        <Stack.Navigator
            initialRouteName='parametre'
            screenOptions={{
                ...screenOpt,
                cardStyle: {
                    ...screenOpt.cardStyle,
                    backgroundColor: back
                },
            }}
        >
            <Stack.Screen name="parametre" component={Setting} />
            <Stack.Screen name="liens" component={Liens} />
            <Stack.Screen name="scolarite" component={Scolarite} />
            <Stack.Screen name="informations" component={Information} />
            <Stack.Screen name="archives" component={Archive} />
            <Stack.Screen name="documents" component={Document} />
            <Stack.Screen name="profile" component={Profil} />
            <Stack.Screen name="pdf" component={PdfView} />
        </Stack.Navigator>
    );
}


export function PreloadingStack() {
    const Stack= createStackNavigator()
    const back= useSelector((state)=>state.themeReducer.back)

    return (
        <Stack.Navigator
            initialRouteName='page1'
            screenOptions={{
                ...screenOpt,
                cardStyle: {
                    ...screenOpt.cardStyle,
                    backgroundColor: back
                },
            }}
        >
            <Stack.Screen name="page1" component={Page1} />
            <Stack.Screen name="page2" component={Page2} options={{ gestureEnabled: false }} />
            <Stack.Screen name="login" component={Login} />
        </Stack.Navigator>
    );
}



export function AdminStack() {
    const Stack= createStackNavigator()
    const back= useSelector((state)=>state.themeReducer.back)

    return (
        <Stack.Navigator
            initialRouteName='admin'
            screenOptions={{
                ...screenOpt,
                cardStyle: {
                    ...screenOpt.cardStyle,
                    backgroundColor: back
                },
            }}
        >
            <Stack.Screen name="admin" component={Admin} />
            <Stack.Screen name="inscription/add" component={AddInscription} />
            <Stack.Screen name="login" component={Login} />
        </Stack.Navigator>
    );
}