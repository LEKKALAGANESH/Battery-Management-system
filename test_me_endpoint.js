import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

async function testMeEndpoint() {
    try {
        // Login first
        const loginRes = await api.post('/api/auth/login', {
            email: 'ganesh@gmail.com',
            password: 'demo123'
        });

        const token = loginRes.data.token;
        console.log('Login successful, token:', token.substring(0, 20) + '...');

        // Get user info
        const meRes = await api.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('User info:', meRes.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testMeEndpoint();
