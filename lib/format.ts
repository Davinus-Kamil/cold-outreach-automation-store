const INDIA_TIME_ZONE = "Asia/Kolkata";

export function formatInrFromPaise(amountPaise: number): string {
  if (!Number.isFinite(amountPaise)) {
    return "";
  }

  const totalPaise = Math.trunc(amountPaise);
  const negative = totalPaise < 0;
  const absolutePaise = Math.abs(totalPaise);
  const rupees = Math.trunc(absolutePaise / 100);
  const leftoverPaise = absolutePaise % 100;
  const groupedRupees = new Intl.NumberFormat("en-IN", {
    useGrouping: true,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(rupees);
  const sign = negative ? "-" : "";

  if (leftoverPaise === 0) {
    return `${sign}₹${groupedRupees}`;
  }

  return `${sign}₹${groupedRupees}.${String(leftoverPaise).padStart(2, "0")}`;
}

export function formatMoneyFromPaise(amountPaise: number, currency: string): string {
  if (currency === "INR") {
    return formatInrFromPaise(amountPaise);
  }
  return `${currency} ${Math.trunc(amountPaise)}`;
}

export function formatPurchaseDateInIndia(value: string | null): string {
  if (!value) {
    return "Verified purchase";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Verified purchase";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: INDIA_TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
