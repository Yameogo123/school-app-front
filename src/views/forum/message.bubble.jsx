import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

export default function MessageBubble({ message }) {
    const user= useSelector((state)=> state.userReducer.user);
    const isMyMessage = message.userID === user?._id;
    const isMessageRead = false;


    return (
        <View
            style={{
                ...styles.messageContainer,
                alignSelf: !isMyMessage ? "flex-start" : "flex-end",
                backgroundColor: !isMyMessage ? "#fcfcfc" : "skyblue",
                borderTopLeftRadius: !isMyMessage ? 0 : 5,
                borderTopRightRadius: !isMyMessage ? 5 : 0,
            }}
        >
            <View
                style={{
                    ...styles.leftMessageArrow,
                    display: isMyMessage ? "flex" : "none",
                }}
            ></View>
            <Text
                style={{
                    ...styles.messageText,
                    left: isMyMessage ? 0 : 10,
                }}
            >
                {message.text}
            </Text>
            <View
                style={{
                    ...styles.timeAndReadContainer,
                    left: isMyMessage ? 0 : 10,
                }}
            >
                <Text style={styles.timeText}>
                    {dayjs(message.time).format("HH:mm A")}
                </Text>
                <View>
                    {isMessageRead ? (
                        <MaterialCommunityIcons name="read" size={16} color="#5bb6c9" />
                    ) : (
                        <MaterialCommunityIcons name="check" size={16} color="grey" />
                    )}
                </View>
                <View
                    style={{
                        ...styles.rightMsgArrow,
                        display: isMyMessage ? "none" : "flex",
                    }}
                ></View>
            </View>
        </View>
    );
}



const styles= StyleSheet.create({
    messageContainer: {
        width: "65%", marginVertical: 5, marginHorizontal: 16,
        paddingVertical: 10, flexDirection: "row", borderRadius: 5,
    },
    leftMessageArrow: {
        height: 0, width: 0, borderLeftWidth: 10, borderLeftColor: "transparent",
        borderTopColor: "white", borderTopWidth: 10, alignSelf: "flex-start",
        borderRightColor: "black", right: 10, bottom: 10,
    },
    messageText: {
        fontSize: 16, width: "65%",
    },
    timeAndReadContainer: {
        flexDirection: "row",
    },
    timeText: {
        fontSize: 12,
        color: "grey",
    },
    rightMsgArrow: {
        height: 0, width: 0, borderRightWidth: 10, borderRightColor: "transparent",
        borderTopColor: "green", borderTopWidth: 10, alignSelf: "flex-start",
        left: 6, bottom: 10,
    },
});