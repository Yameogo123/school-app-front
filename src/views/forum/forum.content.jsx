import { View, Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
import useKeyboardOffsetHeight from "../../template/component/useKeyboardOffsetHeight";
import MessageBubble from "./message.bubble";
import getMessageHeightOffset from "../../template/component/getMessageHeightOffset";
import react, { useEffect, useState } from "react";

const windowHeight = Dimensions.get("window").height;


export default function ForumContent({ heightOfMessageBox, messages }) {

    const keyBoardOffsetHeight = useKeyboardOffsetHeight();
    const renderMessageBubble = ({ item }) => {
        return <MessageBubble message={item} />;
    };

    //const [height, setHeight]= useState(windowHeight * 0.8 - keyBoardOffsetHeight * 0.95 - getMessageHeightOffset(heightOfMessageBox, windowHeight))

    useEffect(()=>{
        //console.log(windowHeight * 0.8 - keyBoardOffsetHeight * 0.95 - getMessageHeightOffset(heightOfMessageBox, windowHeight));
    }, [])
 
    return (
        <View style={{flex: 1, paddingBottom: Math.max(keyBoardOffsetHeight, windowHeight * 0.02)+60}}>
            <FlashList
                inverted data={[...messages].reverse()} showsVerticalScrollIndicator={false}
                renderItem={renderMessageBubble} estimatedItemSize={40}
            />
        </View>
    );
}