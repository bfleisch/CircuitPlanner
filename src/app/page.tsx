import { getWaypoints } from "./lib/fetchWaypoints";
import Main from "./main"

export default async function App() {

    const waypoints = await getWaypoints()
    
    return (<Main waypoints={waypoints}/>)
}