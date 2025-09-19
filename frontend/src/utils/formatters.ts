function getOrdinalSuffix(n: number): string {
  const absN = Math.abs(n);
  const lastTwo = absN % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
  switch (absN % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

export function formatYear(art: { year?: string; year_specificity?: string }) {
    const { year, year_specificity } = art;
    if (!year_specificity) return "";

    const yearNum = year ? Number(year) : null;

    if (year_specificity.includes("exact")) {
        return year ?? "";
    }

    if (year_specificity.includes("year")) {
        return yearNum !== null ? `c. ${yearNum}` : "";
    }

    if (year_specificity.includes("decade")) {
        return yearNum !== null ? `${yearNum}s` : "";
    }

    if (year_specificity.includes("century")) {
        if (yearNum === null) return "";
        const century = Math.ceil(Math.abs(yearNum) / 100);
        return `${getOrdinalSuffix(century)} century ${yearNum > 0 ? "A.D." : "B.C."}`;
    }

    if (year_specificity.includes("millennium")) {
        if (yearNum === null) return "";
        const millennium = Math.ceil(Math.abs(yearNum) / 1000);
        return `${getOrdinalSuffix(millennium)} millennium ${yearNum > 0 ? "A.D." : "B.C."}`;
    }

    if (year_specificity.includes("unknown")) {
        return "Unknown";
    }

    return "";
}

export function formatDate(dateString?: string): string {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function formatRuntime(runtime?: string): string {
    if (!runtime) return "Unknown runtime";
    const [hours, minutes, seconds] = runtime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + Math.round((seconds || 0) / 60);
    return `${totalMinutes} mins`
}