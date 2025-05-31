
import { CircuitType } from "@/app/lib/circuitReducer";
import { Button } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';



function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename // set your desired file name here
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function TaskGenerator ({circuit} :{circuit: CircuitType    }) {

    function handleClick (){

        const taskDoc = new Document()
        const rootNode = taskDoc.createElement ("Task")
        taskDoc.appendChild(rootNode)
        circuit.waypoints.forEach ( (wp, index) => {
            const node = taskDoc.createElement ("Point")

            let type=''

            if (index==0)
                type = 'Start'
            else if (index == circuit.waypoints.length - 1)
                type = 'Finish'
            else
                type = 'Turn'
            node.setAttribute("type", type)
            rootNode.appendChild(node)
            
            const wpNode  = taskDoc.createElement ("Waypoint")
            wpNode.setAttribute("name", wp.name)

            node.appendChild(wpNode)

            const locNode = taskDoc.createElement ("Location")
            locNode.setAttribute("latitude", String(wp.lat))
            locNode.setAttribute("longitude", String (wp.lon))
            wpNode.appendChild(locNode)

            const obsNode = taskDoc.createElement("ObservationZone")
            if (type == 'Turn') { // point de virage
                // obsNode.setAttribute ("radius", "1000")
                obsNode.setAttribute ("type", "FAISector")
            } else { // start ou finish
                obsNode.setAttribute ("type", "Line")
                obsNode.setAttribute ("length", "1000")

            }
 
            node.appendChild(obsNode)

        })

        const serializer = new XMLSerializer()
        const out = serializer.serializeToString(taskDoc)

        // download file
        const blob = new Blob ([out], {type: "text/plain"})
        downloadBlob(blob, "task.tsk")

    }

    return (
        <>
        <h2>Génération de fichier <code>.tsk</code> (pour XCSoar)</h2>

        <p>
            Cliquez sur le bouton ci-dessous pour générer un fichier <code>.tsk</code> compatible avec XCSoar. 
        </p><br/>
        <p>La tâche sera de type "Circuit FAI" - le premier et le dernier 
            point de virage seront représentées par zones d'observation de type 'lignes' de 1000m de longueur. Les autres points de virage seront des zones d'observation
            de type 'quadrants FAI' d'angle 90° et de longueur infinie. 
        </p>

        <Button 
        sx={{ mt: 2, mb:2 }}
                onClick={() => handleClick()} 
                startIcon={<DownloadIcon/>}
                disabled ={circuit.waypoints.length <1}
                variant="contained"
                size="small"
            >Générer le ficher </Button>


        <p>
            Le fichier généré devra être placé dans le répertoire <code>tasks</code> de XCSoar (généralement dans le dossier <code>/android/media/org.xcsoar</code>)
        </p>
        </>
    )
}