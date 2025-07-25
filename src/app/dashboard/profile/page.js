"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/sidebar"
import PocketBase from "pocketbase"
import { User, Mail, MapPin, Calendar, Edit3, Save, X } from "lucide-react"

const pb = new PocketBase("http://202.10.47.143:8090")

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authData = pb.authStore.model
        if (authData) {
          const userData = await pb.collection("users").getFirstListItem(`id="${authData.id}"`)
          setUser(userData)
          setNewName(userData.name)
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = {
        emailVisibility: true,
        name: newName,
        role: user.role,
        location: user.location || { lon: 0, lat: 0 },
      }
      const record = await pb.collection("users").update(user.id, data)
      setUser({ ...user, name: record.name })
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update user:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setNewName(user.name)
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white rounded-lg shadow p-8 max-w-md w-full mx-4">
            <div className="animate-pulse">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-24 mx-auto mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white rounded-lg shadow p-8 max-w-md w-full mx-4 text-center">
            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h2>
            <p className="text-gray-600">Unable to load your profile information.</p>
          </div>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(user.created).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const formattedLocation =
    user.location && (user.location.lat !== 0 || user.location.lon !== 0)
      ? `${user.location.lat.toFixed(4)}, ${user.location.lon.toFixed(4)}`
      : "Not specified"

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-grow p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Avatar Section */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
                {user.avatar ? (
                  <img
                    src={`http://202.10.47.143:8090/api/files/users/${user.id}/${user.avatar}`}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "flex"
                    }}
                  />
                ) : null}
                <User className="w-12 h-12 text-white" style={{ display: user.avatar ? "none" : "block" }} />
              </div>

              {/* Name Section */}
              {isEditing ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-2xl font-bold text-gray-800 text-center border-b-2 border-blue-300 focus:outline-none focus:border-blue-500 px-2 py-1"
                  placeholder="Enter your name"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              )}

              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mt-2">
                {user.role}
              </span>
            </div>

            {/* Information */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-800">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-800">{formattedLocation}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
