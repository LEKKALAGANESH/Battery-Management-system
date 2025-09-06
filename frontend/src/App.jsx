import axios from "axios";
import { useEffect, useState } from "react";
import BatteryChart from "./components/BatteryChart";
import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./components/Admin";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login"); // 👈 track whether to show Login or Register
  const [view, setView] = useState("dashboard"); // 👈 track current view
  const [batteryId, setBatteryId] = useState("1001");
  const [field, setField] = useState("voltage");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [range, setRange] = useState({ start: "", end: "" });

  console.log(mode)

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
      } catch (e) {
        console.error('Failed to fetch user:', e);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (!token || view !== 'dashboard') return;
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (range.start) params.start = range.start;
        if (range.end) params.end = range.end;
        const res = await api.get(`/api/battery/${batteryId}/${field}`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        setData(res.data);
      } catch (e) {
        setError(e.response?.data?.error || e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, batteryId, field, range.start, range.end, view]);

  // 🟢 Show Login/Register when user is not authenticated
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {mode === "login" ? (
          <Login api={api} onAuthed={setToken} onSwitchToRegister={() => setMode("register")} />
        ) : (
          <Register api={api} onRegistered={() => setMode("login")} onSwitchToLogin={() => setMode("login")} />
        )}
      </div>
    );
  }

  // 🟢 Show dashboard when authenticated
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold">BMS Dashboard</h1>
          <nav className="flex space-x-4">
            <button
              className={`px-3 py-1 rounded ${view === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setView('dashboard')}
            >
              Dashboard
            </button>
            {user?.role === 'admin' && (
              <button
                className={`px-3 py-1 rounded ${view === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setView('admin')}
              >
                Admin
              </button>
            )}
          </nav>
        </div>
        <button
          className="px-4 py-2 rounded-xl bg-slate-900 text-white"
          onClick={() => setToken(null)}
        >
          Logout
        </button>
      </header>

      {view === 'dashboard' && (
        <>
          <section className="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Battery ID</label>
              <input
                value={batteryId}
                onChange={(e) => setBatteryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border"
                placeholder="1001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Field</label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border"
              >
                <option value="voltage">Voltage</option>
                <option value="current">Current</option>
                <option value="temperature">Temperature</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start (ISO)</label>
              <input
                value={range.start}
                onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border"
                placeholder="2024-08-19T10:00:00Z"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End (ISO)</label>
              <input
                value={range.end}
                onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border"
                placeholder="2024-08-19T12:00:00Z"
              />
            </div>
          </section>

          <section className="p-4 rounded-2xl bg-white shadow-sm">
            {loading ? (
              <p className="animate-pulse">Loading…</p>
            ) : (
              <BatteryChart data={data} field={field} />
            )}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </section>
        </>
      )}

      {view === 'admin' && <Admin api={api} token={token} />}
    </div>
  );
}
