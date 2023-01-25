import { StyleSheet } from "react-native";

import { material } from "react-native-typography";

export const ALTA_BLUE = '#323582';

export const ALTA_RED = '#C4332E';

export const GlobalStyles = StyleSheet.create({
    scrollViewContainer: {
        flex: 1,
        paddingTop: 22,
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 16,
    },
    viewContainer: {
        flex: 1,
        paddingTop: 22,
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    h1: {
        paddingBottom: 12,
        ...material.display2,
        color: ALTA_BLUE,
    },
    h2: {
        ...material.headline,
        color: ALTA_BLUE,
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
    td: {
        borderWidth: 1,
        flex: 1,
        padding: 4,
        ...material.body1,
    },
    th: {
        borderWidth: 1,
        flex: 1,
        padding: 4,
        ...material.body2,
    },
    tr: {
        flexDirection: "row",
    },
    table: {
        marginBottom: 24,
        paddingBottom: 24,
        marginTop: 12,
    },
    bubble: {
        flexDirection: "row",
        borderColor: "#323582",
        borderWidth: 2,
        borderRadius: 4,
        backgroundColor: "#323582",
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
    },
});