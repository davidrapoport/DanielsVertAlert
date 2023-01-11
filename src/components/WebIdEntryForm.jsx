import { Button, TextInput, View, Text, StyleSheet } from "react-native";

import { useState } from "react";

const WebIdEntryForm = ({ savedWebId, handleUpdateWebId }) => {
    const [webId, setWebId] = useState("")
    const clearWebId = () => {
        setWebId("");
        handleUpdateWebId("");
    }

    const onClickUpdateWebId = () => {
        handleUpdateWebId(webId)
    }

    if (savedWebId && savedWebId.length > 0) {
        const title = "Reset Web Id? Current ID is " + savedWebId
        return (
            <View>
                <Button onPress={clearWebId} title={title}></Button>
            </View>
        )
    }

    return (
        <View style={styles.inputContainer}>
            <Text>Enter your Alta web Id</Text>
            <TextInput style={styles.input} defaultValue={webId} onChangeText={setWebId}>
            </TextInput>
            <Button onPress={onClickUpdateWebId} title="Update Web ID"></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderColor: 'black',
        borderWidth: 3,
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignContent: 'center',
        bottom: 40,
        top: 20,
    },
})



export default WebIdEntryForm;