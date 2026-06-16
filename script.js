/* SCRIPT.JS - Interactive Portfolio Logic */

// ==========================================================================
// CONFIGURATION: Set your Web3Forms Access Key here to receive real emails
// Get your free key instantly at https://web3forms.com
// ==========================================================================
const WEB3FORMS_ACCESS_KEY = "37c853a9-ca2b-45df-a61c-6204f40329e5";

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Theme Toggle Management
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        enableLightTheme();
    } else {
        enableDarkTheme();
    }
    
    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('light-theme')) {
            enableDarkTheme();
        } else {
            enableLightTheme();
        }
        initParticles(); // Force refresh canvas theme colors
    });
    
    function enableLightTheme() {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        themeIcon.className = 'fa-solid fa-sun';
        localStorage.setItem('portfolio-theme', 'light');
    }
    
    function enableDarkTheme() {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        themeIcon.className = 'fa-solid fa-moon';
        localStorage.setItem('portfolio-theme', 'dark');
    }

    // ==========================================================================
    // 2. Cyber network nodes (HTML5 Canvas Background)
    // ==========================================================================
    const canvas = document.getElementById('cyber-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const maxParticles = 50;
    
    const mouseConnection = {
        x: null,
        y: null,
        radius: 180
    };
    
    window.addEventListener('mousemove', (e) => {
        mouseConnection.x = e.clientX;
        mouseConnection.y = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
        mouseConnection.x = null;
        mouseConnection.y = null;
    });
    
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            
            if (mouseConnection.x !== null) {
                let dx = mouseConnection.x - this.x;
                let dy = mouseConnection.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouseConnection.radius) {
                    const force = (mouseConnection.radius - distance) / mouseConnection.radius;
                    const forceX = (dx / distance) * force * 1.5;
                    const forceY = (dy / distance) * force * 1.5;
                    
                    this.x -= forceX;
                    this.y -= forceY;
                }
            }
            
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }
    
    function initParticles() {
        particlesArray = [];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const isLight = document.body.classList.contains('light-theme');
        const particleColor = isLight 
            ? 'rgba(2, 132, 199, 0.2)' 
            : 'rgba(0, 242, 254, 0.2)';
            
        for (let i = 0; i < maxParticles; i++) {
            let size = Math.random() * 2.5 + 1;
            let x = Math.random() * (canvas.width - size * 2) + size;
            let y = Math.random() * (canvas.height - size * 2) + size;
            let directionX = (Math.random() * 0.3) - 0.15;
            let directionY = (Math.random() * 0.3) - 0.15;
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }
    
    function connectParticles() {
        let opacityValue = 1;
        const isLight = document.body.classList.contains('light-theme');
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 130) {
                    opacityValue = 1 - (distance / 130);
                    ctx.strokeStyle = isLight 
                        ? `rgba(2, 132, 199, ${opacityValue * 0.12})`
                        : `rgba(0, 242, 254, ${opacityValue * 0.12})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
            
            if (mouseConnection.x !== null) {
                let dx = particlesArray[a].x - mouseConnection.x;
                let dy = particlesArray[a].y - mouseConnection.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouseConnection.radius) {
                    opacityValue = 1 - (distance / mouseConnection.radius);
                    ctx.strokeStyle = isLight 
                        ? `rgba(13, 148, 136, ${opacityValue * 0.2})`
                        : `rgba(5, 255, 176, ${opacityValue * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouseConnection.x, mouseConnection.y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        initParticles();
    });

    // ==========================================================================
    // 3. Navigation Scrolling & Sync
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const navbar = document.getElementById('navbar');
    
    // Smooth scroll on clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                if (navMenu && navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                    mobileMenuBtn.classList.remove('open');
                }
            }
        });
    });
    
    // Sync active nav link on scroll & trigger navbar shadow
    function syncScrollActive() {
        let current = "";
        const scrollY = window.pageYOffset;
        
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', syncScrollActive);
    syncScrollActive(); // Run once initially

    // ==========================================================================
    // 4. Mobile Navigation Menu Drawer
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }

    // ==========================================================================
    // 5. Scroll Reveal & Typing Animation Effects
    // ==========================================================================
    
    // Typing Effect
    const typedTextSpan = document.getElementById("typed-text");
    const roles = ["Cybersecurity Analyst", "Software Developer", "Technology Apprentice"];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newWordDelay = 2000;
    let roleIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (charIndex < roles[roleIndex].length) {
            typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newWordDelay);
        }
    }
    
    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, typingSpeed + 500);
        }
    }
    
    if (typedTextSpan) {
        setTimeout(type, 1000);
    }

    // Scroll Reveal Effect
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================================================
    // 6. Contact Form validation & live Web3Forms delivery
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('.btn-submit');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Reset errors
        const errors = contactForm.querySelectorAll('.error-msg');
        errors.forEach(err => err.style.display = 'none');
        
        let isValid = true;
        
        // Fetch values
        const nameVal = document.getElementById('form-name').value.trim();
        const emailVal = document.getElementById('form-email').value.trim();
        const subjectVal = document.getElementById('form-subject').value.trim();
        const messageVal = document.getElementById('form-message').value.trim();
        
        if (!nameVal) {
            document.getElementById('name-error').style.display = 'block';
            isValid = false;
        }
        
        if (!emailVal || !validateEmail(emailVal)) {
            document.getElementById('email-error').style.display = 'block';
            isValid = false;
        }
        
        if (!subjectVal) {
            document.getElementById('subject-error').style.display = 'block';
            isValid = false;
        }
        
        if (!messageVal) {
            document.getElementById('message-error').style.display = 'block';
            isValid = false;
        }
        
        if (isValid) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE" || !WEB3FORMS_ACCESS_KEY) {
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    showToast('Access Key missing. Replace in script.js!', 'error');
                }, 1000);
                return;
            }

            // Web3Forms API Post Call
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    name: nameVal,
                    email: emailVal,
                    subject: subjectVal,
                    message: messageVal
                })
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('success');
                    showToast('Message sent! Eswar will contact you soon.', 'success');
                    contactForm.reset();
                    setTimeout(() => {
                        submitBtn.classList.remove('success');
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    console.error("Web3Forms error response:", json);
                    showToast(json.message || 'Error occurred. Please try again.', 'error');
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            })
            .catch((error) => {
                console.error("Connection error:", error);
                showToast('Connection error. Please check your internet.', 'error');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
        } else {
            showToast('Please correct form validation errors.', 'error');
        }
    });
    
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // ==========================================================================
    // 7. Toast Notification System
    // ==========================================================================
    const toastContainer = document.getElementById('toast-container');
    
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconClass = type === 'success' 
            ? 'fa-solid fa-circle-check' 
            : 'fa-solid fa-triangle-exclamation';
            
        toast.innerHTML = `
            <i class="${iconClass} toast-icon"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('removing');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 4000);
    }

    // ==========================================================================
    // 8. Interactive PG Visualization Demo Modal Controls
    // ==========================================================================
    const openDemoBtns = document.querySelectorAll('.open-demo-btn');
    const demoModal = document.getElementById('demo-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    if (openDemoBtns && demoModal) {
        openDemoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                demoModal.classList.add('open');
                document.body.style.overflow = 'hidden';
                initDemoChart();
            });
        });
        
        closeModalBtn.addEventListener('click', closeModal);
        
        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && demoModal.classList.contains('open')) closeModal();
        });
    }
    
    function closeModal() {
        demoModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    const occupancyVal = document.getElementById('demo-occupancy');
    const totalVal = document.getElementById('demo-total');
    const availableVal = document.getElementById('demo-available');
    const simChartContainer = document.getElementById('simulation-chart');
    const simulateUpdateBtn = document.getElementById('btn-simulate-update');
    const simLogText = document.getElementById('sim-log-text');
    
    let occupancyTrends = [82, 85, 84, 88, 86, 85, 85];
    const totalRooms = 130;
    
    function initDemoChart() {
        simChartContainer.innerHTML = '';
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        for (let i = 0; i < 7; i++) {
            const barWrapper = document.createElement('div');
            barWrapper.className = 'sim-bar';
            barWrapper.style.height = `${occupancyTrends[i]}%`;
            
            const barValue = document.createElement('span');
            barValue.innerText = `${occupancyTrends[i]}%`;
            barWrapper.appendChild(barValue);
            
            const barLabel = document.createElement('div');
            barLabel.className = 'sim-bar-label';
            barLabel.innerText = days[i];
            barWrapper.appendChild(barLabel);
            
            simChartContainer.appendChild(barWrapper);
        }
        
        const activeOccupancy = occupancyTrends[6];
        const activeOccupied = Math.round((activeOccupancy / 100) * totalRooms);
        const activeAvailable = totalRooms - activeOccupied;
        
        occupancyVal.innerText = `${activeOccupancy}%`;
        totalVal.innerText = `${activeOccupied} / ${totalRooms}`;
        availableVal.innerText = activeAvailable;
    }
    
    if (simulateUpdateBtn) {
        simulateUpdateBtn.addEventListener('click', () => {
            const nextOccupancy = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
            
            occupancyTrends.shift();
            occupancyTrends.push(nextOccupancy);
            
            initDemoChart();
            
            const changes = nextOccupancy - occupancyTrends[5];
            let msg = "";
            if (changes > 0) {
                msg = `Simulated check-ins. Occupancy increased by +${changes}%.`;
            } else if (changes < 0) {
                msg = `Simulated check-outs. Occupancy decreased by ${changes}%.`;
            } else {
                msg = `Occupancy levels constant. No change.`;
            }
            
            simLogText.innerText = msg;
            simLogText.style.color = 'var(--accent-secondary)';
            showToast('Hostel records updated successfully!', 'success');
            
            setTimeout(() => {
                simLogText.style.color = 'var(--text-muted)';
            }, 2000);
        });
    }
});
