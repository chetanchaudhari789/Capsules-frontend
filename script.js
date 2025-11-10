// Register ALL GSAP plugins you need ONCE at the top.
gsap.registerPlugin(ScrollTrigger, SplitText);

// --- 1. SETUP SMOOTH SCROLL (LENIS) ---
// We do this ONCE. This will power all ScrollTrigger animations.
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- 2. DEFINE ALL YOUR ANIMATIONS AS FUNCTIONS ---

/**
 * PRELOADER & HERO INTRO ANIMATION
 * (from 3rd effect)
 */
function initPreloader() {
  gsap.set(".preloader-mask", { transformOrigin: "center" });

  function createSplitText(elements) {
    const splits = {};
    elements.forEach(({ key, selector, type }) => {
      const config = { type, mask: type };
      if (type === "chars") config.charsClass = "char";
      if (type === "lines") config.linesClass = "line";
      splits[key] = SplitText.create(selector, config);
    });
    return splits;
  }

  const splitElements = [
    { key: "logoChars", selector: ".preloader-logo h1", type: "chars" },
    { key: "footerLines", selector: ".preloader-footer p", type: "lines" },
    { key: "headerChars", selector: ".header h1", type: "chars" },
    { key: "heroFooterH3", selector: ".hero-footer h3", type: "lines" },
    { key: "heroFooterP", selector: ".hero-footer p", type: "lines" },
    { key: "btnLabels", selector: ".btn-label span", type: "lines" },
  ];

  const splits = createSplitText(splitElements);

  // Set initial states
  gsap.set(splits.logoChars.chars, { x: "100%" });
  gsap.set(
    [
      splits.footerLines.lines,
      splits.headerChars.chars,
      splits.heroFooterH3.lines,
      splits.heroFooterP.lines,
      splits.btnLabels.lines,
    ],
    { y: "100%" }
  );

  gsap.set(".btn-icon", { clipPath: "circle(0% at 50% 50%)" });
  gsap.set(".btn", { scale: 0 });

  // Progress animation
  function animateProgress(duration = 4) {
    const tl = gsap.timeline();
    const counterSteps = 5;
    let currentProgress = 0;
    for (let i = 0; i < counterSteps; i++) {
      const finalStep = i === counterSteps - 1;
      const targetProgress = finalStep
        ? 1
        : Math.min(currentProgress + Math.random() * 0.3 + 0.1, 0.9);
      currentProgress = targetProgress;
      tl.to(".preloader-progress-bar", {
        scaleX: targetProgress,
        duration: duration / counterSteps,
        ease: "power2.out",
      });
    }
    return tl;
  }

  // Master timeline
  const tl = gsap.timeline({ delay: 0.5 });
  tl.to(splits.logoChars.chars, {
    x: "0%",
    stagger: 0.05,
    duration: 1,
    ease: "power4.inOut",
  })
    .add(animateProgress(), "<")
    .to(splits.logoChars.chars, {
      y: "-100%",
      stagger: 0.1,
      duration: 1,
      ease: "power4.inOut",
    })
    .to([".preloader-progress", ".preloader-content"], {
      opacity: 0,
      duration: 0.5,
      ease: "power4.inOut",
    })
    .to(
      ".preloader-mask",
      {
        scale: 20,
        duration: 2,
        ease: "power3.inOut",
        onComplete: () => {
          document.querySelector(".preloader-progress").style.display = "none";
          document.querySelector(".preloader-content").style.display = "none";
          // document.querySelector(".preloader-mask").style.display = "none"; // This line was causing an error, removed
        },
      },
      "<"
    )
    .to(
      ".hero-img",
      {
        scale: 1,
        duration: 1.5,
        ease: "power3.inOut",
      },
      "<"
    )
    .to(
      splits.headerChars.chars,
      {
        y: 0,
        stagger: 0.05,
        duration: 1,
        ease: "power4.inOut",
      },
      "-=1.5"
    )
    .to(
      [splits.heroFooterH3.lines, splits.heroFooterP.lines],
      {
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.inOut",
      },
      "-=1"
    )
    .to(
      ".btn",
      {
        scale: 1,
        duration: 1,
        ease: "power4.inOut",
        onStart: () => {
          gsap.to(".btn-icon", {
            clipPath: "circle(100% at 50% 50%)",
            duration: 1,
            ease: "power2.inOut",
          });
          gsap.to(splits.btnLabels.lines, {
            y: 0,
            duration: 1,
            ease: "power4.inOut",
          });
        },
      },
      "<"
    );
}

