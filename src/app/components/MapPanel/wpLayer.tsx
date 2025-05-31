
/**
 * React component that renders a GeoJSON layer of waypoints on a Leaflet map.
 *
 * @param waypoints - Array of waypoint objects to display on the map.
 * @param circuitDispatch - Dispatch function for circuitReducer actions, used to handle waypoint interactions.
 *
 * The component:
 * - Converts waypoints to a GeoJSON FeatureCollection.
 * - Renders each waypoint as a colored circle marker (green or red based on style).
 * - Binds popup tooltips to each marker showing the waypoint name on mouseover.
 * - Updates popup position on mousemove and closes it on mouseout.
 * - Handles marker click events to dispatch an 'add_wp' action with the waypoint's data.
 *
 * @returns A GeoJSON layer component for use within a react-leaflet map.
 */

import React, { useMemo } from 'react';
import { GeoJSON } from 'react-leaflet';
import { LatLng, Layer } from 'leaflet';
import L from 'leaflet';
import { Feature,  Geometry} from 'geojson';
import { WaypointType } from '@/app/lib/waypoints';
import { Point } from 'leaflet';
import { circuitReducerActionType } from '@/app/lib/circuitReducer';


export default function WPLayer ({waypoints, circuitDispatch}: {waypoints: WaypointType[], circuitDispatch: React.Dispatch<circuitReducerActionType>}) {

        // create a GeoJSON feature collection from the waypoints
        function calcGEOJSON(waypoints: WaypointType[]) : GeoJSON.FeatureCollection   {
        return {
                type: "FeatureCollection",
                features: waypoints
                        .map(waypoint => ({
                        type: "Feature",
                        geometry: {
                                type: "Point",
                                coordinates: [waypoint.lon, waypoint.lat], // Leaflet uses [lon, lat] order
                    },
                        properties: {
                                name: String(waypoint.name),
                                description: String(waypoint.desc),
                                style: waypoint.style
                        }
                }))
                }
        }
        const wpGEOJSON = useMemo(() => calcGEOJSON(waypoints), [waypoints]); // recalculate only when waypoints change, otherwise

        

        const onEachFeature = (feature:Feature<Geometry >, layer: Layer) => {
                if (feature.properties && feature.properties.name) {
                  const popupContent = feature.properties.name;
            
                  layer.on("mouseover", function (e) {
                    layer.bindPopup(popupContent).openPopup(e.latlng);
                  });
            
                  layer.on("mousemove", function (e) {
                     layer.getPopup()?.setLatLng(e.latlng);
                  });
            
                  layer.on("mouseout", function () {
                    layer.closePopup();
                  });
                }
              };

        const pointToLayer = ((geoJsonPoint: Feature<Point | any, any>, latlng: LatLng) => { // eslint-disable-line
 
                const color : string = [2, 4,5].includes(Number(geoJsonPoint.properties?.style)) ? 'green': 'red'
                const marker  =  
                         L.circleMarker(latlng, {
                                radius: 3,
                                color: color, 
                                fillColor: color,
                                fillOpacity: 0.5,
                        });     
   
                marker.on('click', (e) => {
                        circuitDispatch({ type: 'add_wp', payload: { wp: { name: geoJsonPoint.properties.name, lat: e.latlng.lat, lon: e.latlng.lng} } });
                })
                return marker;
        
        })


        return (
            <GeoJSON data={wpGEOJSON} onEachFeature={onEachFeature} pointToLayer={pointToLayer}/>            
        )
    }

        

