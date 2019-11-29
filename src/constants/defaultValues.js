/*
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuType = "menu-hidden";
export const baseURL = 'http://localhost:2906'
export const reCaptchaKey = '6Lc12rEUAAAAAAdO7UU3VFRsNBlo2KN9djcxgRHH'
export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = "en";
export const localeOptions = [
  { id: "en", name: "English", direction: "ltr" },
];

export const coinData = {
  BTC: {
    name: "Bitcoin",
    asset: "BTC",
    img_url: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png?1547033579"
  },
  USDT: {
    name: "Tether",
    asset: "USDT",
    img_url: "https://assets.coingecko.com/coins/images/325/thumb/tether.png?1547034089"
  }
}

export const searchPath = "/app/pages/search";

export const isMultiColorActive = false;
export const defaultColor = "dark.blue";
export const defaultDirection = "ltr";
export const isDarkSwitchActive = true;
export const themeColorStorageKey="__theme_color";
