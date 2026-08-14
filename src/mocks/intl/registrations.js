export const REGISTRATION_STORAGE_KEY = 'jgt-intl-mock-registrations'

export function loadRegistrations () {
  try { return JSON.parse(localStorage.getItem(REGISTRATION_STORAGE_KEY) || '[]') } catch (e) { return [] }
}

export function saveRegistrations (items) {
  localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(items))
}
