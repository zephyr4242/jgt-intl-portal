/** Legacy cleanup hook retained for the shared logout action. */
export function clearDemoSession () {
  try {
    localStorage.removeItem('jiyu_demo')
    localStorage.removeItem('jiyu_users')
    localStorage.removeItem('jiyu_demo_post_status')
    sessionStorage.removeItem('jiyu_demo_auth_code')
  } catch (e) { /* ignore unavailable browser storage */ }
}
