

import { MapContainer, TileLayer,  useMapEvents} from 'react-leaflet'
import { WaypointType } from '../../lib/waypoints';
import { circuitReducerActionType, CircuitType } from '@/app/lib/circuitReducer';

import MapSearchBar from './searchBar';
import MapCircuitLayer from './circuitLayer';
import WPLayer from './wpLayer';


const defaultLatLong : [number, number]=  [45.6542015, 4.91361] // CORBAS !! 


const MAP_BASE_URL = process.env.NEXT_PUBLIC_MAP_BASE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const MAP_BASE_ATTRIBUTION = process.env.NEXT_PUBLIC_MAP_BASE_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';


const MAP_EXT_URL = process.env.NEXT_PUBLIC_MAP_EXT_URL || undefined
const MAP_EXT_ATTRIBUTION = process.env.NEXT_PUBLIC_MAP_EXT_ATTRIBUTION || undefined


function MapEvents({circuitDispatch, circuit} :
         {circuitDispatch: React.Dispatch<circuitReducerActionType>,
        circuit: CircuitType}) {
        useMapEvents({
                click: (e) => {
                        const existingNames = new Set(circuit.waypoints.map(wp => wp.name));
                        let name =''
                        let idx=1
                        // find unused name
                        do {
                                name = `Nouveau point de virage ${idx}`;
                                idx++;
                        } while (existingNames.has(name));

                        circuitDispatch({ type: 'add_wp', payload: { wp: { name, lat: e.latlng.lat, lon: e.latlng.lng} } });
                }
        })
        return null; // This component is used to handle map events if needed
}


export default function Map( 
        {waypoints, circuit, circuitDispatch} : 
        {waypoints: WaypointType[], circuit: CircuitType, circuitDispatch: React.Dispatch<circuitReducerActionType>})  {


    return ( 
        <>
        <h2>Carte interactive</h2>

        <p>Cliquez n'importe où sur la carte ci-dessous pour ajouter un point de virage dans le circuit. Les points rouges  et verts sont les points 
                connus dans la base de données. L'ordre des points de virage peut être changé dans le tableau en dessous. 
        </p>
        <br/>
            <MapContainer center={defaultLatLong} zoom={11} style={{height: "800px", zIndex: 0}} >

                <TileLayer url={MAP_BASE_URL} attribution={MAP_BASE_ATTRIBUTION}/>
                { MAP_EXT_ATTRIBUTION && MAP_EXT_URL && <TileLayer url={MAP_EXT_URL} attribution={MAP_EXT_ATTRIBUTION}/>
}

                <MapCircuitLayer circuit={circuit} circuitDispatch={circuitDispatch} />
                <WPLayer waypoints={waypoints} circuitDispatch={circuitDispatch} />

                <MapEvents circuitDispatch={circuitDispatch} circuit={circuit}/>
                 <MapSearchBar waypoints={waypoints}/>
                
        </MapContainer>
        </>
);
}