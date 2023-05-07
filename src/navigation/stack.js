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
                },
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
    const Stack= createStackNavigator()
    const back= useSelector((state)=>state.themeReducer.back)


    return (
        <Stack.Navigator
            initialRouteName='file'
            screenOptions={{
                ...screenOpt,
                cardStyle: {
                    ...screenOpt.cardStyle,
                    backgroundColor: back
                },
            }}
        >
            <Stack.Screen name="file" component={File} />
            <Stack.Screen name="file/result" component={FileResult} />
            <Stack.Screen name="pdf" component={PdfView} />
            <Stack.Screen name="notes" component={Notes} />
            <Stack.Screen name="cours" component={Cours} />
            <Stack.Screen name="profile" component={Profil} />
            <Stack.Screen name="settings" component={Setting} />
        </Stack.Navigator>
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
            <Stack.Screen name="profile" component={Profil} />
        </Stack.Navigator>
    );
}