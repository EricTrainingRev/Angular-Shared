// helper script to serve the bundled Angular app for viewing
// Note this is not a replacement for ng serve, just an option if you
// want to build the app and then view it

const express = require('express');
const path = require('path');

const app = express();
const dist = path.join(__dirname, 'dist', 'pokedex', 'browser');

// Serve static assets (js, css, images, favicon) from the built output.
app.use(express.static(dist));

// SPA fallback: serve index.html for any request that isn't a static file,
// so client-side routes (e.g. /home) work on refresh and deep links.
app.use((req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serving Pokedex at http://localhost:${PORT}`));
