import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, Sparkles, Stars, Text3D, Center, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUp, Heart, Volume2, VolumeX, Sparkles as SparkleIcon, Gift, Music2, MoonStar, Flower2, Star, Sun, RefreshCw, X, ChevronDown } from 'lucide-react'
import gsap from 'gsap'

type Scene = 'intro' | 'celebration' | 'letter' | 'garden' | 'special' | 'heart' | 'fireworks' | 'constellation' | 'wishes' | 'promise' | 'final'

const letter = [
  'Some people begin as friends and, without even realising it, become family. You have become one of those rare people I am genuinely grateful to have in my life.',
  'You are more than a friend to me, Lavinia. You are a sister by heart. We may not share the same family name or blood, but the place you hold in my life is real and special.',
  'I hope you always see the good in yourself that the people who care about you can see. Your kindness, your smile and the person you are deserve to be celebrated—not just today, but every day.',
  'For this new year of your life, I wish you a peaceful heart, good health, courage for every new beginning, success in the things you work hard for, and happiness that stays.',
  'When life gets busy and everything changes, I hope you never doubt that you have someone wishing the very best for you and cheering you on from wherever they are.',
  'Keep growing into the person you dream of becoming. Keep your light. Keep smiling. And never feel that you have to be anyone other than yourself.',
  'HAPPY BIRTHDAY, LAVINIA. ALWAYS KEEP SHINING!',
]

const qualities = [
  { title: 'HER BEAUTIFUL SMILE', copy: 'A little sunshine that makes ordinary moments feel brighter.', icon: '☀️', color: 'peach' },
  { title: 'HER KIND HEART', copy: 'The warmth and kindness that make you wonderfully you.', icon: '♡', color: 'rose' },
  { title: 'HER BEAUTIFUL SOUL', copy: 'A rare kind of magic that deserves to be celebrated.', icon: '🦋', color: 'lilac' },
  { title: 'HER POSITIVE ENERGY', copy: 'A little spark that makes the world feel lighter.', icon: '✧', color: 'gold' },
  { title: 'OUR SPECIAL BOND', copy: 'Not by blood, but by a connection that means so much.', icon: '💕', color: 'blue' },
  { title: 'HER HAPPINESS', copy: 'May your days be full of reasons to smile and bloom.', icon: '🌸', color: 'mint' },
]

function seeded(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function FloatingDust({ count = 100 }: { count?: number }) {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    position: [(seeded(i + 1) - .5) * 22, (seeded(i + 101) - .5) * 13, (seeded(i + 201) - .5) * 8] as [number, number, number],
    scale: .012 + seeded(i + 301) * .035,
  })), [count])
  const group = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * .012
      group.current.position.y = Math.sin(state.clock.elapsedTime * .16) * .12
    }
  })
  return <group ref={group}>{particles.map((p, i) => <mesh key={i} position={p.position}><sphereGeometry args={[p.scale, 8, 8]} /><meshBasicMaterial color={i % 5 === 0 ? '#ffe4a6' : '#d9c8ff'} transparent opacity={.52 + seeded(i + 401) * .4} /></mesh>)}</group>
}

function CrystalHeart({ scale = 1, onClick }: { scale?: number; onClick?: () => void }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * .48) * .22
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * .7) * .045
    }
  })
  return <group ref={ref} scale={scale} onClick={onClick}>
    <mesh>
      <sphereGeometry args={[.65, 32, 32]} />
      <meshPhysicalMaterial color="#f39ac9" roughness={.12} metalness={.16} transmission={.45} thickness={1.2} clearcoat={1} />
    </mesh>
    <mesh position={[-.44, .18, .02]} scale={[.65, .68, .55]}>
      <sphereGeometry args={[.65, 32, 32]} />
      <meshPhysicalMaterial color="#f7b6e0" roughness={.12} metalness={.12} transmission={.4} thickness={1} clearcoat={1} />
    </mesh>
    <mesh position={[.44, .18, .02]} scale={[.65, .68, .55]}>
      <sphereGeometry args={[.65, 32, 32]} />
      <meshPhysicalMaterial color="#f7b6e0" roughness={.12} metalness={.12} transmission={.4} thickness={1} clearcoat={1} />
    </mesh>
    <mesh position={[0, -.25, 0]} rotation={[0, 0, Math.PI]} scale={[.57, .82, .55]}>
      <coneGeometry args={[.72, 1.65, 4]} />
      <meshPhysicalMaterial color="#d77fb9" roughness={.16} metalness={.15} transmission={.28} thickness={1.1} clearcoat={1} />
    </mesh>
    <pointLight color="#ffacd9" intensity={2.2} distance={5} />
  </group>
}

