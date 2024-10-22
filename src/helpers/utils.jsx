class Utils {
  entity_id = "";
  portal_type = "";

  setEntityID(entity_id) {
    this.entity_id = entity_id;
  }
  setPortalType(portal_type) {
    this.portal_type = portal_type;
  }

  getEntityID() {
    console.log(this.entity_id, "this.entity_id;");
    return this.entity_id;
  }
  getPortalType() {
    console.log(this.portal_type, "this.portal_type;");
    return this.portal_type;
  }
}
const utilsData = new Utils();
export default utilsData;

const currencyIcons = {
  usd: "$",
  eur: "€",
  gbp: "£",
  jpy: "¥",
  cny: "¥",
  inr: "₹",
  aud: "A$",
  cad: "C$",
  chf: "CHF",
  sgd: "S$",
  hkd: "HK$",
  nzd: "NZ$",
  sek: "kr",
  nok: "kr",
  dkk: "kr",
  rub: "₽",
  zar: "R",
  brl: "R$",
  mxn: "MX$",
  pkr: "₨",
  inr: "₹",
  // Add more currency icons as needed
};

export const formattedCurrency = (item) => {
  const currencyCode = (item?.currency || item?.transaction?.currency || "").trim().toLowerCase();
  const amount = item?.amount ?? 0;

  const currencySymbol =
    currencyIcons[currencyCode] ||
    (item?.currency || item?.transaction?.currency || "").toUpperCase().trim() ||
    "";

  const formattedAmount = new Intl.NumberFormat().format(amount) || 0;
  if (currencyIcons[currencyCode]) {
    // If it's a coin currency, place the symbol after the number
    const result = `${currencySymbol}${formattedAmount}`;
    return result.trim();
  } else {
    // Otherwise, place the symbol before the number
    const result = `${formattedAmount}${currencySymbol}`;
    return result.trim();
  }
};
