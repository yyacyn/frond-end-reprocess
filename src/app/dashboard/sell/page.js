"use client"
import { useState, useEffect } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts"
import Sidebar from "../components/sidebar"

const Dashboard = () => {

    // Theme state
    const [theme, setTheme] = useState("dark")

    // Initialize theme from local storage when component mounts
    useEffect(() => {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem("theme") ||
            (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
        setTheme(savedTheme)
        document.documentElement.setAttribute("data-theme", savedTheme)
    }, [])

    // Theme toggle handler
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.documentElement.setAttribute("data-theme", newTheme)
    }

    const trackerData = [
        {
            icon: "🔥",
            value: "2.3 tons",
            label: "CO2 Reduced",
            description: "this month vs. landfill",
            trend: "+12%",
            statColor: "stat-value text-error",
            cardColor: "bg-error/10 border-error/20",
        },
        {
            icon: "♻️",
            value: "450kg",
            label: "Waste Diverted",
            description: "this month from landfills",
            trend: "+8%",
            statColor: "stat-value text-success",
            cardColor: "bg-success/10 border-success/20",
        },
        {
            icon: "🌴",
            value: "24",
            label: "Trees Saved",
            description: "this month via recycling",
            trend: "+15%",
            statColor: "stat-value text-accent",
            cardColor: "bg-accent/10 border-accent/20",
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
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-bold text-base-content">ayaya</h1>
                        <p className="text-xl text-base-content/70">Track your environmental impact and waste transactions</p>
                    </div>

                    {/* Tracker Section - Using DaisyUI Stats */}
                    <div className="stats stats-vertical lg:stats-horizontal shadow-2xl w-full bg-base-100">
                        {trackerData.map((item, index) => (
                            <div key={index} className={`stat ${item.cardColor} border-2`}>
                                <div className="stat-figure text-6xl">{item.icon}</div>
                                <div className="stat-title text-base-content/70 font-semibold">{item.label}</div>
                                <div className={`${item.statColor} text-4xl font-bold`}>{item.value}</div>
                                <div className="stat-desc text-base-content/60">{item.description}</div>
                                <div className="stat-actions">
                                    <div className="badge badge-success gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {item.trend}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Timeline Graph Section */}
                    <div className="card bg-base-100 shadow-2xl">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="text-3xl">📈</div>
                                <div>
                                    <h2 className="card-title text-3xl text-base-content">Waste Transaction Timeline</h2>
                                    <p className="text-base-content/70 text-lg">
                                        Daily waste sold and bought over the past 10 days (in kg)
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--bc) / 0.2)" />
                                        <XAxis
                                            dataKey="day"
                                            stroke="oklch(var(--bc) / 0.6)"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="oklch(var(--bc) / 0.6)"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            label={{ value: "Weight (kg)", angle: -90, position: "insideLeft" }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="sold"
                                            stroke="oklch(var(--su))"
                                            strokeWidth={4}
                                            dot={{ fill: "oklch(var(--su))", strokeWidth: 2, r: 6 }}
                                            activeDot={{ r: 8, stroke: "oklch(var(--su))", strokeWidth: 3 }}
                                            name="Waste Sold"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="bought"
                                            stroke="oklch(var(--in))"
                                            strokeWidth={4}
                                            dot={{ fill: "oklch(var(--in))", strokeWidth: 2, r: 6 }}
                                            activeDot={{ r: 8, stroke: "oklch(var(--in))", strokeWidth: 3 }}
                                            name="Waste Bought"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    </div>

                    {/* Additional Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard