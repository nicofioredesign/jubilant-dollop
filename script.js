//MENU

var tl = gsap.timeline({ paused: true });

function toggleMenuVisibility(isActive) {
    var menu2Items = document.querySelectorAll(".menu2");
    var menu3Items = document.querySelectorAll(".menu3");

    menu2Items.forEach(function(item) {
        item.style.display = isActive ? "none" : "";
    });

    menu3Items.forEach(function(item) {
        item.style.display = isActive ? "none" : "";
    });
}

function openNav() {
    animateOpenNav();
    var navBtn = document.getElementById("nav");
    navBtn.onclick = function (e) {
        // Toggle reversed to its opposite value
        tl.reversed(!tl.reversed());
        // Use the toggle method in the classList API
        navBtn.classList.toggle("active");

        // Change the text of the button based on the active state
        if (navBtn.classList.contains("active")) {
            navBtn.textContent = "chiudi";
            toggleMenuVisibility(true);
        } else {
            navBtn.textContent = "menu";
            toggleMenuVisibility(false);
        }
    };
}

function animateOpenNav() {
    var mobileNav = document.getElementById("mb_nav");
    tl
        .to(mobileNav, {
            duration: 0.6,
            ease: "sine",
            y: 0
        })
        .set('body', { overflow: 'hidden' })
        .to(".nav__link", {
            opacity: 1,
            ease: "power3.out",
            y: 0,
            duration: 0.4,
            stagger: 0.2,
        })
        .to(".contact-info", {
            opacity: 1,
            duration: 0.4,
            ease: "power3.out"
        }, "-=0.4")
        .reverse(); // Finally reverse the timeline. reversed() is true
}

// Ensure the menu visibility is reset when the page loads
document.addEventListener("DOMContentLoaded", function() {
    var navBtn = document.getElementById("nav");
    if (navBtn.classList.contains("active")) {
        toggleMenuVisibility(true);
    } else {
        toggleMenuVisibility(false);
    }
});

// init
openNav();

// Scrolling home sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');

    // Configurazione per IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Sezione visibile nella viewport
                entry.target.classList.add('section-no-radius');
            } else {
                // Sezione non visibile nella viewport
                entry.target.classList.remove('section-no-radius');
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0 // Sezione completamente visibile
    });

    // Osserva ogni sezione
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Cursore

let cursor = document.querySelector(".cursor");
let cursor2 = document.querySelector(".cursor2");
let cursorScale = document.querySelectorAll(".cursor-scale");
let mouseX = 0;
let mouseY = 0;

gsap.to({}, 0.016, {
    repeat: -1,
    onRepeat: function () {
        gsap.set(cursor, {
            css: {
                left: mouseX,
                top: mouseY
            }
        });
        gsap.set(cursor2, {
            css: {
                left: mouseX,
                top: mouseY
            }
        });
    }
});

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

cursorScale.forEach((link) => {
    link.addEventListener("mousemove", () => {
        cursor.classList.add("grow");
        if (link.classList.contains("small")) {
            cursor.classList.remove("grow");
            cursor.classList.add("grow-small");
        }
    });

    link.addEventListener("mouseleave", () => {
        cursor.classList.remove("grow");
        cursor.classList.remove("grow-small");
    });
});

// MARQUEE

gsap.registerPlugin(ScrollTrigger);

const Marquee = function(el, dir, canReverse) {
    this.el = el;

    let direction = dir ? dir : 1; // 1 = forward, -1 = backward scroll
    console.log(direction)

    this.tl = (el, settings, reverse) => {
        if (!canReverse) reverse = false;

        const tl = gsap.timeline({
            repeat: -1,
            onReverseComplete() {
                this.totalTime(this.rawTime() + this.duration() * 10);
            }
        });

        settings = settings || {};
        settings.ease || (settings.ease = 'none');

        let clone = el.cloneNode(true);
        let clone2 = el.cloneNode(true);
        el.parentNode.appendChild(clone);
        el.parentNode.appendChild(clone2);

        tl.to([el, clone, clone2], {
            xPercent: reverse ? 100*direction : -100*direction, ...settings
        }, 0);

        return tl;
    };

    const anim = this.tl(this.el, { duration: 20 });

    this.init = () => {
        ScrollTrigger.create({
            onUpdate(self) {
                if (self.direction !== direction) {
                    if (canReverse) direction *= -1;
                    gsap.to(anim, {
                        timeScale: direction,
                        overwrite: true
                    });
                }
            }
        });
    };

    this.pause = () => {
        anim.pause();
    };

    this.resume = () => {
        anim.resume();
    };
}


const wrappers = document.querySelectorAll('.marquee__wrapper');

wrappers.forEach((wrapper) => {
    const inner = wrapper.querySelector('.marquee__inner');
    const el = wrapper.querySelector('.marquee');
    const direction = (el.dataset.direction == 'right') ? -1 : 1;

    const marquee = new Marquee(el, direction, true);

    marquee.init();

    ScrollTrigger.create({
        trigger: wrapper,
        // onEnter: () => marquee.resume(),
        // onLeave: () => marquee.pause(),
        // onEnterBack: () => marquee.resume(),
        // onLeaveBack: () => marquee.pause(),
        animation: gsap.to(inner, { x: -1 * direction * el.offsetWidth/10 }),
        scrub: true,
    });
});

