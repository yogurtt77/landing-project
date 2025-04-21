document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const menu = document.querySelector(".menu");

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", function () {
      this.classList.toggle("active");
      menu.classList.toggle("active");
      document.body.classList.toggle("menu-open");
    });

    // Close menu when clicking on menu links
    const menuLinks = document.querySelectorAll(".menu a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenuToggle.classList.remove("active");
        menu.classList.remove("active");
        document.body.classList.remove("menu-open");
      });
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all FAQ items
      faqItems.forEach((faq) => {
        faq.classList.remove("open");
      });

      // Open the clicked item if it wasn't already open
      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });

  // Initialize Swiper for Gallery
  const gallerySwiper = new Swiper(".gallery-swiper", {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 10,
    initialSlide: 1,
    loop: true,
    speed: 1000,
    effect: "slide",
    grabCursor: false,
    slideToClickedSlide: false,
    preloadImages: true,
    updateOnImagesReady: true,
    watchSlidesProgress: true,
    loopedSlides: 5,
    observer: true,
    observeParents: true,
    lazy: false,
  });

  // Prevent clicks on gallery slides
  const swiper = document.querySelector(".gallery-swiper");
  if (swiper) {
    swiper.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }

  // Connect custom navigation arrows for gallery
  const galleryLeftArrow = document.querySelector(".gallery-arrow-left");
  const galleryRightArrow = document.querySelector(".gallery-arrow-right");

  if (galleryLeftArrow && galleryRightArrow) {
    galleryLeftArrow.addEventListener("click", () => {
      gallerySwiper.slidePrev();
    });

    galleryRightArrow.addEventListener("click", () => {
      gallerySwiper.slideNext();
    });
  }

  // Force update gallery after initialization
  setTimeout(function () {
    if (gallerySwiper) {
      gallerySwiper.update();
    }
  }, 100);

  // Reviews Slider
  const reviewCards = document.querySelectorAll(".review-card");
  const reviewLeftArrow = document.querySelector(".review-arrow-left");
  const reviewRightArrow = document.querySelector(".review-arrow-right");
  const reviewsSlider = document.querySelector(".reviews-slider");

  let currentReview = 2; // Middle card is active by default

  function updateReviewsSlider() {
    if (!reviewsSlider || reviewCards.length === 0) return;

    // Remove active class from all cards
    reviewCards.forEach((card) => {
      card.classList.remove("active");
    });

    // Set active card
    reviewCards[currentReview].classList.add("active");

    // Calculate how far to scroll to center the active card
    const cardWidth = reviewCards[0].offsetWidth + 30; // card width + gap
    const offset =
      currentReview * cardWidth - reviewsSlider.offsetWidth / 2 + cardWidth / 2;

    // Smooth scroll to center the active card
    reviewsSlider.scrollTo({
      left: offset,
      behavior: "smooth",
    });
  }

  // Initialize reviews slider
  if (reviewCards.length > 0) {
    updateReviewsSlider();
  }

  if (reviewLeftArrow && reviewRightArrow) {
    reviewLeftArrow.addEventListener("click", () => {
      currentReview =
        (currentReview - 1 + reviewCards.length) % reviewCards.length;
      updateReviewsSlider();
    });

    reviewRightArrow.addEventListener("click", () => {
      currentReview = (currentReview + 1) % reviewCards.length;
      updateReviewsSlider();
    });
  }

  // Form Validation
  const feedbackForm = document.querySelector(".feedback-form form");
  const formCheckbox = document.querySelector(".checkbox");
  const formCheckboxWrapper = document.querySelector(".checkbox-wrapper");
  let isChecked = false;

  if (formCheckboxWrapper) {
    formCheckboxWrapper.addEventListener("click", () => {
      isChecked = !isChecked;
      formCheckbox.classList.toggle("checked", isChecked);
    });
  }

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameInput = feedbackForm.querySelector('input[type="text"]');
      const phoneInput = feedbackForm.querySelector('input[type="tel"]');

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        nameInput.style.borderColor = "#EB5757";
        isValid = false;
      } else {
        nameInput.style.borderColor = "#E0E0E0";
      }

      // Validate phone
      const phonePattern =
        /^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
      if (!phonePattern.test(phoneInput.value.trim())) {
        phoneInput.style.borderColor = "#EB5757";
        isValid = false;
      } else {
        phoneInput.style.borderColor = "#E0E0E0";
      }

      // Validate checkbox
      if (!isChecked) {
        formCheckboxWrapper.style.borderColor = "#EB5757";
        isValid = false;
      } else {
        formCheckboxWrapper.style.borderColor = "#181818";
      }

      if (isValid) {
        // Form is valid, you can submit it here
        alert("Форма успешно отправлена!");
        feedbackForm.reset();
        isChecked = false;
        formCheckbox.classList.remove("checked");
      }
    });
  }

  // Smooth Scrolling for Anchor Links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Fixed Button Animation
  const fixedButton = document.querySelector(".fixed-button");

  if (fixedButton) {
    window.addEventListener("scroll", () => {
      fixedButton.style.opacity = window.scrollY > 300 ? "1" : "0.8";
    });
  }

  // Handle smooth scrolling for card buttons
  const cardButtons = document.querySelectorAll(".card-button");

  cardButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Smooth scroll to form
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });

        // Add highlight animation to form
        const feedbackForm = document.querySelector(".feedback-form");
        if (feedbackForm) {
          feedbackForm.classList.add("highlight-form");

          // Remove class after animation completes
          setTimeout(() => {
            feedbackForm.classList.remove("highlight-form");
          }, 2000);
        }

        // Focus on first input field
        setTimeout(() => {
          const firstInput = targetElement.querySelector("input");
          if (firstInput) {
            firstInput.focus();
          }
        }, 800);
      }
    });
  });

  // Handle window resize for responsive adjustments
  window.addEventListener("resize", function () {
    // Update gallery swiper on window resize
    if (gallerySwiper) {
      gallerySwiper.update();
    }

    // Update reviews slider on window resize
    updateReviewsSlider();
  });
});
