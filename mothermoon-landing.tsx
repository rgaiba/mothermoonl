'use client'

import { useState, useEffect, Suspense, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MoonStar, Calendar, Sparkles, ChevronDown } from "lucide-react"
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'

function Icon3D({ IconComponent, color }) {
  return (
    <group>
      <IconComponent color={color} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <ambientLight intensity={0.6} />
    </group>
  )
}

function ZodiacIcon({ color }) {
  const zodiacSymbols = useMemo(() => [
    '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'
  ], [])
  const [currentIndex, setCurrentIndex] = useState(0)

  useFrame(({ clock }) => {
    setCurrentIndex(Math.floor(clock.getElapsedTime() / 5) % zodiacSymbols.length)
  })

  return (
    <group>
      <mesh>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <Text
        position={[0, 0, 0]}
        fontSize={0.8}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {zodiacSymbols[currentIndex]}
      </Text>
    </group>
  )
}

function MonthlyReflectionIcon({ color }) {
  const [moonPosition, setMoonPosition] = useState(0)

  useFrame(({ clock }) => {
    setMoonPosition(clock.getElapsedTime() * 0.5)
  })

  return (
    <group>
      {/* Earth */}
      <mesh>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshStandardMaterial
          color="#4B9CD3"
          emissive="#4B9CD3"
          emissiveIntensity={0.2}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      {/* Earth clouds */}
      <mesh>
        <sphereGeometry args={[0.61, 64, 64]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.3}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Moon orbit */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.25, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Moon */}
      <mesh position={[Math.cos(moonPosition) * 1.225, Math.sin(moonPosition) * 1.225, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color="#CFCFCF"
          emissive="#CFCFCF"
          emissiveIntensity={0.1}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </group>
  )
}

function ThemeIcon({ color }) {
  const [rotation, setRotation] = useState(0)

  useFrame(() => {
    setRotation((prev) => prev + 0.01)
  })

  return (
    <group rotation={[0, rotation, 0]}>
      <mesh>
        <octahedronGeometry args={[0.8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <mesh key={index} position={[
          Math.cos(index * Math.PI / 3) * 0.6,
          Math.sin(index * Math.PI / 3) * 0.6,
          0
        ]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function JournalIcon({ color }) {
  const [pageFlip, setPageFlip] = useState(0)

  useFrame(({ clock }) => {
    setPageFlip(Math.sin(clock.getElapsedTime() * 2) * 0.2)
  })

  return (
    <group>
      {/* Journal cover */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.2, 1.5, 0.1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Journal pages */}
      {[...Array(5)].map((_, index) => (
        <mesh key={index} position={[0.05 * index, 0, 0.1 + 0.01 * index]} rotation={[0, 0, pageFlip * (1 - index * 0.2)]}>
          <planeGeometry args={[1.1, 1.4]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Pen */}
      <mesh position={[0.7, -0.5, 0.2]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Pen tip */}
      <mesh position={[0.9, -0.3, 0.2]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.05, 0.1, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function FeatureIcon({ IconComponent, color, title, description }) {
  return (
    <Card className="bg-indigo-900/30 border-none shadow-lg overflow-hidden group hover:bg-indigo-800/40 transition-all duration-300">
      <CardContent className="flex flex-col items-center space-y-4 p-6">
        <div className="w-48 h-48 relative group-hover:scale-110 transition-transform duration-300">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <Suspense fallback={null}>
              <Icon3D IconComponent={IconComponent} color={color} />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={4} />
          </Canvas>
        </div>
        <h3 className="text-xl font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors duration-300">{title}</h3>
        <p className="text-center text-slate-300 group-hover:text-slate-200 transition-colors duration-300">{description}</p>
      </CardContent>
    </Card>
  )
}

function ZodiacPicker({ selectedZodiac, onSelectZodiac }) {
  const zodiacs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {zodiacs.map((zodiac) => (
        <Button
          key={zodiac}
          onClick={() => onSelectZodiac(zodiac)}
          className={`p-2 text-sm ${selectedZodiac === zodiac ? 'bg-indigo-600 text-white' : 'bg-indigo-900/50 text-indigo-300'} hover:bg-indigo-700 transition-colors`}
        >
          {zodiac}
        </Button>
      ))}
    </div>
  )
}

export default function Component() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [birthdate, setBirthdate] = useState('')
  const [zodiacSign, setZodiacSign] = useState('')
  const [selectedZodiac, setSelectedZodiac] = useState('')
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Pre-order email:', email)
    setSubmitted(true)
    setEmail('')
  }

  const getZodiacSign = (date: string) => {
    const [year, month, day] = date.split('-').map(Number)
    const monthDay = month * 100 + day
    if ((monthDay >= 321 && monthDay <= 419)) return 'Aries'
    if ((monthDay >= 420 && monthDay <= 520)) return 'Taurus'
    if ((monthDay >= 521 && monthDay <= 620)) return 'Gemini'
    if ((monthDay >= 621 && monthDay <= 722)) return 'Cancer'
    if ((monthDay >= 723 && monthDay <= 822)) return 'Leo'
    if ((monthDay >= 823 && monthDay <= 922)) return 'Virgo'
    if ((monthDay >= 923 && monthDay <= 1022)) return 'Libra'
    if ((monthDay >= 1023 && monthDay <= 1121)) return 'Scorpio'
    if ((monthDay >= 1122 && monthDay <= 1221)) return 'Sagittarius'
    if ((monthDay >= 1222 || monthDay <= 119)) return 'Capricorn'
    if ((monthDay >= 120 && monthDay <= 218)) return 'Aquarius'
    return 'Pisces'
  }

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthdate(e.target.value)
    const newZodiacSign = getZodiacSign(e.target.value)
    setZodiacSign(newZodiacSign)
    setSelectedZodiac(newZodiacSign)
    setIsDatePickerOpen(false)
  }

  useEffect(() => {
    const stars = Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      size: `${Math.random() * 2 + 1}px`
    }))

    const starsContainer = document.createElement('div')
    starsContainer.className = 'stars-container'
    stars.forEach(star => {
      const starElement = document.createElement('div')
      starElement.className = 'star'
      starElement.style.left = star.left
      starElement.style.top = star.top
      starElement.style.width = star.size
      starElement.style.height = star.size
      starElement.style.animationDuration = star.animationDuration
      starsContainer.appendChild(starElement)
    })

    document.body.appendChild(starsContainer)

    return () => {
      document.body.removeChild(starsContainer)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 text-white font-sans relative overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Montserrat', sans-serif;
        }
        .zodiac-picker {
          clip-path: polygon(0% 0%, 100% 0%, 97% 100%, 3% 100%);
        }
        .custom-calendar::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
        .custom-calendar {
          background-color: rgba(79, 70, 229, 0.1);
          border: 1px solid rgba(79, 70, 229, 0.3);
          border-radius: 0.375rem;
          color: #fff;
          font-size: 1rem;
          padding: 0.5rem;
          transition: all 0.2s ease-in-out;
          appearance: none;
          -webkit-appearance: none;
        }
        .custom-calendar:focus {
          outline: none;
          border-color: rgba(79, 70, 229, 0.5);
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.25);
        }
        .stars-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
        .star {
          position: absolute;
          background-color: #fff;
          border-radius: 50%;
          opacity: 0;
          animation: twinkle ease infinite;
        }
        @keyframes twinkle {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        .cosmic-dust {
          position: absolute;
          width: 1px;
          height: 1px;
          background: white;
          box-shadow: 0 0 10px 1px #fff;
        }
        .cosmic-dust::after {
          content: "";
          position: absolute;
          top: 0px;
          left: 4px;
          width: 1px;
          height: 1px;
          background: white;
          box-shadow: 0 0 10px 1px #fff;
        }
        .feature-icon {
          transition: all 0.3s ease;
        }
        .feature-icon:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.8));
        }
        .date-picker-dropdown {
          background: rgba(79, 70, 229, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(79, 70, 229, 0.3);
          border-radius: 0.375rem;
          padding: 0.5rem;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 10;
          display: none;
        }
        .date-picker-dropdown.open {
          display: block;
        }
      `}</style>
      <div className="cosmic-dust" style={{ top: '20%', left: '10%', animation: 'float 15s ease-in-out infinite' }}></div>
      <div className="cosmic-dust" style={{ top: '60%', left: '80%', animation: 'float 20s ease-in-out infinite' }}></div>
      <div className="cosmic-dust" style={{ top: '80%', left: '30%', animation: 'float 25s ease-in-out infinite' }}></div>
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-indigo-800 relative z-10">
        <div className="flex items-center justify-center">
          <MoonStar className="h-8 w-8 text-indigo-400" />
          <span className="ml-2 text-xl font-bold text-indigo-400">Mothermoon</span>
        </div>
      </header>
      <main className="flex-1 relative z-10">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-6 lg:pr-12 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                    Your Personalized Cosmic Journey Awaits
                  </h1>
                  <p className="max-w-[600px] text-slate-300 text-lg md:text-xl mx-auto lg:mx-0">
                    Personalized astrology journal that follows your zodiac sign. discover self-reflection prompts based on real-time astrological transits. foster deep introspection and spiritual growth, blending astrology with mindfulness in a high-quality personal journal.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2 mx-auto lg:mx-0">
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                      className="flex-1 bg-slate-800/50 border-indigo-700 text-white placeholder-slate-400"
                      placeholder="Enter your email for early access"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                      Pre-order now
                    </Button>
                  </form>
                  {submitted && (
                    <p className="text-sm text-indigo-400">Thank you for pre-ordering! we'll keep you updated on your cosmic journey.</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-center items-center space-y-6 bg-indigo-900/30 p-8 rounded-lg shadow-lg zodiac-picker backdrop-blur-sm lg:ml-12">
                <h2 className="text-2xl font-bold text-indigo-300">Select your zodiac</h2>
                <ZodiacPicker selectedZodiac={selectedZodiac} onSelectZodiac={setSelectedZodiac} />
                <div className="w-full pt-6 border-t border-indigo-800">
                  <h3 className="text-xl font-semibold text-indigo-300 mb-4">Not sure? ask mothermoon</h3>
                  <div className="w-full space-y-2">
                    <label htmlFor="birthdate" className="block text-sm font-medium text-indigo-300">Date of birth</label>
                    <div className="relative">
                      <input
                        id="birthdate"
                        type="date"
                        value={birthdate}
                        onChange={handleBirthdateChange}
                        className="w-full custom-calendar pr-10 bg-indigo-900/50 border border-indigo-700 rounded-md"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-300" />
                    </div>
                  </div>
                </div>
                {zodiacSign && (
                  <div className="text-center pt-4">
                    <p className="text-lg font-semibold text-slate-300">Your zodiac sign:</p>
                    <p className="text-4xl font-bold text-indigo-300">{zodiacSign}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-indigo-950/50 backdrop-blur-sm">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-indigo-300">Why mothermoon is your perfect cosmic companion</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureIcon
                IconComponent={ZodiacIcon}
                color="#a78bfa"
                title="Zodiac-specific"
                description="Navigate through transits tailored to your sign"
              />
              <FeatureIcon
                IconComponent={MonthlyReflectionIcon}
                color="#93c5fd"
                title="Monthly reflections"
                description="Make the most of transits through thoughtful prompts"
              />
              <FeatureIcon
                IconComponent={ThemeIcon}
                color="#f9a8d4"
                title="Thematic guidance"
                description="Explore curated themes for personal growth"
              />
              <FeatureIcon
                IconComponent={JournalIcon}
                color="#6ee7b7"
                title="Mindful journaling"
                description="Combine astrology with reflective writing"
              />
            </div>
          </div>
        </section>
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-slate-900/50 backdrop-blur-sm">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-indigo-300">
                  Begin your cosmic self-discovery today
                </h2>
                <p className="max-w-[900px] text-slate-300 text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join the waitlist now and be among the first to experience mothermoon's personalized astrology journals. unlock deep introspection and spiritual growth guided by the stars.
                </p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    className="flex-1 bg-slate-800/50 border-indigo-700 text-white placeholder-slate-400"
                    placeholder="Your email for cosmic updates"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                    Join waitlist
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-indigo-800 relative z-10">
        <p className="text-xs text-slate-400">© 2024 mothermoon. all rights reserved.</p>
        <p className="text-xs text-slate-400 mt-2 max-w-[600px] text-center">
          Legal disclaimer: mothermoon is for entertainment purposes only. the information provided is not intended to be a substitute for professional advice. we do not assume any liability for actions taken based on the content provided. by using our services, you agree that mothermoon and its creators are not liable for any damages or losses resulting from your use of our products or services.
        </p>
      </footer>
    </div>
  )
}