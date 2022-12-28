import { TextInput, View } from "react-native";


const WebIdEntryForm = (style) => {
    return (
        <View>
            <TextInput style={style} placeholder="Enter your web Id">
            </TextInput>
        </View>
    );
}

export default WebIdEntryForm;