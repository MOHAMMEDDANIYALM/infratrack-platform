const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Cached JWKS client per tenant to avoid repeated fetches
const clientCache = new Map();

const getJwksClient = (tenantId) => {
  if (clientCache.has(tenantId)) return clientCache.get(tenantId);
  const client = jwksClient({
    jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 10 * 60 * 1000, // 10 minutes
    rateLimit: true,
    jwksRequestsPerMinute: 10,
  });
  clientCache.set(tenantId, client);
  return client;
};

/**
 * Verify a Microsoft ID token (v2.0) and return decoded payload + email.
 * - Validates signature via JWKS
 * - Enforces audience and issuer
 * - Ensures token is an ID token for the expected tenant
 */
async function verifyMicrosoftIdToken({ token, clientId, tenantId }) {
  if (!token) throw new Error('Token is required');
  if (!clientId || !tenantId) throw new Error('Microsoft login not configured');

  const decodedHeader = jwt.decode(token, { complete: true });
  if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
    throw new Error('Invalid Microsoft token: missing header');
  }

  const client = getJwksClient(tenantId);
  const signingKey = await client.getSigningKey(decodedHeader.header.kid);
  const publicKey = signingKey.getPublicKey();

  const payload = jwt.verify(token, publicKey, {
    algorithms: ['RS256'],
    audience: clientId,
    issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
  });

  // Additional safety: ensure token belongs to the same tenant
  if (payload.tid && payload.tid !== tenantId) {
    throw new Error('Invalid Microsoft token: tenant mismatch');
  }

  const email = payload.email || payload.preferred_username || payload.upn;
  if (!email) {
    throw new Error('Invalid Microsoft token: missing email');
  }

  return { payload, email };
}

module.exports = { verifyMicrosoftIdToken };
