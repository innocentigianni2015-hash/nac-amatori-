"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import "./intro.css";

type Point = { x: number; y: number; vx: number; vy: number; r: number };

export default function IntroGate() {
  const pathname = usePathname();
  const homeRoute = pathname === "/";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible || !homeRoute) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    let width = 0, height = 0, frame = 0;
    let points: Point[] = [];
    const point = (): Point => ({ x: Math.random()*width, y: Math.random()*height, vx:(Math.random()-.5)*.34, vy:(Math.random()-.5)*.34, r:Math.random()*1.2+.7 });
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width*ratio; canvas.height = height*ratio;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(ratio,0,0,ratio,0,0);
      points = Array.from({length: width < 720 ? 90 : 210}, point);
    };
    const draw = () => {
      ctx.clearRect(0,0,width,height);
      points.forEach((p,i) => {
        if (!reduced) {
          const dx=p.x-mouse.x, dy=p.y-mouse.y, d=Math.hypot(dx,dy);
          if(d<115&&d>0){const f=(115-d)/115;p.x+=(dx/d)*f*2.1;p.y+=(dy/d)*f*2.1}
          p.x+=p.vx;p.y+=p.vy;
          if(p.x<0)p.x=width;if(p.x>width)p.x=0;if(p.y<0)p.y=height;if(p.y>height)p.y=0;
        }
        for(let j=i+1;j<points.length;j++){const q=points[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<118){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(119,201,242,${(1-d/118)*.34})`;ctx.lineWidth=.7;ctx.stroke()}}
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=i%5===0?"rgba(255,255,255,.9)":"rgba(119,201,242,.82)";ctx.fill();
      });
      frame=requestAnimationFrame(draw);
    };
    const move=(e:PointerEvent)=>{mouse.x=e.clientX;mouse.y=e.clientY};
    const leave=()=>{mouse.x=-9999;mouse.y=-9999};
    const add=(e:PointerEvent)=>{if((e.target as HTMLElement).closest("button"))return;for(let i=0;i<7;i++)points.push({...point(),x:e.clientX,y:e.clientY})};
    document.body.classList.add("intro-open");resize();draw();
    window.addEventListener("resize",resize);window.addEventListener("pointermove",move);window.addEventListener("pointerleave",leave);window.addEventListener("pointerdown",add);
    return()=>{cancelAnimationFrame(frame);document.body.classList.remove("intro-open");window.removeEventListener("resize",resize);window.removeEventListener("pointermove",move);window.removeEventListener("pointerleave",leave);window.removeEventListener("pointerdown",add)};
  },[visible,homeRoute]);
  const enter=()=>{setLeaving(true);window.setTimeout(()=>setVisible(false),720)};
  if(!visible||!homeRoute)return null;
  return <section className={`intro-gate ${leaving?"is-leaving":""}`} aria-label="Ingresso NAC Amatori Castellana"><canvas ref={canvasRef} className="intro-canvas" aria-hidden="true"/><div className="intro-glow" aria-hidden="true"/><div className="intro-content"><span className="intro-kicker">CASTEL GOFFREDO · DAL 2011</span><img src="/nac-scudetto.png" alt="NAC Amatori Castellana" className="intro-crest"/><h1>N.A.C.</h1><p>PASSIONE · UNITÀ · RISPETTO</p><button type="button" onClick={enter} className="intro-enter"><span>ENTRA NELLA SQUADRA</span><b>→</b></button></div><span className="intro-hint">Muovi il cursore · Clicca per accendere la rete</span></section>;
}
