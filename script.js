const scrollSpyObserverOptions = { threshold: 0.2 };

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. THEME MANAGEMENT (Light / Dark Mode Toggle)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeStatusText = document.getElementById('theme-status-text');
    const htmlElement = document.documentElement;

    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update button status label
        if (theme === 'dark') {
            themeStatusText.textContent = 'Dark';
        } else {
            themeStatusText.textContent = 'Light';
        }
    }

    // ==========================================================================
    // 2. SMOOTH SCROLLING WITH OFFSET
    // ==========================================================================
    const navLinks = document.querySelectorAll('.nav-link, .logo-text, .scroll-arrow-link');
    const headerHeight = document.getElementById('main-header').offsetHeight;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            // Only handle internal anchor links
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const sectionTop = targetSection.offsetTop;
                    // Offset scroll position by header height for precise alignment
                    window.scrollTo({
                        top: sectionTop - headerHeight + 10, // minor padding adjustment
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==========================================================================
    // 3. INTERSECTION OBSERVER FOR SCROLL REVEALS
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-text');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger animation only once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================================================
    // 4. SCROLL-SPY ACTIVE NAV HIGHLIGHT
    // ==========================================================================
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-link');

    const scrollSpyOptions = {
        root: null,
        rootMargin: `-${headerHeight}px 0px -40% 0px`, // offset by header and watch mid-screen
        threshold: 0
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');

                navItems.forEach(item => {
                    if (item.getAttribute('href') === `#${activeId}`) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, scrollSpyObserverOptions);

    sections.forEach(sec => scrollSpyObserver.observe(sec));

    // ==========================================================================
    // 5. CLIPBOARD COPY WIDGET
    // ==========================================================================
    const copyBtn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast');
    const emailLink = document.getElementById('email-link');

    if (copyBtn && emailLink) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const emailAddress = emailLink.textContent.trim();

            // Standard Clipboard API
            navigator.clipboard.writeText(emailAddress)
                .then(() => {
                    showToast();
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback copy method for older browsers
                    fallbackCopy(emailAddress);
                });
        });
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed'; // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            showToast();
        } catch (err) {
            console.error('Fallback copy failed', err);
        }

        document.body.removeChild(textArea);
    }
});
