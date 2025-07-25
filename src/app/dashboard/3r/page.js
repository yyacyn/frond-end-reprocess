"use client"
import { useEffect, useState } from "react"
import PocketBase from "pocketbase"
import Sidebar from "../components/sidebar"
import { FaRecycle } from "react-icons/fa"

// const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
const pb = new PocketBase('http://202.10.47.143:8090');
// const pb = new PocketBase('http://172.19.79.163:8090');


const ThreeRPage = () => {
    const [wasteData, setWasteData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [is3RModalOpen, setIs3RModalOpen] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
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

    // Set light mode by default
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "light")
    }, [])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const userId = pb.authStore.model?.id; // Get the current user's ID
            if (!userId) {
                console.error("User is not logged in.");
                return;
            }

            // Fetch waste items where the `user` field matches the current user's ID
            const result = await pb.collection("stocks").getList(1, 30, {
                filter: `user = "${userId}"`,
            });

            setWasteData(result.items);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

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
            anorganic: "♻️",
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
            anorganic: "badge-info",
        }
        return colors[category?.toLowerCase()] || "badge-ghost"
    }

    // Fixed handleEdit function
    const handleEdit = (item) => {
        setCurrentEditItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            category: item.category,
            price_per_kg: item.price_per_kg,
            quantity: item.quantity,
            on_sale: item.on_sale,
            images: null, // Images won't be pre-filled
        });
        setIs3RModalOpen(true);
    };

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
        );
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
                            <h1 className="text-4xl font-bold text-base-content mb-2">Recycle, Reduce, Reuse Waste</h1>
                            <p className="text-lg text-base-content/70">Start turning your trash into treasure</p>
                        </div>
                    </div>

                    {/* Waste Items Table */}
                    <div className="card bg-base-100 shadow-2xl">
                        <div className="card-body p-6">
                            <div className="flex justify-between mb-6">
                                <h2 className="card-title text-2xl text-base-content">Waste Inventory</h2>
                            </div>
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
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        {/* Table header */}
                                        <thead>
                                            <tr>
                                                <th className="bg-base-200">Image</th>
                                                <th className="bg-base-200">Name</th>
                                                <th className="bg-base-200">Category</th>
                                                <th className="bg-base-200">Description</th>
                                                <th className="bg-base-200 text-center">Price (Rp/kg)</th>
                                                <th className="bg-base-200 text-center">Quantity (kg)</th>
                                                <th className="bg-base-200 text-center">Status</th>
                                                <th className="bg-base-200 text-center">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {wasteData.map((item) => (
                                                <tr key={item.id} className="hover">
                                                    {/* Image */}
                                                    <td className="w-20">
                                                        {item.images && item.images.length > 0 ? (
                                                            <img
                                                                src={`http://202.10.47.143:8090/api/files/wastes/${item.id}/${item.images[0]}`}
                                                                alt={item.name}
                                                                className="rounded-md w-16 h-16 object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-16 bg-base-200 rounded-md flex items-center justify-center">
                                                                <div className="text-2xl opacity-50">📦</div>
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Name */}
                                                    <td className="font-medium text-[#000000]">{item.name}</td>

                                                    {/* Category */}
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <span>{getCategoryIcon(item.category)}</span>
                                                            <div className={`badge ${getCategoryColor(item.category)}`}>
                                                                {item.category}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Description */}
                                                    <td className="max-w-xs">
                                                        <p className="line-clamp-2 text-sm text-base-content/70">
                                                            {item.description}
                                                        </p>
                                                    </td>

                                                    {/* Price */}
                                                    <td className="text-center font-semibold text-primary">
                                                        {item.price_per_kg}
                                                    </td>

                                                    {/* Quantity */}
                                                    <td className="text-center font-semibold text-secondary">
                                                        {item.stock_quantity}
                                                    </td>

                                                    {/* Status */}
                                                    <td className="text-center">
                                                        {item.on_sale ? (
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
                                                        ) : (
                                                            <div className="badge badge-ghost">Not For Sale</div>
                                                        )}
                                                    </td>

                                                    {/* Actions */}
                                                    <td>
                                                        <div className="flex justify-center items-center gap-2">
                                                            <button
                                                                className={`btn btn-s btn-outline btn-primary items-center px-5 ${item.on_sale ? "btn-disabled" : ""}`}
                                                                onClick={() => {
                                                                    if (item.on_sale) {
                                                                        // Show a pop-up if the item is on sale
                                                                        alert("This item is currently on sale and cannot be processed for 3R actions.");
                                                                    } else {
                                                                        handleEdit(item);
                                                                    }
                                                                }}
                                                            >
                                                                <FaRecycle /> 3R
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                        {/* Table footer with summary */}
                                        <tfoot>
                                            <tr>
                                                <td colSpan="8" className="bg-base-200">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span>Total items: <strong>{wasteData.length}</strong></span>
                                                        <span>Total weight: <strong>{wasteData.reduce((sum, item) => sum + (Number.parseFloat(item.quantity) || 0), 0).toFixed(1)}kg</strong></span>
                                                        <span>Items on sale: <strong>{wasteData.filter((item) => item.on_sale).length}</strong></span>
                                                        <span>Last updated: <strong>{new Date().toLocaleDateString()}</strong></span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}

                            {/* 3R Modal */}
                            {is3RModalOpen && (
                                <div className="modal modal-open">
                                    <div className="modal-box w-11/12 max-w-2xl">
                                        <h3 className="font-bold text-2xl mb-6 text-center text-[#000000]">What do you want to do with your waste?</h3>
                                        <div className="flex flex-col md:flex-row justify-center gap-3 mb-6">
                                            {/* Reduce Button */}
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setIs3RModalOpen(false);
                                                    window.location.href = `/dashboard/3r/reduce?id=${currentEditItem.id}&action=reduce`;
                                                }}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                    Reduce
                                                </span>
                                            </button>

                                            {/* Reuse Button */}
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    setIs3RModalOpen(false);
                                                    window.location.href = `/dashboard/3r/reuse?id=${currentEditItem.id}&action=reuse`;
                                                }}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Reuse
                                                </span>
                                            </button>

                                            {/* Recycle Button */}
                                            <button
                                                className="btn btn-accent"
                                                onClick={() => {
                                                    setIs3RModalOpen(false);
                                                    window.location.href = `/dashboard/3r/recycle?id=${currentEditItem.id}&action=recycle`;
                                                }}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <FaRecycle className="w-4 h-4" />
                                                    Recycle
                                                </span>
                                            </button>

                                            {/* Cancel Button */}
                                            <button
                                                className="btn bg-[#FF0000] text-[#ffffff] hover:bg-[#FF0000]/90"
                                                onClick={() => {
                                                    setIs3RModalOpen(false);
                                                }}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Cancel
                                                </span>
                                            </button>
                                        </div>

                                        {/* Loading indicator when fetching recommendations */}
                                        {loading && (
                                            <div className="flex justify-center items-center mt-4">
                                                <div className="loading loading-spinner loading-md text-primary"></div>
                                                <span className="ml-2 text-base-content">Generating recommendations...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThreeRPage