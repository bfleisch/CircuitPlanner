
import { WaypointType } from "./waypoints"


export type circuitReducerActionType = 
  | { type: "add_wp"; payload: { wp: WaypointType } }
  | { type: "remove_wp"; payload: { idx: number } }
  | { type: "update_wp"; payload: { idx: number, new_wp: WaypointType } }
  | { type: "wp_move_up"; payload: { idx: number } }
  | { type: "wp_move_down"; payload: { idx: number } }
  | { type: "wp_rename"; payload: { idx: number, new_name: string } }

export type CircuitType = {
  waypoints: WaypointType[];
}

export function circuitReducer(state: CircuitType, action: circuitReducerActionType): CircuitType {
  switch (action.type) {
    case "add_wp":
      return {
        ...state,
        waypoints: [...state.waypoints, action.payload.wp],
      };
    case "remove_wp":
      return {
        ...state,
        waypoints: state.waypoints.filter((_, index) => index !== action.payload.idx),
        };  
        case 'wp_move_down':
      const wpToMoveDown = state.waypoints[action.payload.idx];
      if (action.payload.idx < state.waypoints.length - 1) {
        const newWaypoints = [...state.waypoints];
        newWaypoints.splice(action.payload.idx, 1); // Remove the waypoint from its current position
        newWaypoints.splice(action.payload.idx + 1, 0, wpToMoveDown); // Insert it at the next position
        return {
          ...state,
          waypoints: newWaypoints,
        };
      }
      return state; // No change if already at the bottom
      
      case 'wp_move_up': 
        const wpToMoveUp = state.waypoints[action.payload.idx];
        if (action.payload.idx > 0) {
          const newWaypoints = [...state.waypoints];
          newWaypoints.splice(action.payload.idx, 1); // Remove the waypoint from its current position        
          newWaypoints.splice(action.payload.idx - 1, 0, wpToMoveUp); // Insert it at the previous position
          return {
            ...state,
            waypoints: newWaypoints,
          };
          }
          return state; // No change if already at the top
        
        case 'wp_rename': 
        if (!action.payload.new_name || action.payload.new_name.trim() === '')  return state; // No change if new name is empty or whitespace
          const updatedWaypoints = state.waypoints.map((wp, index) => {
            if (index === action.payload.idx) {
              return { ...wp, name: action.payload.new_name  };
            }
            return wp;
          })
          return {
            ...state,
            waypoints: updatedWaypoints,
          }
      
    
      default:
        return state;
  }
}

