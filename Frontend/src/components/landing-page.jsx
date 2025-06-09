"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Leaf, Calendar, Globe, Users, Heart, ExternalLink } from "lucide-react"
import * as THREE from 'three'

export default function LandingPage() {
  const navigate = useNavigate()
  const [animateStats, setAnimateStats] = useState(false)
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0)
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const globeRef = useRef(null)

  // NGO partners data
  const ngoPartners = [
    { name: "PETA", description: "Animal Rights" },
    { name: "WWF", description: "Wildlife Conservation" },
    { name: "Greenpeace", description: "Environmental Protection" },
  ]

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Volunteer",
      text: "Joining Civic Circle changed my life! I've participated in over 15 beach cleanups and made amazing friends.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "NGO Coordinator",
      text: "As a small environmental NGO, we've grown our volunteer base by 300% in just six months!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Regular Volunteer",
      text: "The community is incredible. I love sharing experiences and seeing our collective impact grow.",
      rating: 5,
    },
  ]

  // Upcoming events
  const upcomingEvents = [
    {
      title: "Beach Cleanup Drive",
      location: "Marine Drive, Mumbai",
      date: "April 20, 2025",
      spots: "7 spots left"
    },
    {
      title: "Animal Shelter Volunteer Day",
      location: "PETA Shelter, Delhi",
      date: "April 25, 2025",
      spots: "4 spots left"
    },
    {
      title: "Tree Plantation Drive",
      location: "Aarey Colony, Mumbai",
      date: "May 1, 2025",
      spots: "12 spots left"
    }
  ]

  // Animate stats when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimateStats(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  // 3D Globe animation
  useEffect(() => {
    if (!globeRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(300, 300);
    globeRef.current.appendChild(renderer.domElement);
    
    // Create Earth globe with wireframe
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    
    // Add points representing volunteer locations
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 100;
    const positions = new Float32Array(pointsCount * 3);
    
    for (let i = 0; i < pointsCount; i++) {
      const radius = 2.1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xf472b6,
      size: 0.1,
    });
    
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);
    
    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(2.2, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { type: "f", value: 0.2 },
        p: { type: "f", value: 3.2 },
        glowColor: { type: "c", value: new THREE.Color(0x3b82f6) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float c;
        uniform float p;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
          gl_FragColor = vec4(glowColor * intensity, intensity);
        }
      `,
      transparent: true,
    });
    
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowSphere);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.005;
      points.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      renderer.dispose();
      if (globeRef.current && renderer.domElement) {
        globeRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 3D Hero animation
  useEffect(() => {
    if (!heroRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, 400);
    heroRef.current.appendChild(renderer.domElement);
    
    // Create floating particles
    const particlesCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPositions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      particlesPositions[i * 3] = (Math.random() - 0.5) * 10;
      particlesPositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      particlesPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.05,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      particles.rotation.x += 0.001;
      particles.rotation.y += 0.002;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / 400;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 400);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (heroRef.current && renderer.domElement) {
        heroRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  // Count up animation for stats
  const CountUpStat = ({ end, label, icon }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!animateStats) return;
      
      let start = 0;
      const increment = end / 100;
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 20);
      
      return () => clearInterval(timer);
    }, [animateStats, end]);

    return (
      <div className="text-center space-y-2">
        {icon && <div className="mb-2 text-primary mx-auto">{icon}</div>}
        <h4 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {animateStats ? count.toLocaleString() : 0}+
        </h4>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Civic Circle</span>
          </a>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {["about", "events", "testimonials", "partners"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full capitalize"
              >
                {section}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:flex transition-all hover:bg-primary/10 hover:border-primary border rounded-md px-4 py-2 text-sm font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="transition-all hover:bg-primary/90 hover:scale-105 bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with 3D Background */}
        <section className="relative overflow-hidden">
          <div ref={heroRef} className="absolute inset-0" aria-hidden="true"></div>
          <div className="relative container py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm">
                  ✨ Join 5,000+ volunteers making a difference
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Your Path to{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Meaningful Impact
                  </span>
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground">
                  Discover volunteer opportunities that match your passion, connect with like-minded people, and track your positive impact.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate("/signup")}
                    className="gap-2 hover:bg-primary/90 hover:scale-105 group bg-primary text-primary-foreground rounded-md px-6 py-3 text-base font-medium inline-flex items-center transition-all"
                  >
                    Start Your Journey
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button 
                    onClick={() => scrollToSection("events")}
                    className="transition-all hover:bg-primary/10 hover:border-primary border rounded-md px-6 py-3 text-base font-medium"
                  >
                    Explore Events
                  </button>
                </div>
              </div>
              <div className="relative hidden lg:flex justify-center">
                <div ref={globeRef} className="relative z-10 h-[300px] w-[300px]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-primary/20 blur-3xl w-64 h-64"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-muted/30 py-24" ref={statsRef}>
          <div className="container space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Your Platform for{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Social Impact
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Civic Circle connects you with meaningful volunteer opportunities and like-minded individuals to create lasting positive change.
              </p>
            </div>
            
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { icon: <Calendar />, title: "Discover Events", desc: "Find volunteer opportunities based on your interests, skills, and availability." },
                { icon: <Heart />, title: "Share Your Impact", desc: "Document your volunteering journey and inspire others with your stories." },
                { icon: <Globe />, title: "Track Progress", desc: "Monitor your impact with detailed analytics and earn recognition badges." }
              ].map((item, i) => (
                <div key={i} className="border border-primary/20 hover:border-primary/50 hover:shadow-md rounded-lg group hover:-translate-y-1 duration-300 p-6 space-y-4">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
              <CountUpStat end={250} label="Successful Events" icon={<Calendar className="h-8 w-8" />} />
              <CountUpStat end={5000} label="Active Volunteers" icon={<Users className="h-8 w-8" />} />
              <CountUpStat end={1200} label="Impact Stories" icon={<Heart className="h-8 w-8" />} />
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Upcoming{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Volunteer Opportunities
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Find events that match your interests and make a real difference in your community.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={index} 
                  className="border border-primary/20 hover:border-primary/50 rounded-lg overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1 duration-300"
                >
                  <div className="aspect-video bg-muted relative">
                    <img 
                      src={`/api/placeholder/${400}/${225}`}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                      {event.spots}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center text-xs text-muted-foreground space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>{event.date}</span>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="text-sm text-muted-foreground">{event.location}</div>
                    <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-medium py-2 rounded-md text-sm transition-colors">
                      Join Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center pt-8">
              <button className="hover:bg-primary hover:text-white border border-primary text-primary rounded-md px-6 py-2.5 text-base font-medium inline-flex items-center gap-2 transition-all">
                Explore All Events
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-muted/30 py-24">
          <div className="container space-y-12">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
              What Our{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Community
              </span>{" "}
              Says
            </h2>
            
            <div className="max-w-3xl mx-auto relative h-[240px]">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 flex flex-col items-center text-center p-6 border border-primary/20 rounded-lg ${
                    index === activeTestimonialIndex 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8 pointer-events-none"
                  }`}
                >
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <div className="flex justify-center mt-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={i < testimonial.rating ? "#f59e0b" : "none"}
                          stroke={i < testimonial.rating ? "#f59e0b" : "currentColor"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground">"{testimonial.text}"</p>
                  </div>
                </div>
              ))}
              
              <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === activeTestimonialIndex ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    onClick={() => setActiveTestimonialIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section id="partners" className="py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our NGO{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Partners
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                We collaborate with leading organizations committed to creating positive change around the world.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
              {ngoPartners.map((partner, index) => (
                <div
                  key={index}
                  className="w-[220px] h-[160px] bg-white/5 border border-primary/20 hover:border-primary/50 rounded-lg p-6 flex flex-col items-center justify-center space-y-4 hover:shadow-md transition-all hover:-translate-y-1 duration-300"
                >
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                    <img 
                      src={`/api/placeholder/${60}/${60}`}
                      alt={partner.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold">{partner.name}</h3>
                    <p className="text-xs text-muted-foreground">{partner.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <button className="hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors text-sm font-medium inline-flex items-center gap-1">
                View All Partners <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-50"></div>
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Make a{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Difference?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Join our community today and be part of a global movement creating positive change.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => navigate("/signup")}
                  className="gap-2 hover:bg-primary/90 hover:scale-105 group bg-primary text-primary-foreground rounded-md px-8 py-4 text-lg font-medium inline-flex items-center transition-all"
                >
                  Join Civic Circle
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Civic Circle</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting passionate volunteers with impactful causes to create positive change worldwide.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["About Us", "Our Partners", "Testimonials", "Events"].map((item) => (
                  <li key={item}>
                    <button className="hover:text-primary transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Get Involved</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Join Our Community", "Work With Us", "Upcoming Events", "Success Stories"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                      {item} {item.includes("Join") && <ExternalLink className="h-3 w-3" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
  
            <div className="space-y-4">
              <h3 className="font-semibold">Contact Us</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Civic-Circle@gmail.com</li>
                <li>+91 8888888888</li>
                <li>Mumbai, India</li>
                <li className="flex space-x-4 pt-2">
                  <a href="#" className="hover:text-primary transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Civic-Circle. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

