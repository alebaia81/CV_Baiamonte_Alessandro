document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       THEME CONTROLLER (DARK / LIGHT)
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    /* ==========================================================================
       LANGUAGE SWITCHER (ITALIAN / ENGLISH)
       ========================================================================== */
    const langToggle = document.getElementById('lang-toggle');
    const toggleText = langToggle.querySelector('.toggle-text');

    // Load saved language or default to Italian ('it')
    let currentLang = localStorage.getItem('lang') || 'it';
    setLanguage(currentLang);

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'it' ? 'en' : 'it';
        setLanguage(currentLang);
        localStorage.setItem('lang', currentLang);
    });

    function setLanguage(lang) {
        htmlElement.setAttribute('lang', lang);
        if (lang === 'it') {
            toggleText.textContent = 'EN';
            langToggle.setAttribute('title', 'Switch to English');
            langToggle.setAttribute('aria-label', 'Cambia lingua in Inglese');
        } else {
            toggleText.textContent = 'IT';
            langToggle.setAttribute('title', 'Passa all\'Italiano');
            langToggle.setAttribute('aria-label', 'Cambia lingua in Italiano');
        }
    }

    /* ==========================================================================
       TIMELINE CATEGORY FILTERS
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineTrack = document.querySelector('.timeline-track');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            timelineItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            // Trigger a minor layout recalculation if needed
            setTimeout(recalculateTimelineTrack, 300);
        });
    });

    function recalculateTimelineTrack() {
        // Adjusts timeline track height dynamically based on active items if necessary
        const activeItems = Array.from(timelineItems).filter(item => !item.classList.contains('hidden'));
        if (activeItems.length === 0) {
            timelineTrack.style.opacity = '0';
        } else {
            timelineTrack.style.opacity = '1';
        }
    }

    /* ==========================================================================
       SCROLL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    // Skill bars dynamic loading when visible
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                // Read original width set in inline style
                const targetWidth = bar.style.width;
                bar.style.width = '0';
                
                // Force a browser reflow
                bar.offsetHeight;
                
                // Animate to target width
                bar.style.width = targetWidth;
                
                // Unobserve since animation is done
                observer.unobserve(bar);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Stats counter animation (optional but premium)
    const statCards = document.querySelectorAll('.stat-card');
    
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transitionDelay = `${index * 100}ms`;
        cardObserver.observe(card);
    });

    /* ==========================================================================
       CONTACT FORM MOCK SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data
            const name    = (document.getElementById('name').value || '').trim();
            const email   = (document.getElementById('email').value || '').trim();
            const message = (document.getElementById('message').value || '').trim();

            // Build mailto URL
            const to      = 'alebaia81@gmail.com';
            const subject = encodeURIComponent(`Contatto dal CV - ${name}`);
            const body    = encodeURIComponent(
                `Nome: ${name}\nEmail: ${email}\n\n${message}`
            );
            const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;

            // Open the default mail client
            window.location.href = mailtoUrl;

            // Show success message and reset form
            setTimeout(() => {
                formSuccess.classList.remove('hidden');
                contactForm.reset();
            }, 500);
        });
    }

    /* ==========================================================================
       FOOTER YEAR AUTO-UPDATE
       ========================================================================== */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
