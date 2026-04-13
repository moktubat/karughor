export function getAdminToken(): string {
    if (typeof window === 'undefined') return '';
    try { return localStorage.getItem('admin_token') || ''; } catch { return ''; }
}

export function adminAuthHeaders(): Record<string, string> {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}