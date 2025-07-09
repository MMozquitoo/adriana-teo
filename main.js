document.addEventListener("DOMContentLoaded", () => {
  // Sidebar Navigation
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarMenu = document.getElementById("sidebarMenu");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  sidebarToggle.addEventListener("click", () => {
    sidebarMenu.classList.toggle("open");
    sidebarOverlay.classList.toggle("active");
  });

  sidebarOverlay.addEventListener("click", () => {
    sidebarMenu.classList.remove("open");
    sidebarOverlay.classList.remove("active");
  });

  document.querySelectorAll(".sidebar .nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebarMenu.classList.remove("open");
      sidebarOverlay.classList.remove("active");
    });
  });

  // Animación de scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Animación de aparición al hacer scroll
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Elementos a animar
  const animatedElements = document.querySelectorAll(
    ".story-content, .transport-card, .gift-content"
  );
  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
    observer.observe(element);
  });

  // Cambio de estilo de la navegación al hacer scroll
  let lastScroll = 0;
  const nav = document.querySelector(".main-nav");

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      nav.style.boxShadow = "none";
    } else {
      nav.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    }

    lastScroll = currentScroll;
  });

  // Event listener para los radio buttons de asistencia
  const attendanceRadios = document.querySelectorAll(
    'input[name="attendance"]'
  );
  const attendanceDetails = document.querySelectorAll(".attendance-details");

  const toggleAttendanceDetails = () => {
    const isAttending =
      document.querySelector('input[name="attendance"]:checked')?.value ===
      "yes";

    attendanceDetails.forEach((detail) => {
      if (isAttending) {
        detail.style.display = "block";
        detail.style.opacity = "0";
        detail.style.transform = "translateY(20px)";
        setTimeout(() => {
          detail.style.opacity = "1";
          detail.style.transform = "translateY(0)";
        }, 100);
      } else {
        detail.style.display = "none";
      }
    });
  };

  // Agregar event listeners a los radio buttons
  attendanceRadios.forEach((radio) => {
    radio.addEventListener("change", toggleAttendanceDetails);
  });

  // Manejo del envío del formulario
  const form = document.getElementById("rsvpForm");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const submitBtn = form.querySelector(".submit-btn-elegant");
      const btnText = submitBtn.querySelector(".btn-text");
      const originalText = btnText.textContent;

      btnText.textContent = "Envoi en cours...";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            form.style.display = "none";
            document.getElementById("successMessage").style.display = "block";
            document.getElementById("merci").style.display = "block";

            // Animación de aparición del mensaje de éxito
            const successMessage = document.getElementById("successMessage");
            successMessage.style.opacity = "0";
            successMessage.style.transform = "translateY(20px)";
            successMessage.style.display = "block";

            setTimeout(() => {
              successMessage.style.opacity = "1";
              successMessage.style.transform = "translateY(0)";
            }, 100);
          } else {
            throw new Error("Erreur lors de l'envoi");
          }
        })
        .catch((error) => {
          alert(
            "Désolé, une erreur est survenue. Veuillez réessayer plus tard."
          );
          console.error(error);
        })
        .finally(() => {
          btnText.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
        });
    });

    // Inicializar el estado de los detalles de asistencia al cargar la página
    toggleAttendanceDetails();
  }
});
