import { useState } from 'react'

export default function Login({ api, onAuthed, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await api.post('/api/auth/login', { email, password })
      onAuthed(res.data.token)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-white p-3 -pb-3 rounded-2xl shadow-sm">
        <h1 className="text-xl font-semibold">Login</h1>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full px-3 py-2 rounded-xl border" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} className="w-full px-3 py-2 pr-10 rounded-xl border" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>
        <button disabled={loading} className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white">{loading ? 'Signing in…' : 'Sign in'}</button>
        <p className="text-center text-sm">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Sign up
          </button>
        </p>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  )
}
