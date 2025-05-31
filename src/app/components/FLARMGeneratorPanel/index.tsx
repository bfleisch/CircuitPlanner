
// https://www.flarm.com/wp-content/uploads/2024/04/FTD-014-FLARM-Configuration-Specification-1.16.pdf


import React, { useState } from "react";
import { Box, Button, TextField, } from "@mui/material";
import { CircuitType } from "@/app/lib/circuitReducer";
import {decimalToCoord, WaypointType} from "@/app/lib/waypoints"
import DownloadIcon from '@mui/icons-material/Download';


export default function FLARMGeneratorPanel({ circuit }: { circuit: CircuitType }) {
  const [pilotId, setPilotId] = useState("");
  const [aircraft, setAircraft] = useState("");

  const handleGenerate = () => {
    // Each instruction as a separate $PFLAC directive
    const lines = [
      `$PFLAC,S,PILOT,${pilotId.slice(0,47)}`,
      `$PFLAC,S,GLIDERID,${aircraft.slice(0,15)}`,
      `$PFLAC,S,NEWTASK,Task`,
      `$PFLAC,S,ADDWP,0000000N,00000000E`,

      ...(circuit.waypoints || []).map(
        (wp: WaypointType) =>
          `$PFLAC,S,ADDWP,${decimalToCoord (wp.lat, true)},${decimalToCoord(wp.lon, false)},${wp.name.slice(0,50)}`
      ),
      `$PFLAC,S,ADDWP,0000000N,00000000E`,
    ];

    const content = lines.join("\r\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "flarmcfg.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (<>
    <h2>Déclaration pour FLARM</h2>

    <p>Remplissez les informations ci-dessous et cliquez sur le bouton pour générer 
        un fichier <code>flarmcfg.txt</code> qui contiendra la déclaration du circuit pour votre FLARM.  
    </p>
    <br/>

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <TextField
          label="Nom du pilote"
          value={pilotId}
          onChange={e => setPilotId(e.target.value)}
          required
        />
        
        <TextField
          label="Immatriculation du planeur (F-XXXX)"
          value={aircraft}
          onChange={e => setAircraft(e.target.value)}
          required
        />
             </Box>
 
        <Button 
            type="submit" variant="contained" sx={{ mt: 2 }}
            disabled={ aircraft=='' || pilotId=='' || circuit.waypoints.length < 1 }
            onClick={()=>handleGenerate()}
            startIcon={<DownloadIcon/>}
            size="small"    
        >
          Générer le fichier
        </Button>
</>
  );
}