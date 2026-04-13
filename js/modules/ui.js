export function initNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === id);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-60px 0px -60px 0px' });

    sections.forEach(s => observer.observe(s));

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            if (link.dataset.section) {
                e.preventDefault();
                const target = document.getElementById(link.dataset.section);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('navLinks').classList.remove('open');
            }
        });
    });
}

export function initHamburger() {
    const btn = document.getElementById('hamburger');
    const links = document.getElementById('navLinks');

    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        links.classList.toggle('open');
        btn.classList.toggle('open');
    });
}

export function openModal(html) {
    const modalContent = document.getElementById('modalContent');
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalContent || !modalOverlay) return;

    modalContent.innerHTML = html;
    modalOverlay.classList.add('open');
}

export function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.remove('open');
}

export function initModal() {
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');

    if (!modalClose || !modalOverlay) return;

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) closeModal();
    });
}
