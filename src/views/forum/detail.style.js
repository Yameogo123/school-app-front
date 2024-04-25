import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default StyleSheet.create({

    sendBtnContainer: {
        minHeight: windowHeight * 0.06,
        maxHeight: windowHeight * 0.4,
        paddingHorizontal: "1%", position: "absolute",
        left: 0, width: windowWidth, alignContent: "center",
    },

    textBoxContainer: {
        maxHeight: windowHeight * 0.3, backgroundColor: "white",
        width: "90%", margin: "1%", flexDirection: "row",
        alignItems: "center", justifyContent: "center",
        paddingHorizontal: "2%", paddingVertical: "1%",
        borderRadius: 20,
    },

    textInput: {
        width: "80%", marginHorizontal: "2%", fontSize: 20,
        color: "black", opacity: 0.3,
    },

    voiceButtonContainer: {
        width: "11%", justifyContent: "center", alignContent: "center",
    },

    voiceButton: {
        backgroundColor: "skyblue", borderRadius: 50, height: windowWidth * 0.1,
        width: windowWidth * 0.1, alignItems: "center", justifyContent: "center",
    }
});