
export const REGIONS = [
  "Africa",
  "Asia Pacific",
  "Europe",
  "Latam",
  "Middle East",
  "North America"
];

// Updated LANGUAGES list with "None" only as the first option
export const LANGUAGES = [
  "None",
  "English",
  "French",
  "Portuguese",
  "Spanish"
];

export const INDUSTRIES = [
  "Aviation",
  "Cruise",
  "Data Center Operators",
  "Data Center Providers",
  "Energy",
  "Government",
  "Hyperscalers",
  "Internet Service Providers",
  "Maritime",
  "Media & Broadcasters",
  "Mining",
  "MNO",
  "Sports & Organizations",
  "System Integrators",
  "Telco",
  "Utilities"
];

export interface TrustedSource {
  name: string;
  segment: string[];
  region: string;
}

export interface KeywordPair {
  visible: string;
  real: string;
}

// Keywords by industry with visible/real keyword pairs (limited to 5 per industry)
export const keywordsByIndustry: Record<string, KeywordPair[]> = {
  "Government": [
    { visible: "SatCom",           real: "satellite communications" },
    { visible: "Gov SatCom",       real: "government satellite communications" },
    { visible: "Gov Telecom",      real: "government telecom" },
    { visible: "Gov Connectivity", real: "government connectivity" },
    { visible: "Defense Infra",    real: "defense connectivity" },
    { visible: "Gov Broadband",    real: "broadband rollout" },
    { visible: "Secure Comms",     real: "secure communications" },
    { visible: "Public Tech",      real: "public sector technology" }
  ],
  "Energy": [
    { visible: "Smart Grid",        real: "energy telecom" },
    { visible: "Renewable Telco",   real: "renewable energy connectivity" },
    { visible: "Offgrid SatCom",    real: "offshore energy communications" },
    { visible: "OilGas IoT",        real: "oil gas IoT communications" },
    { visible: "Grid Storage",      real: "energy storage" },
    { visible: "Energy SCADA",      real: "SCADA security" },
    { visible: "Hydro Monitoring",  real: "hydro monitoring" },
    { visible: "Remote Energy",     real: "remote energy connectivity" }
  ],
  "Mining": [
    { visible: "Mining SatCom",     real: "remote mining connectivity" },
    { visible: "Smart Mining",      real: "mining connectivity" },
    { visible: "Mine Safety",       real: "safety monitoring" },
    { visible: "Autonomous Mining", real: "autonomous mining" },
    { visible: "Exploration IoT",   real: "exploration IoT" },
    { visible: "Mining Comms",      real: "mining communications" },
    { visible: "Underground Net",   real: "mining broadband" },
    { visible: "Mining 5G",         real: "mining 5G" }
  ],
  "Utilities": [
    { visible: "Smart Metering",   real: "smart metering" },
    { visible: "Infra Comms",      real: "infrastructure communications" },
    { visible: "Water IoT",        real: "water IoT" },
    { visible: "Waste Sensors",    real: "waste IoT" },
    { visible: "Smart Lighting",   real: "lighting control" },
    { visible: "Utilities SatCom", real: "IoT satellite" },
    { visible: "Grid Monitoring",  real: "grid telecom" },
    { visible: "Smart Utilities",  real: "city telecom" }
  ],
  "Cloud Service providers": [
    { visible: "Cloud Cables",        real: "cloud hyperscaler" },
    { visible: "Edge Cloud",          real: "cloud telecom" },
    { visible: "Multi Cloud",         real: "multi cloud" },
    { visible: "Cloud Orchestration", real: "cloud orchestration" },
    { visible: "Cloud Security",      real: "cloud security" },
    { visible: "Sat Backhaul",        real: "satellite backhaul" },
    { visible: "CSP Network",         real: "cloud network integration" },
    { visible: "Cloud Infra",         real: "cloud telco partnerships" }
  ],
  "Telco": [
    { visible: "5G Infra",         real: "5G infrastructure" },
    { visible: "Telco SatCom",     real: "telco backhaul" },
    { visible: "Open RAN",         real: "open RAN" },
    { visible: "Fiber Build",      real: "fiber rollout" },
    { visible: "Network Slicing",  real: "network slicing" },
    { visible: "Telco Transform",  real: "network transformation" },
    { visible: "MENA Telco",       real: "telecom innovation" },
    { visible: "Private Telco",    real: "telecom investment" }
  ],
  "MNO (Mobile Network Operators)": [
    { visible: "MNO SatCom",     real: "satellite partnerships" },
    { visible: "Rural Mobile",   real: "rural connectivity" },
    { visible: "Roaming Deals",  real: "roaming partnerships" },
    { visible: "eSIM Growth",    real: "eSIM adoption" },
    { visible: "MNO Strategy",   real: "emerging markets telecom" },
    { visible: "Private 5G",     real: "private 5G" },
    { visible: "LATAM 5G",       real: "5G rollout" },
    { visible: "Orchestration",  real: "MNO satellite partnerships" }
  ],
  "Data Center Operators": [
    { visible: "Edge DC",        real: "edge telco" },
    { visible: "DC Innovation",  real: "data center connectivity" },
    { visible: "DC Cooling",     real: "cooling efficiency" },
    { visible: "DC Energy",      real: "renewable energy" },
    { visible: "DC Automation",  real: "ops automation" },
    { visible: "DC Backup",      real: "hyperscale satellite backup" },
    { visible: "DC Trends",      real: "interconnection networks" },
    { visible: "DC Cables",      real: "data cables" }
  ],
  "Hyperscalers": [
    { visible: "SatCom",          real: "hyperscaler connectivity" },
    { visible: "Edge Regions",    real: "edge regions" },
    { visible: "AI Chips",        real: "AI hardware" },
    { visible: "Sovereign Cloud", real: "sovereign cloud" },
    { visible: "Cloud Net",       real: "hyperscaler telecom" },
    { visible: "Telco Deals",     real: "cloud scale networking" },
    { visible: "AI Infra",        real: "AI infrastructure connectivity" },
    { visible: "CDN Optimize",    real: "CDN optimization" }
  ],
  "Media & Broadcasters": [
    { visible: "Broadcast Sat",  real: "broadcast telecom" },
    { visible: "DRM Security",   real: "DRM security" },
    { visible: "Live Production",real: "live production" },
    { visible: "Sports Streaming",real: "sports streaming" },
    { visible: "OTT Infra",      real: "OTT infrastructure" },
    { visible: "IPTV Sat",       real: "IPTV distribution" },
    { visible: "5G Broadcast",   real: "5G broadcasting" },
    { visible: "Media Latency",  real: "media distribution latency" }
  ],
  "Data Center Providers": [
    { visible: "Colo Backup",    real: "satellite backup" },
    { visible: "Cloud Onramps",  real: "cloud onramps" },
    { visible: "Colo Security",  real: "physical security" },
    { visible: "Colo Expansion", real: "capacity expansion" },
    { visible: "Neutral DC",     real: "carrier connectivity" },
    { visible: "Edge Compute",   real: "edge deployment" },
    { visible: "DC Resilience",  real: "data center resilience" },
    { visible: "DC Interconnect",real: "disaster recovery telecom" }
  ],
  "Aviation": [
    { visible: "Inflight Comms", real: "inflight connectivity" },
    { visible: "Airport WiFi",   real: "airport connectivity" },
    { visible: "Crew Ops",       real: "crew communications" },
    { visible: "UAV Traffic",    real: "drone management" },
    { visible: "Aviation Trends",real: "aviation connectivity" },
    { visible: "Airline 5G",     real: "airline 5G" },
    { visible: "ATC Modernize",  real: "airport connectivity upgrades" },
    { visible: "Aviation Net",   real: "aviation broadband" }
  ],
  "Maritime": [
    { visible: "Maritime Net",   real: "maritime connectivity" },
    { visible: "Vessel IoT",     real: "vessel telecom" },
    { visible: "Shipping Digital",real: "shipping broadband" },
    { visible: "Maritime Cyber", real: "maritime networks" },
    { visible: "Port 5G",        real: "port 5G" },
    { visible: "Green Shipping", real: "fuel efficiency" },
    { visible: "Fleet Tracking", real: "fleet tracking" },
    { visible: "VSAT Deploy",    real: "VSAT deployment" }
  ],
  "Cruise": [
    { visible: "Cruise Net",     real: "cruise ship connectivity" },
    { visible: "Shore Backhaul", real: "port backhaul" },
    { visible: "Luxury Cruise",  real: "cruise connectivity" },
    { visible: "Cruise IoT",     real: "cruise IoT" },
    { visible: "Crew WiFi",      real: "crew connectivity" },
    { visible: "Onboard Apps",   real: "app services" },
    { visible: "Cruise 5G",      real: "5G cruise" },
    { visible: "Smart Cruise",   real: "smart cruise ship networks" }
  ],
  "Internet Service Providers": [
    { visible: "Rural ISP",     real: "ISP connectivity" },
    { visible: "Fiber vs Sat",  real: "fiber vs satellite" },
    { visible: "Emerging ISPs", real: "markets internet" },
    { visible: "ISP Converge",  real: "network convergence" },
    { visible: "LEO ISPs",      real: "LEO constellations" },
    { visible: "Peering Deals", real: "peering agreements" },
    { visible: "FWA Growth",    real: "fixed wireless" },
    { visible: "MEO ISPs",      real: "MEO constellations" }
  ]
};



