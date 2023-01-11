import { Button, TextInput, View, Text, StyleSheet, Image } from "react-native";

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
            <View style={styles.inputContainer}>
                <Image source={require('../img/Alta_logo_dropshadow.jpg')} />
                <Button onPress={clearWebId} title={title}></Button>
            </View>
        )
    }

    return (
        <View style={styles.inputContainer}>
            <Image source={require('../img/Alta_logo_dropshadow.jpg')} />
            <Text style={styles.h3}>Enter your Alta Web Id to get started</Text>
            <Text>Your Web Id can be found at the bottom of your season pass</Text>
            <Text>(make sure to put in the dashes too)</Text>
            <TextInput style={styles.input} defaultValue={webId} onChangeText={setWebId}>
            </TextInput>
            <Button onPress={onClickUpdateWebId} title="Check my Vert"></Button>
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
        marginLeft: 12,
        marginRight: 12,
    },
    h3: {
        fontSize: 22,
    },
})



export default WebIdEntryForm;