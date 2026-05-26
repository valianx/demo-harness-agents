import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function GraciasAnimation(): React.ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(".gr-star", { opacity: 0 }, { opacity: 0.6, duration: 0.3, stagger: 0.04 });

      // Atom logo scales in
      tl.fromTo(".gr-orbit", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)", transformOrigin: "center" }, "+=0.1");

      // Core glow pulse
      tl.to(".gr-core-glow", { scale: 1.15, opacity: 0.8, duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "center" });

      // Title + subtitle
      tl.fromTo(".gr-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, "-=1.5");
      tl.fromTo(".gr-subtitle", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
      tl.fromTo(".gr-author", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");

      // Robot slides in from bottom-right
      tl.fromTo(".gr-robot", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }, "-=0.3");

      // Waving arm
      tl.to(".gr-wave", { rotation: -10, duration: 0.4, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 100%" }, "-=0.3");

      // Eye blink
      gsap.to(".gr-eye", { scaleY: 0.1, duration: 0.12, yoyo: true, repeat: 1, transformOrigin: "center", repeatDelay: 3, delay: 3 });

      // Antenna glow
      tl.to(".gr-antenna-dot", { opacity: 0.3, duration: 0.8, yoyo: true, repeat: -1, ease: "sine.inOut" }, "-=0.5");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const stars = [
    "left:3%;top:8%", "left:12%;top:25%", "left:8%;top:60%", "left:15%;top:80%",
    "left:25%;top:12%", "left:30%;top:45%", "left:22%;top:70%",
    "left:45%;top:5%", "left:55%;top:8%",
    "left:70%;top:15%", "left:75%;top:40%", "left:80%;top:65%",
    "left:85%;top:20%", "left:90%;top:50%", "left:92%;top:80%",
    "left:50%;top:85%", "left:35%;top:90%", "left:65%;top:88%",
  ];

  return (
    <div ref={rootRef} className="w-full h-full relative overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 50%, #0c0e1a 0%, #08090f 50%, #050507 100%)" }}>
      {stars.map((s, i) => (
        <div key={i} className="gr-star absolute rounded-full" style={{
          width: i % 3 === 0 ? "2px" : "1px",
          height: i % 3 === 0 ? "2px" : "1px",
          background: i % 4 === 0 ? "#60a5fa" : i % 3 === 0 ? "#a78bfa" : "#94a3b8",
          ...Object.fromEntries(s.split(";").map(p => { const [k,v] = p.split(":"); return [k,v]; })),
          opacity: 0,
        }} />
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
        {/* Atom orbital logo (center) */}
        <div className="gr-orbit" style={{ width: 260, height: 260, opacity: 0 }}>
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ overflow: "visible" }}>
            <defs>
              <radialGradient id="gr-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle className="gr-core-glow" cx="100" cy="100" r="50" fill="url(#gr-glow)" />
            <circle cx="100" cy="100" r="8" fill="#f59e0b" opacity="0.9" />
            <circle cx="100" cy="100" r="4" fill="#fbbf24" />
            <ellipse cx="100" cy="100" rx="70" ry="30" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="0.8" />
            <ellipse cx="100" cy="100" rx="65" ry="28" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" transform="rotate(60 100 100)" />
            <ellipse cx="100" cy="100" rx="75" ry="32" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" transform="rotate(-60 100 100)" />
            <ellipse cx="100" cy="100" rx="60" ry="25" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="0.8" strokeDasharray="4 3" transform="rotate(120 100 100)" />
            <ellipse cx="100" cy="100" rx="80" ry="35" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="0.8" strokeDasharray="6 4" transform="rotate(-30 100 100)" />
            <g style={{ animation: "orbit 8s linear infinite", transformOrigin: "100px 100px" }}>
              <circle cx="170" cy="100" r="4" fill="#94a3b8" opacity="0.8" />
            </g>
            <g style={{ animation: "orbit 12s linear infinite", transformOrigin: "100px 100px", transform: "rotate(60deg)" }}>
              <circle cx="165" cy="100" r="3" fill="#818cf8" opacity="0.7" />
            </g>
            <g style={{ animation: "orbit-reverse 10s linear infinite", transformOrigin: "100px 100px", transform: "rotate(-60deg)" }}>
              <circle cx="175" cy="100" r="3.5" fill="#94a3b8" opacity="0.7" />
            </g>
            <g style={{ animation: "orbit 15s linear infinite", transformOrigin: "100px 100px", transform: "rotate(120deg)" }}>
              <circle cx="160" cy="100" r="2.5" fill="#818cf8" opacity="0.5" />
            </g>
          </svg>
        </div>

        <h1 className="gr-title text-7xl font-bold text-scene-text" style={{ opacity: 0 }}>Gracias</h1>
        <p className="gr-subtitle text-2xl text-scene-muted" style={{ opacity: 0 }}>¿Preguntas?</p>
        <div className="gr-author flex items-center gap-3 text-scene-muted text-base border border-scene-border/50 rounded-full px-6 py-2 backdrop-blur-sm mt-2" style={{ opacity: 0 }}>
          <span>Mario Gutiérrez</span>
          <span className="text-scene-border">·</span>
          <span>Equipo Zippy</span>
        </div>
      </div>

      {/* Robot (bottom-right corner) */}
      <div className="gr-robot absolute bottom-8 right-12" style={{ opacity: 0 }}>
        <svg viewBox="0 0 160 200" width="180" height="225" style={{ overflow: "visible" }}>
          <line x1="80" y1="28" x2="80" y2="10" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          <circle className="gr-antenna-dot" cx="80" cy="7" r="5" fill="#3b82f6" opacity="1" />
          <rect x="40" y="28" width="80" height="55" rx="16" fill="#111827" stroke="#3b82f6" strokeWidth="2.5" />
          <circle className="gr-eye" cx="62" cy="52" r="7" fill="#3b82f6" />
          <circle className="gr-eye" cx="98" cy="52" r="7" fill="#3b82f6" />
          <circle cx="62" cy="50" r="3" fill="#93c5fd" />
          <circle cx="98" cy="50" r="3" fill="#93c5fd" />
          <path d="M 64 68 Q 80 78 96 68" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          <rect x="70" y="83" width="20" height="10" rx="3" fill="#111827" stroke="#475569" strokeWidth="1.5" />
          <rect x="30" y="93" width="100" height="65" rx="14" fill="#111827" stroke="#475569" strokeWidth="2" />
          <rect x="55" y="103" width="50" height="30" rx="8" fill="#0a0f1a" stroke="#334155" strokeWidth="1" />
          <circle cx="80" cy="118" r="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
          <circle cx="80" cy="118" r="4" fill="#3b82f6" opacity="0.8" />
          <line x1="50" y1="143" x2="110" y2="143" stroke="#1e293b" strokeWidth="1.5" />
          <line x1="50" y1="149" x2="110" y2="149" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="10" y="98" width="18" height="45" rx="9" fill="#111827" stroke="#475569" strokeWidth="2" />
          <circle cx="19" cy="148" r="8" fill="#111827" stroke="#475569" strokeWidth="2" />
          <g className="gr-wave">
            <rect x="132" y="80" width="18" height="45" rx="9" fill="#111827" stroke="#3b82f6" strokeWidth="2" />
            <g className="gr-hand">
              <circle cx="141" cy="75" r="8" fill="#111827" stroke="#3b82f6" strokeWidth="2" />
              <line x1="135" y1="68" x2="133" y2="62" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              <line x1="141" y1="67" x2="141" y2="60" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              <line x1="147" y1="68" x2="149" y2="62" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
          <rect x="48" y="158" width="20" height="22" rx="6" fill="#111827" stroke="#475569" strokeWidth="2" />
          <rect x="92" y="158" width="20" height="22" rx="6" fill="#111827" stroke="#475569" strokeWidth="2" />
          <rect x="42" y="178" width="30" height="12" rx="6" fill="#111827" stroke="#475569" strokeWidth="2" />
          <rect x="88" y="178" width="30" height="12" rx="6" fill="#111827" stroke="#475569" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
