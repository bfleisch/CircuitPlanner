import { IconButton, Input, TableContainer,  } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import UpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import DownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { circuitReducerActionType, CircuitType } from "../../lib/circuitReducer";

import styles from "./table.module.css"; // Importing the CSS module for styling


//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1: number, lon1: number, lat2: number, lon2:number) 
{
    const R = 6371; // km
    const dLat = toRad(lat2-lat1);
    const dLon = toRad(lon2-lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c;
    return d;
}

// Converts numeric degrees to radians
function toRad(Value: number) 
{
    return Value * Math.PI / 180;
}

// This function calculates the total distance of the circuit by summing up the distances between consecutive waypoints
function sumDistance (waypoints: CircuitType['waypoints']) {
    return waypoints.reduce((acc, wp, index) => {
        if (index === 0) return acc; // Skip the first waypoint as there's no previous one to compare
        const prevWp = waypoints[index - 1];
        return acc + calcCrow(prevWp.lat, prevWp.lon, wp.lat, wp.lon);
    }
, 0)};

// This component renders the editable name input for each waypoint
function WPEditableName({wp, index, circuitDispatch}: 
    {wp: CircuitType['waypoints'][number], index: number, circuitDispatch: React.Dispatch<circuitReducerActionType>}) {
    return (
        <Input value={wp.name} disableUnderline size="small"
            onChange={(e)=>circuitDispatch({  type: 'wp_rename', payload: {idx: index, new_name: e.target.value}} )}/>
        )
}

// This is the main component that renders the table of waypoints
export default function WPTable({circuit, circuitDispatch}: {circuit: CircuitType  , circuitDispatch: React.Dispatch<circuitReducerActionType>}) {
    return (<div>
            <h2>Tableau des points de virage</h2>
            <p>
                Le tableau suivant indique les points de virage du circuit ainsi que leur ordre de passage. 
            </p>
            <br/>
            <p >
                Pour modifier l'ordre de passage, cliquez sur les chevrons (<UpIcon style={{display: 'inline'}}/> et <DownIcon/>) pour avancer ou reculer un point 
                particulier. Les points de passages peuvent être renomés directement dans le tableau.
            </p>
            <br/>


            <TableContainer>

                <Table className={styles['circuit-table']} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Points de virage</TableCell>
                            <TableCell>Latitude</TableCell>
                            <TableCell>Longitude</TableCell>
                            <TableCell>Km branche</TableCell>
                            <TableCell>Km total</TableCell>
                            <TableCell>Actions</TableCell> 
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    


                        {circuit.waypoints.map((wp, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{WPEditableName({wp, index, circuitDispatch})}</TableCell>
                                    <TableCell>{wp.lat.toFixed(6)}</TableCell>
                                    <TableCell>{wp.lon.toFixed(6)}</TableCell>
                                    <TableCell>{sumDistance(circuit.waypoints.slice (index-1, index+1)).toFixed(0)}</TableCell>
                                    <TableCell>{sumDistance(circuit.waypoints.slice(0, index+1)).toFixed(0)}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => circuitDispatch({ type: 'remove_wp', payload: { idx: index } })}>
                                            <DeleteIcon  />
                                        </IconButton>

                                        <IconButton onClick={() => circuitDispatch({ type: 'wp_move_up', payload: { idx: index } })}
                                            disabled={index == 0}>
                                            <UpIcon  />
                                        </IconButton>

                                        <IconButton onClick={() => circuitDispatch({ type: 'wp_move_down', payload: { idx: index } })}
                                            disabled={index == circuit.waypoints.length - 1}>
                                            <DownIcon  />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
            
            </div>
    );
}