export function Icon({ name, className = "h-5 w-5" }) {
  const common = { className, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" };

  switch (name) {
    case "menu":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="2">
          <path d="M4 13.5V6.5A2.5 2.5 0 0 1 6.5 4h3A2.5 2.5 0 0 1 12 6.5v7A2.5 2.5 0 0 1 9.5 16h-3A2.5 2.5 0 0 1 4 13.5Z" />
          <path d="M12 17.5V10.5A2.5 2.5 0 0 1 14.5 8h3A2.5 2.5 0 0 1 20 10.5v7A2.5 2.5 0 0 1 17.5 20h-3A2.5 2.5 0 0 1 12 17.5Z" />
        </svg>
      );
    case "kpi":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M7 15l3-3 3 3 5-7" />
        </svg>
      );
    case "submit":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 3v12" />
          <path d="M7 8l5-5 5 5" />
          <path d="M4 21h16" />
        </svg>
      );
    case "approve":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 7l-9 10-4-4" />
          <path d="M4 7h7" />
        </svg>
      );
    case "report":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M7 3h10v18H7z" />
          <path d="M9 7h6M9 11h6M9 15h6" />
        </svg>
      );
    case "profile":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 21a8 8 0 0 0-16 0" />
          <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        </svg>
      );
    case "admin":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4Z" />
          <path d="M9.5 12l1.7 1.7L14.8 10" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4Z" />
        </svg>
      );
    case "db":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M7 18h10a4 4 0 0 0 0-8 5 5 0 0 0-9.7 1.5A3.5 3.5 0 0 0 7 18Z" />
        </svg>
      );
    default:
      return <span className={className} />;
  }
}