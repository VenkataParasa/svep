import fs from "fs";
import path from "path";

async function fetchSamples() {
  const jsonDir = path.join(process.cwd(), "JSON");
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir);
  }

  // 1. Cicero API
  console.log("Fetching Cicero...");
  try {
    const ciceroRes = await fetch("https://cicero.azavea.com/v3.1/official?key=40e38926bc5ea0a4842d044a28e978c78a6ebaae&search_postal=48103&search_country=US&format=json");
    const ciceroData = await ciceroRes.json();
    fs.writeFileSync(path.join(jsonDir, "cicero-official-response.json"), JSON.stringify(ciceroData, null, 2));
    console.log("Saved Cicero.");
  } catch(e) { console.error("Cicero failed", e); }

  // 2. Google Civic API
  console.log("Fetching Google Civic...");
  try {
    const civicRes = await fetch(`https://www.googleapis.com/civicinfo/v2/voterinfo?address=1000%20Bank%20St%20Richmond%20VA%2023219&key=AIzaSyAaZxaLz6vIBD9uOQPdOp3NvAkJFVkxirw`);
    const civicData = await civicRes.json();
    fs.writeFileSync(path.join(jsonDir, "google-civic-voterinfo-response.json"), JSON.stringify(civicData, null, 2));
    console.log("Saved Google Civic.");
  } catch(e) { console.error("Google Civic failed", e); }

  // 3. Open States API
  console.log("Fetching Open States...");
  try {
    const osRes = await fetch("https://v3.openstates.org/bills?jurisdiction=Michigan&q=housing&sort=updated_desc&per_page=3", {
      headers: { 'X-API-KEY': "f419c3ec-84bc-43b3-b41d-d498693b5456" }
    });
    const osData = await osRes.json();
    fs.writeFileSync(path.join(jsonDir, "open-states-bills-response.json"), JSON.stringify(osData, null, 2));
    console.log("Saved Open States.");
  } catch(e) { console.error("Open States failed", e); }
}

fetchSamples();