/**
 * PAGE 2 & 3 SCROLL ANIMATIONS
 * (from 3rd effect / remake)
 */
function initPage2Page3Animations() {
  // --- Page 2 Animation ---
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".page2",
      start: "28% 70%",
      end: "100% 70%",
      scrub: 1,
    },
  });
  tl2.to(".page2 .bottom", {
    y: 760,
  });

  // --- Page 3 Animation ---
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".page3",
      start: "25% 50%",
      end: "60% 50%",
      scrub: 1,
    },
  });
  tl3.to(".page3 .hide", { // Targeted only .page3's .hide
    top: "-100%",
    stagger: 0.1,
  });
}

/**
 * PAGE 4 STACKING CARDS ANIMATION
 * (from 2nd effect)
 */
function initCardStacking() {
  // --- Card Marquee (self-animating) ---
  let tween = gsap
    .to(".cards .marquee", {
      xPercent: -100,
      repeat: -1,
      duration: 10,
      ease: "linear",
    })
    .totalProgress(0.5);
  gsap.set(".cards .marquee", { xPercent: -50 });

  // --- Card Animation Functions ---
  function animationContentIn(titleChars, discription) {
    gsap.to(titleChars, {
      x: "0%",
      duration: 0.75,
      ease: "power4.inOut",
      stagger: 0.03,
    });
    gsap.to(discription, {
      x: 0,
      opacity: 1,
      duration: 0.75,
      delay: 0.1,
      ease: "power4.inOut",
    });
  }

  function animationContentOut(titleChars, discription) {
    gsap.to(titleChars, {
      x: "100%",
      duration: 0.75,
      ease: "power4.inOut",
      stagger: 0.03,
    });
    gsap.to(discription, {
      x: 40,
      opacity: 0,
      duration: 0.75,
      delay: 0.1,
      ease: "power4.inOut",
    });
  }

  // --- Card & Title Setup ---
  const cards = gsap.utils.toArray(".cards .card");
  const titles = gsap.utils.toArray(".cards .card-title h1");

  titles.forEach((title) => {
    const split = new SplitText(title, {
      type: "chars",
      charClass: "char",
      tag: "div",
    });
    split.chars.forEach((char) => {
      char.innerHTML = `<span>${char.textContent}</span>`;
    });
  });

  // --- Intro Card Animation (Card 0) ---
  const introCard = cards[0];
  if (introCard) {
    const cardImageWrapper = introCard.querySelector(".card-img");
    const cardImg = introCard.querySelector(".card-img img");
    const marquee = introCard.querySelector(".card-marquee");
    const titleChars = introCard.querySelectorAll(".char span");
    const discription = introCard.querySelector(".card-disacription");

    gsap.set(cardImageWrapper, {
      scale: 0.5,
      borderRadius: "400px",
    });
    gsap.set(cardImg, {
      scale: 1.5,
    });

    ScrollTrigger.create({
      trigger: introCard,
      start: "top top",
      end: "+=300vh",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const imgScale = 0.5 + progress * 0.5;
        const radius = 400 - progress * 375;
        const innerImageScale = 1.5 - progress * 0.5;

        gsap.set(cardImageWrapper, {
          scale: imgScale,
          borderRadius: radius + "px",
        });
        gsap.set(cardImg, { scale: innerImageScale });

        if (imgScale >= 0.5 && imgScale <= 0.75) {
          const fadeProgress = (imgScale - 0.5) / (0.75 - 0.5);
          gsap.set(marquee, { opacity: 1 - fadeProgress });
        } else if (imgScale > 0.75) {
          gsap.set(marquee, { opacity: 0 });
        }

        if (progress > 0.9 && !introCard.contentRevealed) {
          introCard.contentRevealed = true;
          animationContentIn(titleChars, discription);
        }
        if (progress < 0.9 && introCard.contentRevealed) {
          introCard.contentRevealed = false;
          animationContentOut(titleChars, discription);
        }
      },
    });
  }

  // --- All Cards Stacking Logic ---
  cards.forEach((card, index) => {
    const isLastCard = index === cards.length - 1;

    if (!isLastCard) {
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        pin: true,
        pinSpacing: false,
        endTrigger: cards[index + 1],
        end: "top top",
      });

      const cardWrapper = card.querySelector(".card-wrapper");
      const nextCard = cards[index + 1];

      ScrollTrigger.create({
        trigger: nextCard,
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(cardWrapper, {
            scale: 1 - progress * 0.15,
            opacity: 1 - progress,
          });
        },
      });
    } else {
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        pin: true,
        pinSpacing: true,
        end: "+=100%",
      });
    }

    if (index > 0) {
      const cardImg = card.querySelector(".card-img img");
      const imgContainer = card.querySelector(".card-img");
      const titleChars = card.querySelectorAll(".char span");
      const discription = card.querySelector(".card-disacription");

      ScrollTrigger.create({
        trigger: card,
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(cardImg, {
            scale: 2 - progress,
          });
          gsap.set(imgContainer, {
            borderRadius: 150 - progress * 125 + "px",
          });
        },
      });

      ScrollTrigger.create({
        trigger: card,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => animationContentIn(titleChars, discription),
        onLeaveBack: () => animationContentOut(titleChars, discription),
      });
    }
  });
}

