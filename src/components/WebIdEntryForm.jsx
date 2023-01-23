import { Button, TextInput, View, Text, StyleSheet, Image } from "react-native";

import { useRef, useState } from "react";

import { material } from "react-native-typography";

const WebIdEntryForm = ({ savedWebId, handleUpdateWebId }) => {
    const [webId, setWebId] = useState("")
    const [error, setError] = useState("");
    const clearWebId = () => {
        setWebId("");
        setError('');
        handleUpdateWebId("");
    }

    const inputRef = useRef(TextInput);

    const validateWebId = webId => {
        return webId.search(/\w{8}-\w{3}-\w{3}/gm) !== -1;
    }

    const onClickUpdateWebId = () => {
        if (validateWebId(webId)) {
            setError('');
            handleUpdateWebId(webId.toUpperCase())
        } else {
            setError("Your Web Id isn't in the right format")
            inputRef.current.clear();
        }
    }

    if (savedWebId && savedWebId.length > 0) {
        const title = "Reset Web Id?"
        return (
            <View style={styles.inputContainer}>
                <Image source={require('../img/Alta_logo_dropshadow.jpg')} />
                <Button style={styles.button} onPress={clearWebId} title={title}></Button>
            </View>
        )
    }

    return (
        <View style={styles.inputContainer}>
            <Image source={require('../img/Alta_logo_dropshadow.jpg')} />
            <Text style={styles.h3}>Enter your Alta Web Id to get started</Text>
            <Text style={{ paddingBottom: 12, ...material.body1 }}>Your Web Id can be found at the bottom of your season pass
                (make sure to put in the dashes too)</Text>
            {error && <Text style={styles.errorMessage}>{error}</Text>}
            <TextInput
                style={styles.input}
                defaultValue={webId}
                onChangeText={setWebId}
                autoCorrect={false}
                ref={inputRef}>
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
        borderRadius: 9,
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignContent: 'center',
        bottom: 40,
        top: 20,
        width: '90%',
    },
    button: {

    },
    h3: {
        ...material.title,
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        fontSize: 22,
        paddingVertical: 8,
    },
})



export default WebIdEntryForm;