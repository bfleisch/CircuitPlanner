

import { CircuitType } from "@/app/lib/circuitReducer";
import { decimalToCoord } from "@/app/lib/waypoints";
import { Button,Box } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


export default function CUPGenerator ({circuit} :{circuit: CircuitType    }) {
function handleClick () {
    // CUP header
    let out = "name,code,country,lat,lon,elev,style,rwdir,rwlen,rwwidth,freq,desc,userdata,pics\n";

    // Waypoints section
    circuit.waypoints.forEach((wp) => {
        const latStr = decimalToCoord(wp.lat, true);
        const lonStr = decimalToCoord(wp.lon, false);
        // Escape double quotes in the waypoint name for CSV
        const safeName = wp.name.replace(/"/g, '""');
        out += [
            `"${safeName}"`,
            wp.code || "",
            wp.country || "",
            latStr,
            lonStr,
            wp.elev ?? "",
            wp.style ?? "",
            "", "", "",
            "",
            wp.desc ?? "",
            "",
            ""
        ].join(",") + "\n";
    });

    // Task section
    out += "\n-----Related Tasks-----\n";
    out += "\"Circuit généré par l'outil Circuit Planner\",";
    out +=  '"",' + circuit.waypoints.map(wp => `"${wp.name.replace(/"/g, '""')}"`).join(",") + ',""\n';
    out +=  circuit.waypoints.map((wp, idx) => {
        if (idx === 0) { // start
            return `ObsZone=${idx},Style=2,R1=500m,Line=1`;
        } else  if  ( idx === circuit.waypoints.length - 1){ // finish
            return `ObsZone=${idx},Style=3,R1=500m,Line=1`;
        } else { // autres
            return `ObsZone=${idx},Style=2,A1=45,R1=10000m`;
        }
    }).join("\n");

    // Download as .cup
    const blob = new Blob([out], {type: "text/plain"});
    downloadBlob(blob, "task.cup");
}

    return (
        <>
        <h2>Génération de fichier <code>.cup</code> (pour SeeYou / Oudie)</h2>

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
      >

        <p>
            Cliquez sur le bouton ci-dessous pour générer un fichier <code>.cup</code> compatible avec SeeYou / Oudie. 
        </p><br/>
        <p>La tâche sera de type "Circuit FAI" - le premier et le dernier 
            point de virage seront représentées par zones d'observation de type 'lignes' de 1000m de longueur. Les autres points de virage seront des zones d'observation
            de type 'quadrants FAI' d'angle 90° et de longueur infinie. 
        </p>
        </Box>

            <Button  sx={{ mt: 2 }}
                onClick={() => handleClick()} 
                startIcon={<DownloadIcon/>}
                disabled ={circuit.waypoints.length <1}
                variant="contained"
                size="small"
            >Générer le ficher </Button>

     
        </>
    )
}