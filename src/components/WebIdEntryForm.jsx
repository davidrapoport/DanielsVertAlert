import { Button, TextInput, View, Text, StyleSheet, Image, KeyboardAvoidingView } from "react-native";

import { useRef, useState } from "react";
import { material } from "react-native-typography";
import { GlobalStyles } from "../GlobalStyles";

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

    const changeText = text => {
        if (text.length === 8 || text.length === 12) {
            text = text + '-';
        }
        if (text.endsWith('--')) {
            text = text.substring(0, text.length - 1);
        }
        setWebId(text);
    }

    if (savedWebId && savedWebId.length > 0) {
        const title = "Reset Web Id?"
        return (
            <View style={GlobalStyles.viewContainer}>
                <Image source={require('../img/Alta_logo_dropshadow.jpg')} />
                <Button onPress={clearWebId} title={title}></Button>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={GlobalStyles.viewContainer}>
                <Image source={require('../img/Alta_logo_dropshadow.jpg')} />
                <Text style={GlobalStyles.h3}>Enter your Alta Web Id to get started</Text>
                <Text style={{ paddingBottom: 12, ...material.body1, marginHorizontal: 12 }}>
                    Your Web Id can be found at the bottom of your season pass
                </Text>
                {error && <Text style={GlobalStyles.errorMessage}>{error}</Text>}
                <TextInput
                    style={styles.input}
                    defaultValue={webId}
                    onChangeText={changeText}
                    autoCorrect={false}
                    ref={inputRef}>
                </TextInput>
                <Button onPress={onClickUpdateWebId} title="Check my Vert"></Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    input: {
        borderColor: 'black',
        borderWidth: 3,
        padding: 20,
        borderRadius: 9,
        marginBottom: 12,
        marginHorizontal: 12,
        alignSelf: 'stretch',
    },
})



export default WebIdEntryForm;