"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Sidebar from "../../components/sidebar"
import PocketBase from "pocketbase"

const pb = new PocketBase("http://202.10.47.143:8090")

export default function ReusePage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const wasteId = searchParams.get("id")
    const action = searchParams.get("action")

    const [loading, setLoading] = useState(true)
    const [wasteData, setWasteData] = useState(null)
    const [recommendations, setRecommendations] = useState([])
    const [selectedRecommendation, setSelectedRecommendation] = useState(null)
    const [actionCreated, setActionCreated] = useState(false)
    const [error, setError] = useState(null)
    const [actionId, setActionId] = useState(null)
    const [validationText, setValidationText] = useState("")
    const [validating, setValidating] = useState(false)
    const [validationSuccess, setValidationSuccess] = useState(false)
    const [validationError, setValidationError] = useState(null)

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

                if (action === "reuse" && parsedData[1]) {
                    const reuseData = parsedData[1]
                    setRecommendations([reuseData])
                    setSelectedRecommendation(reuseData)

                    // Create action immediately
                    createAction(reuseData)
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
                category: "reuse",
                description: recommendation.description,
                insight: recommendation.insight || "AI-generated waste reusage recommendation",
                benefit: recommendation.benefit,
                point: recommendation.point,
                quantity: recommendation.quantity_kg,
                finished: false,
                tasks: JSON.stringify([
                    {
                        title: "Research Best Practices",
                        description: `Research best practices for ${recommendation.category || "waste reusage"} related to this material.`,
                        estimated_days: 2
                    },
                    {
                        title: "Create Implementation Plan",
                        description: `Develop a detailed plan to implement "${recommendation.description.split('.')[0]}".`,
                        estimated_days: 3
                    },
                    {
                        title: "Track Progress",
                        description: "Create a tracking system to monitor the impact of your waste reusage efforts.",
                        estimated_days: 7
                    },
                    {
                        title: "Implement Changes",
                        description: "Begin implementing the waste reusage strategy in your daily routine.",
                        estimated_days: 14
                    },
                    {
                        title: "Share Results",
                        description: "Document your experience and share learnings with others.",
                        estimated_days: 5
                    }
                ]),
            }

            const record = await pb.collection("actions").create(actionData)
            setActionCreated(true)
            setActionId(record.id)

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

    const validateTaskCompletion = async () => {
        if (!actionId || !validationText || validationText.length < 50) {
            setValidationError("Please provide a detailed explanation of at least 50 characters");
            return;
        }

        setValidating(true);
        setValidationError(null);

        try {
            const response = await fetch("http://202.10.47.143:8090/api/actions/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action_id: actionId,
                    text: validationText,
                    waste_id: wasteId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const isValid = await response.json(); // Expecting a boolean response

            if (isValid) {
                setValidationSuccess(true);

                // Update action as finished in the database
                await pb.collection("actions").update(actionId, {
                    finished: true,
                    completion_date: new Date().toISOString(),
                });

                // Show validation success toast
                document.getElementById("validation-success-toast").classList.remove("hidden");
                setTimeout(() => {
                    document.getElementById("validation-success-toast").classList.add("hidden");
                }, 3000);

                // Don't redirect automatically - let user choose their next action
            } else {
                setValidationError("Validation failed. Please provide more details about your completed tasks.");
            }
        } catch (error) {
            console.error("Error validating action:", error);
            setValidationError("Failed to validate your submission. Please try again.");
        } finally {
            setValidating(false);
        }
    };

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
                        <p className="text-xl font-semibold text-base-content">Generating waste reusage recommendations...</p>
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
                        <div className="flex items-center justify-start gap-3 mb-4">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                reuse
                            </h1>
                        </div>
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

                    {/* Task Recommendations */}
                    {/* Recommendations Section - Two Cards Side by Side */}
                    {recommendations.length > 0 && (
                        <div className="card bg-base-100 shadow-xl border border-base-300/50 flex flex-col md:flex-row">
                            {/* Task Finished (Immediate Points) */}
                            <div className="card-body border-r border-base-300 md:w-1/2">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="text-3xl">✅</div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-base-content">Task Finished</h2>
                                        <p className="text-sm text-base-content/70">Points awarded automatically</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {recommendations.map((recommendation, index) => (
                                        <div
                                            key={index}
                                            className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="card-body">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h3 className="text-xl font-bold text-blue-800">Quick Action #{index + 1}</h3>
                                                    <div className="badge badge-info gap-1">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Completed
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-blue-800 bg-white/50 p-3 rounded-lg">
                                                            Basic waste awareness action completed: You've taken the first step by analyzing this waste item.
                                                        </p>
                                                    </div>


                                                    <div className="card-actions justify-end mt-6">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Task Recommendations (Future Points) */}
                            <div className="card-body md:w-1/2">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="text-3xl">💡</div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-base-content">Task Recommendations</h2>
                                        <p className="text-sm text-base-content/70">Complete these tasks for more points</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {recommendations.map((recommendation, index) => (
                                        <div
                                            key={index}
                                            className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="card-body">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h3 className="text-xl font-bold text-green-800">Reusage Strategy #{index + 1}</h3>
                                                    <div className="badge badge-success gap-1">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Earn {recommendation.point} Points
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
                                                            <div className="text-sm text-green-700">Reusage Target</div>
                                                        </div>
                                                    </div>

                                                    <div className="card-actions justify-end mt-6">
                                                        {/* Button is now always disabled, as action is created automatically */}
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Task Validation Section - Always visible since action is created automatically */}
                    {recommendations.length > 0 && (
                        <div id="validation-section" className="card bg-base-100 shadow-xl border border-base-300/50">
                            <div className="card-body">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="text-3xl">🔍</div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-base-content">Task Validation</h2>
                                        <p className="text-sm text-base-content/70">Provide details about how you've completed the task</p>
                                    </div>
                                </div>

                                {!validationSuccess ? (
                                    <>
                                        <div className="space-y-6">
                                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-yellow-700">
                                                            To earn your points, please describe in detail how you've implemented the waste reusage strategy.
                                                            Include specific actions taken, challenges faced, and results achieved.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold text-base-content mb-2">Your Implementation Details</h3>
                                                <textarea
                                                    className="textarea textarea-bordered w-full h-48 text-[#000000]"
                                                    placeholder="Describe in detail how you've implemented this waste reusage strategy. Include specific steps taken, methods used, challenges faced, and any measurable results (e.g., 'I reused my plastic consumption by 30% by...', 'I implemented a composting system that processes 2kg of waste weekly...', etc.)"
                                                    value={validationText}
                                                    onChange={(e) => setValidationText(e.target.value)}
                                                ></textarea>
                                                <div className="text-sm text-base-content/70 mt-2">
                                                    Minimum 50 characters. Current length: {validationText.length} characters.
                                                </div>
                                            </div>

                                            {validationError && (
                                                <div className="alert alert-error">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    <span>{validationError}</span>
                                                </div>
                                            )}

                                            <div className="card-actions justify-end mt-6 gap-2 flex flex-col sm:flex-row">
                                                <button
                                                    className="btn btn-outline btn-warning order-2 sm:order-1"
                                                    onClick={() => router.push("/dashboard/3r")}
                                                >
                                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                    </svg>
                                                    Skip Validation
                                                </button>
                                                <button
                                                    className="btn btn-primary order-1 sm:order-2"
                                                    onClick={validateTaskCompletion}
                                                    disabled={validating || validationText.length < 50}
                                                >
                                                    {validating ? (
                                                        <>
                                                            <div className="loading loading-spinner loading-sm"></div>
                                                            Validating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                            </svg>
                                                            Submit for Validation
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-6xl mb-4">🎉</div>
                                        <h3 className="text-2xl font-bold text-success mb-2">Task Successfully Validated!</h3>
                                        <p className="text-lg text-base-content/70 mb-6">
                                            Congratulations! Your waste reusage efforts have been validated and you've earned impact points.
                                        </p>

                                        <div className="stats shadow bg-success/10 mx-auto mb-6">
                                            <div className="stat">
                                                <div className="stat-title text-success/70">Impact Points Earned</div>
                                                <div className="stat-value text-success">{recommendations[0]?.point || "500+"}</div>
                                                <div className="stat-desc text-success/70">For completing this task</div>
                                            </div>
                                        </div>

                                        <div className="alert bg-blue-50 border border-blue-200 mb-6">
                                            <div className="flex gap-3">
                                                <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <h3 className="font-bold text-blue-800">Complete more tasks for additional points!</h3>
                                                    <p className="text-sm text-blue-600">
                                                        You've successfully reused waste. Want to earn more impact points?
                                                        Try completing additional waste reusage tasks.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => router.push("/dashboard/home")}
                                            >
                                                Return to Dashboard
                                            </button>
                                            <button
                                                className="btn btn-outline btn-success"
                                                onClick={() => router.push("/dashboard/3r")}
                                            >
                                                Find More Tasks
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Toast */}
            <div id="success-toast" className="toast toast-top toast-end hidden">
                <div className="alert alert-success">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Action plan created automatically!</span>
                </div>
            </div>

            {/* Validation Success Toast */}
            <div id="validation-success-toast" className="toast toast-top toast-end hidden">
                <div className="alert alert-success">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Task validated successfully! Points awarded.</span>
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

// export default function ReusePage() {
//     return (
//         <Suspense fallback={<div>Loading...</div>}>
//             <RecycleContent />
//         </Suspense>
//     )
// }