function Cake() {
  const candleRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (candleRef.current) candleRef.current.children.forEach((child, i) => {
      child.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8 + i) * .13
    })
  })
  return <group position={[0, -1.15, 0]}>
    {[0, 1, 2].map((i) => <group key={i} position={[0, i * .58, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.35 - i * .2, 1.35 - i * .2, .58, 64]} />
        <meshStandardMaterial color={i === 1 ? '#d99adf' : '#f2b8d7'} roughness={.32} metalness={.06} />
      </mesh>
      <mesh position={[0, .3, 0]}>
        <torusGeometry args={[1.28 - i * .2, .055, 10, 64]} />
        <meshStandardMaterial color="#f7d99a" metalness={.78} roughness={.24} />
      </mesh>
      <mesh position={[0, .305, 0]}>
        <cylinderGeometry args={[1.32 - i * .2, 1.32 - i * .2, .08, 64]} />
        <meshStandardMaterial color="#fff1fa" roughness={.3} />
      </mesh>
    </group>)}
    <group ref={candleRef}>{[-.45, 0, .45].map((x, i) => <group key={i} position={[x, 2.05, .05]}>
      <mesh><cylinderGeometry args={[.045, .045, .55, 12]} /><meshStandardMaterial color="#fff3d0" emissive="#fce7bd" emissiveIntensity={.12} /></mesh>
      <mesh position={[0, .34, 0]}><sphereGeometry args={[.09, 12, 12]} /><meshBasicMaterial color="#ffb858" /></mesh>
      <pointLight position={[0, .4, 0]} color="#ffb858" intensity={.45} distance={1.6} />
    </group>)}</group>
    <mesh position={[0, - .38, 0]}><cylinderGeometry args={[1.55, 1.55, .16, 64]} /><meshStandardMaterial color="#d8ad68" metalness={.82} roughness={.2} /></mesh>
  </group>
}

function Butterflies() {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current) return
    group.current.children.forEach((child, i) => {
      child.position.y = Math.sin(state.clock.elapsedTime * .7 + i * 2) * .35 + Math.cos(i * 8) * .6
      child.position.x = Math.sin(state.clock.elapsedTime * .28 + i * 3) * 3.8
      child.rotation.y = Math.sin(state.clock.elapsedTime * 4 + i) * .5
    })
  })
  return <group ref={group}>{Array.from({ length: 7 }, (_, i) => <group key={i} position={[0, 0, -1 - i * .3]}>
    <mesh position={[-.12, 0, 0]} rotation={[0, 0, -.45]} scale={[.24, .34, .035]}><sphereGeometry args={[1, 20, 16]} /><meshStandardMaterial color={i % 2 ? '#c8b0ff' : '#ffacd7'} emissive={i % 2 ? '#8e68d5' : '#da6aa9'} emissiveIntensity={.38} /></mesh>
    <mesh position={[.12, 0, 0]} rotation={[0, 0, .45]} scale={[.24, .34, .035]}><sphereGeometry args={[1, 20, 16]} /><meshStandardMaterial color={i % 2 ? '#e7cfff' : '#ffe0b8'} emissive="#a67bd9" emissiveIntensity={.25} /></mesh>
    <mesh scale={[.025, .2, .025]}><cylinderGeometry args={[1, 1, 1, 8]} /><meshStandardMaterial color="#f9e7d3" /></mesh>
  </group>)}</group>
}

function OrbitingJewels() {
  const ring = useRef<THREE.Group>(null)
  const gems = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    angle: (i / 18) * Math.PI * 2,
    radius: 4.1 + seeded(i + 701) * 1.8,
    height: (seeded(i + 801) - .5) * 5.8,
    size: .035 + seeded(i + 901) * .075,
    color: ['#ffd9a6', '#f5b8dc', '#cbb7ff', '#a9e8e3'][i % 4],
  })), [])
  useFrame((state, delta) => {
    if (ring.current) {
      ring.current.rotation.y += delta * .035
      ring.current.rotation.z = Math.sin(state.clock.elapsedTime * .12) * .08
    }
  })
  return <group ref={ring}>
    <mesh rotation={[Math.PI / 2.5, .2, 0]}><torusGeometry args={[4.7, .008, 8, 180]} /><meshBasicMaterial color="#e9c6ff" transparent opacity={.24} /></mesh>
    <mesh rotation={[Math.PI / 2.1, -.3, .4]}><torusGeometry args={[5.25, .006, 8, 180]} /><meshBasicMaterial color="#f6d8a8" transparent opacity={.2} /></mesh>
    {gems.map((g, i) => <mesh key={i} position={[Math.cos(g.angle) * g.radius, g.height, Math.sin(g.angle) * g.radius]}>
      <octahedronGeometry args={[g.size, 1]} />
      <meshStandardMaterial color={g.color} emissive={g.color} emissiveIntensity={.8} metalness={.55} roughness={.18} />
    </mesh>)}
  </group>
}

