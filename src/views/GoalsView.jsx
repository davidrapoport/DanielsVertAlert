import { ScrollView, View, Text } from "react-native";
import SeasonVertProgressBar from "../components/SeasonVertProgressBar";
import BadgesView from "../components/BadgeView";
import { GlobalStyles } from "../GlobalStyles";
import { ActivityIndicator } from "react-native";

function GoalsView({ ridesData, vertGoal }) {
    if (!vertGoal) {
        return <ActivityIndicator size={'large'} style={{ marginTop: 100 }} />;
    }
    return (
        <ScrollView style={GlobalStyles.scrollViewContainer}>
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={GlobalStyles.h1}>Your Season Goals</Text>
                <SeasonVertProgressBar ridesData={ridesData} goalVert={vertGoal} />
            </View>
            <BadgesView ridesData={ridesData} />
        </ScrollView>
    );
}

export default GoalsView;