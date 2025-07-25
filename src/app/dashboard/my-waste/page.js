"use client"
import { useEffect, useState } from "react"
import PocketBase from "pocketbase"
import Sidebar from "../components/sidebar"

// const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
const pb = new PocketBase('http://202.10.47.143:8090');
// const pb = new PocketBase('http://172.19.79.163:8090');

const MyWaste = () => {
    const [wasteData, setWasteData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
            const result = await pb.collection("wastes").getList(1, 30, {
                filter: `user = "${userId}"`,
            });

            setWasteData(result.items);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "file" ? Array.from(files) : value, // Handle multiple files
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "images" && formData[key]?.length > 0) {
                    formData[key].forEach((file) => {
                        formDataToSend.append(key, file); // Append multiple images
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Add the user ID to the form data
            formDataToSend.append("user", pb.authStore.model?.id);

            await pb.collection("wastes").create(formDataToSend);

            // Reset form and refresh data
            setFormData({
                name: "",
                description: "",
                category: "",
                price_per_kg: "",
                quantity: "",
                on_sale: false,
                images: null,
            });
            setIsModalOpen(false);
            fetchData();

            // Show success message
            document.getElementById("success-toast").classList.remove("hidden");
            setTimeout(() => {
                document.getElementById("success-toast").classList.add("hidden");
            }, 3000);
        } catch (error) {
            console.error("Error creating waste:", error);
            // Show error message
            document.getElementById("error-toast").classList.remove("hidden");
            setTimeout(() => {
                document.getElementById("error-toast").classList.add("hidden");
            }, 3000);
        } finally {
            setSubmitting(false);
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
        setIsEditModalOpen(true);
    };

    // Fixed handleEditSubmit function
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "images" && formData[key]?.length > 0) {
                    formData[key].forEach((file) => {
                        formDataToSend.append(key, file);
                    });
                } else if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            await pb.collection("wastes").update(currentEditItem.id, formDataToSend);

            // Show success toast
            document.getElementById("success-edit-toast").classList.remove("hidden");
            setTimeout(() => {
                document.getElementById("success-edit-toast").classList.add("hidden");
            }, 3000);

            setIsEditModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error updating waste:", error);
            // Show error toast
            document.getElementById("error-toast").classList.remove("hidden");
            setTimeout(() => {
                document.getElementById("error-toast").classList.add("hidden");
            }, 3000);
        } finally {
            setSubmitting(false);
        }
    };

    // Fixed handleDelete function
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await pb.collection("wastes").delete(id);

            // Show success toast
            document.getElementById("success-delete-toast").classList.remove("hidden");
            setTimeout(() => {
                document.getElementById("success-delete-toast").classList.add("hidden");
            }, 3000);

            fetchData();
        } catch (error) {
            console.error("Error deleting waste:", error);
            // Show error toast
            document.getElementById("error-toast").classList.remove("hidden");
            setTimeout(() => {
                document.getElementById("error-toast").classList.add("hidden");
            }, 3000);
        }
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
                            className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-100"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Waste
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex flex-row gap-6 justify-between">
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
                    </div>

                    {/* Waste Items Table */}
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
                                                                src={`http://172.19.79.163:8090/api/files/wastes/${item.id}/${item.images[0]}`}
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
                                                        {item.quantity}
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
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                className="btn btn-xs btn-outline btn-primary"
                                                                onClick={() => handleEdit(item)}
                                                            >
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

                                                            <button
                                                                className="btn btn-xs btn-outline btn-error"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Waste Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-2xl">
                        <h3 className="font-bold text-2xl mb-6 text-center text-[#000000]">Add New Waste Item</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-[#000000]">Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="input input-bordered text-[#0D0D0D] w-full"
                                        placeholder="Enter waste name"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-[#000000]">Category</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="select select-bordered w-full text-[#000000]"
                                        required
                                    >
                                        <option value="" className="text-[#0D0D0D]">Select category</option>
                                        <option value="anorganic">♻️ Anorganic</option>
                                        <option value="organic">🌱 Organic</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-control flex flex-col ">
                                <label className="label">
                                    <span className="label-text font-semibold text-[#000000]">Description</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="textarea textarea-bordered h-24 text-[#0D0D0D]"
                                    placeholder="Describe the waste item..."
                                    required
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-[#000000]">Price per kg (Rp)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price_per_kg"
                                        value={formData.price_per_kg}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full text-[#0D0D0D]"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-[#000000]">Quantity (kg)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full text-[#0D0D0D]"
                                        placeholder="0.0"
                                        step="0.1"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-[#000000]">Image</span>
                                </label>
                                <input
                                    type="file"
                                    name="images"
                                    onChange={handleInputChange}
                                    className="file-input file-input-bordered w-full text-[#0D0D0D]"
                                    accept="image/*" multiple
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
                                    <span className="label-text font-semibold text-[#000000]">Put this item on sale</span>
                                </label>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost text-[#000000]"
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

            {/* Edit Waste Modal */}
            {isEditModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-2xl">
                        <h3 className="font-bold text-2xl mb-6 text-center text-[#000000]">Edit Waste Item</h3>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-[#000000]">Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="input input-bordered text-[#0D0D0D] w-full"
                                        placeholder="Enter waste name"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-[#000000]">Category</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="select select-bordered w-full text-[#000000]"
                                        required
                                    >
                                        <option value="" className="text-[#0D0D0D]">Select category</option>
                                        <option value="anorganic">♻️ Anorganic</option>
                                        <option value="organic">🌱 Organic</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-control flex flex-col ">
                                <label className="label">
                                    <span className="label-text font-semibold text-[#000000]">Description</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="textarea textarea-bordered h-24 text-[#0D0D0D]"
                                    placeholder="Describe the waste item..."
                                    required
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-[#000000]">Price per kg (Rp)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price_per_kg"
                                        value={formData.price_per_kg}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full text-[#0D0D0D]"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-[#000000]">Quantity (kg)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full text-[#0D0D0D]"
                                        placeholder="0.0"
                                        step="0.1"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-[#000000]">Image</span>
                                </label>
                                <input
                                    type="file"
                                    name="images"
                                    onChange={handleInputChange}
                                    className="file-input file-input-bordered w-full text-[#0D0D0D]"
                                    accept="image/*" multiple
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
                                    <span className="label-text font-semibold text-[#000000]">Put this item on sale</span>
                                </label>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost text-[#000000]"
                                    onClick={() => setIsEditModalOpen(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Waste Item"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Toast - Add */}
            <div id="success-toast" className="toast toast-top toast-end hidden">
                <div className="alert alert-success">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Waste item added successfully!</span>
                </div>
            </div>

            {/* Success Toast - Edit */}
            <div id="success-edit-toast" className="toast toast-top toast-end hidden">
                <div className="alert alert-success">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Waste item updated successfully!</span>
                </div>
            </div>

            {/* Success Toast - Delete */}
            <div id="success-delete-toast" className="toast toast-top toast-end hidden">
                <div className="alert alert-success">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Waste item deleted successfully!</span>
                </div>
            </div>

            {/* Error Toast */}
            <div id="error-toast" className="toast toast-top toast-end hidden">
                <div className="alert alert-error">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Error processing your request. Please try again.</span>
                </div>
            </div>
        </div>
    )
}

export default MyWaste