/**
 * רכיב ניווט משותף - נטען בכל הדפים
 * שימוש: הוסף <nav id="main-nav"></nav> ב-HTML ו-<script src="js/nav.js"></script>
 */
(function() {
    const navLinks = [
        { href: 'index.html', icon: '🏠', text: 'דף הבית' },
        { href: 'menu.html', icon: '📅', text: 'תפריטים' },
        { href: 'search-labels.html', icon: '🔍', text: 'חיפוש מוסד' },
        { href: 'production-report.html', icon: '🔥', text: 'דוח ייצור חם' }
    ];

    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        return page;
    }

    function renderNav() {
        const navContainer = document.getElementById('main-nav');
        if (!navContainer) return;

        const currentPage = getCurrentPage();

        navContainer.className = 'main-nav';
        navContainer.innerHTML = navLinks.map(link => {
            const isActive = currentPage === link.href ||
                            (currentPage === '' && link.href === 'index.html');
            return `<a href="${link.href}" class="nav-link${isActive ? ' active' : ''}">${link.icon} ${link.text}</a>`;
        }).join('');
    }

    // הרצה כאשר ה-DOM מוכן
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNav);
    } else {
        renderNav();
    }
})();
