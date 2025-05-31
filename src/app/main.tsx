
"use client"

import styles from "./page.module.css";
import Table from "./components/CircuitTablePanel";


// react-leaftlet utilise l'objet window -- SSR désactivé!
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('./components/MapPanel/index'), {
  ssr: false,
  loading: () => (
    <div style={{textAlign: 'center', paddingTop: 20}}>
      Chargement…
    </div>
  )
})

import TaskGenerator from "./components/XCSoarTaskGeneratorPanel";
import CUPGenerator from "./components/SeeYouCUPGeneratorPanel";



import {   WaypointType } from "./lib/waypoints";
import React, { ReactNode,   useReducer,} from "react";   
import { circuitReducer } from "./lib/circuitReducer";
import { Stack } from "@mui/material";
import FLARMGeneratorPanel from "./components/FLARMGeneratorPanel";



function Panel ({children}: {children: ReactNode})
{

  return (<div className={styles.panel}>
    {children}
  </div>
  )
}


 export default function Main({waypoints}: {waypoints: WaypointType[]}) {

  const [circuitState, circuitDispatch] = useReducer(circuitReducer, { waypoints:[]})
  

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Stack spacing={8}>

        <Panel>
          <h1>Configurateur de circuits pour le vol à voile
          </h1>
          <p>
            Cette application permet de créer facilement un circuit de vol grâce à une carte interactive et une base de points de virage intégrée. Une fois le circuit finalisé, 
            il peut être exporté en fichier <code>.tsk</code>, compatible avec XCSoar ou <code>flarmcfg.txt</code> pour des appareils FLARM. 
          </p>
        </Panel>

        <Panel>
          <div className={styles['map-container']}>
            <Map waypoints={waypoints} circuitDispatch={circuitDispatch} circuit={circuitState}/> 
          </div>
        </Panel>
                <Panel>
            <Table circuit={circuitState} circuitDispatch={circuitDispatch}/>    
        </Panel>
        <Panel><TaskGenerator circuit={circuitState}/></Panel>
          
          <Panel><CUPGenerator circuit={circuitState}/></Panel>

            <Panel><FLARMGeneratorPanel circuit={circuitState}/></Panel>

        </Stack>
      </main>

    </div>
  );
}
