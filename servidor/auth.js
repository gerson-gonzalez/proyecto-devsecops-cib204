// Autenticacion JWT mediante Keycloak y JWKS
const { jwtVerify, createRemoteJWKSet } = require('jose');
const config = require('./config');

// Direccion interna para consultar las claves publicas de Keycloak
const jwksUrl = new URL(
  `${config.KEYCLOAK_URL}/realms/${config.KEYCLOAK_REALM}/protocol/openid-connect/certs`
);

const JWKS = createRemoteJWKSet(jwksUrl);

// Emisor real configurado en Keycloak
const issuer = process.env.KEYCLOAK_ISSUER;

async function requiereAuth(req, res, next) {
  if (!config.AUTH_ENABLED) {
    return next();
  }

  const authorization = req.headers.authorization || '';
  const match = /^Bearer\s+(.+)$/i.exec(authorization);

  if (!match || !issuer) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { payload } = await jwtVerify(match[1], JWKS, {
      algorithms: ['RS256'],
      issuer,
    });

    req.usuario = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'No autorizado' });
  }
}

module.exports = { requiereAuth };
