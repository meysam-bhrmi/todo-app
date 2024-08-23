// /pages/api/metrics.js
import { register } from '../../lib/metrics';

export default async function handler(req, res) {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
}

