import { useNavigation, useRoute } from "@react-navigation/native";
import React, {useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
//import RNDrawOnScreen from 'react-native-draw-on-screen';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import SimpleHeader from "../../../template/header/simpleHeader";
import {Path, Svg} from 'react-native-svg';
import ViewShot, {captureRef} from 'react-native-view-shot';


export default function Tableau(){

  const front= useSelector((state)=>state.themeReducer.front)
  const back= useSelector((state)=>state.themeReducer.back)
  const chart= useSelector((state)=>state.themeReducer.chart)
  const nav= useNavigation()
  const route= useRoute()
  const ref=useRef();
  const {height, width} = Dimensions.get('window');
  const [currentPath, setCurrentPath] = useState([]);
  const [paths, setPaths] = useState([]);

  const onTouchMove = (event) => {
    const newPath = [...currentPath];

    //get current user touches position
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;

    // create new point
    const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(
      0,
    )},${locationY.toFixed(0)} `;

    // add the point to older points
    newPath.push(newPoint);
    setCurrentPath(newPath);
  };


  const onTouchEnd = () =>{
    const currentPaths = [...paths];
    const newPath = [...currentPath];

    //push new path with old path and clean current path state
    currentPaths.push(newPath);
    setPaths(currentPaths);
    setCurrentPath([]);
  };

  const rm = () =>{
    setPaths([]);
    setCurrentPath([]);
  };

  const save = () => {
    captureRef(ref, {format: 'jpg', quality: 1}).then(
      uri => Alert.alert('le fichier a été sauvegardé dans le chemin suivant', uri),
      error => console.error('Oops, snapshot failed', error),
    );
  };

  useEffect(()=>{
    nav.setOptions({
      header : ()=> {
        return <SimpleHeader  />
      }, 
      headerShown: true
    })
  },[])

  const styles = StyleSheet.create({
    container: {
      flex: 1, justifyContent: 'center', alignItems: 'center',
    },
    svgContainer: {
      height: height * 0.8, width, borderColor: 'black', backgroundColor: 'white', borderWidth: 1
    },
    btn: { width: 65, height: 35, backgroundColor: "red",  borderRadius: 2, justifyContent: "center", alignItems: "center", margin: 2 },
  });

  return (
    <View>
      <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <TouchableOpacity onPress={()=> save()} style={[styles.btn, {backgroundColor: back}]}>
            <Ionicons name="save" size={25} color={chart} />
        </TouchableOpacity>
        <TouchableOpacity onPress={rm} style={[styles.btn, {backgroundColor: back}]}>
            <Ionicons name="trash" size={25} color={"red"} />
        </TouchableOpacity>
      </View>
      <View
        style={styles.svgContainer}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}>
        <ViewShot ref={ref}>
          <Svg height={height * 0.7} width={width}>
            <Path
              d={currentPath.join('')} stroke={'red'} fill={'transparent'}
              strokeWidth={2} strokeLinejoin={'round'} strokeLinecap={'round'}
            />

              {paths.length > 0 &&
                paths.map((item, index) => (
                  <Path
                      key={`path-${index}`} d={item.join('')} stroke={'red'}
                      fill={'transparent'} strokeWidth={2} strokeLinejoin={'round'}
                      strokeLinecap={'round'}
                  />
                ))
              }
          </Svg>
        </ViewShot>
      </View>
    </View>
  );
}