export const sections = [
  ["intro", "Home"],
  ["about", "About"],
  ["work", "Projects"],
  ["toolkit", "Skills"],
  ["contact", "Contact"],
];

export const projects = [
  {
    id: "01",
    title: "Finlytic AI",
    type: "FINTECH / PERSONAL FINANCE",
    summary: "A clearer picture of personal spending, one transaction at a time.",
    description:
      "A personal finance application focused on expense tracking, spending analysis, and context-aware recommendations, with Retrieval-Augmented Generation (RAG) to ground AI responses in relevant financial context.",
    stack: ["Python", "SQLite", "Streamlit", "Pandas", "RAG"],
    href: "https://github.com/arka-builds/Finlytic-AI",
    kind: "finance",
    status: "Application project",
  },
  {
    id: "02",
    title: "SupplyShield",
    type: "DATA ANALYTICS / SUPPLY CHAIN",
    summary: "Making procurement data easier to understand—and supplier performance easier to act on.",
    description:
      "A Power BI analytics project exploring purchase orders, supplier performance, and supply chain signals using a Python and MySQL data workflow.",
    stack: ["Python", "MySQL", "Power BI"],
    href: "https://github.com/arka-builds/SupplyShield",
    kind: "supply",
    status: "Analytics project",
  },
  {
    id: "03",
    title: "InsightIndia",
    type: "ANALYTICS / BUSINESS INTELLIGENCE",
    summary: "Turning data into meaningful insights and smarter decisions.",
    description:
      "An end-to-end data analytics portfolio featuring five projects across e-commerce, road safety, government finance, marketing experiments, and business intelligence. It combines data cleaning, exploratory analysis, SQL querying, statistical methods, and interactive dashboards to uncover trends and communicate actionable insights.",
    stack: ["Python", "SQL", "Pandas", "NumPy", "Plotly", "Streamlit", "SQLite", "Power BI", "Tableau"],
    href: "https://github.com/arka-builds/InsightIndia",
    kind: "insight",
    status: "Analytics project",
  },
];

export const skillGroups = [
  ["Build", "Python", "SQL", "Java · fundamentals"],
  ["Analyze", "Pandas", "NumPy", "Power BI", "Data visualization"],
  ["Work with data", "MySQL", "SQLite", "DBMS"],
  ["Tools & foundations", "Git / GitHub", "Streamlit", "FastAPI", "RAG", "Machine Learning", "Statistics", "OOP"],
];

export const contacts = [
  { label: "EMAIL", text: "arka829636@gmail.com", href: "mailto:arka829636@gmail.com", icon: "mail" },
  { label: "GITHUB", text: "GitHub Profile", href: "https://github.com/arka-builds", icon: "github", external: true },
  { label: "LINKEDIN", text: "LinkedIn Profile", href: "https://www.linkedin.com/in/arka-mondal-am/", icon: "linkedin", external: true },
  { label: "INSTAGRAM", text: "@arkamondal_", href: "https://www.instagram.com/arkamondal_/", icon: "instagram", external: true },
];
