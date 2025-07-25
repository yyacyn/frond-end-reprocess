"use client";

import { useState } from 'react';
import PocketBase from 'pocketbase';

// const pb = new PocketBase('http://202.10.47.143:8090');
const pb = new PocketBase('http://172.19.79.163:8090');

export default function Login() {
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const authData = await pb.collection('users').authWithPassword(email, password);

            console.log(pb.authStore.isValid);
            console.log(pb.authStore.token);
            console.log(pb.authStore.record.id);

            window.location.href = '/dashboard/home';

        } catch (err) {
            setError('Email atau password salah');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validation
        if (password !== confirmPassword) {
            setError('Password dan konfirmasi password tidak sama');
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password minimal 8 karakter');
            setLoading(false);
            return;
        }

        try {
            const data = {
                "email": email,
                "password": password,
                "passwordConfirm": confirmPassword,
                "name": name
            };

            const record = await pb.collection('users').create(data);
            console.log('Registration success:', record);

            setSuccess('Registrasi berhasil! Silakan login dengan akun Anda.');

            // Clear form and switch to login tab
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setName('');
            setTimeout(() => {
                setActiveTab('login');
                setSuccess('');
                console.log(pb.authStore.isValid);
                console.log(pb.authStore.token);
                console.log(pb.authStore.record.id);
            }, 2000);

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Gagal mendaftar, silakan coba lagi');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const authMethods = await pb.collection('users').listAuthMethods();

            const googleProvider = authMethods.authProviders.find(
                provider => provider.name === 'google'
            );

            if (!googleProvider) {
                throw new Error('Google OAuth tidak tersedia');
            }

            const authData = await pb.collection('users').authWithOAuth2({
                provider: 'google',
                urlCallback: window.location.origin + '/login',
            });

            console.log('Google auth success:', authData);
            window.location.href = '/dashboard/home';

        } catch (err) {
            console.error('Google auth error:', err);
            setError('Gagal masuk dengan Google: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const switchTab = (tab) => {
        setActiveTab(tab);
        setError('');
        setSuccess('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-400 to-blue-500 items-center justify-center p-12">
                <div className="text-center">
                    <div className="mb-8">
                        <svg className="w-32 h-32 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2M12 7.5L11.45 9.5L9.5 10L11.45 10.5L12 12.5L12.55 10.5L14.5 10L12.55 9.5L12 7.5Z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Recycle Together</h1>
                    <p className="text-lg text-white/90">Bergabunglah dalam gerakan daur ulang untuk bumi yang lebih hijau</p>
                </div>
            </div>

            {/* Right side - Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Tabs */}
                    <div role="tablist" className="tabs tabs-box mb-8 w-full flex justify-evenly">
                        <a
                            role="tab"
                            className={`tab w-1/2 ${activeTab === 'login' ? 'tab-active' : ''}`}
                            onClick={() => switchTab('login')}
                        >
                            Masuk
                        </a>
                        <a
                            role="tab"
                            className={`tab w-1/2 ${activeTab === 'register' ? 'tab-active' : ''}`}
                            onClick={() => switchTab('register')}
                        >
                            Daftar
                        </a>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {activeTab === 'login' ? 'Masuk' : 'Daftar'}
                        </h2>
                        <p className="text-gray-600 mt-2">
                            {activeTab === 'login'
                                ? 'Silakan masuk ke akun Anda'
                                : 'Buat akun baru untuk bergabung'
                            }
                        </p>
                    </div>

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <form className="space-y-6" onSubmit={handleLogin}>
                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-error">
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Email Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Masukkan email Anda"
                                    className="input input-bordered w-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Masukkan password Anda"
                                    className="input input-bordered w-full"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">Lupa password?</a>
                                </label>
                            </div>

                            {/* Login Button */}
                            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                                {loading ? <span className="loading loading-spinner"></span> : 'Masuk'}
                            </button>

                            {/* Divider */}
                            <div className="divider">ATAU</div>

                            {/* Google Login Button */}
                            <button
                                type="button"
                                className="btn btn-outline w-full gap-2"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {loading ? <span className="loading loading-spinner"></span> : 'Masuk dengan Google'}
                            </button>
                        </form>
                    )}

                    {/* Register Form */}
                    {activeTab === 'register' && (
                        <form className="space-y-6" onSubmit={handleRegister}>
                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-error">
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="alert alert-success">
                                    <span>{success}</span>
                                </div>
                            )}

                            {/* Name Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Nama Lengkap</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama lengkap Anda"
                                    className="input input-bordered w-full"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Masukkan email Anda"
                                    className="input input-bordered w-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Minimal 8 karakter"
                                    className="input input-bordered w-full"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Confirm Password Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Konfirmasi Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Ulangi password Anda"
                                    className="input input-bordered w-full"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Register Button */}
                            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                                {loading ? <span className="loading loading-spinner"></span> : 'Daftar'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
