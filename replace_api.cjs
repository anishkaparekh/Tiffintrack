// replace_api.cjs
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function replaceInContent(content) {
  const patterns = [
    // single-quote fetch
    { regex: /fetch\(['\"]\/api\//g, replace: 'fetch(`${import.meta.env.VITE_API_URL}/api/' },
    // backtick fetch without env
    { regex: /fetch\(`\/api\//g, replace: 'fetch(`${import.meta.env.VITE_API_URL}/api/' },
    // axios get/post
    { regex: /axios\.get\(['\"]\/api\//g, replace: 'axios.get(`${import.meta.env.VITE_API_URL}/api/' },
    { regex: /axios\.post\(['\"]\/api\//g, replace: 'axios.post(`${import.meta.env.VITE_API_URL}/api/' },
    // generic axios
    { regex: /axios\(['\"]\/api\//g, replace: 'axios(`${import.meta.env.VITE_API_URL}/api/' },
    // backtick literals without env (replace '`/api/' with '`${import.meta.env.VITE_API_URL}/api/')
    { regex: /`\/api\//g, replace: '`${import.meta.env.VITE_API_URL}/api/' },
    { regex: /`\/api\b/g, replace: '`${import.meta.env.VITE_API_URL}/api' }
  ];
  let result = content;
  patterns.forEach(p => { result = result.replace(p.regex, p.replace); });
  return result;
}

const files = glob.sync('src/**/*.{js,jsx,ts,tsx}', { cwd: process.cwd() });
files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  const original = fs.readFileSync(fullPath, 'utf8');
  const updated = replaceInContent(original);
  if (updated !== original) {
    fs.writeFileSync(fullPath, updated, 'utf8');
  }
});
