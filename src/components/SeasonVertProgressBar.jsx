import { differenceInDays, isAfter } from "date-fns";
import { addDays } from "date-fns/esm";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from 'react-native-progress';
import { material } from "react-native-typography";
import { ALTA_BLUE, GlobalStyles } from "../GlobalStyles";
import { getCurrentDateAlta, getMeanVert, getNumRestDays } from "../RideUtils";

function SeasonVertProgressBar({ goalVert, ridesData }) {
    const meanVert = getMeanVert(ridesData);
    const numRestDays = getNumRestDays(ridesData);
    const daysSkied = ridesData.length;
    const seasonVert = ridesData.reduce((acc,
        { totalVert }) => { return acc + totalVert }, 0);
    // TODO: Make season agnostic.
    const seasonEnd = new Date("2023-04-23");
    const today = getCurrentDateAlta();
    if (isAfter(today, seasonEnd)) {
        return (
            <View>
                <Text style={style.text}>
                    The season's over, go raft guide or something.
                </Text>
            </View>
        )
    }
    const daysLeft = differenceInDays(seasonEnd, today);
    const skiRatio = daysSkied / (daysSkied + numRestDays);
    const projectedVert = skiRatio * daysLeft * meanVert + seasonVert;
    const percentMet = Math.min(seasonVert / Math.max(goalVert, 1), 1);
    let text = "You're skiing " + Math.round(skiRatio * 100) + "% of the days and averaging " +
        meanVert.toLocaleString() + " feet a day with " + daysLeft + " days left in the season.";
    if (percentMet === 1) {
        text = "Congrats, you've met your season vert goal. Now get back to work."
    } else if (projectedVert >= goalVert) {
        const vertRemaining = goalVert - seasonVert;
        const daysToSki = Math.ceil(vertRemaining / (meanVert * skiRatio));
        const projectedFinishDay = addDays(today, daysToSki);
        text += " You're projected to meet your vert goal on " +
            projectedFinishDay.toLocaleDateString() +
            ". Keep up the good work!"
    } else {
        text += " At this rate, you won't meet your vert goal. You'll only get " +
            Math.round(projectedVert).toLocaleString() + " feet by closing day. You'd better start having" +
            " your prep cooks make your soup for you."
    }

    return <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <Text style={{ ...material.title, flexWrap: 'wrap', paddingTop: 12 }}>
            Your Vert Goal: {goalVert.toLocaleString()} feet
        </Text>
        <View style={{ paddingVertical: 16, flexDirection: "row", alignItems: "center" }}>
            <Progress.Bar progress={percentMet} height={12} />
        </View>
        <Text style={{ ...style.text, color: ALTA_BLUE }}>{text}</Text>
    </View >;
}

const style = StyleSheet.create({
    text: {
        ...material.subheading,
        flexWrap: 'wrap',
    }
})

export default SeasonVertProgressBar;