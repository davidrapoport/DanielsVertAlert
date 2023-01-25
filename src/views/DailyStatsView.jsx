import { View, ActivityIndicator } from "react-native"
import DailyRides from "../components/DailyRides"
import SummaryTable from "../components/SummaryTable"
import { GlobalStyles } from "../GlobalStyles"


function DailyStatsView({ ridesData, lastRefreshTime, refreshControl }) {
    if (!ridesData) {
        return <ActivityIndicator size={'large'} />
    }
    return <View style={GlobalStyles.viewContainer}>
        <DailyRides ridesData={ridesData}
            lastRefreshTime={lastRefreshTime}
            refreshControl={refreshControl}
            footerComponent={<SummaryTable ridesData={ridesData} />}
        />
    </View>
}

export default DailyStatsView