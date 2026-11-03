import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, Sparkles, Stars, Text3D, Center, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUp, Heart, Volume2, VolumeX, Sparkles as SparkleIcon, Gift, Music2, MoonStar, Flower2, Star, Sun, RefreshCw, X, ChevronDown } from 'lucide-react'
import gsap from 'gsap'

type Scene = 'intro' | 'celebration' | 'letter' | 'garden' | 'special' | 'heart' | 'fireworks' | 'final'

const letter = [
  'Some people enter our lives as friends, but slowly become family. You are one of those beautiful blessings in my life.',
  'You are not just a friend to me; you are like a sister. Even though we may not be connected by blood, our bond is special in its own beautiful way.',
  'Thank you for being the wonderful person you are. Your smile, your kindness, your personality, and your presence make life a little more beautiful.',
  'I genuinely wish you endless happiness, unlimited success, good health, peace, and all the beautiful things your heart desires.',
  'No matter where life takes us, always remember that you have a special place in my heart.',
  'Keep smiling, keep shining, and never stop being YOU.',
  'HAPPY BIRTHDAY, MY SISTER FROM ANOTHER MOTHER!',
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

function SceneCanvas({ scene, onHeart }: { scene: Scene; onHeart?: () => void }) {
  const isGarden = scene === 'garden'
  const isCake = scene === 'celebration' || scene === 'final'
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 44 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => { gl.setClearColor('#000000', 0) }}>
    <ambientLight intensity={isGarden ? 1.2 : .85} />
    <pointLight position={[4, 5, 5]} intensity={2.2} color="#e7c7ff" />
    <pointLight position={[-5, 1, 3]} intensity={1.3} color="#ffb9db" />
    <Stars radius={65} depth={35} count={isGarden ? 500 : 950} factor={3} saturation={.3} fade speed={.18} />
    <Sparkles count={isGarden ? 95 : 145} scale={[16, 9, 8]} size={2.4} speed={.22} opacity={.62} color="#f5d8ff" />
    <FloatingDust count={isGarden ? 65 : 115} />
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

  const navItems: { scene: Scene; label: string }[] = [
    { scene: 'celebration', label: 'Celebration' }, { scene: 'letter', label: 'A letter' }, { scene: 'garden', label: 'Garden' }, { scene: 'special', label: 'You' }, { scene: 'heart', label: 'Our bond' }, { scene: 'fireworks', label: 'Fireworks' },
  ]

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
            <AnimatePresence>{heartRevealed && <motion.div className="heart-reveal" initial={{ opacity: 0, scale: .85, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}><span>♡</span>You're not just a friend, Lavinia. You're family. A sister I got through life's beautiful journey. I'm grateful to have you. <b>♡</b></motion.div>}</AnimatePresence>
            <button className="next-link" onClick={() => transition('fireworks')}>LET'S LIGHT UP THE SKY <ArrowDown size={14}/></button>
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

        {scene === 'final' && <motion.section key="final" className="full-scene final-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="scene-canvas"><SceneCanvas scene="final"/></div>
          <div className="final-glow"/>
          <div className="scene-content final-content">
            <div className="final-badge"><Star size={13} fill="currentColor"/> MADE WITH LOVE, JUST FOR YOU <Star size={13} fill="currentColor"/></div>
            <p className="final-overline">THE WORLD IS A LITTLE MORE MAGICAL BECAUSE YOU'RE IN IT</p>
            <h2>Happy Birthday<br/><em>my dear Lavinia!</em> <span>♡</span></h2>
            <p className="final-message">May every new chapter of your life be more beautiful than the last. You deserve all the happiness in the universe.</p>
            <div className="final-mantra"><span>YOU ARE SPECIAL.</span><i>✦</i><span>YOU ARE LOVED.</span><i>✦</i><span>YOU ARE FAMILY.</span></div>
            <div className="final-signoff">LOTS OF LOVE, <em>YOUR FRIEND & SIBLING BY HEART.</em> <span>❤️</span></div>
            <button className="replay-button" onClick={replay}><RefreshCw size={16}/> EXPERIENCE THE MAGIC AGAIN <span>✦</span></button>
            <p className="final-footer">A LITTLE UNIVERSE FOR LAVINIA <span>♡</span> FOREVER A REASON TO CELEBRATE</p>
          </div>
        </motion.section>}
      </AnimatePresence>
    </main>

    <footer className="page-footer"><span>✦</span> A LITTLE MAGIC, MADE WITH LOVE <span>♡</span> <span className="footer-right">FOR LAVINIA · ALWAYS SHINE</span></footer>
  </div>
}

export default App