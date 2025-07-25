"use client"
import { useState, useEffect } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts"
import Sidebar from "../components/sidebar"
import PocketBase from 'pocketbase';
import { FaMedal } from "react-icons/fa";

const pb = new PocketBase("http://172.19.79.163:8090");

const Dashboard = () => {

    // Theme state
    const [theme, setTheme] = useState("dark")
    const [user, setUser] = useState(null);

    // Initialize theme and user data
    useEffect(() => {
        // Set theme
        const savedTheme = localStorage.getItem("theme") ||
            (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);

        // Get logged-in user
        if (pb.authStore.isValid) {
            setUser(pb.authStore.model); // Retrieve user data from authStore
        }
    }, []);

    // Theme toggle handler
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.documentElement.setAttribute("data-theme", newTheme)
    }

    const trackerData = [
        {
            icon: "♻️",
            value: "23 kg",
            label: "Waste Recycled",
            description: "This month",
            statColor: "stat-value text-success",
            cardColor: "bg-success/10 border-success/20",
        },
        {
            icon: "⬇️",
            value: "45 kg",
            label: "Waste Reduced",
            description: "This month",
            statColor: "stat-value text-success",
            cardColor: "bg-success/10 border-success/20",
        },
        {
            icon: "🪴",
            value: "24 kg",
            label: "Waste Reused",
            description: "This month",
            statColor: "stat-value text-success",
            cardColor: "bg-success/10 border-success/20",
        },
        {
            icon: "🏆",
            value: "12",
            label: "Task Completed",
            description: "This month",
            statColor: "stat-value text-success",
            cardColor: "bg-success/10 border-success/20",
        },
    ]

    const timelineData = [
        { date: "2025-07-15", sold: 25, bought: 15, day: "Jul 15" },
        { date: "2025-07-16", sold: 35, bought: 25, day: "Jul 16" },
        { date: "2025-07-17", sold: 28, bought: 18, day: "Jul 17" },
        { date: "2025-07-18", sold: 42, bought: 32, day: "Jul 18" },
        { date: "2025-07-19", sold: 38, bought: 28, day: "Jul 19" },
        { date: "2025-07-20", sold: 30, bought: 20, day: "Jul 20" },
        { date: "2025-07-21", sold: 50, bought: 40, day: "Jul 21" },
        { date: "2025-07-22", sold: 45, bought: 35, day: "Jul 22" },
        { date: "2025-07-23", sold: 52, bought: 42, day: "Jul 23" },
        { date: "2025-07-24", sold: 48, bought: 38, day: "Jul 24" },
    ]

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-base-100 p-4 rounded-lg shadow-lg border border-base-300">
                    <p className="font-semibold text-base-content">{`Date: ${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value}kg`}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-base-200 to-base-300 p-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-center w-full space-y-4">
                        <h1 className="text-2xl font-bold text-base-content">
                            Welcome, {user?.name || user?.email || "User"}!
                        </h1>
                        <p className="text-xl text-base-content/70 flex items-center gap-2">
                            My points <FaMedal /> <span className="font-semibold text-primary">1234</span>
                        </p>
                    </div>

                    {/* Tracker Section - Using DaisyUI Stats */}
                    <div className="stats stats-vertical lg:stats-horizontal shadow-2xl w-full bg-base-100">
                        {trackerData.map((item, index) => (
                            <div key={index} className={`stat ${item.cardColor} border-2`}>
                                <div className="stat-figure text-6xl">{item.icon}</div>
                                <div className="stat-title text-base-content/70 font-semibold">{item.label}</div>
                                <div className={`${item.statColor} text-4xl font-bold`}>{item.value}</div>
                                <div className="stat-desc text-base-content/60">{item.description}</div>
                            </div>
                        ))}
                    </div>

                    {/* Timeline Graph Section */}
                    <div className="card bg-base-100 shadow-2xl border border-base-300/50">
                        <div className="card-body p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-r from-emerald-400/20 via-blue-500/20 to-purple-600/20 rounded-full animate-pulse">
                                        <div className="text-4xl">📈</div>
                                    </div>
                                    <div>
                                        <h2 className="card-title text-4xl text-base-content bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                                            Waste Transaction Timeline
                                        </h2>
                                        <p className="text-base-content/70 text-lg">
                                            Daily waste sold and bought over the past 10 days (in kg)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-400/50"></div>
                                        <span className="text-sm font-semibold text-base-content">Waste Sold</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg shadow-blue-400/50"></div>
                                        <span className="text-sm font-semibold text-base-content">Waste Bought</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full h-[550px] p-6 bg-gradient-to-br from-slate-50/50 via-white/30 to-slate-100/50 rounded-2xl border border-base-300/30 shadow-inner">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={timelineData} margin={{ top: 40, right: 50, left: 50, bottom: 40 }}>
                                        <defs>
                                            {/* Gradient definitions for sold line */}
                                            <linearGradient id="soldLineGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="50%" stopColor="#059669" />
                                                <stop offset="100%" stopColor="#047857" />
                                            </linearGradient>

                                            {/* Gradient definitions for bought line */}
                                            <linearGradient id="boughtLineGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="50%" stopColor="#2563eb" />
                                                <stop offset="100%" stopColor="#1d4ed8" />
                                            </linearGradient>

                                            {/* Area gradients */}
                                            <linearGradient id="soldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                                            </linearGradient>

                                            <linearGradient id="boughtAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                                            </linearGradient>

                                            {/* Glow filter */}
                                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>

                                            {/* Drop shadow for dots */}
                                            <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
                                                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                                            </filter>
                                        </defs>

                                        <CartesianGrid strokeDasharray="3 3" stroke="#F2b8f0" />
                                        <XAxis
                                            dataKey="day"
                                            stroke="oklch(var(--bc) / 0.8)"
                                            fontSize={14}
                                            fontWeight={600}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "oklch(var(--bc) / 0.8)" }}
                                            dy={15}
                                        />

                                        <YAxis
                                            stroke="oklch(var(--bc) / 0.8)"
                                            fontSize={14}
                                            fontWeight={600}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "oklch(var(--bc) / 0.8)" }}
                                            label={{
                                                value: "Weight (kg)",
                                                angle: -90,
                                                position: "insideLeft",
                                                style: {
                                                    textAnchor: "middle",
                                                    fill: "oklch(var(--bc) / 0.8)",
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                },
                                            }}
                                            dx={-15}
                                        />

                                        <Tooltip
                                            content={<CustomTooltip />}
                                            cursor={{
                                                stroke: "oklch(var(--bc) / 0.4)",
                                                strokeWidth: 3,
                                                strokeDasharray: "8 8",
                                            }}
                                        />

                                        {/* Sold line with enhanced styling */}
                                        <Line
                                            type="monotone"
                                            dataKey="sold"
                                            stroke="url(#soldLineGradient)"
                                            strokeWidth={6}
                                            dot={{
                                                fill: "#ffffff",
                                                stroke: "#10b981",
                                                strokeWidth: 4,
                                                r: 10,
                                                
                                            }}
                                            activeDot={{
                                                r: 14,
                                                stroke: "#10b981",
                                                strokeWidth: 5,
                                                fill: "#ffffff",
                                                
                                                style: {
                                                    boxShadow: "0 0 20px #10b981",
                                                },
                                            }}
                                            name="Waste Sold"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            connectNulls={true}
                                            
                                        />

                                        {/* Bought line with enhanced styling */}
                                        <Line
                                            type="monotone"
                                            dataKey="bought"
                                            stroke="url(#boughtLineGradient)"
                                            strokeWidth={6}
                                            dot={{
                                                fill: "#ffffff",
                                                stroke: "#3b82f6",
                                                strokeWidth: 4,
                                                r: 10,
                                                
                                            }}
                                            activeDot={{
                                                r: 14,
                                                stroke: "#3b82f6",
                                                strokeWidth: 5,
                                                fill: "#ffffff",
                                                
                                                style: {
                                                    boxShadow: "0 0 20px #3b82f6",
                                                },
                                            }}
                                            name="Waste Bought"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            connectNulls={true}
                                            
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Graph Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                                <div className="stat bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-200 shadow-lg">
                                    <div className="stat-title text-emerald-700 font-semibold">Peak Sold</div>
                                    <div className="stat-value text-emerald-600 text-3xl font-bold">
                                        {Math.max(...timelineData.map((item) => item.sold))}kg
                                    </div>
                                    <div className="stat-desc text-emerald-600/70">Highest single day</div>
                                </div>

                                <div className="stat bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-lg">
                                    <div className="stat-title text-blue-700 font-semibold">Peak Bought</div>
                                    <div className="stat-value text-blue-600 text-3xl font-bold">
                                        {Math.max(...timelineData.map((item) => item.bought))}kg
                                    </div>
                                    <div className="stat-desc text-blue-600/70">Highest single day</div>
                                </div>

                                <div className="stat bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 shadow-lg">
                                    <div className="stat-title text-amber-700 font-semibold">Avg Sold</div>
                                    <div className="stat-value text-amber-600 text-3xl font-bold">
                                        {Math.round(timelineData.reduce((sum, item) => sum + item.sold, 0) / timelineData.length)}kg
                                    </div>
                                    <div className="stat-desc text-amber-600/70">Daily average</div>
                                </div>

                                <div className="stat bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 shadow-lg">
                                    <div className="stat-title text-purple-700 font-semibold">Net Flow</div>
                                    <div className="stat-value text-purple-600 text-3xl font-bold">
                                        +{timelineData.reduce((sum, item) => sum + (item.sold - item.bought), 0)}kg
                                    </div>
                                    <div className="stat-desc text-purple-600/70">Total difference</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="card bg-gradient-to-r from-success to-success-focus text-success-content shadow-2xl">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-success-content/80 text-lg">Total Waste Sold</p>
                                        <p className="text-4xl font-bold">{timelineData.reduce((sum, item) => sum + item.sold, 0)}kg</p>
                                    </div>
                                    <div className="text-6xl opacity-60">📤</div>
                                </div>
                                <div className="card-actions justify-end">
                                    <div className="badge badge-success-content/20 text-success-content">Revenue Generated</div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-r from-info to-info-focus text-info-content shadow-2xl">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-info-content/80 text-lg">Total Waste Bought</p>
                                        <p className="text-4xl font-bold">{timelineData.reduce((sum, item) => sum + item.bought, 0)}kg</p>
                                    </div>
                                    <div className="text-6xl opacity-60">📥</div>
                                </div>
                                <div className="card-actions justify-end">
                                    <div className="badge badge-info-content/20 text-info-content">Materials Acquired</div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Additional Insights */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body text-center">
                                <div className="text-4xl mb-2">🎯</div>
                                <h3 className="card-title justify-center text-primary">Net Balance</h3>
                                <p className="text-2xl font-bold text-accent">
                                    +{timelineData.reduce((sum, item) => sum + (item.sold - item.bought), 0)}kg
                                </p>
                                <p className="text-base-content/60">Waste processed efficiently</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body text-center">
                                <div className="text-4xl mb-2">📊</div>
                                <h3 className="card-title justify-center text-secondary">Avg Daily</h3>
                                <p className="text-2xl font-bold text-secondary">
                                    {Math.round(timelineData.reduce((sum, item) => sum + item.sold, 0) / timelineData.length)}kg
                                </p>
                                <p className="text-base-content/60">Sold per day</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body text-center">
                                <div className="text-4xl mb-2">🌍</div>
                                <h3 className="card-title justify-center text-accent">Impact Score</h3>
                                <p className="text-2xl font-bold text-success">A+</p>
                                <p className="text-base-content/60">Environmental rating</p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Dashboard