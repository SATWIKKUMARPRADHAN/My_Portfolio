// --- Contact Form Submission ---
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        formStatus.textContent = "Sending...";
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message")
        };
        fetch("https://my-portfolio-1-hev5.onrender.com/sendmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.text())
            .then(result => {
                if (result.trim() === "success") {
                    formStatus.textContent = "Message sent successfully!";
                    contactForm.reset();
                } else {
                    formStatus.textContent = "Failed to send message. Please try again.";
                }
            })
            .catch(error => {
                console.error(error);
                formStatus.textContent = "Server error. Please try again later.";
            });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // --- Typewriter Effect for Hero Subtitle ---
    const typewriterText = "I design and develop scalable digital solutions, turning complex problems into elegant, high-performance software experiences.";
    const typewriterElem = document.getElementById('typewriterText');
    const cursorElem = document.querySelector('.typewriter-cursor');
    let i = 0;
    function typeWriter() {
        if (typewriterElem && i < typewriterText.length) {
            typewriterElem.textContent += typewriterText.charAt(i);
            i++;
            setTimeout(typeWriter, 30);
        } else if (cursorElem) {
            cursorElem.style.display = 'none';
        }
    }
    typewriterElem.textContent = "";
    if (typewriterElem && cursorElem) typeWriter();

    /* --- 1. Theme Toggle Logic (Light / Dark) for Desktop & Mobile --- */
    const themeToggleBtns = document.querySelectorAll('.theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);

            if (window.myChart) { updateChartTheme(newTheme); }
        });
    });

    /* --- 2. Custom Cursor (V3) --- */
    const customCursor = document.getElementById('customCursor');
    // Simple check to enable custom cursor only on non-touch devices
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    if (!isTouchDevice && customCursor) {
        document.body.classList.add('has-mouse');

        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        });

        const interactElements = document.querySelectorAll('.hover-interact, a, button, input, textarea, .glass-card');
        interactElements.forEach(el => {
            el.addEventListener('mouseenter', () => customCursor.classList.add('active'));
            el.addEventListener('mouseleave', () => customCursor.classList.remove('active'));
        });
    }

    /* --- 3. Mobile Navigation Side Panel --- */
    const mobileToggle = document.getElementById('mobileNavToggle');
    const mobileClose = document.getElementById('mobileNavClose');
    const mobilePanel = document.getElementById('mobileNavPanel');
    const mobileOverlay = document.getElementById('mobileNavOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMobileNav() {
        mobilePanel.classList.add('open');
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // prevent bg scroll
    }

    function closeMobileNav() {
        mobilePanel.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileNav);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    /* --- 4. Scroll Reveal Animations --- */
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const revealElements = document.querySelectorAll('.reveal-elem');

    setTimeout(() => {
        document.querySelector('.desktop-nav')?.classList.remove('hidden');
        document.querySelector('#hero')?.classList.remove('hidden');
    }, 100);

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(elem => {
        if (elem.id !== 'hero' && !elem.classList.contains('desktop-nav')) {
            scrollObserver.observe(elem);
        }
    });

    /* --- 5. Timeline Toggle --- */
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const timelines = document.querySelectorAll('.timeline');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTimeline = btn.getAttribute('data-target');
            const targetEl = document.querySelector(`.${targetTimeline}-timeline`);
            timelines.forEach(t => {
                t.classList.remove('active', 'slide-in-left', 'slide-in-right');
                t.classList.add('hidden');
            });
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (targetEl) {
                targetEl.classList.remove('hidden');
                if (targetTimeline === 'work') {
                    targetEl.classList.add('slide-in-left');
                } else {
                    targetEl.classList.add('slide-in-right');
                }
                targetEl.classList.add('active');
                // Remove slide class after animation completes
                setTimeout(() => {
                    targetEl.classList.remove('slide-in-left', 'slide-in-right');
                }, 500);
            }
        });
    });

    /* --- 6. Chart.js Implementation --- */
    const ctx = document.getElementById('ratingChart');
    if (ctx && typeof Chart !== 'undefined') {
        const labels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        const data = [1200, 1350, 1320, 1500, 1680, 1750, 1920];

        const getGridColor = () => htmlElement.getAttribute('data-theme') === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
        const getTextColor = () => htmlElement.getAttribute('data-theme') === 'dark' ? '#9ca3af' : '#4b5563';

        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Rating', data: data,
                    borderColor: '#4f46e5', backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 2, pointBackgroundColor: '#4f46e5', pointBorderColor: '#fff',
                    pointRadius: 4, pointHoverRadius: 6, fill: true, tension: 0.4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { family: 'Inter', size: 13 }, bodyFont: { family: 'Inter', size: 13 }, padding: 10, displayColors: false } },
                scales: { x: { grid: { display: false, drawBorder: false }, ticks: { color: getTextColor(), font: { family: 'Inter' } } }, y: { grid: { color: getGridColor(), drawBorder: false }, ticks: { color: getTextColor(), font: { family: 'Inter' }, stepSize: 200 } } },
                interaction: { intersect: false, mode: 'index' },
            }
        });

        window.updateChartTheme = function (theme) {
            const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
            const textColor = theme === 'dark' ? '#9ca3af' : '#4b5563';
            window.myChart.options.scales.x.ticks.color = textColor;
            window.myChart.options.scales.y.ticks.color = textColor;
            window.myChart.options.scales.y.grid.color = gridColor;
            window.myChart.update();
        };
    }

    /* --- 7. Certificates Horizontal Draggable Scroll --- */
    const carousel = document.getElementById('certCarousel');
    let isDragging = false;
    let preventClick = false;

    if (carousel) {
        let startX, scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDragging = true; preventClick = false;
            carousel.classList.add('active');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            carousel.style.scrollSnapType = 'none';
        });

        carousel.addEventListener('mouseleave', () => {
            isDragging = false; carousel.classList.remove('active'); carousel.style.scrollSnapType = 'x mandatory';
        });

        carousel.addEventListener('mouseup', () => {
            isDragging = false; carousel.classList.remove('active'); carousel.style.scrollSnapType = 'x mandatory';
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            preventClick = true; // If mouse moved while down, it's a drag, not a click
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    }

    /* --- 8. Lightbox Modal for Certificates --- */
    const certCards = document.querySelectorAll('.cert-card-img');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    certCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (preventClick) return; // Ignore click if dragging
            const imgSrc = card.getAttribute('data-img-src');
            if (imgSrc && lightboxModal && lightboxImg) {
                lightboxImg.src = imgSrc;
                lightboxModal.classList.add('active');
                if (!isTouchDevice) document.body.classList.remove('has-mouse'); // Hide custom cursor temporarily
            }
        });
    });

    const closeLightbox = () => {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            setTimeout(() => { lightboxImg.src = ""; }, 300);
            if (!isTouchDevice) document.body.classList.add('has-mouse'); // Restore custom cursor
        }
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxModal) lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox(); // Close on backdrop click
    });

});
