import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, Download, Edit3, History, RotateCcw, Save, Settings2, Target, Trash2 } from "lucide-react";

const KEY="control-cordajes-tenis-v3";
const durations=Array.from({length:8},(_,i)=>(i+1)*.5);
const localDate=()=>{const d=new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); return d.toISOString().slice(0,10)};
const uid=()=>`${Date.now()}-${Math.random().toString(36).slice(2)}`;
const fh=v=>`${Number(v||0).toLocaleString("es-ES",{minimumFractionDigits:1,maximumFractionDigits:1})} h`;
const fd=v=>new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}).format(new Date(`${v}T12:00:00`));
const makeRacket=(id,name)=>({id,name,targetHours:15,current:{startDate:localDate(),stringName:"",tension:"",sessions:[]},strings:[]});
const initial={rackets:[makeRacket("r1","Raqueta 1"),makeRacket("r2","Raqueta 2")]};

export default function App(){
 const [data,setData]=useState(()=>{try{return JSON.parse(localStorage.getItem(KEY))||initial}catch{return initial}});
 const [activeId,setActiveId]=useState("r1"),[view,setView]=useState("registro"),[date,setDate]=useState(localDate()),[duration,setDuration]=useState(1),[editing,setEditing]=useState(null),[notice,setNotice]=useState("");
 useEffect(()=>localStorage.setItem(KEY,JSON.stringify(data)),[data]);
 const racket=data.rackets.find(r=>r.id===activeId)||data.rackets[0];
 const total=useMemo(()=>racket.current.sessions.reduce((s,x)=>s+Number(x.hours),0),[racket]);
 const progress=Math.min(100,total/Math.max(.5,Number(racket.targetHours))*100);
 const sessions=[...racket.current.sessions].sort((a,b)=>b.date.localeCompare(a.date));
 const update=fn=>setData(d=>({...d,rackets:d.rackets.map(r=>r.id===activeId?fn(r):r)}));
 const flash=m=>{setNotice(m);setTimeout(()=>setNotice(""),2200)};
 const save=()=>{update(r=>({...r,current:{...r.current,sessions:editing?r.current.sessions.map(s=>s.id===editing?{...s,date,hours:Number(duration)}:s):[...r.current.sessions,{id:uid(),date,hours:Number(duration)}]}}));flash(editing?"Sesión actualizada":`Añadidas ${fh(duration)}`);setEditing(null)};
 const edit=s=>{setDate(s.date);setDuration(s.hours);setEditing(s.id);scrollTo({top:0,behavior:"smooth"})};
 const remove=id=>{if(confirm("¿Eliminar esta sesión?"))update(r=>({...r,current:{...r.current,sessions:r.current.sessions.filter(s=>s.id!==id)}}))};
 const reset=()=>{if(!confirm(`¿Finalizar el cordaje de ${racket.name} y poner las horas a cero?`))return;const done={id:uid(),startDate:racket.current.startDate,endDate:localDate(),stringName:racket.current.stringName,tension:racket.current.tension,totalHours:total,sessions:racket.current.sessions};update(r=>({...r,strings:[done,...r.strings],current:{startDate:localDate(),stringName:"",tension:"",sessions:[]}}));setView("historico");flash("Cordaje archivado")};
 const exportCSV=()=>{const rows=[["Raqueta","Cordaje","Inicio","Fin","Horas","Sesiones","Tension"]];data.rackets.forEach(r=>r.strings.forEach((s,i)=>rows.push([r.name,s.stringName||`Cordaje ${r.strings.length-i}`,s.startDate,s.endDate,s.totalHours,s.sessions.length,s.tension||""])));const csv=rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(";")).join("\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`historico-cordajes-${localDate()}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
 return <main><div className="app">
  <header><div className="ball">●</div><div><small>TENNIS STRING TRACKER</small><h1>Mis cordajes</h1></div></header>
  <nav className="rackets">{data.rackets.map(r=><button className={activeId===r.id?"active":""} onClick={()=>setActiveId(r.id)} key={r.id}>{r.name}</button>)}</nav>
  <section className="summary"><div className="summaryTop"><div><span>Cordaje actual</span><strong>{fh(total)}</strong></div><Clock3/></div><div className="bar"><i className={progress>=100?"red":progress>=75?"amber":""} style={{width:`${progress}%`}}/></div><div className="meta"><span>Desde {fd(racket.current.startDate)}</span><span>Objetivo {fh(racket.targetHours)}</span></div>{progress>=100&&<p className="warning">Objetivo alcanzado: revisa el cordaje</p>}</section>
  <nav className="tabs">{[["registro","Registrar",Save],["historico","Histórico",History],["ajustes","Ajustes",Settings2]].map(([v,l,I])=><button className={view===v?"active":""} onClick={()=>setView(v)} key={v}><I size={17}/>{l}</button>)}</nav>
  {view==="registro"&&<><section className="card light"><label><CalendarDays size={17}/> Fecha de juego</label><input type="date" value={date} max={localDate()} onChange={e=>setDate(e.target.value)}/><label>Tiempo jugado</label><div className="times">{durations.map(h=><button className={duration===h?"active":""} onClick={()=>setDuration(h)} key={h}>{h%1===0?`${h} h`:`${Math.floor(h)}:30`}</button>)}</div><button className="primary" onClick={save}><Save size={18}/>{editing?"Actualizar sesión":`Guardar ${fh(duration)}`}</button>{editing&&<button className="cancel" onClick={()=>setEditing(null)}>Cancelar edición</button>}</section><h2>Sesiones actuales</h2>{sessions.length===0?<p className="empty">Todavía no hay sesiones.</p>:sessions.map(s=><article className="session" key={s.id}><div>{fd(s.date)}<strong>{fh(s.hours)}</strong></div><div><button onClick={()=>edit(s)}><Edit3 size={17}/></button><button className="danger" onClick={()=>remove(s.id)}><Trash2 size={17}/></button></div></article>)}<button className="reset" onClick={reset}><RotateCcw size={18}/>Cambiar cordaje / poner a cero</button></>}
  {view==="historico"&&<><button className="primary export" onClick={exportCSV}><Download size={18}/>Exportar histórico CSV</button>{racket.strings.length===0?<p className="empty">Aún no hay cordajes finalizados.</p>:racket.strings.map((s,i)=><article className="history" key={s.id}><div><small>{s.stringName||`Cordaje ${racket.strings.length-i}`}</small><b>{fd(s.startDate)} → {fd(s.endDate)}</b><span>{s.sessions.length} sesiones{s.tension?` · ${s.tension} kg`:""}</span></div><strong>{fh(s.totalHours)}</strong></article>)}</>}
  {view==="ajustes"&&<section className="card light"><label>Nombre de la raqueta</label><input value={racket.name} onChange={e=>update(r=>({...r,name:e.target.value}))}/><label><Target size={17}/> Aviso de cambio</label><select value={racket.targetHours} onChange={e=>update(r=>({...r,targetHours:Number(e.target.value)}))}>{[5,7.5,10,12.5,15,17.5,20,25,30].map(h=><option key={h}>{h}</option>)}</select><label>Cordaje actual</label><input placeholder="Ej. Head Lynx Tour 1.25" value={racket.current.stringName} onChange={e=>update(r=>({...r,current:{...r.current,stringName:e.target.value}}))}/><label>Tensión (kg)</label><input type="number" inputMode="decimal" placeholder="Ej. 23" value={racket.current.tension} onChange={e=>update(r=>({...r,current:{...r.current,tension:e.target.value}}))}/></section>}
  {notice&&<div className="toast">{notice}</div>}
 </div></main>
}
