import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// In production Vercel serves api/*.js as serverless functions. This plugin
// runs the same handlers inside `npm run dev`, so no Vercel CLI is needed locally.
function devApi() {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api/check', async (req, res) => {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        try {
          req.body = JSON.parse(Buffer.concat(chunks).toString() || '{}');
        } catch {
          req.body = {};
        }
        res.status = (code) => ((res.statusCode = code), res);
        res.json = (obj) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(obj));
        };
        const { default: handler } = await server.ssrLoadModule('/api/check.js');
        await handler(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'GEMINI_');
  Object.assign(process.env, env);
  return {
    plugins: [react(), devApi()],
    // The lazily loaded country borders chunk is ~750KB (~230KB gzipped) by design.
    build: { chunkSizeWarningLimit: 800 },
  };
});
