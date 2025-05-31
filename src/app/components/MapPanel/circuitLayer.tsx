

/**
 * React component that renders a circuit layer on a Leaflet map using GeoJSON features.
 * 
 * This component visualizes a circuit by displaying its waypoints as numbered circle markers
 * and connecting them with a line. The markers and line are generated from the provided `circuit` prop.
 * 
 * @param circuit - The circuit data containing waypoints to be displayed on the map.
 * @param circuitDispatch - The dispatch function for circuit reducer actions (currently unused).
 * 
 * @returns A GeoJSON layer containing the circuit's waypoints and connecting path, styled appropriately.
 * 
 * @remarks
 * - Each waypoint is rendered as a blue circle marker with a permanent tooltip showing its index.
 * - The path connecting the waypoints is rendered as a GeoJSON LineString.
 * - Styling is applied via a CSS module.
 */


import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import { LatLng,  } from 'leaflet';
import L from 'leaflet';
import { Feature, } from 'geojson';
import { circuitReducerActionType, CircuitType } from '@/app/lib/circuitReducer';
import styles from './map.module.css'; // Assuming you have a CSS module for styling
import { Point } from 'geojson';


export default function MapCircuitLayer ({circuit, circuitDispatch} : {circuit: CircuitType, circuitDispatch: React.Dispatch<circuitReducerActionType>}) { //eslint-disable-line @typescript-eslint/no-unused-vars

const [circuitGEOJSON, setcircuitGEOJSON] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry>>({
            type: "FeatureCollection",
            features: [],
        })

        // create a GeoJSON feature collection from the circuit waypoints
        useEffect ( () => {
        setcircuitGEOJSON({
            type: "FeatureCollection",  
            features: [
                ...circuit.waypoints.map<GeoJSON.Feature<GeoJSON.Point>>((waypoint, index) => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [waypoint.lon, waypoint.lat],
                    },
                    properties: {
                        index : index +1
                    }
                })),
                {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: circuit.waypoints.map(wp => [wp.lon, wp.lat]),
                    },
                    properties: {
                        name: "Circuit Path",
                        style: 1,
                        description: "Path connecting the waypoints in the circuit",
                    }
                }
            ]
        })}, [circuit]); 


        // const map = useMap();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pointToLayerCircuit = ((geoJsonPoint: Feature<Point, any>, latlng: LatLng) => {

                const circle = L.circleMarker(latlng, {
                        radius: 10,
                        color: 'blue',
                        fillColor: 'blue',
                        fillOpacity: 0.5,
                        interactive: false
                });

                // add a tooltip to the circle marker
                circle.bindTooltip(`${geoJsonPoint.properties.index}`, {
                        permanent: true,
                        direction: 'auto',
                        className: styles['circuit-tooltip'], 
                        interactive: false, 
                });

                return circle
        }
        )       

        return (<GeoJSON
                data={circuitGEOJSON}
                 key={JSON.stringify(circuitGEOJSON)}
                 pointToLayer={pointToLayerCircuit}     
                />)

}

