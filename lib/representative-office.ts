type OfficeDetails = {
  office: string;
  level: string;
  jurisdiction?: string | null;
  district?: string | null;
};

function districtValue(details: OfficeDetails) {
  return (details.district || details.jurisdiction || "").trim();
}

export function representativeOfficeLabel(details: OfficeDetails) {
  const office = details.office.trim() || "Elected Official";
  const value = districtValue(details);
  const numericDistrict = /^\d+$/.test(value);
  const atLarge = /at[ -]?large/i.test(value);
  const normalizedOffice = office.toLowerCase();

  if (normalizedOffice.includes("representative")) {
    const title = details.level === "federal" ? "U.S. Representative" : "State Representative";
    if (numericDistrict) {
      const districtName = details.level === "federal" ? "Congressional District" : "House District";
      return `${title} - ${districtName} ${value}`;
    }
    if (value && !normalizedOffice.includes(value.toLowerCase())) return `${title} - ${value}`;
    return title;
  }

  if (normalizedOffice.includes("senator")) {
    const title = details.level === "federal" ? "U.S. Senator" : "State Senator";
    if (numericDistrict && details.level === "state") return `${title} - Senate District ${value}`;
    if (value && !/^(mi|united states)$/i.test(value)) return `${title} - ${value}`;
    return title;
  }

  if (normalizedOffice.includes("council")) {
    if (atLarge) return `${office} - At Large`;
    if (numericDistrict) return `${office} - Council District ${value}`;
    if (value && !normalizedOffice.includes(value.toLowerCase())) return `${office} - ${value}`;
  }

  return office;
}

export function representativeJurisdictionLabel(details: OfficeDetails) {
  const value = districtValue(details);
  if (!value) return "Jurisdiction not available";
  if (/^\d+$/.test(value)) {
    const office = details.office.toLowerCase();
    if (office.includes("council")) return `Council District ${value}`;
    if (details.level === "federal" && office.includes("representative")) {
      return `Congressional District ${value}`;
    }
    if (details.level === "state" && office.includes("senator")) return `State Senate District ${value}`;
    if (details.level === "state" && office.includes("representative")) return `State House District ${value}`;
  }
  return /at[ -]?large/i.test(value) ? "At Large" : value;
}
