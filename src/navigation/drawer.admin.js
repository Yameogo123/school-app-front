import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "react-native-paper";
import { VERSION } from "../api/constante";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AddInscription from "../views/admin/inscription/add";
import Admin from "../views/admin/admin";
import AnnulerInscription from "../views/admin/inscription/annuler";
import AddUser from "../views/admin/user/add";
import SupprimeUser from "../views/admin/user/supprime";
import Planifier from "../views/admin/pedagogie/planifier";
import PlanCours from "../views/admin/pedagogie/plan.cours";
import PlanEvent from "../views/admin/pedagogie/plan.event";
import AnnulerPlan from "../views/admin/pedagogie/plan.annuler";
import Notifier from "../views/admin/pedagogie/notifier";
import Salle from "../views/admin/gestion/salle";
import Cours from "../views/admin/gestion/cours";
import Classe from "../views/admin/gestion/classe";
import Issu from "../views/security/issu";
import NoteView from "../views/admin/gestion/note.view";
import Absence from "../views/admin/gestion/absence";
import Reglement from "../views/admin/comptabilite/reglement";
import Rapport from "../views/admin/comptabilite/rapport";
import Montant from "../views/admin/comptabilite/montant";
import Impaye from "../views/admin/comptabilite/impaye";
import Coefficient from "../views/admin/gestion/coefficient";
import Bulletin from "../views/admin/pedagogie/bulletin";
import Orientation from "../views/admin/gestion/orientation";
import { useTranslation } from "react-i18next";

const Drawer = createDrawerNavigator()
const iconSize= 18;

function Menu(props){
    const back = useSelector((state)=>state.themeReducer.back);
    const user = useSelector((state)=>state.userReducer.user);
    const nav= useNavigation();
    const route= useRoute();
    const [page, setPage]= useState("admin");
    const {t, _}=useTranslation();


    useEffect(()=>{
        //console.log(nav.isFocused());
        //setPage("admin")
    }, [])

    const allowed= ["Directeur", "Secretaire"];
 
    function handleReport(){
        nav.navigate("issu");
    }

    const style= StyleSheet.create({
        content: {
            flex: 1,backgroundColor: "skyblue",//paddingTop: 10
        },
        imgcontainer: {
            alignItems: "center", marginBottom: 20, marginTop: 10
        },
        img:{
            width: "50%", height: 120, borderRadius: 50
        },
        text: {
            fontSize: 18, color: back, padding: 10, marginLeft: 15 //textAlign: "center"
        },
        title: {
            fontSize: 20, fontWeight: "bold", color: back, padding:5//textAlign: "center"
        },
        button: {
            backgroundColor: "orange", padding: 10, borderRadius: 10, position: "absolute", bottom: -15, opacity: 0.7
        },
        block: {
            margin: 10, alignItems: "center"
        },
        divider :{
            height: 1, width: "100%", backgroundColor: "transparent", //alignItems: "center",
            //margin: 20
        },
        bottom: {
            position: "absolute", bottom: 0, right: 10, left: 10
        },
        btn:{
            display:"flex", flexDirection: "row", backgroundColor: "red",
            justifyContent: "space-around", alignItems: "center", padding: 10, margin :10
        }
    })

    return (
        <SafeAreaView style={style.content}>
            <ScrollView style={{marginBottom: 100, marginLeft: 25}}>
                <View style={style.block}>
                   
                </View>
                
                <TouchableOpacity style={{marginTop: 30, marginBottom: 15, flexDirection: "row", backgroundColor: page==="admin" ? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=>{nav.navigate("admin"); setPage("admin")}}>
                    <Ionicons name="home" color={back} size={iconSize} />
                    <Text style={style.title}>{t('bottom2')}</Text>
                </TouchableOpacity>

                <View style={style.block}>
                    <Divider style={style.divider} />
                </View>

                {
                    allowed?.includes(user?.type) && <View>

                        <View style={{flexDirection: "row"}}>
                            <Ionicons name="reader" color={back} size={iconSize} />
                            <Text style={style.title}>Inscription:</Text>
                        </View>
                        <TouchableOpacity style={{backgroundColor: page==="inscription/add"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=>{nav.navigate("inscription/add"); setPage("inscription/add")}}>
                            <Text style={style.text}>{t('drawer1')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: page==="inscription/annuler"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("inscription/annuler"); setPage("inscription/annuler")}}>
                            <Text style={style.text}>{t('cancel')}</Text>
                        </TouchableOpacity>
                        
                        <View style={style.block}>
                            <Divider style={style.divider} />
                        </View>

                        <View style={{flexDirection: "row"}}>
                            <Ionicons name="people" color={back} size={iconSize} />
                            <Text style={style.title}>User:</Text>
                        </View>
                        <TouchableOpacity style={{backgroundColor: page==="user/add"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("user/add"); setPage("user/add")}}>
                            <Text style={style.text}>{t('drawer1')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: page==="user/supprimer"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("user/supprimer"); setPage("user/supprimer")}}>
                            <Text style={style.text}>{t('drawer2')}</Text>
                        </TouchableOpacity>

                        <View style={style.block}>
                            <Divider style={style.divider} />
                        </View>

                        <View style={{flexDirection: "row"}}>
                            <Ionicons name="school" color={back} size={iconSize} />
                            <Text style={style.title}>{t('drawer3')}:</Text>
                        </View>
                        <TouchableOpacity style={{backgroundColor: page==="planifier"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("planifier"); setPage("planifier")}}>
                            <Text style={style.text}>{t('drawer4')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: page==="notifier" ? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("notifier"); setPage("notifier")}}>
                            <Text style={style.text}>notification</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={{backgroundColor: page==="bulletin" ? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("bulletin"); setPage("bulletin")}}>
                            <Text style={style.text}>bulletin</Text>
                        </TouchableOpacity> */}


                        <View style={style.block}>
                            <Divider style={style.divider} />
                        </View>

                
                        <View style={{flexDirection: "row"}}>
                            <Ionicons name="add-circle" color={back} size={iconSize} />
                            <Text style={style.title}>{t('drawer5')}:</Text>
                        </View>
                        <TouchableOpacity style={{backgroundColor: page==="admin/absence"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("admin/absence"); setPage("admin/absence")}}>
                            <Text style={style.text}>absences</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: page==="admin/classe"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("admin/classe"); setPage("admin/classe")}}>
                            <Text style={style.text}>{t('drawer6')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: page==="admin/cours"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("admin/cours"); setPage("admin/cours")}}>
                            <Text style={style.text}>{t('drawer7')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: page==="admin/coefficient"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("admin/coefficient"); setPage("admin/coefficient")}}>
                            <Text style={style.text}>coefficients</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: page==="admin/note"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("admin/note"); setPage("admin/note")}}>
                            <Text style={style.text}>{t('drawer8')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: page==="admin/orientation"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("admin/orientation"); setPage("admin/orientation")}}>
                            <Text style={style.text}>orientation</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: page==="salle"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("salle"); setPage("salle")}}>
                            <Text style={style.text}>{t('drawer9')}</Text>
                        </TouchableOpacity>

                        <View style={style.block}>
                            <Divider style={style.divider} />
                        </View>
                    </View>
                }

                {
                    user?.type!=="Professeur" && <View>
                        <View style={{flexDirection: "row"}}>
                            <Ionicons name="cash" color={back} size={iconSize} />
                            <Text style={style.title}>{t("drawer10")}:</Text>
                        </View>
                        { user?.type==="Eleve" && <TouchableOpacity style={{backgroundColor: page==="admin/reglement"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("admin/reglement"); setPage("admin/reglement")}}>
                            <Text style={style.text}>{t("drawer13")}</Text>
                        </TouchableOpacity>}
                        { allowed?.includes(user?.type) && <TouchableOpacity style={{backgroundColor: page==="admin/rapport"? "blue": "skyblue", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 5}} onPress={()=> {nav.navigate("admin/rapport"); setPage("admin/rapport")}}>
                            <Text style={style.text}>{t("drawer11")}</Text>
                        </TouchableOpacity>}

                        <View style={style.block}>
                            <Divider style={style.divider} />
                        </View>
                    </View>
                }
            </ScrollView>

            <View style={style.bottom}>
                <TouchableOpacity style={style.btn} onPress={handleReport}>
                    <Ionicons name="information-circle" color={back} size={20} />
                    <Text style={style.text}>{t("drawer12")} ?</Text>
                </TouchableOpacity>
                <Text style={[style.text, {textAlign: "center"}]}>{VERSION}</Text>
            </View>

        </SafeAreaView>
    );
}