function CameraDrift({ scene }: { scene: Scene }) {
  useFrame((state, delta) => {
    const targetZ = scene === 'intro' ? 8.8 : scene === 'heart' ? 7.1 : scene === 'final' ? 7.6 : 8
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, Math.sin(state.clock.elapsedTime * .09) * .16, 1.1, delta)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, Math.cos(state.clock.elapsedTime * .11) * .11, 1.1, delta)
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 1.2, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function SceneCanvas({ scene, onHeart }: { scene: Scene; onHeart?: () => void }) {
  const isGarden = scene === 'garden'
  const isCake = scene === 'celebration' || scene === 'final'
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 44 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => { gl.setClearColor('#000000', 0) }}>
    <CameraDrift scene={scene} />
    <ambientLight intensity={isGarden ? 1.35 : 1.05} />
    <pointLight position={[4, 5, 5]} intensity={2.2} color="#e7c7ff" />
    <pointLight position={[-5, 1, 3]} intensity={1.65} color="#ffb9db" />
    <pointLight position={[0, -4, -2]} intensity={.75} color="#a98bff" />
    <Stars radius={65} depth={35} count={isGarden ? 500 : 950} factor={3} saturation={.3} fade speed={.18} />
    <Sparkles count={isGarden ? 95 : 145} scale={[16, 9, 8]} size={2.4} speed={.22} opacity={.62} color="#f5d8ff" />
    <FloatingDust count={isGarden ? 85 : 145} />
    <OrbitingJewels />
    <Butterflies />
    {isCake && <Float speed={1.1} rotationIntensity={.1} floatIntensity={.24}><Cake /></Float>}
    {scene === 'heart' && <Float speed={1.3} rotationIntensity={.25} floatIntensity={.45}><CrystalHeart scale={1.5} onClick={onHeart} /></Float>}
    {isGarden && <group>
      {Array.from({ length: 13 }, (_, i) => <group key={i} position={[(i - 6) * 1.05, -2.4 + Math.sin(i * 2) * .4, -1 - (i % 3)]}>
        <mesh position={[0, .36, 0]}><cylinderGeometry args={[.035, .055, .85, 8]} /><meshStandardMaterial color="#49865f" /></mesh>
        {[0, 1, 2].map((j) => <mesh key={j} position={[Math.cos(j * 2.1) * .13, .72 + Math.sin(j * 2.1) * .07, Math.sin(j * 2.1) * .13]} rotation={[0, j * 2, 0]}><sphereGeometry args={[.22, 12, 12]} /><meshStandardMaterial color={['#ed9ec7', '#d8b5ff', '#fff0e7'][i % 3]} emissive="#b967a5" emissiveIntensity={.3} /></mesh>)}
      </group>)}
      <mesh position={[0, -3, -1]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[22, 12]} /><meshStandardMaterial color="#20344a" roughness={1} /></mesh>
    </group>}
    {scene === 'intro' && <group position={[0, -.25, 0]}>
      <mesh position={[0, -.2, -1]}><boxGeometry args={[2.25, 1.9, 1.75]} /><meshPhysicalMaterial color="#bca2f4" metalness={.24} roughness={.12} transmission={.18} thickness={1} clearcoat={1} /></mesh>
      <mesh position={[0, .83, -1]}><boxGeometry args={[2.42, .22, 1.9]} /><meshStandardMaterial color="#f1d092" metalness={.86} roughness={.2} /></mesh>
      <mesh position={[0, .05, -.05]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[.68, .075, 12, 70]} /><meshStandardMaterial color="#f6d79b" metalness={.9} roughness={.2} /></mesh>
      <mesh position={[0, .85, -.05]}><torusGeometry args={[.48, .065, 12, 70]} /><meshStandardMaterial color="#ffe5b2" metalness={.85} roughness={.2} /></mesh>
      <pointLight position={[0, 0, 1.3]} color="#ffccf0" intensity={2.8} distance={6} />
    </group>}
    {scene === 'final' && <Float speed={1} floatIntensity={.5}><CrystalHeart scale={.7} /></Float>}
    <Environment preset="night" />
  </Canvas>
}

