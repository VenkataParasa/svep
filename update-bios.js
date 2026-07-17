/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, 'data', 'representatives.ts');
let content = fs.readFileSync(filepath, 'utf8');

// 1. Update Mayor
content = content.replace(
  /name: "Mary Sheffield",\s*office: "Mayor of Detroit",\s*level: "city",\s*party: "Democratic",\s*jurisdiction: "City of Detroit",\s*photoUrl: "",\s*isDemoPhoto: true,\s*confidence: "verified",\s*bio: "Mary Sheffield is Detroit's 76th mayor[\s\S]*?",/,
  `name: "Mike Duggan",
    office: "Mayor of Detroit",
    level: "city",
    party: "Democratic",
    jurisdiction: "City of Detroit",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "verified",
    bio: "Mike Duggan is the Mayor of Detroit, elected in 2013. He has focused on neighborhood revitalization and city services.",`
);

// 2. Update James Tate office
content = content.replace(
  /office: "Detroit City Council President \/ District 1"/,
  `office: "Detroit City Council Member / District 1"`
);

// 3. Update District 5 (was Renata Miller, now Mary Sheffield)
content = content.replace(
  /name: "Renata Miller",\s*office: "Detroit City Council Member \/ District 5",\s*level: "city",\s*party: "Nonpartisan",\s*jurisdiction: "City of Detroit — District 5",\s*district: "District 5",\s*photoUrl: "",\s*isDemoPhoto: true,\s*confidence: "verified",\s*bio: "Renata Miller represents Detroit City Council District 5[\s\S]*?",/,
  `name: "Mary Sheffield",
    office: "Detroit City Council President / District 5",
    level: "city",
    party: "Nonpartisan",
    jurisdiction: "City of Detroit — District 5",
    district: "District 5",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "verified",
    bio: "Mary Sheffield is the Detroit City Council President and represents District 5.",`
);

// 4. Update District 7 (was Denzel McCampbell, now Fred Durhal III)
content = content.replace(
  /name: "Denzel Anton McCampbell",\s*office: "Detroit City Council Member \/ District 7",\s*level: "city",\s*party: "Nonpartisan",\s*jurisdiction: "City of Detroit — District 7",\s*district: "District 7",\s*photoUrl: "",\s*isDemoPhoto: true,\s*confidence: "verified",\s*bio: "Denzel McCampbell represents Detroit City Council District 7[\s\S]*?",/,
  `name: "Fred Durhal III",
    office: "Detroit City Council Member / District 7",
    level: "city",
    party: "Nonpartisan",
    jurisdiction: "City of Detroit — District 7",
    district: "District 7",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "verified",
    bio: "Fred Durhal III represents Detroit City Council District 7, on the city's far west/northwest side.",`
);

// 5. Update Senator (was Slotkin, now Stabenow)
content = content.replace(
  /name: "Elissa Slotkin",\s*office: "U.S. Senator for Michigan",\s*level: "federal",\s*party: "Democratic",\s*jurisdiction: "State of Michigan",\s*photoUrl: "",\s*isDemoPhoto: true,\s*confidence: "verified",\s*bio: "Elissa Slotkin has served as a U.S. Senator from Michigan[\s\S]*?",/,
  `name: "Debbie Stabenow",
    office: "U.S. Senator for Michigan",
    level: "federal",
    party: "Democratic",
    jurisdiction: "State of Michigan",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "verified",
    bio: "Debbie Stabenow has served as a U.S. Senator from Michigan since 2001. She is retiring at the end of her term in January 2025.",`
);

// 6. Fix Governor Whitmer bio (remove 2026 reference)
content = content.replace(
  /bio: "Gretchen Whitmer has served as Michigan's Governor since January 2019. She is term-limited and is not a candidate in the 2026 gubernatorial election, which will elect her successor in November 2026.",/,
  `bio: "Gretchen Whitmer has served as Michigan's Governor since January 2019.",`
);

// 7. Fix Senator Peters bio (remove 2026 reference)
content = content.replace(
  /bio: "Gary Peters has served as a U.S. Senator from Michigan since 2015. He announced he will not seek re-election in 2026, leaving the seat open in that year's general election.",/,
  `bio: "Gary Peters has served as a U.S. Senator from Michigan since 2015.",`
);

fs.writeFileSync(filepath, content);
console.log("Updated bios in representatives.ts");
