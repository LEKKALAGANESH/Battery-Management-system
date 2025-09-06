import { useEffect, useState } from 'react';

export default function Admin({ api, token }) {
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const countRes = await api.get('/api/auth/admin/user-count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserCount(countRes.data.count);

        const usersRes = await api.get('/api/auth/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersRes.data.users);
      } catch (e) {
        setError(e.response?.data?.error || e.message);
      }
    };
    fetchAdminData();
  }, [api, token]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      {error && <p className="text-red-600">{error}</p>}
      <p>Total Users: {userCount}</p>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left">ID</th>
            <th className="border border-gray-300 p-2 text-left">Email</th>
            <th className="border border-gray-300 p-2 text-left">Password</th>
            <th className="border border-gray-300 p-2 text-left">Role</th>
            <th className="border border-gray-300 p-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border border-gray-300 p-2">{user.id}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">{user.plain_password}</td>
              <td className="border border-gray-300 p-2">{user.role}</td>
              <td className="border border-gray-300 p-2">{new Date(user.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
