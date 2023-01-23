import { ScrollView, ActivityIndicator } from "react-native"
import DailyRides from "../components/DailyRides"
import SummaryTable from "../components/SummaryTable"


function DailyStatsView({ ridesData, lastRefreshTime, refreshControl }) {
    if (!ridesData) {
        return <ActivityIndicator size={'large'} />
    }
    return <ScrollView style={{ flexDirection: 'column' }}>
        <DailyRides ridesData={ridesData}
            lastRefreshTime={lastRefreshTime}
            refreshControl={refreshControl}
        />
        <SummaryTable ridesData={ridesData} />
    </ScrollView>
}

export default DailyStatsView