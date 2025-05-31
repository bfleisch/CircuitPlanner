
import { WaypointType } from '../../lib/waypoints';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField, Container } from '@mui/material';
import styles from './map.module.css'

// This component provides a search functionality for waypoints on the map
// It allows users to search for waypoints by name and centers the map on the selected waypoint.

export default function MapSearchBar ({waypoints,
} : {waypoints: WaypointType[], }) {


        const map = useMap();
        const ref = useRef<HTMLDivElement>(null);
        
        useEffect(() => {
        if (ref.current) {
            L.DomEvent.disableClickPropagation(ref.current);
        }
    });

        const onSearchChange = (value: string) => {
                const waypoint = waypoints.find(waypoint =>
                        waypoint.name.toLowerCase().includes(value.toLowerCase())
                );
                if (!waypoint) {
                        console.log("No waypoint found for search value:", value);
                        return;
                }
               map.setView([waypoint.lat, waypoint.lon], 13); // Adjust the zoom level as needed
               map.eachLayer ((layer) => {
                        if ((layer instanceof L.Marker || layer instanceof L.CircleMarker) && layer.getLatLng().equals([waypoint.lat, waypoint.lon])) {
                                                    layer.bindPopup(waypoint.name).openPopup([waypoint.lat, waypoint.lon]);

                        }
                })
        }

        return (
                <Container className={styles["map-search"]} ref={ref} >
                
                        <Autocomplete
                                options={waypoints.map((waypoint) => waypoint.name)}
                                renderInput={(params) => <TextField 
                                        {...params} 
                                        placeholder="Rechercher un point de virage" 
                                       
                                        ></TextField>}
                                                
                                onChange={(event, value) => {onSearchChange(value || '');}}
                                className={styles['map-search-input']}
                                autoComplete
                
                        />
                </Container>
        );
}
