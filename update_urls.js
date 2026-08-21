const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Replace "http://127.0.0.1:8000/api..." with \\/api...\
    // We only replace fetch calls.
    content = content.replace(/fetch\(\s*['"]http:\/\/127\.0\.0\.1:8000([^'"]+)['"]\s*([,)])/g, 
        'fetch(\\\$2');
    
    // Also replace ternary options like : "http://127.0.0.1:8000..."
    content = content.replace(/:\s*['"]http:\/\/127\.0\.0\.1:8000([^'"]+)['"]/g, 
        ': \\\');
        
    fs.writeFileSync(file, content, 'utf8');
});
console.log('Done');
