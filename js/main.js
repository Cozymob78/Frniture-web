document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-active');
        } else {
            header.classList.remove('header-active');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animate toggle lines
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
            spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
        });

        // Close menu when link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // 3. Before/After Image Slider
    const container = document.querySelector('.image-compare-container');
    if (container) {
        const sliderBar = container.querySelector('.slider-bar');
        const beforeImg = container.querySelector('.img-before');
        const sliderButton = container.querySelector('.slider-button');

        let isDragging = false;

        const updateSlider = (clientX) => {
            const rect = container.getBoundingClientRect();
            let position = ((clientX - rect.left) / rect.width) * 100;
            
            // Constrain between 0% and 100%
            if (position < 0) position = 0;
            if (position > 100) position = 100;

            // Set clip-path for before image
            beforeImg.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
            // Set position of slider bar
            sliderBar.style.left = `${position}%`;
        };

        const startDragging = () => {
            isDragging = true;
        };

        const stopDragging = () => {
            isDragging = false;
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            // Handle touch or mouse
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(clientX);
        };

        // Event listeners
        sliderBar.addEventListener('mousedown', startDragging);
        sliderButton.addEventListener('mousedown', startDragging);
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('mousemove', onDrag);

        sliderBar.addEventListener('touchstart', startDragging);
        sliderButton.addEventListener('touchstart', startDragging);
        window.addEventListener('touchend', stopDragging);
        window.addEventListener('touchmove', onDrag);
    }

    // 4. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // 5. Quote Form Submission Simulation
    const form = document.querySelector('.quote-form');
    if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const feedback = document.querySelector('.form-feedback');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values for visual validation
            const name = form.querySelector('#name').value.trim();
            const phone = form.querySelector('#phone').value.trim();
            const email = form.querySelector('#email').value.trim();
            
            if (!name || !phone || !email) {
                alert('Please enter your name and phone number so we can contact you.');
                return;
            }

            // Visual feedback on submit button
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span style="display:inline-block; animation: spin 1s infinite linear; margin-right: 8px;">↻</span> Sending Request...';

            // Simulate server request delay
            setTimeout(() => {
                submitBtn.innerHTML = 'Request Sent Successfully!';
                submitBtn.style.background = '#10b981';
                
                // Show feedback card
                if (feedback) {
                    feedback.innerHTML = `<h4>✓ Quote Request Received!</h4><p style="margin-top:0.5rem; font-size:0.95rem;">Thank you, ${name}. We will review your request and contact you at <strong>${phone}</strong> or call you back from <strong>07465808079</strong> shortly.</p>`;
                    feedback.style.display = 'block';
                    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                // Reset form fields
                form.reset();

                // Re-enable form after a while
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                }, 5000);

            }, 1800);
        });
    }
});

// Spin animation helper styling
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
