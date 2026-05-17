document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica del Menú Hamburguesa (Mobile)
    const navbarToggle = document.getElementById('js-navbar-toggle');
    const navbarMenu = document.getElementById('js-navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('main-navbar__menu--open');
            const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
            navbarToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // 2. Lógica del Formulario, FORMSPREE y Persistencia
    const bookingForm = document.getElementById('js-booking-form');
    const successMessage = document.getElementById('js-success-message');
    const btnResetForm = document.getElementById('js-btn-reset-form');

    const checkFormStatus = () => {
        const hasSubmitted = localStorage.getItem('parcheReservado');

        if (hasSubmitted === 'true') {
            if (bookingForm) bookingForm.style.display = 'none';
            if (successMessage) successMessage.style.display = 'flex';
        } else {
            if (bookingForm) bookingForm.style.display = 'flex';
            if (successMessage) successMessage.style.display = 'none';
        }
    };

    checkFormStatus();

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevenimos que Formspree nos mande a su página genérica

            const submitBtn = bookingForm.querySelector('.booking-form__btn-submit');
            const originalBtnText = submitBtn.textContent;
            
            // Cambiamos el texto para que el usuario sepa que está cargando
            submitBtn.textContent = 'Enviando reserva...';
            submitBtn.style.pointerEvents = 'none'; // Evitar doble clic

            // Empaquetamos los datos automáticamente
            const formData = new FormData(bookingForm);

            try {
                // Enviamos los datos a Formspree usando Fetch
                const response = await fetch(bookingForm.action, {
                    method: bookingForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Formspree pide esto para responder por AJAX
                    }
                });

                if (response.ok) {
                    // ¡Éxito! Formspree lo recibió. 
                    // Guardamos en LocalStorage para ocultar el formulario
                    localStorage.setItem('parcheReservado', 'true');
                    bookingForm.reset();
                    checkFormStatus();

                    const formSection = document.getElementById('formulario');
                    if (formSection) {
                        formSection.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    alert("Uy, hubo un problema al enviar la reserva. Intenta nuevamente.");
                }
            } catch (error) {
                alert("Error de conexión. Revisa tu internet e intenta de nuevo.");
            } finally {
                // Si falla, regresamos el botón a la normalidad
                submitBtn.textContent = originalBtnText;
                submitBtn.style.pointerEvents = 'auto';
            }
        });
    }

    if (btnResetForm) {
        btnResetForm.addEventListener('click', () => {
            localStorage.removeItem('parcheReservado'); 
            if (bookingForm) bookingForm.reset(); 
            checkFormStatus(); 
        });
    }

    // 3. Autoselección del Plan desde la sección "Planes"
    const planTriggers = document.querySelectorAll('.js-plan-trigger');
    const planSelect = document.getElementById('form-plan');

    planTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target'); 
            const selectedPlan = button.getAttribute('data-plan'); 

            if (planSelect && selectedPlan) {
                planSelect.value = selectedPlan;
                // Disparamos el evento 'change' por si la barra de progreso necesita actualizarse
                planSelect.dispatchEvent(new Event('change'));
            }

            if (targetId) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ==========================================================================
    // 4. NUEVOS SNIPPETS INTERACTIVOS (Scroll, Progress Bar, Carousel)
    // ==========================================================================

    // A. Lógica del Botón Scroll-to-Top
    const scrollTopBtn = document.getElementById('js-scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('scroll-top-btn--visible');
            } else {
                scrollTopBtn.classList.remove('scroll-top-btn--visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // B. Lógica de la Barra de Progreso del Formulario
    const formProgress = document.getElementById('js-form-progress');
    const formInputs = document.querySelectorAll('#js-booking-form input[required], #js-booking-form select[required]');
    
    if (formProgress && formInputs.length > 0) {
        const updateProgressBar = () => {
            let filledFields = 0;
            
            formInputs.forEach(input => {
                if (input.value.trim() !== '') {
                    filledFields++;
                }
            });

            const progressPercentage = (filledFields / formInputs.length) * 100;
            formProgress.style.width = `${progressPercentage}%`;
            
            if (progressPercentage === 100) {
                formProgress.style.backgroundColor = '#2ec4b6'; 
            } else {
                formProgress.style.backgroundColor = 'var(--color-primary)';
            }
        };

        formInputs.forEach(input => {
            input.addEventListener('input', updateProgressBar);
            input.addEventListener('change', updateProgressBar); 
        });
    }

    // C. Lógica del Carrusel de Testimonios
    const track = document.getElementById('js-testimonials-track');
    const btnPrev = document.getElementById('js-test-prev');
    const btnNext = document.getElementById('js-test-next');

    if (track && btnPrev && btnNext) {
        const getCardWidth = () => {
            const firstCard = track.querySelector('.testimonial-card');
            return firstCard ? firstCard.offsetWidth + 30 : 0; 
        };

        btnNext.addEventListener('click', () => {
            track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });

        btnPrev.addEventListener('click', () => {
            track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });
    }
});