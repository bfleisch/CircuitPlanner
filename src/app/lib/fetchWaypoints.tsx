

import { WaypointType, parseCoordinate } from './waypoints';

import fs from 'node:fs'
import csv from "csv-parser"

const WAYPOINTS_FILE = './public/waypoints.cup';


export async function getWaypoints(): Promise<WaypointType[]>  {


    const data : WaypointType [] = [];
    if (!fs.existsSync(WAYPOINTS_FILE)) {
        console.error(`Waypoints file not found: ${WAYPOINTS_FILE}`);
        return data; // Return empty array if file does not exist
    }
    return new Promise<WaypointType[]>((resolve, reject) => {
        fs.createReadStream(WAYPOINTS_FILE, { encoding: 'utf8' })
        .pipe (csv())
        .on('data',  (row: WaypointType) => { data.push({
            ...row,
            lat: parseCoordinate(row.lat as unknown as string),
            lon: parseCoordinate(row.lon as unknown as string),
        }); })
        .on ('end', () => { resolve(data); })
        .on('error', (error: Error) => { reject(error); })
    }
    )
}