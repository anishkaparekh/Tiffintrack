// replace_api.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function replaceInContent(content) {
  const patterns = [
    { regex: /fetch\(['"]\/api\//g, replace: 'fetch(`${import.meta.env.VITE_API_URL}/api/' },
    { regex: /axios\.get\(['"]\/api\//g, replace: 'axios.get(`${import.meta.env.VITE_API_URL}/api/' },
    { regex: /axios\.post\(['"]\/api\//g, replace: 'axios.post(`${import.meta.env.VITE_API_URL}/api/' },
    { regex: /axios\(['"]\/api\//g, replace: 'axios(`${import.meta.env.VITE_API_URL}/api/' }
  ];
  let result = content;
  patterns.forEach(p => { result = result.replace(p.regex, p.replace); });
  return result;
}

glob('src/**/*.{js,jsx,ts,tsx}', { cwd: process.cwd() }, (err, files) => {
  if (err) { console.error(err); process.exit(1); }
  files.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    const original = fs.readFileSync(fullPath, 'utf8');
    const updated = replaceInContent(original);
    if (updated !== original) {
      fs.writeFileSync(fullPath, updated, 'utf8');
    }
  });
});
