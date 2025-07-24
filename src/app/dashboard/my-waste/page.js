"use client"
import { useEffect, useState } from "react"
import PocketBase from "pocketbase"
import Sidebar from "../components/sidebar"

const MyWaste = () => {
    const [wasteData, setWasteData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price_per_kg: "",
        quantity: "",
        on_sale: false,
        images: null,
    })
    const [submitting, setSubmitting] = useState(false)

    const pb = new PocketBase("http://172.19.79.163:8090")

    // Set light mode by default
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "light")
    }, [])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const result = await pb.collection("wastes").getList(1, 30)
            setWasteData(result.items)
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const formDataToSend = new FormData()
            Object.keys(formData).forEach((key) => {
                if (key === "images" && formData[key]) {
                    formDataToSend.append(key, formData[key])
                } else if (key !== "images") {
                    formDataToSend.append(key, formData[key])
                }
            })

            await pb.collection("wastes").create(formDataToSend)

            // Reset form and close modal
            setFormData({
                name: "",
                description: "",
                category: "",
                price_per_kg: "",
                quantity: "",
                on_sale: false,
                images: null,
            })
            setIsModalOpen(false)

            // Refresh data
            fetchData()

            // Show success message
            document.getElementById("success-toast").classList.remove("hidden")
            setTimeout(() => {
                document.getElementById("success-toast").classList.add("hidden")
            }, 3000)
        } catch (error) {
            console.error("Error creating waste:", error)
            // Show error message
            document.getElementById("error-toast").classList.remove("hidden")
            setTimeout(() => {
                document.getElementById("error-toast").classList.add("hidden")
            }, 3000)
        } finally {
            setSubmitting(false)
        }
    }

    const getCategoryIcon = (category) => {
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

    const getCategoryColor = (category) => {
        const colors = {
            plastic: "badge-info",
            metal: "badge-neutral",
            paper: "badge-warning",
            glass: "badge-accent",
            organic: "badge-success",
            electronic: "badge-secondary",
            textile: "badge-primary",
            other: "badge-ghost",
        }
        return colors[category?.toLowerCase()] || "badge-ghost"
    }

    if (loading) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
                    <div className="text-center">
                        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                        <p className="text-xl font-semibold text-base-content">Loading your waste data...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-base-200 to-base-300 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-base-content mb-2">My Waste Collection</h1>
                            <p className="text-lg text-base-content/70">Manage and track your waste inventory</p>
                            <div className="flex items-center gap-4 mt-3">
                                <div className="badge badge-primary badge-lg">
                                    <span className="font-semibold">{wasteData.length} Items</span>
                                </div>
                                <div className="badge badge-success badge-lg">
                                    <span className="font-semibold">{wasteData.filter((item) => item.on_sale).length} On Sale</span>
                                </div>
                            </div>
                        </div>

                        {/* Add Waste Button */}
                        <button
                            className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Waste
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="stat bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 shadow-lg">
                            <div className="stat-figure text-primary text-3xl">📦</div>
                            <div className="stat-title text-primary/70">Total Items</div>
                            <div className="stat-value text-primary text-2xl">{wasteData.length}</div>
                        </div>

                        <div className="stat bg-gradient-to-r from-success/10 to-success/5 rounded-xl border border-success/20 shadow-lg">
                            <div className="stat-figure text-success text-3xl">💰</div>
                            <div className="stat-title text-success/70">On Sale</div>
                            <div className="stat-value text-success text-2xl">{wasteData.filter((item) => item.on_sale).length}</div>
                        </div>

                        <div className="stat bg-gradient-to-r from-info/10 to-info/5 rounded-xl border border-info/20 shadow-lg">
                            <div className="stat-figure text-info text-3xl">⚖️</div>
                            <div className="stat-title text-info/70">Total Weight</div>
                            <div className="stat-value text-info text-2xl">
                                {wasteData.reduce((sum, item) => sum + (Number.parseFloat(item.quantity) || 0), 0).toFixed(1)}kg
                            </div>
                        </div>

                        <div className="stat bg-gradient-to-r from-warning/10 to-warning/5 rounded-xl border border-warning/20 shadow-lg">
                            <div className="stat-figure text-warning text-3xl">🏷️</div>
                            <div className="stat-title text-warning/70">Categories</div>
                            <div className="stat-value text-warning text-2xl">
                                {new Set(wasteData.map((item) => item.category)).size}
                            </div>
                        </div>
                    </div>

                    {/* Waste Items Grid */}
                    <div className="card bg-base-100 shadow-2xl">
                        <div className="card-body p-6">
                            <h2 className="card-title text-2xl mb-6 text-base-content">Waste Inventory</h2>

                            {wasteData.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📦</div>
                                    <h3 className="text-2xl font-bold text-base-content mb-2">No waste items yet</h3>
                                    <p className="text-base-content/60 mb-6">Start by adding your first waste item to the collection</p>
                                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                                        Add Your First Item
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {wasteData.map((item) => (
                                        <div
                                            key={item.id}
                                            className="card bg-base-100 shadow-lg border border-base-300/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        >
                                            <figure className="px-4 pt-4">
                                                {item.images && item.images.length > 0 ? (
                                                    <img
                                                        src={`http://172.19.79.163:8090/api/files/wastes/${item.id}/${item.images[0]}`}
                                                        alt={item.name}
                                                        className="rounded-xl w-full h-48 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-gradient-to-br from-base-200 to-base-300 rounded-xl flex items-center justify-center">
                                                        <div className="text-6xl opacity-50">📦</div>
                                                    </div>
                                                )}
                                            </figure>

                                            <div className="card-body">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="card-title text-lg">{item.name}</h3>
                                                    {item.on_sale && (
                                                        <div className="badge badge-success gap-1">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            On Sale
                                                        </div>
                                                    )}
                                                </div>

                                                <p className="text-base-content/70 text-sm mb-3 line-clamp-2">{item.description}</p>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                                                    <div className={`badge ${getCategoryColor(item.category)} font-semibold`}>
                                                        {item.category}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div className="bg-base-200 rounded-lg p-2 text-center">
                                                        <div className="font-semibold text-primary">${item.price_per_kg}</div>
                                                        <div className="text-xs text-base-content/60">per kg</div>
                                                    </div>
                                                    <div className="bg-base-200 rounded-lg p-2 text-center">
                                                        <div className="font-semibold text-secondary">{item.quantity}kg</div>
                                                        <div className="text-xs text-base-content/60">available</div>
                                                    </div>
                                                </div>

                                                <div className="card-actions justify-end mt-4">
                                                    <button className="btn btn-sm btn-outline btn-primary">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button className="btn btn-sm btn-outline btn-error">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>

                                                <div className="text-xs text-base-content/50 mt-2">
                                                    Added: {new Date(item.created).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Waste Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-2xl">
                        <h3 className="font-bold text-2xl mb-6 text-center">Add New Waste Item</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full"
                                        placeholder="Enter waste name"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Category</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        <option value="plastic">♻️ Plastic</option>
                                        <option value="metal">🔩 Metal</option>
                                        <option value="paper">📄 Paper</option>
                                        <option value="glass">🥃 Glass</option>
                                        <option value="organic">🌱 Organic</option>
                                        <option value="electronic">💻 Electronic</option>
                                        <option value="textile">👕 Textile</option>
                                        <option value="other">📦 Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Description</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Describe the waste item..."
                                    required
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Price per kg ($)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price_per_kg"
                                        value={formData.price_per_kg}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Quantity (kg)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full"
                                        placeholder="0.0"
                                        step="0.1"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Image</span>
                                </label>
                                <input
                                    type="file"
                                    name="images"
                                    onChange={handleInputChange}
                                    className="file-input file-input-bordered w-full"
                                    accept="image/*"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="checkbox"
                                        name="on_sale"
                                        checked={formData.on_sale}
                                        onChange={handleInputChange}
                                        className="checkbox checkbox-primary"
                                    />
                                    <span className="label-text font-semibold">Put this item on sale</span>
                                </label>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Adding...
                                        </>
                                    ) : (
                                        "Add Waste Item"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            <div id="success-toast" className="toast toast-top toast-end hidden">
                <div className="alert alert-success">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Waste item added successfully!</span>
                </div>
            </div>

            {/* Error Toast */}
            <div id="error-toast" className="toast toast-top toast-end hidden">
                <div className="alert alert-error">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Error adding waste item. Please try again.</span>
                </div>
            </div>
        </div>
    )
}

export default MyWaste