const AdminDrawer = () => {

    return (
        <Drawer.Navigator initialRouteName="admin" screenOptions={{headerShown: false}} drawerContent={(props)=> <Menu {...props} />}>
            <Drawer.Screen name="admin" component={Admin} />
            <Drawer.Screen name="inscription/add" component={AddInscription} />
            <Drawer.Screen name="inscription/annuler" component={AnnulerInscription} />
            <Drawer.Screen name="user/add" component={AddUser} />
            <Drawer.Screen name="user/supprimer" component={SupprimeUser} />
            <Drawer.Screen name="planifier" component={Planifier} />
            <Drawer.Screen name="plan/cours" component={PlanCours} />
            <Drawer.Screen name="plan/event" component={PlanEvent} />
            <Drawer.Screen name="plan/annuler" component={AnnulerPlan} />
            <Drawer.Screen name="notifier" component={Notifier} />
            <Drawer.Screen name="salle" component={Salle} />
            <Drawer.Screen name="bulletin" component={Bulletin} />
            <Drawer.Screen name="admin/cours" component={Cours} />
            <Drawer.Screen name="admin/classe" component={Classe} />
            <Drawer.Screen name="admin/note" component={NoteView} />
            <Drawer.Screen name="admin/coefficient" component={Coefficient} />
            <Drawer.Screen name="admin/absence" component={Absence} />
            <Drawer.Screen name="admin/reglement" component={Reglement} />
            <Drawer.Screen name="admin/rapport" component={Rapport} />
            <Drawer.Screen name="admin/montant" component={Montant} />
            <Drawer.Screen name="admin/impaye" component={Impaye} />
            <Drawer.Screen name="admin/orientation" component={Orientation} />
            <Drawer.Screen name="issu" component={Issu} />
        </Drawer.Navigator>
    );
};

export default AdminDrawer;

