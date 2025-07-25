"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://172.19.79.163:8090');

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");
    const [newAvatar, setNewAvatar] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const authData = pb.authStore.model;
                if (authData) {
                    const userData = await pb.collection('users').getFirstListItem(`id="${authData.id}"`);
                    setUser(userData);
                    setNewName(userData.name);
                    setNewAvatar(userData.avatar);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        try {
            const data = {
                emailVisibility: true,
                name: newName,
                role: user.role,
                location: {
                    lon: 0,
                    lat: 0,
                },
            };

            const record = await pb.collection('users').update(user.id, data);
            setUser({ ...user, name: record.name, avatar: record.avatar });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>No user data found.</div>;
    }

    const formattedDate = new Date(user.created).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="flex">
            <Sidebar />
            <div className="p-4 bg-gray-100 min-h-screen flex-grow">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Profile</h1>
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto">
                    <div className="flex flex-col items-center mb-6">
                        {isEditing ? (
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="text-center text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        ) : (
                            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                        )}
                        {isEditing ? (
                            <input
                                type="text"
                                value={newAvatar}
                                onChange={(e) => setNewAvatar(e.target.value)}
                                className="text-center text-gray-500 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        ) : (
                            <img
                                src={`http://172.19.79.163:8090/api/files/users/${user.id}/${user.avatar}`}
                                alt="User Avatar"
                                className="w-32 h-32 rounded-full shadow-md mb-4"
                            />
                        )}
                    </div>
                    <div className="text-gray-700">
                        <p className="mb-2"><span className="font-semibold">Joined:</span> {formattedDate}</p>
                        <p className="mb-2"><span className="font-semibold">Role:</span> {user.role}</p>
                    </div>
                    <div className="mt-4 text-center">
                        {isEditing ? (
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