/**
 * PAGE 5 MAGNETIC BUTTON
 * (from remake)
 */
function initMagneticButton() {
  const hoverArea = document.querySelector(".page5-content h1");
  const mapButton = document.querySelector(".map-button");

  if (hoverArea && mapButton) {
    hoverArea.addEventListener("mouseenter", function () {
      gsap.to(mapButton, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
      });
    });

    hoverArea.addEventListener("mouseleave", function () {
      gsap.to(mapButton, {
        opacity: 0,
        scale: 0,
        duration: 0.3,
      });
    });

    hoverArea.addEventListener("mousemove", function (event) {
      const rect = hoverArea.getBoundingClientRect();
      const x = event.clientX - rect.left;
      gsap.to(mapButton, {
        x: x,
        duration: 0.5,
      });
    });
  }
}

/**
 * PAGE 6 MARQUEE
 * (from remake)
 */
function initPage6Marquee() {
  // --- Marquee Scroll Direction Logic ---
  let currentScroll = 0;
  let isScrolloingDown = true;
  let tween = gsap
    .to(".page6 .marquee_part", { // Targeted .page6
      xPercent: -100,
      repeat: -1,
      duration: 5,
      ease: "linear",
    })
    .totalProgress(0.5);

  gsap.set(".page6 .maruee_inner", { // Targeted .page6
    xPercent: -50,
  });

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > currentScroll) {
      isScrolloingDown = true;
    } else {
      isScrolloingDown = false;
    }
    gsap.to(tween, {
      timeScale: isScrolloingDown ? 1 : -1,
    });
    currentScroll = window.pageYOffset;
  });
}

/**
 * PAGE 7 HORIZONTAL SCROLL
 * (SMOOTH VERSION)
 */
