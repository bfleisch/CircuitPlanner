


export type WaypointType = {
// name,code,country,lat,lon,elev,style,rwdir,rwlen,rwwidth,freq,desc,userdata,pics
    name: string,
    code?:string,
    country?:string, 
    lat:number , // string for csv parsing, number for calculations
    lon:number , // string for csv parsing, number for calculations
    elev?: number,
    style?:number
    desc?: number
}
  


 // Convert waypoints to GeoJSON format

 export function parseCoordinate(coord: string) {

    if (!coord || coord.length < 4) {
            // console.error("Invalid coordinate format:", coord);
            return 0; // 

    }
    // pad coord with leading zeros if necessary
    if (coord.length < 10) {
            coord = coord.padStart(10, '0');} 
    // Extract the direction (last character)
    const direction = coord.slice(-1);
    
    // Extract the degrees and minutes
    const degrees = parseInt(coord.slice(0, 3), 10); // First three characters
    const minutes = parseFloat(coord.slice(3, -1)); // Characters after degrees, excluding the direction
    
    // Convert to decimal degrees
    let decimalDegrees = degrees + (minutes / 60);
    
    // Apply the sign based on the direction
    if (direction === 'S' || direction === 'W') {
        decimalDegrees *= -1;
    }
    
    return decimalDegrees;
}
    
export function decimalToCoord(decimal: number, isLat: boolean): string {
    const abs = Math.abs(decimal);
    const degrees = Math.floor(abs);
    const minutes = (abs - degrees) * 60;
    const degWidth = isLat ? 2 : 3;
    const direction = isLat
        ? (decimal >= 0 ? 'N' : 'S')
        : (decimal >= 0 ? 'E' : 'W');
    const degStr = degrees.toString().padStart(degWidth, '0');
    const minStr = minutes.toFixed(3).padStart(6, '0');
    return `${degStr}${minStr}${direction}`;
}

