
/* ========================================
   EFFET CURSEUR - TRAÎNÉE PASTEL
======================================== */

const canvas = document.getElementById("cursor-canvas");
const button = document.getElementById("cursor-toggle");

if (canvas && button) {

    const ctx = canvas.getContext("2d");

    // Couleurs pastel
    const colors = [
        "#c9b8ef",
        "#e8b9d0",
        "#d9c5f4",
        "#edc9df"
    ];

    // Préférence d'accessibilité
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // État de l'animation
    let enabled = !reducedMotion.matches;
    let particles = [];
    let animationId = null;

    // Dimensions du canvas
    function resizeCanvas() {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mise à jour du bouton
    function updateButton() {
        button.textContent = enabled
            ? "Désactiver l'effet du curseur"
            : "Activer l'effet du curseur";

        button.setAttribute("aria-pressed", String(enabled));

        canvas.style.display = enabled ? "block" : "none";
    }

    // Création des particules
    function createParticle(x, y) {

        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: 3 + Math.random() * 3,
            life: 1,
            decay: 0.018 + Math.random() * 0.012,
            color: colors[
                Math.floor(Math.random() * colors.length)
            ]
        });

        // Limite le nombre de particules
        if (particles.length > 35) {
            particles.shift();
        }
    }

    // Déplacement de la souris
    window.addEventListener("pointermove", (event) => {

        if (!enabled || event.pointerType === "touch") return;

        createParticle(event.clientX, event.clientY);

    });

    // Animation
    function animate() {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

        particles = particles.filter(particle => {

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;

            if (particle.life <= 0) return false;

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.globalAlpha = particle.life * 0.55;
            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 10;
            ctx.fill();

            ctx.shadowBlur = 0;

            return true;
        });

        ctx.globalAlpha = 1;

        if (particles.length > 0 && enabled) {
            animationId = requestAnimationFrame(animate);
        } else {
            animationId = null;
        }
    }

    // Lancement de l'animation si nécessaire
    function startAnimation() {
        if (!animationId && enabled) {
            animationId = requestAnimationFrame(animate);
        }
    }

    // Gestion du bouton
    button.addEventListener("click", () => {

        enabled = !enabled;

        if (!enabled) {
            particles = [];

            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );

        }

        updateButton();
    });

    // Démarrage
    updateButton();

    // L'animation démarre à chaque déplacement
    window.addEventListener("pointermove", () => {
        if (enabled && particles.length > 0) {
            startAnimation();
        }
    });
}
