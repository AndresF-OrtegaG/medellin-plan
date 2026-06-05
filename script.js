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
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue de golpe

            // Capturamos los datos que el usuario escribió
            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Enviamos los datos a tu nuevo servidor en el puerto 3000
                const response = await fetch('http://localhost:3000/api/cliente', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // Si el servidor responde OK, mostramos el éxito
                    localStorage.setItem('parcheReservado', 'true');
                    bookingForm.style.display = 'none';
                    if (successMessage) successMessage.style.display = 'flex';
                    alert("¡Tus datos se guardaron correctamente en la Base de Datos!");
                } else {
                    alert('Hubo un error al guardar la reserva.');
                }
            } catch (error) {
                console.error('Error conectando con el servidor:', error);
                alert('Asegúrate de que el servidor Node.js esté encendido.');
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
        // Al usar 'track.clientWidth', el scroll se desplaza exactamente
        // el ancho visible del contenedor. Esto significa que en móvil mueve 1,
        // en tablet mueve 2, y en PC mueve 3 tarjetas a la vez.
        btnNext.addEventListener('click', () => {
            track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
        });

        btnPrev.addEventListener('click', () => {
            track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
        });
    }
});