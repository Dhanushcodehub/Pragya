'use client';
import { motion } from 'framer-motion';

export default function FlyingPencil() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
      
      {/* Background soft watercolor-like splashes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-pink-100 rounded-full blur-[60px] opacity-60 z-0 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/3 w-[200px] h-[200px] bg-yellow-100 rounded-full blur-[40px] opacity-70 z-0 pointer-events-none"></div>

      {/* Speed Lines to give motion context to the fire (moved BEHIND everything to fix the opacity/layering issue) */}
      <div className="absolute inset-0 z-0 opacity-40 flex items-center justify-center pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 400 400">
           <motion.path d="M 150 280 L 100 330" stroke="#000" strokeWidth="5" strokeLinecap="round" animate={{ opacity: [0,1,0], x: [-15, 15], y: [15, -15] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }} />
           <motion.path d="M 120 330 L 70 380" stroke="#000" strokeWidth="5" strokeLinecap="round" animate={{ opacity: [0,1,0], x: [-15, 15], y: [15, -15] }} transition={{ duration: 0.4, repeat: Infinity, delay: 0.4 }} />
           <motion.path d="M 180 350 L 130 400" stroke="#000" strokeWidth="5" strokeLinecap="round" animate={{ opacity: [0,1,0], x: [-15, 15], y: [15, -15] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} />
        </svg>
      </div>

      {/* Background Clouds (Using precise standard cloud paths) */}
      <motion.div 
        animate={{ x: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-8 z-10"
      >
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(6) translate(1, 1)">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#E0F2FE" stroke="#000" strokeWidth="0.75" strokeLinejoin="round"/>
          </g>
        </svg>
      </motion.div>

      <motion.div 
        animate={{ x: [10, -10, 10] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 right-10 z-10"
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(4.5) translate(1, 1)">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#E0F2FE" stroke="#000" strokeWidth="1" strokeLinejoin="round"/>
          </g>
        </svg>
      </motion.div>

      {/* Pencil Rocket SVG */}
      <motion.div 
        animate={{ 
          y: [-8, 8, -8],
          rotate: [0, -1.5, 1.5, 0] 
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-20 w-[300px] h-[300px] flex items-center justify-center drop-shadow-[0_15px_15px_rgba(0,0,0,0.25)]"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
          {/* Rotate the whole pencil assembly to match the reference exactly */}
          <g transform="rotate(55, 200, 200)">
            
            {/* Animated Fire Exhaust */}
            <motion.path 
              d="M 170 330 C 170 410 200 450 200 450 C 200 450 230 410 230 330 Z" 
              fill="#F97316" 
              stroke="#000"
              strokeWidth="6"
              strokeLinejoin="round"
              animate={{ 
                scaleY: [1, 1.15, 1],
                scaleX: [1, 0.95, 1],
              }}
              transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
              style={{ originX: '200px', originY: '330px' }}
            />
            <motion.path 
              d="M 182 330 C 185 380 200 400 200 400 C 200 400 215 380 218 330 Z" 
              fill="#FDE047" 
              animate={{ 
                scaleY: [1, 1.25, 1],
              }}
              transition={{ duration: 0.15, repeat: Infinity, ease: "linear", delay: 0.1 }}
              style={{ originX: '200px', originY: '330px' }}
            />

            {/* Left Fin */}
            <path d="M 160 240 C 110 240 100 280 100 310 C 120 310 140 290 160 280 Z" fill="#FACC15" stroke="#000" strokeWidth="6" strokeLinejoin="round"/>
            
            {/* Right Fin */}
            <path d="M 240 240 C 290 240 300 280 300 310 C 280 310 260 290 240 280 Z" fill="#FACC15" stroke="#000" strokeWidth="6" strokeLinejoin="round"/>

            {/* Wood Base (drawn first so it sits behind the yellow body scallops) */}
            <path d="M 200 60 L 160 140 L 240 140 Z" fill="#E2C285" stroke="#000" strokeWidth="6" strokeLinejoin="round"/>
            
            {/* Wood grain lines (subtle detail) */}
            <path d="M 195 70 C 195 90 185 110 175 130" fill="none" stroke="#D4A373" strokeWidth="2" strokeLinecap="round"/>
            <path d="M 205 70 C 205 90 215 110 225 130" fill="none" stroke="#D4A373" strokeWidth="2" strokeLinecap="round"/>
            <path d="M 200 90 C 200 100 195 120 195 130" fill="none" stroke="#D4A373" strokeWidth="2" strokeLinecap="round"/>
            
            {/* Graphite Tip (rounded) */}
            <path d="M 200 55 C 195 65 190 75 185 85 L 215 85 C 210 75 205 65 200 55 Z" fill="#333" stroke="#000" strokeWidth="6" strokeLinejoin="round"/>

            {/* Yellow Body with precise scallops */}
            <path d="M 160 130 C 173 150 186 130 186 130 C 186 130 200 150 213 130 C 213 130 226 150 240 130 L 240 280 L 160 280 Z" fill="#FACC15" stroke="#000" strokeWidth="6" strokeLinejoin="round"/>
            
            {/* Body Dots - Perfectly aligned and sized */}
            <circle cx="200" cy="170" r="12" fill="#333" />
            <circle cx="200" cy="215" r="12" fill="#333" />
            <circle cx="200" cy="260" r="12" fill="#333" />

            {/* Silver Band (Ferrule) */}
            <rect x="160" y="280" width="80" height="25" fill="#D1D5DB" stroke="#000" strokeWidth="6" strokeLinejoin="round"/>
            <line x1="160" y1="288" x2="240" y2="288" stroke="#000" strokeWidth="4" />
            <line x1="160" y1="296" x2="240" y2="296" stroke="#000" strokeWidth="4" />

            {/* Eraser - Rounded nicely */}
            <path d="M 160 305 L 160 315 C 160 330 240 330 240 315 L 240 305 Z" fill="#C2410C" stroke="#000" strokeWidth="6" strokeLinejoin="round"/>
            
          </g>
        </svg>
      </motion.div>

      {/* Twinkling Stars */}
      <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="absolute top-[20%] left-[25%] z-10 pointer-events-none">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#FACC15" stroke="#000" strokeWidth="2"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>
      </motion.div>
      <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }} className="absolute bottom-1/4 right-1/4 z-10 pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FACC15" stroke="#000" strokeWidth="2"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>
      </motion.div>
      <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }} className="absolute top-[25%] right-[20%] z-10 pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#FACC15" stroke="#000" strokeWidth="2"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>
      </motion.div>
    </div>
  );
}