function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo(() => Array.from({ length: 100 }, (_, i) => ({ left: seeded(i + 7) * 100, delay: seeded(i + 99) * 2.8, duration: 3 + seeded(i + 201) * 4, hue: [285, 325, 42, 195, 260][i % 5], size: 4 + seeded(i + 301) * 6 })), [])
  if (!active) return null
  return <div className="confetti-layer" aria-hidden>{pieces.map((p, i) => <i key={i} style={{ left: p.left + '%', animationDelay: p.delay + 's', animationDuration: p.duration + 's', width: p.size, height: p.size * 1.6, background: `hsl(${p.hue} 80% 78%)` }} />)}</div>
}

function App() {
  const [scene, setScene] = useState<Scene>('intro')
  const [giftOpened, setGiftOpened] = useState(false)
  const [wish, setWish] = useState(false)
  const [letterOpen, setLetterOpen] = useState(false)
  const [heartRevealed, setHeartRevealed] = useState(false)
  const [music, setMusic] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [volume, setVolume] = useState(0.28)
  const [confetti, setConfetti] = useState(false)
  const [activeQuality, setActiveQuality] = useState<number | null>(null)
  const [gardenBloom, setGardenBloom] = useState(false)
  const [typed, setTyped] = useState(false)
  const audioRef = useRef<AudioContext | null>(null)
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)

  const sound = useCallback((frequency = 660, duration = .14, type: OscillatorType = 'sine') => {
    try {
      const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!audioRef.current) audioRef.current = new Ctx()
      const ctx = audioRef.current
      if (ctx.state === 'suspended') void ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(frequency, ctx.currentTime)
      gain.gain.setValueAtTime(.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(volume * .23, ctx.currentTime + .025)
      gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + duration)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(); osc.stop(ctx.currentTime + duration + .02)
    } catch { /* Audio is an optional enhancement. */ }
  }, [volume])

  useEffect(() => {
    if (scene === 'letter' && letterOpen) {
      setTyped(false)
      const timer = window.setTimeout(() => setTyped(true), 500)
      return () => window.clearTimeout(timer)
    }
  }, [scene, letterOpen])

  useEffect(() => {
    if (scene === 'intro') return
    const el = rootRef.current
    if (el && !reduceMotion) gsap.fromTo(el.querySelector('.scene-content'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out' })
  }, [scene, reduceMotion])

  const transition = (next: Scene) => {
    sound(720, .1)
    setScene(next)
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const celebrate = () => {
    setGiftOpened(true)
    setConfetti(true)
    sound(520, .2); window.setTimeout(() => sound(780, .28), 140); window.setTimeout(() => sound(1040, .35), 280)
    window.setTimeout(() => { setConfetti(false); transition('celebration') }, reduceMotion ? 500 : 1800)
  }

  const makeWish = () => {
    setWish(true); setConfetti(true)
    sound(880, .25); window.setTimeout(() => sound(1175, .35), 180)
  }

  const replay = () => {
    setScene('intro'); setGiftOpened(false); setWish(false); setLetterOpen(false); setHeartRevealed(false); setActiveQuality(null); setConfetti(false); setGardenBloom(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleMusic = async () => {
    // Synthesized ambient music: user-initiated only; no external audio asset.
    if (!audioRef.current) {
      const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      audioRef.current = new Ctx()
    }
    await audioRef.current.resume()
    setAudioReady(true)
    setMusic(v => !v)
    sound(music ? 440 : 660, .2)
  }

  useEffect(() => {
    if (!music || !audioRef.current) return
    const ctx = audioRef.current
    const notes = [261.63, 329.63, 392, 523.25]
    const oscillators = notes.map((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain()
      osc.type = 'sine'; osc.frequency.value = freq
      gain.gain.value = i === 0 ? .012 : .004
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start()
      return { osc, gain }
    })
    return () => oscillators.forEach(({ osc }) => { try { osc.stop() } catch { /* already stopped */ } })
  }, [music, audioReady])

  const chapterOrder: { scene: Scene; label: string }[] = [
    { scene: 'celebration', label: 'Celebration' }, { scene: 'letter', label: 'A letter' }, { scene: 'garden', label: 'Garden' }, { scene: 'special', label: 'You' }, { scene: 'heart', label: 'Our bond' }, { scene: 'constellation', label: 'Star map' }, { scene: 'wishes', label: 'Wish book' }, { scene: 'promise', label: 'Promises' }, { scene: 'fireworks', label: 'Fireworks' }, { scene: 'final', label: 'Finale' },
  ]
  const navItems = chapterOrder.filter(item => item.scene !== 'final')
  const currentChapter = chapterOrder.findIndex(item => item.scene === scene)
  const previousChapter = currentChapter > 0 ? chapterOrder[currentChapter - 1] : null
  const nextChapter = currentChapter >= 0 && currentChapter < chapterOrder.length - 1 ? chapterOrder[currentChapter + 1] : null

  return <div className={`app scene-${scene}`} ref={rootRef}>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <div className="grain" />
    <Confetti active={confetti} />
    <header className="topbar">
      <button className="brand" onClick={() => transition('intro')} aria-label="Back to beginning"><span className="brand-mark">✦</span> FOR LAVINIA <span className="brand-heart">♡</span></button>
      <nav className="desktop-nav" aria-label="Birthday sections">{navItems.map(item => <button key={item.scene} className={scene === item.scene ? 'nav-active' : ''} onClick={() => transition(item.scene)}>{item.label}</button>)}</nav>
      <button className={`music-toggle ${music ? 'playing' : ''}`} onClick={toggleMusic} aria-label={music ? 'Turn music off' : 'Turn music on'}><span className="music-bars"><i/><i/><i/><i/></span>{music ? <Volume2 size={15}/> : <VolumeX size={15}/>}<span className="music-label">SOUND</span></button>
    </header>

    <main>
      <AnimatePresence mode="wait">
        {scene === 'intro' && <motion.section key="intro" className="intro-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.08 }} transition={{ duration: .8 }}>
          <div className="moon" /><div className="intro-orbit orbit-a" /><div className="intro-orbit orbit-b" />
          <div className="intro-copy">
            <motion.div className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}><span/> A LITTLE UNIVERSE, MADE WITH LOVE <span/></motion.div>
            <motion.p className="intro-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }}>A LITTLE MAGIC FOR SOMEONE VERY SPECIAL...</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9, duration: 1 }}>Something beautiful<br/>is waiting for you, <em>Lavinia</em> <span className="heart-emoji">♡</span></motion.h1>
            <motion.p className="intro-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35 }}>A tiny universe of wishes, memories & all the love you deserve.</motion.p>
          </div>
          <motion.div className={`gift-stage ${giftOpened ? 'gift-opened' : ''}`} initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1 }}>
            <div className="gift-aura"/><div className="gift-glow"/>
            <div className="gift-box"><div className="gift-front"/><div className="gift-side"/><div className="gift-lid"><span className="ribbon-v"/><span className="ribbon-h"/></div><div className="gift-bow"><i/><i/><b/></div><div className="gift-light"/></div>
            <div className="gift-shadow"/>
            <span className="gift-spark s1">✧</span><span className="gift-spark s2">✦</span><span className="gift-spark s3">✧</span><span className="gift-spark s4">·</span>
          </motion.div>
          <motion.button className="primary-cta" onClick={celebrate} whileHover={{ scale: 1.045 }} whileTap={{ scale: .97 }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}><Gift size={17}/> UNWRAP YOUR SURPRISE <span>✦</span></motion.button>
          <p className="intro-footnote">MADE ESPECIALLY FOR YOU <span>♡</span> TAKE A DEEP BREATH & ENJOY THE MAGIC</p>
          <div className="scroll-hint"><span>SCROLL TO EXPLORE</span><ChevronDown size={14}/></div>
          <div className="canvas-bg"><SceneCanvas scene="intro"/></div>
        </motion.section>}

        {scene === 'celebration' && <motion.section key="celebration" className="full-scene celebration" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="scene-canvas"><SceneCanvas scene="celebration"/></div>
          <div className="scene-content celebration-content">
            <p className="eyebrow"><span/> THE UNIVERSE IS CELEBRATING YOU <span/></p>
            <h2 className="gold-title">Happy Birthday<br/><em>Lavinia</em><span className="title-star">✦</span></h2>
            <p className="scene-subtitle">To my sister by heart, my forever special person. <span>♡</span></p>
            <div className="cake-caption"><span>✧</span> MAKE A WISH, BEAUTIFUL SOUL <span>✧</span></div>
            <button className="wish-button" onClick={makeWish}><SparkleIcon size={17}/>{wish ? 'YOUR WISH IS IN THE UNIVERSE' : 'MAKE A WISH'}<span>✦</span></button>
            <AnimatePresence>{wish && <motion.div className="wish-message" initial={{ opacity: 0, y: 18, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }}>May every beautiful thing find its way to you. ✨</motion.div>}</AnimatePresence>
            <button className="next-link" onClick={() => transition('letter')}>THERE'S A LETTER FOR YOU <ArrowDown size={14}/></button>
          </div>
          <div className="scene-vignette"/>
        </motion.section>}

        {scene === 'letter' && <motion.section key="letter" className="full-scene letter-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="scene-canvas"><SceneCanvas scene="letter"/></div>
          <div className="scene-content letter-content">
            <p className="eyebrow"><span/> A NOTE FROM THE HEART <span/></p>
            <h2 className="section-title">A little letter, <em>for you.</em></h2>
            {!letterOpen ? <motion.button className="envelope-wrap" onClick={() => { setLetterOpen(true); sound(560, .16) }} whileHover={{ y: -8, rotate: -1 }} whileTap={{ scale: .98 }} aria-label="Open your letter">
              <div className="envelope"><div className="envelope-back"/><div className="letter-peek"><span>Dear Lavinia,</span><i>With love,</i></div><div className="envelope-flap"/><div className="envelope-front"/><div className="seal">♡</div></div>
              <span className="open-note">A LITTLE SOMETHING FROM ME <span>↗</span></span>
            </motion.button> : <motion.article className="letter-card" initial={{ opacity: 0, y: 24, rotateX: -5 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: .85 }}>
              <div className="letter-top"><span>✦ A NOTE FOR YOU ✦</span><span>♡</span></div>
              <h3>Dear Lavinia <span>♡</span></h3>
              <div className="letter-body">{letter.map((p, i) => <motion.p key={i} initial={{ opacity: 0, y: 9 }} animate={typed ? { opacity: 1, y: 0 } : { opacity: 0 }} transition={{ delay: i * .42, duration: .6 }}>{p}</motion.p>)}</div>
              <p className="letter-signature">With lots of love. <span>❤️🫂</span></p>
              <button className="close-letter" onClick={() => setLetterOpen(false)}><X size={13}/> FOLD THE LETTER</button>
            </motion.article>}
            <button className="next-link" onClick={() => transition('garden')}>FOLLOW THE LITTLE LIGHTS <ArrowDown size={14}/></button>
          </div>
        </motion.section>}

        {scene === 'garden' && <motion.section key="garden" className="full-scene garden-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="scene-canvas"><SceneCanvas scene="garden"/></div>
          <div className="garden-haze"/>
          <div className="scene-content garden-content">
            <p className="eyebrow"><span/> A WORLD THAT BLOOMS FOR YOU <span/></p>
            <h2 className="section-title">A little world of<br/><em>happiness for you.</em> <span>✿</span></h2>
            <p className="scene-subtitle">May life always give you beautiful places to grow, glow and bloom.</p>
            <button className="garden-button" onClick={() => { setGardenBloom(v => !v); sound(880, .3) }}>{gardenBloom ? 'LET THE MAGIC GROW ✨' : 'MAKE THE GARDEN BLOOM'} <Flower2 size={16}/></button>
            <div className={`garden-blooms ${gardenBloom ? 'bloom-active' : ''}`}>{['✿', '❀', '✾', '❁', '✿', '❀', '✾'].map((f, i) => <span key={i} style={{ animationDelay: i * .12 + 's' }}>{f}</span>)}</div>
            <button className="next-link" onClick={() => transition('special')}>A FEW THINGS WORTH CELEBRATING <ArrowDown size={14}/></button>
          </div>
        </motion.section>}

        {scene === 'special' && <motion.section key="special" className="full-scene special-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="scene-canvas"><SceneCanvas scene="special"/></div>
          <div className="scene-content special-content">
            <p className="eyebrow"><span/> SIX LITTLE REASONS <span/></p>
            <h2 className="section-title">Why you're <em>so special.</em></h2>
            <p className="scene-subtitle">A few beautiful things that make you, wonderfully you.</p>
            <div className="quality-grid">{qualities.map((q, i) => <motion.button key={q.title} className={`quality-card ${q.color} ${activeQuality === i ? 'quality-active' : ''}`} onClick={() => { setActiveQuality(activeQuality === i ? null : i); sound(590 + i * 60, .14) }} whileHover={{ y: -7, rotateX: 3, rotateY: -3 }} whileTap={{ scale: .97 }}>
              <span className="quality-number">0{i + 1}</span><span className="quality-icon">{q.icon}</span><strong>{q.title}</strong><span className="quality-copy">{activeQuality === i ? q.copy : 'TAP TO DISCOVER'}</span><span className="quality-spark">✦</span>
            </motion.button>)}</div>
            <button className="next-link" onClick={() => transition('heart')}>ONE MORE THING I WANT YOU TO KNOW <ArrowDown size={14}/></button>
          </div>
        </motion.section>}

        {scene === 'heart' && <motion.section key="heart" className="full-scene heart-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="scene-canvas"><SceneCanvas scene="heart" onHeart={() => setHeartRevealed(true)}/></div>
          <div className="scene-content heart-content">
            <p className="eyebrow"><span/> SOME THINGS ARE FELT, NOT SAID <span/></p>
            <h2 className="section-title">There is something<br/>I want you to <em>know.</em></h2>
            <button className="heart-interaction" onClick={() => { setHeartRevealed(true); sound(720, .2); setConfetti(true); window.setTimeout(() => setConfetti(false), 2600) }}>
              <span className="heart-orbit"/><span className="heart-orbit orbit-two"/><Heart fill="url(#heartFill)" size={54} strokeWidth={1}/><span>CLICK THE HEART</span>
            </button>
            <AnimatePresence>{heartRevealed && <motion.div className="heart-reveal" initial={{ opacity: 0, scale: .85, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}><span>♡</span>You're not just a friend, Lavinia. You're family—a sister by heart, and someone whose place in my life I will always value. I'm grateful for our bond, and I will always wish the very best for you. <b>♡</b></motion.div>}</AnimatePresence>
            <button className="next-link" onClick={() => transition('constellation')}>DISCOVER YOUR LITTLE GALAXY <ArrowDown size={14}/></button>
          </div>
        </motion.section>}

        {scene === 'fireworks' && <motion.section key="fireworks" className="full-scene fireworks-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="scene-canvas"><SceneCanvas scene="fireworks"/></div>
          <div className="firework-field" aria-hidden>{Array.from({ length: 18 }, (_, i) => <div className={`firework fw-${i % 6}`} key={i} style={{ left: (8 + seeded(i + 12) * 84) + '%', top: (12 + seeded(i + 33) * 62) + '%', animationDelay: seeded(i + 45) * 4 + 's' }}><i/></div>)}</div>
          <div className="scene-content fireworks-content">
            <p className="eyebrow"><span/> A SKY FULL OF WISHES <span/></p>
            <h2 className="firework-title">Tonight, the stars shine<br/><em>a little brighter</em><br/>for you, Lavinia! <span>✦</span></h2>
            <p className="scene-subtitle">Here's to a year filled with wonder, beautiful surprises and endless reasons to celebrate.</p>
            <button className="next-link" onClick={() => transition('final')}>ONE LAST SURPRISE <ArrowDown size={14}/></button>
          </div>
        </motion.section>}

        {scene === 'constellation' && <motion.section key="constellation" className="full-scene constellation-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="constellation-sky" aria-hidden>{Array.from({ length: 42 }, (_, i) => <motion.i key={i} style={{ left: seeded(i + 1200) * 100 + '%', top: seeded(i + 1300) * 100 + '%' }} animate={{ opacity: [.18, .95, .25], scale: [.7, 1.5, .7] }} transition={{ duration: 2.5 + seeded(i + 1400) * 4, repeat: Infinity, delay: seeded(i + 1500) * 4 }} />)}</div>
      <div className="scene-content constellation-content">
        <p className="eyebrow"><span/> YOUR OWN LITTLE GALAXY <span/></p>
        <h2 className="section-title">A universe named<br/><em>after your sparkle.</em></h2>
        <p className="scene-subtitle">If every lovely thing in the sky became a wish for you, the stars would never run out.</p>
        <div className="star-map"><div className="star-map-orbit orbit-one"/><div className="star-map-orbit orbit-two"/><div className="star-map-core">L<span>♡</span></div>{Array.from({length:9},(_,i)=><motion.span key={i} className="map-star" style={{'--angle':(i*40)+'deg','--distance':(100+i%3*22)+'px'} as React.CSSProperties} animate={{rotate:360}} transition={{duration:22+i*3,repeat:Infinity,ease:'linear'}}>✦</motion.span>)}</div>
        <div className="constellation-quote">“May you always find your way to the brightest version of yourself.”</div>
        <button className="next-link" onClick={() => transition('wishes')}>OPEN YOUR WISH BOOK <ArrowDown size={14}/></button>
      </div>
    </motion.section>}

    {scene === 'wishes' && <motion.section key="wishes" className="full-scene wishes-scene" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="scene-content wishes-content">
        <p className="eyebrow"><span/> LITTLE WISHES, INFINITE LOVE <span/></p>
        <h2 className="section-title">A wish for every<br/><em>beautiful tomorrow.</em></h2>
        <p className="scene-subtitle">Tap each little star to uncover a wish waiting just for you.</p>
        <div className="wish-grid">{[
          ['01','JOY','May laughter find you in the smallest moments.','☀'],
          ['02','COURAGE','May you always be brave enough to chase your dreams.','✧'],
          ['03','PEACE','May your heart feel calm, safe and deeply loved.','☾'],
          ['04','ADVENTURE','May life surprise you with places and people that make you bloom.','✈'],
          ['05','SUCCESS','May every effort bring you closer to the life you imagine.','♛'],
          ['06','LOVE','May you always be surrounded by people who celebrate you.','♡'],
        ].map((w,i)=><motion.button key={w[0]} className={`wish-tile ${activeQuality === i+10 ? 'wish-tile-open' : ''}`} onClick={()=>{setActiveQuality(activeQuality===i+10?null:i+10);sound(660+i*70,.18)}} whileHover={{y:-8,rotateX:5}} whileTap={{scale:.96}}>
          <span className="wish-tile-number">{w[0]}</span><span className="wish-tile-icon">{w[3]}</span><b>{w[1]}</b><span>{activeQuality===i+10?w[2]:'TAP TO REVEAL YOUR WISH'}</span>
        </motion.button>)}</div>
        <button className="next-link" onClick={() => transition('promise')}>A FEW PROMISES FOR YOU <ArrowDown size={14}/></button>
      </div>
    </motion.section>}

    {scene === 'promise' && <motion.section key="promise" className="full-scene promise-scene" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="promise-halo"/><div className="scene-content promise-content">
        <p className="eyebrow"><span/> A LITTLE PROMISE FROM MY HEART <span/></p>
        <h2 className="section-title">No matter what,<br/><em>you'll always matter.</em></h2>
        <div className="promise-list">{[
          'I will always wish the very best for you.',
          'I hope you never forget how special you are.',
          'I will cheer for your wins, big and small.',
          'I hope you keep choosing happiness and yourself.',
          'And wherever life takes us, this bond will always be precious.',
        ].map((p,i)=><motion.div className="promise-line" key={p} initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.5}} transition={{delay:i*.12}}><span>✦</span>{p}</motion.div>)}</div>
        <div className="promise-seal">WITH LOVE <span>♡</span> ALWAYS</div>
        <button className="next-link" onClick={() => transition('fireworks')}>LET'S LIGHT UP THE SKY <ArrowDown size={14}/></button>
      </div>
    </motion.section>}

    {scene === 'final' && <motion.section key="final" className="full-scene final-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="scene-canvas"><SceneCanvas scene="final"/></div>
          <div className="final-glow"/>
          <div className="scene-content final-content">
            <div className="final-badge"><Star size={13} fill="currentColor"/> MADE WITH LOVE, JUST FOR YOU <Star size={13} fill="currentColor"/></div>
            <p className="final-overline">THE WORLD IS A LITTLE MORE MAGICAL BECAUSE YOU'RE IN IT</p>
            <h2>Happy Birthday<br/><em>my dear Lavinia!</em> <span>♡</span></h2>
            <p className="final-message">May the year ahead bring you gentle days, brave beginnings, unexpected joy and the kind of happiness that feels like home. You deserve beautiful things, Lavinia.</p>
            <div className="final-mantra"><span>YOU ARE SPECIAL.</span><i>✦</i><span>YOU ARE LOVED.</span><i>✦</i><span>YOU ARE FAMILY.</span></div>
            <div className="final-signoff">LOTS OF LOVE, <em>YOUR FRIEND & SIBLING BY HEART.</em> <span>❤️</span></div>
            <button className="replay-button" onClick={replay}><RefreshCw size={16}/> EXPERIENCE THE MAGIC AGAIN <span>✦</span></button>
            <p className="final-footer">A LITTLE UNIVERSE FOR LAVINIA <span>♡</span> FOREVER A REASON TO CELEBRATE</p>
          </div>
        </motion.section>}
      </AnimatePresence>
    </main>

    {scene !== 'intro' && scene !== 'final' && <div className="chapter-controls" aria-label="Chapter navigation">
      {previousChapter ? <button onClick={() => transition(previousChapter.scene)}><ArrowUp size={13}/><span>PREVIOUS</span><small>{previousChapter.label}</small></button> : <span className="chapter-edge">YOUR JOURNEY BEGINS HERE</span>}
      <div className="chapter-progress" aria-label={`Chapter ${currentChapter + 1} of ${chapterOrder.length}`}><span>{String(currentChapter + 1).padStart(2, '0')}</span><i/><span>{String(chapterOrder.length).padStart(2, '0')}</span></div>
      {nextChapter ? <button onClick={() => transition(nextChapter.scene)}><span>NEXT</span><small>{nextChapter.label}</small><ArrowDown size={13}/></button> : null}
    </div>}

    <footer className="page-footer"><span>✦</span> A LITTLE MAGIC, MADE WITH LOVE <span>♡</span> <span className="footer-right">FOR LAVINIA · ALWAYS SHINE</span></footer>
  </div>
}

export default App