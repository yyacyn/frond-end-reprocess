"use client"
import { useState, useEffect } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts"
import Sidebar from "../components/sidebar"
import PocketBase from 'pocketbase';
import { FaMedal } from "react-icons/fa";

const pb = new PocketBase('http://202.10.47.143:8090');

const Dashboard = () => {
    // Theme state
    const [theme, setTheme] = useState("light")
    const [user, setUser] = useState(null);
    const [points, setPoints] = useState(0); // State to store user points
    const [salesData, setSalesData] = useState([]); // State to store user's sale data

    // Initialize theme and user data
    useEffect(() => {
        // Set theme
        const savedTheme = localStorage.getItem("theme") ||
            (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);

        // Get logged-in user
        if (pb.authStore.isValid) {
            const loggedInUser = pb.authStore.model;
            setUser(loggedInUser);
            fetchUserPoints(loggedInUser.id); // Fetch points for the logged-in user
            fetchUserSales(loggedInUser.id); // Fetch sales data for the logged-in user
        }
    }, []);

    // Add this new state to your existing useState declarations
    const [monthlyPoints, setMonthlyPoints] = useState([]);

    // Add this new function to fetch monthly points data
    const fetchMonthlyPoints = async () => {
        try {
            const response = await fetch("http://202.10.47.143:8090/api/tracks/monthly");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMonthlyPoints(data);
        } catch (error) {
            console.error("Error fetching monthly points:", error);
            setMonthlyPoints([]); // Set to empty array on error
        }
    };

    // Update your useEffect to include this function
    useEffect(() => {
        // Set theme
        const savedTheme = localStorage.getItem("theme") ||
            (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);

        // Get logged-in user
        if (pb.authStore.isValid) {
            const loggedInUser = pb.authStore.model;
            setUser(loggedInUser);
            fetchUserPoints(loggedInUser.id);
            fetchUserSales(loggedInUser.id);
            fetchMonthlyPoints();
            fetchTrackerData(loggedInUser.id); // Add this new function call
        }
    }, []);

    // Calculate points report metrics
    const totalPoints = monthlyPoints.reduce((sum, month) => sum + month.points, 0);
    const peakMonthPoints = monthlyPoints.length > 0
        ? Math.max(...monthlyPoints.map(month => month.points))
        : 0;
    const peakMonth = monthlyPoints.find(month => month.points === peakMonthPoints)?.label || "None";
    const averageMonthlyPoints = monthlyPoints.length > 0
        ? Math.round(totalPoints / monthlyPoints.filter(month => month.points > 0).length || 1)
        : 0;

    // Add this new CustomTooltip for points chart
    const PointsCustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-base-100 p-4 rounded-lg shadow-lg border border-base-300">
                    <p className="font-semibold text-base-content">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value} points`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const fetchUserPoints = async (userId) => {
        try {
            const records = await pb.collection("points").getList(1, 1, {
                filter: `user_id="${userId}"`, // Filter by user ID
            });

            if (records.items.length > 0) {
                setPoints(records.items[0].total_points); // Assuming "points" is the field name
            } else {
                setPoints(0); // Default to 0 if no points record is found
            }
        } catch (error) {
            console.error("Error fetching user points:", error);
            setPoints(0); // Handle error by setting points to 0
        }
    };

    const fetchUserSales = async (userId) => {
        try {
            const salesRecords = await pb.collection("sale").getList(1, 50, { // Fetch more if needed
                filter: `user="${userId}"`, // Filter by the user ID
                sort: 'created', // Sort by creation date
            });

            // Process sales data for the report
            const processedSales = salesRecords.items.map(sale => ({
                ...sale,
                date: new Date(sale.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                day: new Date(sale.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // Using 'day' for XAxis
            }));

            // Group sales data by date to aggregate quantity sold per day
            const aggregatedSales = processedSales.reduce((acc, sale) => {
                const date = sale.day;
                if (!acc[date]) {
                    acc[date] = { day: date, sold: 0, bought: 0 }; // Initialize bought to 0 for this report
                }
                acc[date].sold += sale.quantity; // Sum quantity for 'sold'
                return acc;
            }, {});

            setSalesData(Object.values(aggregatedSales)); // Convert back to array for Recharts
        } catch (error) {
            console.error("Error fetching user sales:", error);
            setSalesData([]); // Handle error by setting sales data to empty
        }
    };

    // Theme toggle handler
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.documentElement.setAttribute("data-theme", newTheme)
    }

    // Add these new state variables
    const [trackerData, setTrackerData] = useState([
        {
            icon: "♻️",
            value: "0 kg",
            label: "Waste Recycled",
            description: "This month",
            statColor: "stat-value text-emerald-600",
            cardColor: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200",
            category: "recycle"
        },
        {
            icon: "⬇️",
            value: "0 kg",
            label: "Waste Reduced",
            description: "This month",
            statColor: "stat-value text-blue-600",
            cardColor: "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200",
            category: "reduce"
        },
        {
            icon: "🪴",
            value: "0 kg",
            label: "Waste Reused",
            description: "This month",
            statColor: "stat-value text-amber-600",
            cardColor: "bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200",
            category: "reuse"
        },
        {
            icon: "🏆",
            value: "0",
            label: "Task Completed",
            description: "This month",
            statColor: "stat-value text-purple-600",
            cardColor: "bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200",
            category: "all"
        },
    ]);

    // Add this new function to fetch tracker data
    const fetchTrackerData = async (userId) => {
        try {
            // Get current date info to filter for current month
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

            // Fetch completed actions for this user
            const actionsResponse = await pb.collection("actions").getList(1, 100, {
                filter: `finished=true`, // Only get finished actions
                sort: "-created", // Sort by most recent first
            });

            // Count total completed tasks
            const completedTasksCount = actionsResponse.items.length;

            // Group by category and calculate total quantities
            const categoryTotals = {
                recycle: 0,
                reduce: 0,
                reuse: 0
            };

            // Process the actions data
            actionsResponse.items.forEach(action => {
                if (categoryTotals.hasOwnProperty(action.category)) {
                    categoryTotals[action.category] += action.quantity || 0;
                }
            });

            // Update the tracker data with actual values
            setTrackerData(prevData => {
                return prevData.map(item => {
                    if (item.category === "all") {
                        return {
                            ...item,
                            value: completedTasksCount.toString()
                        };
                    } else if (categoryTotals.hasOwnProperty(item.category)) {
                        return {
                            ...item,
                            value: `${categoryTotals[item.category]} kg`
                        };
                    }
                    return item;
                });
            });
        } catch (error) {
            console.error("Error fetching tracker data:", error);
        }
    };

    // Use the fetched salesData for the timeline graph
    const timelineData = salesData; // Now this will be dynamic based on user sales

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

    // Calculate sales report metrics
    const totalWasteSold = salesData.reduce((sum, item) => sum + item.sold, 0);
    const peakSold = salesData.length > 0 ? Math.max(...salesData.map((item) => item.sold)) : 0;
    const averageSold = salesData.length > 0 ? Math.round(totalWasteSold / salesData.length) : 0;

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
                            My points <FaMedal /> <span className="font-semibold text-[#2DC653]">{points}</span>
                        </p>
                    </div>

                    {/* Tracker Section - Using DaisyUI Stats */}
                    <div className="stats stats-vertical lg:stats-horizontal shadow-2xl w-full bg-base-100">
                        {trackerData.map((item, index) => (
                            <div key={index} className={`stat ${item.cardColor}`}>
                                <div className="stat-figure text-6xl">{item.icon}</div>
                                <div className="stat-title text-base-content/70 font-semibold">{item.label}</div>
                                <div className={`${item.statColor} text-4xl font-bold`}>{item.value}</div>
                                <div className="stat-desc text-base-content/60">{item.description}</div>
                            </div>
                        ))}
                    </div>
                    {/* Sales Report Section */}
                    ---
                    <div className="card bg-base-100 shadow-2xl border border-base-300/50">
                        <div className="card-body p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-r from-green-400/20 via-cyan-500/20 to-lime-600/20 rounded-full animate-pulse">
                                        <div className="text-4xl">💰</div>
                                    </div>
                                    <div>
                                        <h2 className="card-title text-4xl text-base-content bg-gradient-to-r from-green-500 via-cyan-500 to-lime-600 bg-clip-text">
                                            My Sales Report
                                        </h2>
                                        <p className="text-base-content/70 text-lg">
                                            Overview of your waste sales activities
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-400/50"></div>
                                        <span className="text-sm font-semibold text-base-content">Waste Sold</span>
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

                                            {/* Area gradients */}
                                            <linearGradient id="soldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                                            </linearGradient>
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
                                            interval={0}  // Ensure all 7 days are displayed
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
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Sales Report Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                <div className="stat bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-200 shadow-lg">
                                    <div className="stat-title text-emerald-700 font-semibold">Total Waste Sold</div>
                                    <div className="stat-value text-emerald-600 text-3xl font-bold">
                                        {totalWasteSold}kg
                                    </div>
                                    <div className="stat-desc text-emerald-600/70">Overall sales</div>
                                </div>

                                <div className="stat bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-lg">
                                    <div className="stat-title text-blue-700 font-semibold">Peak Daily Sale</div>
                                    <div className="stat-value text-blue-600 text-3xl font-bold">
                                        {peakSold}kg
                                    </div>
                                    <div className="stat-desc text-blue-600/70">Highest single day sale</div>
                                </div>

                                <div className="stat bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 shadow-lg">
                                    <div className="stat-title text-amber-700 font-semibold">Average Daily Sale</div>
                                    <div className="stat-value text-amber-600 text-3xl font-bold">
                                        {averageSold}kg
                                    </div>
                                    <div className="stat-desc text-amber-600/70">Daily average</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard