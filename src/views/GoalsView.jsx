import { ScrollView, Text } from "react-native";
import SeasonVertProgressBar from "../components/SeasonVertProgressBar";
import BadgesView from "../components/BadgeView";
import { GlobalStyles } from "../GlobalStyles";

function GoalsView({ ridesData, refreshControl }) {
    return (
        <ScrollView style={GlobalStyles.scrollViewContainer}>
            <Text style={GlobalStyles.h1}>Your Season Goals</Text>
            <SeasonVertProgressBar ridesData={ridesData} goalVert={1000000} />
            <BadgesView ridesData={ridesData} />
        </ScrollView>
    );
}

export default GoalsView;