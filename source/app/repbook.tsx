'use client';
import {useState} from 'react';
import {Dumbbell,Utensils,Scale} from 'lucide-react';
import Tracker from './tracker';
import HealthTracker from './health-tracker';
export default function Repbook(){const [view,setView]=useState<'workouts'|'nutrition'|'weight'>('workouts');return <><div className="shell"><header><a className="brand" href="/"><span className="brand-icon"><Dumbbell/></span>repbook<span className="brand-dot">.</span></a><span className="header-note">TRAIN / FUEL / GROW</span><span className="profile">SP</span></header><nav className="app-nav" aria-label="Main sections">{([{key:'workouts',label:'Workouts',Icon:Dumbbell},{key:'nutrition',label:'Nutrition',Icon:Utensils},{key:'weight',label:'Weight',Icon:Scale}] as const).map(({key,label,Icon})=><button key={key} aria-current={view===key?'page':undefined} className={view===key?'active':''} onClick={()=>setView(key)}><Icon size={18}/>{label}</button>)}</nav></div><div hidden={view!=='workouts'}><Tracker/></div>{view!=='workouts'&&<HealthTracker view={view}/>}</>}
