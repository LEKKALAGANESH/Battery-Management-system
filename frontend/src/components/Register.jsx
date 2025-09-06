import { useState } from 'react'

export default function Register({ api, onRegistered, onSwitchToLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const submit = async e => {
        e.preventDefault()
        setLoading(true); setError('')
        try {
            const res = await api.post('/api/auth/register', { email, password })
            onRegistered()
        } catch (e) {
            setError(e.response?.data?.error || e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-2xl shadow-sm">
                <h1 className="text-xl font-semibold">Register</h1>
                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input className="w-full px-3 py-2 rounded-xl border" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
                </div>
                <div>
                    <label className="block text-sm mb-1">Password</label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} className="w-full px-3 py-2 pr-10 rounded-xl border" value={password} onChange={e => setPassword(e.target.value)} required />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? '👁️' : '🙈'}
                        </button>
                    </div>
                </div>
                <button disabled={loading} className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white">{loading ? 'Signing up…' : 'Sign up'}</button>
                {error && <p className="text-red-600">{error}</p>}
                <p className="text-center text-sm mt-2">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        Login
                    </button>
                </p>
            </form>
        </div>
    )
}