function initHorizontalScroll() {
  // Select all the elements we need
  let stickysection = document.querySelector(".sticky");
  let slidercontainer = document.querySelector(".slides");
  let slider = document.querySelector(".slider");
  let slides = document.querySelectorAll(".slide");
  let titles = Array.from(slides).map((slide) =>
    slide.querySelector(".title h1")
  );
  let lastSlide = -1;

  // Ensure elements exist before creating ScrollTrigger
  if (!stickysection || !slidercontainer || !slider || slides.length === 0) {
    console.warn("Horizontal scroll elements not found. Skipping init.");
    return;
  }

  // --- 1. THE MAIN HORIZONTAL SCROLL TWEEN ---
  const horizontalTween = gsap.to(slidercontainer, {
    x: () => `-${slidercontainer.offsetWidth - slider.offsetWidth}px`,
    ease: "none", 
  });

  // --- 2. THE MAIN SCROLLTRIGGER ---
  ScrollTrigger.create({
    trigger: stickysection,
    start: "top top",
    end: () => `+=${slidercontainer.offsetWidth - slider.offsetWidth}`,
    scrub: 1, 
    pin: true,
    pinSpacing: true,
    invalidateOnRefresh: true,
    animation: horizontalTween,

    // --- 3. SECONDARY ANIMATIONS (Titles & Parallax) ---
    onUpdate(self) {
      let totalMove = slidercontainer.offsetWidth - slider.offsetWidth;
      let slideWidth = slider.offsetWidth;
      let mainMove = self.progress * totalMove;

      // --- Title Animation ---
      let currentSlide = Math.floor(mainMove / slideWidth);

      if (currentSlide !== lastSlide) {
        if (lastSlide >= 0 && titles[lastSlide]) {
          gsap.to(titles[lastSlide], {
            y: -200,
            duration: 0.5,
            ease: "power2.out",
          });
        }
        if (
          currentSlide >= 0 &&
          currentSlide < titles.length &&
          titles[currentSlide]
        ) {
          gsap.to(titles[currentSlide], {
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        }
        lastSlide = currentSlide;
      }

      // --- Image Parallax Animation ---
      let slideProgress = (mainMove % slideWidth) / slideWidth;

      slides.forEach((slide, index) => {
        let image = slide.querySelector("img");
        if (image) {
          if (index === currentSlide || index === currentSlide + 1) {
            let relativeProgress =
              index === currentSlide ? slideProgress : slideProgress - 1;
            let parallaxAmount = relativeProgress * slideWidth * 0.25;

            gsap.set(image, {
              x: parallaxAmount,
              scale: 1.3,
            });
          } else {
            gsap.set(image, {
              x: 0,
            });
          }
        }
      });
    },
  });
}

/**
 * NEW: PAGE 7 (ACTIVITIES INTRO) TEXT ANIMATION
 */
function initActivitiesIntroAnimation() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".activities-intro", // TARGETED NEW SECTION
      start: "25% 50%",
      end: "60% 50%",
      scrub: 1,
    },
  });
  tl.to(".activities-intro .hide", { // TARGETED NEW SECTION
    top: "-100%",
    stagger: 0.1,
  });
}

/**
 * NEW: FOOTER MARQUEE
 */
function initFooterMarquee() {
  let currentScroll = 0;
  let isScrolloingDown = true;
  let tween = gsap
    .to(".footer-marquee .marquee_part", { // TARGETED NEW SECTION
      xPercent: -100,
      repeat: -1,
      duration: 5,
      ease: "linear",
    })
    .totalProgress(0.5);

  gsap.set(".footer-marquee .maruee_inner", { // TARGETED NEW SECTION
    xPercent: -50,
  });

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > currentScroll) {
      isScrolloingDown = true;
    } else {
      isScrolloingDown = false;
    }
    gsap.to(tween, {
      timeScale: isScrolloingDown ? 1 : -1,
    });
    currentScroll = window.pageYOffset;
  });
}

function LineFooter() {
  // 1. First, create the split.
  // We just need the type, "chars". No mask, no onSplit.
  const mySplit = SplitText.create(".line-footer", {
    type: "chars"
  });

  // 2. Second, create the animation using the split characters.
  // We animate from a 'yPercent' of 100 (bottom of the box) up to 0.
  gsap.from(mySplit.chars, {
    scrollTrigger: {
      trigger: ".line-footer", // The h1 is the trigger
      start: "top 85%",     // Start when the top of the h1 hits 85% down the screen
    },
    xPercent: 50,
    opacity: 0,
    stagger:0.05,
    duration: 0.5,
    ease: "power2.out",
  });
}
// --- 3. RUN ALL ANIMATIONS ---
document.fonts.ready.then(() => {
  initPreloader();
  initPage2Page3Animations();
  initCardStacking();
  initMagneticButton();
  initPage6Marquee();
  initHorizontalScroll();

  // --- ADDED THE CALLS TO THE NEW FUNCTIONS ---
  initActivitiesIntroAnimation();
  initFooterMarquee();
  LineFooter();


});