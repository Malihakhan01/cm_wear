const fs = require('fs');

const content = fs.readFileSync('src/config/megaMenuData.ts', 'utf8');

// Match all divisions
const divisions = [];
const divisionRegex = /id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*number:\s*"([^"]+)"/g;
let match;
while ((match = divisionRegex.exec(content)) !== null) {
  divisions.push({
    id: match[1],
    slug: match[2],
    name: match[3],
    number: match[4]
  });
}

console.log('Found divisions:', divisions);

// Let's also check groups and productTypes
const groupRegex = /name:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*productTypes:\s*\[([\s\S]*?)\]/g;
let groupMatch;
let totalGroups = 0;
while ((groupMatch = groupRegex.exec(content)) !== null) {
  totalGroups++;
  console.log(`Group: ${groupMatch[1]} (${groupMatch[2]})`);
}
console.log('Total groups:', totalGroups);
