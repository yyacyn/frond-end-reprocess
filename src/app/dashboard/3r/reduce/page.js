"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Sidebar from "../../components/sidebar"
import PocketBase from "pocketbase"

const pb = new PocketBase("http://202.10.47.143:8090")

export default function ReducePage() {
    const searchParams = useSearchParams()
    const wasteId = searchParams.get("id")
    const action = searchParams.get("action")

    const [loading, setLoading] = useState(true)
    const [wasteData, setWasteData] = useState(null)
    const [recommendations, setRecommendations] = useState([])
    const [selectedRecommendation, setSelectedRecommendation] = useState(null)
    const [actionCreated, setActionCreated] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "light");
        if (wasteId) {
            fetchWasteData()
            fetchRecommendations()
        }
    }, [wasteId, action])

    const fetchWasteData = async () => {
        try {
            const record = await pb.collection("wastes").getOne(wasteId)
            setWasteData(record)
        } catch (error) {
            console.error("Error fetching waste data:", error)
            setError("Failed to load waste data")
        }
    }

    const fetchRecommendations = async () => {
        try {
            const response = await fetch(`http://202.10.47.143:8090/api/generate-recommendations/${wasteId}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text

            if (textContent) {
                const parsedData = JSON.parse(textContent)

                if (action === "reduce" && parsedData[1]) {
                    const reduceData = parsedData[1]
                    setRecommendations([reduceData])
                    setSelectedRecommendation(reduceData)
                } else {
                    setRecommendations(parsedData)
                }
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error)
            setError("Failed to load recommendations")
        } finally {
            setLoading(false)
        }
    }

    const createAction = async (recommendation) => {
        try {
            const actionData = {
                waste: wasteId,
                category: "reduce",
                description: recommendation.description,
                insight: recommendation.insight || "AI-generated waste reduction recommendation",
                benefit: recommendation.benefit,
                point: recommendation.point,
                quantity: recommendation.quantity_kg,
                finished: false,
            }

            const record = await pb.collection("actions").create(actionData)
            setActionCreated(true)

            // Show success toast
            document.getElementById("success-toast").classList.remove("hidden")
            setTimeout(() => {
                document.getElementById("success-toast").classList.add("hidden")
            }, 3000)

            return record
        } catch (error) {
            console.error("Error creating action record:", error)
            // Show error toast
            document.getElementById("error-toast").classList.remove("hidden")
            setTimeout(() => {
                document.getElementById("error-toast").classList.add("hidden")
            }, 3000)
        }
    }

    const getWasteIcon = (category) => {
        const icons = {
            plastic: "♻️",
            metal: "🔩",
            paper: "📄",
            glass: "🥃",
            organic: "🌱",
            electronic: "💻",
            textile: "👕",
            other: "📦",
        }
        return icons[category?.toLowerCase()] || "📦"
    }

    if (loading) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
                    <div className="text-center">
                        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                        <p className="text-xl font-semibold text-base-content">Generating waste reduction recommendations...</p>
                        <p className="text-base-content/60 mt-2">This may take a few moments</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
                    <div className="text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-error mb-2">Error Loading Data</h2>
                        <p className="text-base-content/70">{error}</p>
                        <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen">
            <Sidebar />

            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-base-200 to-base-300 p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="text-5xl">🌱</div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Waste Reduction Plan
                            </h1>
                        </div>
                        <p className="text-lg text-base-content/70">
                            AI-powered recommendations to reduce your environmental impact
                        </p>
                    </div>

                    {/* Waste Item Info */}
                    {wasteData && (
                        <div className="card bg-base-100 shadow-xl border border-base-300/50">
                            <div className="card-body">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-4xl">{getWasteIcon(wasteData.category)}</div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-base-content">{wasteData.name}</h2>
                                        <p className="text-base-content/70">{wasteData.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="stat bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                                        <div className="stat-title text-primary/70">Category</div>
                                        <div className="stat-value text-primary text-lg">{wasteData.category}</div>
                                    </div>
                                    <div className="stat bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20">
                                        <div className="stat-title text-success/70">Quantity</div>
                                        <div className="stat-value text-success text-lg">{wasteData.quantity}kg</div>
                                    </div>
                                    <div className="stat bg-gradient-to-r from-info/10 to-info/5 rounded-lg border border-info/20">
                                        <div className="stat-title text-info/70">Price/kg</div>
                                        <div className="stat-value text-info text-lg">${wasteData.price_per_kg}</div>
                                    </div>
                                    <div className="stat bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg border border-warning/20">
                                        <div className="stat-title text-warning/70">Status</div>
                                        <div className="stat-value text-warning text-lg">{wasteData.on_sale ? "On Sale" : "Available"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recommendations Section */}
                    {recommendations.length > 0 && (
                        <div className="card bg-base-100 shadow-xl border border-base-300/50">
                            <div className="card-body">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="text-3xl">💡</div>
                                    <h2 className="text-2xl font-bold text-base-content">Reduction Recommendations</h2>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {recommendations.map((recommendation, index) => (
                                        <div
                                            key={index}
                                            className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="card-body">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h3 className="text-xl font-bold text-green-800">Reduction Strategy #{index + 1}</h3>
                                                    <div className="badge badge-success gap-1">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        AI Recommended
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="font-semibold text-green-700 mb-2">📝 Description</h4>
                                                        <p className="text-green-800 bg-white/50 p-3 rounded-lg">{recommendation.description}</p>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold text-green-700 mb-2">🌟 Benefits</h4>
                                                        <p className="text-green-800 bg-white/50 p-3 rounded-lg">{recommendation.benefit}</p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-white/70 p-3 rounded-lg text-center">
                                                            <div className="text-2xl font-bold text-green-600">{recommendation.point}</div>
                                                            <div className="text-sm text-green-700">Impact Points</div>
                                                        </div>
                                                        <div className="bg-white/70 p-3 rounded-lg text-center">
                                                            <div className="text-2xl font-bold text-green-600">{recommendation.quantity_kg}kg</div>
                                                            <div className="text-sm text-green-700">Reduction Target</div>
                                                        </div>
                                                    </div>

                                                    <div className="card-actions justify-end mt-6">
                                                        {!actionCreated ? (
                                                            <button
                                                                className="btn btn-success btn-block"
                                                                onClick={() => createAction(recommendation)}
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M12 4v16m8-8H4"
                                                                    />
                                                                </svg>
                                                                Start This Action Plan
                                                            </button>
                                                        ) : (
                                                            <button className="btn btn-success btn-block" disabled>
                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                                Action Plan Created!
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Impact Visualization */}
                    {selectedRecommendation && (
                        <div className="card bg-base-100 shadow-xl border border-base-300/50">
                            <div className="card-body">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="text-3xl">📊</div>
                                    <h2 className="text-2xl font-bold text-base-content">Expected Impact</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="stat bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-200">
                                        <div className="stat-figure text-green-500 text-4xl">🌱</div>
                                        <div className="stat-title text-green-700">CO2 Reduction</div>
                                        <div className="stat-value text-green-600">
                                            {(selectedRecommendation.quantity_kg * 2.3).toFixed(1)}kg
                                        </div>
                                        <div className="stat-desc text-green-600/70">Estimated CO2 saved</div>
                                    </div>

                                    <div className="stat bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-200">
                                        <div className="stat-figure text-blue-500 text-4xl">💧</div>
                                        <div className="stat-title text-blue-700">Water Saved</div>
                                        <div className="stat-value text-blue-600">
                                            {(selectedRecommendation.quantity_kg * 15).toFixed(0)}L
                                        </div>
                                        <div className="stat-desc text-blue-600/70">Liters of water conserved</div>
                                    </div>

                                    <div className="stat bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-200">
                                        <div className="stat-figure text-purple-500 text-4xl">⚡</div>
                                        <div className="stat-title text-purple-700">Energy Saved</div>
                                        <div className="stat-value text-purple-600">
                                            {(selectedRecommendation.quantity_kg * 5.2).toFixed(1)}kWh
                                        </div>
                                        <div className="stat-desc text-purple-600/70">Kilowatt hours saved</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Steps */}
                    <div className="card bg-base-100 shadow-xl border border-base-300/50">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="text-3xl">✅</div>
                                <h2 className="text-2xl font-bold text-base-content">Next Steps</h2>
                            </div>

                            <div className="steps steps-vertical lg:steps-horizontal w-full">
                                <div className="step step-primary">
                                    <div className="text-left">
                                        <div className="font-semibold">Review Recommendations</div>
                                        <div className="text-sm opacity-70">Analyze AI suggestions</div>
                                    </div>
                                </div>
                                <div className={`step ${actionCreated ? "step-primary" : ""}`}>
                                    <div className="text-left">
                                        <div className="font-semibold">Create Action Plan</div>
                                        <div className="text-sm opacity-70">Start implementation</div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="text-left">
                                        <div className="font-semibold">Track Progress</div>
                                        <div className="text-sm opacity-70">Monitor results</div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="text-left">
                                        <div className="font-semibold">Measure Impact</div>
                                        <div className="text-sm opacity-70">Celebrate success</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            <div id="success-toast" className="toast toast-top toast-end hidden">
                <div className="alert alert-success">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Action plan created successfully!</span>
                </div>
            </div>

            {/* Error Toast */}
            <div id="error-toast" className="toast toast-top toast-end hidden">
                <div className="alert alert-error">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Error creating action plan. Please try again.</span>
                </div>
            </div>
        </div>
    )
}
