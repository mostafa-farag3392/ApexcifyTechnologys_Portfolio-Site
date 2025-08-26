        // Global variables
        let currentFilter = 'all';
        
        // Initialize everything when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeNavigation();
            initializeAnimations();
            initializeSkillBars();
            initializeProjectFilters();
            initializeScrollEffects();
        });

        // Navigation functionality
        function initializeNavigation() {
            const burger = document.getElementById('burger');
            const navLinks = document.getElementById('nav-links');
            const navLinkElements = document.querySelectorAll('.nav-link');

            // Mobile menu toggle
            burger.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                
                // Animate burger lines
                const spans = burger.querySelectorAll('span');
                spans.forEach((span, index) => {
                    if (navLinks.classList.contains('active')) {
                        if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                        if (index === 1) span.style.opacity = '0';
                        if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                    } else {
                        span.style.transform = 'none';
                        span.style.opacity = '1';
                    }
                });
            });

            // Smooth scrolling and active link highlighting
            navLinkElements.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 70;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }

                    // Close mobile menu
                    navLinks.classList.remove('active');
                    
                    // Reset burger animation
                    const spans = burger.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = 'none';
                        span.style.opacity = '1';
                    });
                    
                    // Update active link
                    updateActiveNavLink(this);
                });
            });

            // Update active link on scroll
            window.addEventListener('scroll', updateActiveNavOnScroll);
        }

        // Update active navigation link based on scroll position
        function updateActiveNavOnScroll() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });

            // Update navbar background on scroll
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(100, 255, 218, 0.1)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }

        function updateActiveNavLink(activeLink) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            activeLink.classList.add('active');
        }

        // Initialize scroll-triggered animations
        function initializeAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        // Trigger skill bar animations when skills section is visible
                        if (entry.target.closest('#skills')) {
                            animateSkillBars();
                        }
                    }
                });
            }, observerOptions);

            // Observe all animated elements
            document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
                observer.observe(el);
            });
        }

        // Initialize skill progress bars
        function initializeSkillBars() {
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                bar.style.width = '0%';
            });
        }

        // Animate skill progress bars
        function animateSkillBars() {
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const targetWidth = bar.dataset.width;
                    bar.style.width = targetWidth;
                }, index * 100);
            });
        }

        // Project filtering functionality
        function initializeProjectFilters() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const projectCards = document.querySelectorAll('.project-card');

            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Update active filter button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');

                    const filter = this.dataset.filter;
                    currentFilter = filter;

                    // Filter project cards
                    projectCards.forEach(card => {
                        const category = card.dataset.category;
                        
                        if (filter === 'all' || category === filter) {
                            card.style.display = 'block';
                            card.style.animation = 'fadeInUp 0.6s ease forwards';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
        }

        // Scroll effects (parallax, etc.)
        function initializeScrollEffects() {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                
                // Parallax effect for floating elements
                const floatingElements = document.querySelectorAll('.floating-element');
                floatingElements.forEach((element, index) => {
                    const speed = (index + 1) * 0.1;
                    element.style.transform = `translateY(${scrolled * speed}px)`;
                });
            });
        }

        // Project modal functionality
        function showProjectDetails(title, description, technologies) {
            const modal = document.getElementById('projectModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalDescription = document.getElementById('modalDescription');
            const modalTech = document.getElementById('modalTech');

            modalTitle.textContent = title;
            modalDescription.textContent = description;
            
            // Clear and populate technology tags
            modalTech.innerHTML = '';
            technologies.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                modalTech.appendChild(tag);
            });

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Animate modal appearance
            requestAnimationFrame(() => {
                modal.style.opacity = '1';
            });
        }

        function closeModal() {
            const modal = document.getElementById('projectModal');
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }

        // Close modal when clicking outside
        document.getElementById('projectModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Form submission handler
        function handleFormSubmit(event) {
            event.preventDefault();
            const submitBtn = event.target.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                alert('Thank you for your message! I\'ll get back to you soon.');
                event.target.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }

        // Resume download handler
        function downloadResume() {
            // In a real implementation, this would trigger a file download
            alert('Resume download would start here. In a real implementation, this would link to your actual resume file.');
        }

        // Typing effect for hero title
        function typeWriter(element, text, speed = 100) {
            let i = 0;
            element.textContent = '';
            
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        }

        // Initialize typing effect after hero animation
        setTimeout(() => {
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                const originalText = heroTitle.textContent;
                typeWriter(heroTitle, originalText, 100);
            }
        }, 1500);

        // Add smooth reveal animations for project cards
        function revealProjectCards() {
            const cards = document.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                if (currentFilter === 'all' || card.dataset.category === currentFilter) {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    }, index * 100);
                }
            });
        }

        // Trigger project card reveals when projects section is visible
        const projectsSection = document.getElementById('projects');
        const projectsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealProjectCards();
                    projectsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        if (projectsSection) {
            projectsObserver.observe(projectsSection);
        }

        // Add loading animation
        window.addEventListener('load', function() {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });