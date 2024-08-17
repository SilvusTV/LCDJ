export function isSmartphone() {
  return window.innerWidth < 768
}
export function isTablet() {
  return window.innerWidth >= 768 && window.innerWidth < 1024
}
