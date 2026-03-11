export const hasSessionCookie = (): boolean =>
  typeof document !== 'undefined' && document.cookie.includes('malinkiddy_session=');

export const hasAdminCookie = (): boolean =>
  typeof document !== 'undefined' && document.cookie.includes('malinkiddy_admin_session=');
