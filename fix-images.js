const fs = require('fs');
const path = './server/seed/seedData.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/image: \".*?\"/g, (match, offset, str) => {
    const chunk = str.substring(Math.max(0, offset - 100), offset + 100);
    if (chunk.includes('Pickles & Condiments')) return 'image: "/images/product-pickle.png"';
    if (chunk.includes('Snacks and Namkeen')) return 'image: "/images/product-snack.png"';
    if (chunk.includes('Mukhvas & Digestives')) return 'image: "/images/product-mukhwas.png"';
    if (chunk.includes('Dry/Instant Grocery')) return 'image: "/images/product-grocery.png"';
    return 'image: "/images/product-pickle.png"';
});

fs.writeFileSync(path, content);
console.log("Images updated.");
