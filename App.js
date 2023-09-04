import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import PreApp from './PreApp';
import Provide from "./src/redux/provider";
import {LocaleConfig} from 'react-native-calendars';
import { useEffect, useState } from 'react';
import NetInfo from "@react-native-community/netinfo";
import NoInternet from './src/template/component/noInternet';

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'
  ],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui"
};

LocaleConfig.defaultLocale = 'fr';

export default function App() {

  const [alert, setAlert] = useState(false);

  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener((st) => {
      if(!st.isConnected){
        setAlert(true);
      }else{
        setAlert(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [])

  return (
    <Provide>
      <StatusBar style="auto" />
      {alert ? <NoInternet /> :  <PreApp />}
    </Provide>
  );
}


