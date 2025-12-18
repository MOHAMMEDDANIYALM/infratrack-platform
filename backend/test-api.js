// Quick API Test Script
const API_BASE = 'http://localhost:8080';

async function testAPI(endpoint, token) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await response.json();
    console.log(`✅ ${endpoint}:`, response.status, data);
    return data;
  } catch (e) {
    console.error(`❌ ${endpoint}:`, e.message);
  }
}

async function runTests() {
  console.log('Testing InfraTrack API Endpoints...\n');
  
  // 1. Health check
  await testAPI('/health');
  
  console.log('\n⚠️  Protected endpoints require auth token. Set TOKEN env var to test.\n');
  
  const token = process.env.TOKEN;
  if (token) {
    console.log('Testing protected endpoints...\n');
    await testAPI('/api/dashboard/metrics', token);
    await testAPI('/api/servers', token);
    await testAPI('/api/logs', token);
    await testAPI('/api/alerts', token);
    await testAPI('/api/costs', token);
    await testAPI('/api/deployments', token);
    await testAPI('/api/users', token);
  }
}

runTests();
