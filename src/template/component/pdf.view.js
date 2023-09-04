import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {Dimensions, StyleSheet, View, Linking, Alert} from 'react-native';
import Pdf from 'react-native-pdf';
import SimpleHeader from '../header/simpleHeader';


export default function PdfView() {
  
    const nav=  useNavigation()
    const route= useRoute()

    const document= route.params?.document || 'http://samples.leanpub.com/thereactnativebook-sample.pdf';
    const source = { uri: document, cache: true };

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
                trustAllCerts={false}
                source={source} fitWidth={true} style={styles.pdf}
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