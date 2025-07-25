'use client';

import { useState, useEffect } from 'react';
import { MapPin, Search, X, Menu } from 'lucide-react';
import PocketBase from 'pocketbase';

export default function MarketplacePage() {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Initialize PocketBase
    const pb = new PocketBase('http://202.10.47.143:8090');
    
    // Mock data fallback
    const mockData = {
        items: [
            {
                id: '1',
                name: 'PT Eco Recycle Indonesia',
                address: 'Jl. Industri No. 123, Jakarta Timur',
                location: { lat: -6.200000, lon: 106.816666 },
                waste_accept: ['plastik', 'kertas'],
                image: null
            },
            {
                id: '2',
                name: 'CV Green Waste Solutions',
                address: 'Jl. Lingkungan Hijau No. 45, Jakarta Selatan',
                location: { lat: -6.230000, lon: 106.840000 },
                waste_accept: ['logam', 'organik'],
                image: null
            }
        ]
    };

    const categories = ['plastik', 'kertas', 'logam', 'organik', 'elektronik', 'kaca', 'tekstil'];

    // Load Leaflet CSS
    useEffect(() => {
        if (!document.querySelector('link[href*="leaflet"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }
    }, []);

    // Load Leaflet JS and initialize map
    useEffect(() => {
        const loadLeaflet = async () => {
            if (window.L) {
                initLeafletMap();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => {
                setTimeout(initLeafletMap, 100);
            };
            document.head.appendChild(script);
        };

        const timer = setTimeout(loadLeaflet, 100);
        return () => clearTimeout(timer);
    }, []);

    // Cleanup map on component unmount
    useEffect(() => {
        return () => {
            if (map) {
                map.remove();
                setMap(null);
            }
        };
    }, []);

    const initLeafletMap = () => {
        if (!window.L || map || !document.getElementById('map')) {
            return;
        }

        try {
            const mapInstance = window.L.map('map').setView([-6.208763, 106.845599], 10);
            
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance);

            setMap(mapInstance);
        } catch (error) {
            console.error('Error initializing map:', error);
            setTimeout(() => {
                if (!map && document.getElementById('map')) {
                    initLeafletMap();
                }
            }, 500);
        }
    };

    // Fetch data from PocketBase
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const records = await pb.collection('locations').getFullList({
                    sort: '-created',
                });
                
                const processedRecords = records.map(record => ({
                    ...record,
                    location: record.location || { lat: -6.208763, lon: 106.845599 },
                    waste_accept: Array.isArray(record.waste_accept) ? record.waste_accept : [],
                    address: record.address || 'Alamat tidak tersedia',
                    name: record.name || 'Nama tidak tersedia'
                }));
                
                setCompanies(processedRecords);
                setFilteredCompanies(processedRecords);
            } catch (error) {
                console.error('Error fetching data:', error);
                setCompanies(mockData.items);
                setFilteredCompanies(mockData.items);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    // Update map markers when filtered companies change
    useEffect(() => {
        if (map && window.L && filteredCompanies.length > 0) {
            markers.forEach(marker => {
                if (map.hasLayer(marker)) {
                    map.removeLayer(marker);
                }
            });
            
            const newMarkers = filteredCompanies.map(company => {
                const greenIcon = window.L.divIcon({
                    className: 'custom-div-icon',
                    html: '<div style="background-color: #16a34a; width: 20px; height: 20px; border-radius: 50%; border: 2px solid #15803d; display: flex; align-items: center; justify-content: center;"><div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });

                const marker = window.L.marker([company.location.lat, company.location.lon], {
                    icon: greenIcon
                }).addTo(map);

                const popupContent = `
                    <div style="padding: 8px; min-width: 200px;">
                        <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #166534;">${company.name}</h3>
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">${company.address}</p>
                        <div style="margin-top: 8px;">
                            ${Array.isArray(company.waste_accept) && company.waste_accept.length > 0
                                ? company.waste_accept.map(waste => 
                                    `<span style="display: inline-block; padding: 2px 8px; background-color: #dcfce7; color: #166534; font-size: 12px; border-radius: 12px; margin-right: 4px; margin-bottom: 4px;">${waste}</span>`
                                ).join('')
                                : '<span style="color: #6b7280; font-size: 12px;">Tidak ada info limbah</span>'
                            }
                        </div>
                    </div>
                `;

                marker.bindPopup(popupContent);
                return marker;
            });

            setMarkers(newMarkers);
        }
        
        return () => {
            if (map && markers.length > 0) {
                markers.forEach(marker => {
                    if (map.hasLayer(marker)) {
                        map.removeLayer(marker);
                    }
                });
            }
        };
    }, [map, filteredCompanies]);

    useEffect(() => {
        filterCompanies();
    }, [searchTerm, selectedCategories, companies, userLocation]);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    setUserLocation(location);
                    
                    if (map && window.L) {
                        map.setView([location.lat, location.lon], 12);
                        
                        const redIcon = window.L.divIcon({
                            className: 'custom-div-icon',
                            html: '<div style="background-color: #dc2626; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 0 2px #dc2626;"></div>',
                            iconSize: [16, 16],
                            iconAnchor: [8, 8]
                        });

                        window.L.marker([location.lat, location.lon], {
                            icon: redIcon
                        }).addTo(map).bindPopup('Lokasi Anda').openPopup();
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const filterCompanies = () => {
        let filtered = companies.filter(company => {
            const name = company.name || '';
            const address = company.address || '';
            const wasteTypes = Array.isArray(company.waste_accept) ? company.waste_accept : [];
            
            // Search in name, address, and waste categories
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = searchTerm === '' || 
                                 name.toLowerCase().includes(searchLower) ||
                                 address.toLowerCase().includes(searchLower) ||
                                 wasteTypes.some(waste => waste.toLowerCase().includes(searchLower));
            
            // Filter by selected categories
            const matchesCategory = selectedCategories.length === 0 || 
                                   selectedCategories.some(category => wasteTypes.includes(category));
            
            return matchesSearch && matchesCategory;
        });

        if (userLocation) {
            filtered = filtered.map(company => {
                const companyLat = company.location?.lat || -6.208763;
                const companyLon = company.location?.lon || 106.845599;
                
                return {
                    ...company,
                    distance: calculateDistance(
                        userLocation.lat, userLocation.lon,
                        companyLat, companyLon
                    )
                };
            }).sort((a, b) => a.distance - b.distance);
        }

        setFilteredCompanies(filtered);
    };

    const toggleCategory = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <div className="text-xl text-green-800">Memuat data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">

            <div className="navbar bg-base-100/95 backdrop-blur-sm fixed top-0 z-50 shadow-lg ">
                <div className="navbar-start">
                <div className="dropdown">
                    <div 
                    tabIndex={0} 
                    role="button" 
                    className="btn btn-ghost lg:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                    {mobileMenuOpen ? <X /> : <Menu />}
                    </div>
                    <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg">
                    <li><a onClick={() => smoothScroll('hero')}>Home</a></li>
                    <li><a onClick={() => smoothScroll('features')}>3R Features</a></li>
                    <li><a onClick={() => smoothScroll('marketplace')}>Marketplace</a></li>
                    <li><a onClick={() => smoothScroll('impact')}>Impact</a></li>
                    </ul>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <span className="text-xl font-bold text-success">Re:Process</span>
                </div>
                </div>
                
                <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a onClick={() => smoothScroll('hero')} className="hover:text-success">Home</a></li>
                    <li><a onClick={() => smoothScroll('features')} className="hover:text-success">3R Features</a></li>
                    <li><a onClick={() => smoothScroll('marketplace')} className="hover:text-success">Marketplace</a></li>
                    <li><a onClick={() => smoothScroll('impact')} className="hover:text-success">Impact</a></li>
                </ul>
                </div>
                
                <div className="navbar-end">
                <a href="/auth" className="btn btn-success text-white rounded-full">Login</a>
                </div>
            </div>
            <div className="max-w-7xl mx-auto p-4">
                
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-green-100 mt-20">
                    <div className="flex flex-col gap-4">
                        {/* Search Input */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-green-500" />
                                <input
                                    type="text"
                                    placeholder="Cari perusahaan, lokasi, atau jenis limbah..."
                                    className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={getCurrentLocation}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all ${
                                        userLocation 
                                            ? 'bg-green-100 border-green-300 text-green-700 shadow-sm' 
                                            : 'bg-white border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'
                                    }`}
                                >
                                    <MapPin className="h-5 w-5" />
                                    {userLocation ? 'Lokasi Aktif' : 'Aktifkan Lokasi'}
                                </button>

                                {(searchTerm || selectedCategories.length > 0) && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all"
                                    >
                                        <X className="h-4 w-4" />
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                                
                        

                        {/* Active Filters Display */}
                        {(searchTerm || selectedCategories.length > 0) && (
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <div className="text-sm text-green-700 mb-2">Filter aktif:</div>
                                <div className="flex flex-wrap gap-2">
                                    {searchTerm && (
                                        <span className="bg-white px-3 py-1 rounded-full text-xs border border-green-300 text-green-800">
                                            Pencarian: "{searchTerm}"
                                        </span>
                                    )}
                                    {selectedCategories.map(category => (
                                        <span key={category} className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                                            {category}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-xs text-green-600 mt-2">
                                    Menampilkan {filteredCompanies.length} dari {companies.length} perusahaan
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map */}
                <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden border border-green-100">
                    <div className="bg-green-600 text-white p-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            🗺️ Peta Lokasi Perusahaan
                        </h2>
                        <p className="text-green-100 text-sm">Klik marker untuk melihat detail perusahaan</p>
                    </div>
                    <div id="map" className="h-96 w-full"></div>
                </div>

                {/* Companies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map(company => (
                        <div key={company.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300">
                            <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center relative overflow-hidden">
                                <img 
                                    src={company.image ? `${pb.baseUrl}/api/files/${company.collectionId}/${company.id}/${company.image}` : '/images/placeholder-company.jpg'} 
                                    alt={company.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/images/placeholder-company.jpg';
                                    }}
                                />
                                <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    🏢 Perusahaan
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-green-800 mb-3">{company.name}</h3>
                                <p className="text-gray-600 mb-4 flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-green-500" />
                                    {company.address}
                                </p>
                                
                                {company.distance && (
                                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm text-green-700 font-medium">
                                            📍 {company.distance.toFixed(1)} km dari lokasi Anda
                                        </p>
                                    </div>
                                )}
                                
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-green-800 mb-3">♻️ Menerima limbah:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(company.waste_accept) ? company.waste_accept.map(waste => (
                                            <span key={waste} className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium border border-green-200">
                                                {waste}
                                            </span>
                                        )) : (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                Info tidak tersedia
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                        <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg">
                                            💬 Reach Out
                                        </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCompanies.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-green-100">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-green-600 text-xl font-medium mb-2">Tidak ada perusahaan yang ditemukan</p>
                        <p className="text-green-500">Coba ubah kriteria pencarian Anda</p>
                    </div>
                )}
            </div>
        </div>
    );
}