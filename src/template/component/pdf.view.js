import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {Dimensions, Platform, StyleSheet, View, Linking, Alert} from 'react-native';
import Pdf from 'react-native-pdf';
import SimpleHeader from '../header/simpleHeader';

const DOCUMENT = 'https://www.afmc.ch/fileadmin/user_upload/exemple-1.pdf';

export default function PdfView() {
  
    const nav=  useNavigation()
    const route= useRoute()

    const document= route.params?.document
    const source = { uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true };

    useEffect(() => {
        nav.setOptions({
            header : ()=> {
                return <SimpleHeader />
            }, 
            headerShown: true
        })
    }, [])

    return (
        <View style={styles.container}>
            <Pdf
                source={source} 
                onLoadComplete={(numberOfPages,filePath) => {
                    //console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page,numberOfPages) => {
                    //console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    Alert.alert("Erreur", "erreur de fichier: "+error)
                }}
                onPressLink={(uri) => {
                    Linking.openURL(uri).then(()=> Alert.alert("Lien", uri+" ouvert avec succès"))
                }}
                style={styles.pdf}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});