export function createPageUrl(pageName) {
    const isGitHubPages = window.location.pathname.includes('/FIT/');
    const base = isGitHubPages ? '/FIT/' : '/';
    return base + pageName.replace(/ /g, '-').replace(/^\//, '');
}