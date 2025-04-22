document.addEventListener("DOMContentLoaded", function () {
  // Preload all gallery images immediately
  function preloadGalleryImages() {
    return new Promise((resolve) => {
      const imageUrls = [
        "assets/images/backgrounds/slide1.png",
        "assets/images/backgrounds/slide2.png",
        "assets/images/backgrounds/slide3.png",
      ];

      let loadedCount = 0;

      imageUrls.forEach((url) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          // Когда все изображения загружены, разрешаем Promise
          if (loadedCount === imageUrls.length) {
            resolve();
          }
        };
        img.onerror = () => {
          loadedCount++;
          console.error("Failed to load image:", url);
          // Даже если что-то не загрузилось, продолжаем
          if (loadedCount === imageUrls.length) {
            resolve();
          }
        };
        img.src = url;
      });
    });
  }

  // Preload partner logos
  function preloadPartnerLogos() {
    return new Promise((resolve) => {
      const partnersContainer = document.querySelector(".partners-track");
      if (!partnersContainer) {
        resolve();
        return;
      }

      const logos = partnersContainer.querySelectorAll("img");
      if (logos.length === 0) {
        resolve();
        return;
      }

      // Preload all logo images first
      let loadedCount = 0;
      const totalLogos = logos.length;

      // Create image cache object to optimize multiple instances of the same image
      const imageCache = {};

      logos.forEach((logo) => {
        const imgSrc = logo.src;

        // If this image is already loading/loaded in cache, skip duplicated loading
        if (imageCache[imgSrc]) {
          loadedCount++;
          if (loadedCount === totalLogos) resolve();
          return;
        }

        // Create new cache entry
        imageCache[imgSrc] = new Image();

        if (logo.complete) {
          loadedCount++;
          if (loadedCount === totalLogos) resolve();
        } else {
          imageCache[imgSrc].onload = () => {
            loadedCount++;
            if (loadedCount === totalLogos) resolve();
          };
          imageCache[imgSrc].onerror = () => {
            loadedCount++;
            console.error("Failed to load partner logo:", logo.src);
            if (loadedCount === totalLogos) resolve();
          };
          imageCache[imgSrc].src = imgSrc;
        }
      });

      // Safeguard in case some images have issues loading
      setTimeout(resolve, 2000);
    });
  }

  // Call preload functions immediately and then initialize sliders
  Promise.all([preloadGalleryImages(), preloadPartnerLogos()]).then(() => {
    console.log("All images preloaded");

    // Продолжаем инициализацию после загрузки всех изображений
    initializeSliders();
  });

  // Функция инициализации всех слайдеров
  function initializeSliders() {
    // Screen size detection for responsive sliders
    const isLargeScreen = window.innerWidth >= 1441;
    const isExtraLargeScreen = window.innerWidth >= 1921;
    const isSmallScreen = window.innerWidth <= 576;
    const isMobileScreen = window.innerWidth <= 480;

    // Language Dropdown Toggle
    const languageSelector = document.querySelector(".language");

    if (languageSelector) {
      languageSelector.addEventListener("click", function (e) {
        // Toggle active class on language selector
        this.classList.toggle("active");

        // Close dropdown when clicking outside
        e.stopPropagation();
      });

      // Handle language option selection
      const languageOptions = document.querySelectorAll(".language-option");
      languageOptions.forEach((option) => {
        option.addEventListener("click", function (e) {
          e.preventDefault();
          // Get the selected language
          const selectedLanguage = this.textContent;
          // Update displayed language
          const languageText = document.querySelector(".language span");
          if (languageText) {
            languageText.textContent = selectedLanguage;
          }
          // Close the dropdown
          languageSelector.classList.remove("active");
        });
      });

      // Close dropdown when clicking elsewhere on the page
      document.addEventListener("click", function () {
        languageSelector.classList.remove("active");
      });
    }

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

    // Hero Background
    const slides = document.querySelectorAll(".slide");
    let index = 0;
    const slideTitle = document.getElementById("slide-title");
    const slideDescription = document.getElementById("slide-description");

    function showSlide(i) {
      slides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === i);
      });

      // Update content
      const currentSlide = slides[i];
      slideTitle.textContent = currentSlide.getAttribute("data-title");
      slideDescription.textContent =
        currentSlide.getAttribute("data-description");
    }

    document.querySelector(".arrow-right").addEventListener("click", () => {
      index = (index + 1) % slides.length;
      showSlide(index);
    });

    document.querySelector(".arrow-left").addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    });

    showSlide(index);

    // FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item");
    const faqQuestions = document.querySelectorAll(".faq-question");

    // Ensure all FAQ items have necessary elements
    faqItems.forEach((item) => {
      // Check if faq-divider is missing
      if (!item.querySelector(".faq-divider")) {
        const divider = document.createElement("div");
        divider.className = "faq-divider";
        const question = item.querySelector(".faq-question");
        if (question) {
          item.insertBefore(divider, question.nextSibling);
        }
      }

      // Check if faq-answer is missing
      if (!item.querySelector(".faq-answer")) {
        const answer = document.createElement("div");
        answer.className = "faq-answer";
        const p = document.createElement("p");
        p.textContent =
          "Пожалуйста, свяжитесь с нами для получения подробной информации по этому вопросу.";
        answer.appendChild(p);
        item.appendChild(answer);
      }
    });

    // Add click handlers to all FAQ questions
    faqQuestions.forEach((question) => {
      question.addEventListener("click", function () {
        const parentItem = this.closest(".faq-item");
        const isOpen = parentItem.classList.contains("open");
        const answer = parentItem.querySelector(".faq-answer");

        // Закрываем все FAQ элементы
        faqItems.forEach((faq) => {
          const faqAnswer = faq.querySelector(".faq-answer");
          faq.classList.remove("open");

          // Сбрасываем inline стили, если они есть
          if (faqAnswer) {
            // Чистим лишние инлайн стили, чтобы CSS мог корректно работать
            faqAnswer.style.maxHeight = "";
            faqAnswer.style.opacity = "";
            faqAnswer.style.padding = "";
          }
        });

        // Открываем кликнутый элемент, если он был закрыт
        if (!isOpen) {
          parentItem.classList.add("open");

          // Принудительно устанавливаем стили для открытия
          if (answer) {
            // Используем небольшую задержку, чтобы анимация работала корректно
            setTimeout(() => {
              // Проверяем видимость элемента
              const rect = parentItem.getBoundingClientRect();
              const isVisible =
                rect.top >= 0 &&
                rect.bottom <=
                  (window.innerHeight || document.documentElement.clientHeight);

              // Если элемент не полностью видим, скроллим к нему
              if (!isVisible) {
                parentItem.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }, 300);
          }
        }
      });
    });

    // Initialize Partners Slider
    initializePartnersSlider();

    // Initialize Swiper for Gallery
    const gallerySwiper = new Swiper(".gallery-swiper", {
      slidesPerView: "auto",
      centeredSlides: true,
      loop: true,
      speed: 1000,
      spaceBetween: isExtraLargeScreen ? 40 : (isLargeScreen ? 30 : 20),
      initialSlide: 1,
      loopAdditionalSlides: 9,
      effect: "slide",
      grabCursor: false,
      slideToClickedSlide: false,
      preloadImages: true,
      updateOnImagesReady: true,
      watchSlidesProgress: true,
      loopedSlides: 9,
      observer: true,
      observeParents: true,
      lazy: false,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      virtualTranslate: false,
      watchOverflow: true,
      preventInteractionOnTransition: true,
      preventClicks: true,
      preventClicksPropagation: true,
      allowTouchMove: true,
      touchReleaseOnEdges: true,
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 5,
          centeredSlides: true,
        },
        480: {
          slidesPerView: "auto",
          spaceBetween: 8,
          centeredSlides: true,
        },
        576: {
          slidesPerView: "auto",
          spaceBetween: 10,
          centeredSlides: true,
        },
        768: {
          slidesPerView: "auto",
          spaceBetween: 10,
          centeredSlides: true,
        },
      },
      on: {
        init: function () {
          // Preload all slide images on initialization
          const slides = document.querySelectorAll(".swiper-slide");
          slides.forEach((slide) => {
            const bgUrl = window.getComputedStyle(slide).backgroundImage;
            if (bgUrl && bgUrl !== "none") {
              const img = new Image();
              img.src = bgUrl.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
            }
          });
        },
        beforeTransitionStart: function () {
          // Установим opacity 1 для всех слайдов перед переходом
          document.querySelectorAll(".swiper-slide").forEach((slide) => {
            slide.style.opacity = "1";
          });
        },
        slideChangeTransitionEnd: function () {
          // Обновим свайпер после завершения перехода
          this.update();
        },
        loopFix: function (swiper) {
          // Дополнительная обработка для обеспечения бесшовного перехода при зацикливании
          // Эта функция вызывается перед фиксацией цикла
          requestAnimationFrame(() => {
            // Используем requestAnimationFrame для синхронизации с рендерингом браузера
            swiper.updateSlides();
            swiper.updateProgress();
          });
        },
      },
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
        const isFirstSlide = gallerySwiper.isBeginning;

        if (isFirstSlide) {
          // Если это первый слайд, применим специальную логику для плавного перехода к последнему
          // Сначала скроем переход, затем выполним его
          gallerySwiper.el.style.transition = "none";

          // Используем особый метод для перехода в конец без анимации
          setTimeout(() => {
            // Получим общее количество слайдов (без учета дублированных)
            const lastRealSlideIndex =
              Math.floor(gallerySwiper.slides.length / 3) - 1;
            gallerySwiper.slideToLoop(lastRealSlideIndex, 0); // Переходим к последнему слайду без анимации

            // Затем восстановим анимацию и плавно покажем последний слайд
            setTimeout(() => {
              gallerySwiper.el.style.transition = "";
              gallerySwiper.updateSlides();
            }, 50);
          }, 0);
        } else {
          // Обычное поведение для других слайдов
          gallerySwiper.slidePrev();
        }
      });

      galleryRightArrow.addEventListener("click", () => {
        const isLastSlide = gallerySwiper.isEnd;

        if (isLastSlide) {
          // Если это последний слайд, применим специальную логику для плавного перехода к первому
          // Сначала скроем переход, затем выполним его
          gallerySwiper.el.style.transition = "none";

          // Используем особый метод для перехода в начало без анимации
          setTimeout(() => {
            gallerySwiper.slideToLoop(0, 0); // Переходим к первому слайду без анимации

            // Затем восстановим анимацию и плавно покажем первый слайд
            setTimeout(() => {
              gallerySwiper.el.style.transition = "";
              gallerySwiper.updateSlides();
            }, 50);
          }, 0);
        } else {
          // Обычное поведение для других слайдов
          gallerySwiper.slideNext();
        }
      });
    }

    // Force update gallery after initialization
    setTimeout(function () {
      if (gallerySwiper) {
        gallerySwiper.update();

        // Настройка для обработки бесконечного цикла
        handleInfiniteLoop(gallerySwiper);
      }
    }, 100);

    // Функция для обработки бесконечного цикла
    function handleInfiniteLoop(swiper) {
      // Создадим кэш для предзагрузки изображений
      const slidesCache = {};

      // Кэшируем все фоновые изображения
      swiper.slides.forEach((slide, index) => {
        const style = window.getComputedStyle(slide);
        const bgImage = style.backgroundImage;
        slidesCache[index] = bgImage;
      });

      // Обработчик для перехода между слайдами
      swiper.on("slideChange", function () {
        const totalSlides = swiper.slides.length;
        const currentIndex = swiper.activeIndex;

        // Если мы приближаемся к концу/началу, обновим свайпер
        if (currentIndex >= totalSlides - 3 || currentIndex <= 2) {
          setTimeout(() => {
            swiper.update();
          }, 0);
        }
      });

      // Обработчик завершения транзиции
      swiper.on("transitionEnd", function () {
        // Обновим свайпер после завершения анимации
        swiper.update();
      });
    }

    // Initialize Reviews Slider
    const reviewsSwiper = new Swiper(".reviews-swiper", {
      slidesPerView: "auto",
      centeredSlides: true,
      loop: true,
      speed: 600,
      spaceBetween: 30,
      initialSlide: 2,
      loopAdditionalSlides: 3,
      effect: "slide",
      grabCursor: false,
      slideToClickedSlide: false,
      preloadImages: true,
      updateOnImagesReady: true,
      watchSlidesProgress: true,
      loopedSlides: 3,
      observer: true,
      observeParents: true,
      lazy: false,
      preventInteractionOnTransition: true,
      preventClicks: true,
      preventClicksPropagation: true,
      allowTouchMove: true,
      touchReleaseOnEdges: true,
      width: null,
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
          initialSlide: 2,
        },
        576: {
          slidesPerView: "auto",
          spaceBetween: 20,
          initialSlide: 2,
        },
        768: {
          slidesPerView: "auto",
          spaceBetween: 30,
          initialSlide: 2,
        },
      },
      on: {
        init: function () {
          // Убедимся, что слайды имеют правильные размеры и стили opacity
          document
            .querySelectorAll(".reviews-swiper .swiper-slide")
            .forEach((slide) => {
              if (window.innerWidth > 768) {
                slide.style.width = "363px";
                slide.style.height = "420px";
              }

              // Применяем opacity ко всем слайдам
              const reviewCard = slide.querySelector(".review-card");
              if (reviewCard) {
                reviewCard.style.opacity = "0.4";
                // Принудительно применяем padding
                if (window.innerWidth > 576) {
                  reviewCard.style.padding = "35px";
                } else if (window.innerWidth > 480) {
                  reviewCard.style.padding = "30px";
                } else {
                  reviewCard.style.padding = "25px";
                }
              }
            });

          // Устанавливаем полную непрозрачность активному слайду
          const activeSlide = document.querySelector(
            ".reviews-swiper .swiper-slide-active"
          );
          if (activeSlide) {
            const activeReviewCard = activeSlide.querySelector(".review-card");
            if (activeReviewCard) {
              activeReviewCard.style.opacity = "1";
            }
          }
        },
        slideChangeTransitionStart: function () {
          // При начале смены слайда устанавливаем opacity всем карточкам
          document
            .querySelectorAll(".reviews-swiper .swiper-slide .review-card")
            .forEach((card) => {
              card.style.opacity = "0.4";
            });
        },
        slideChangeTransitionEnd: function () {
          // Обновим свайпер после завершения перехода
          this.update();

          // Установим opacity 1 для активного слайда
          const activeSlide = document.querySelector(
            ".reviews-swiper .swiper-slide-active"
          );
          if (activeSlide) {
            const activeReviewCard = activeSlide.querySelector(".review-card");
            if (activeReviewCard) {
              activeReviewCard.style.opacity = "1";

              // Убедимся, что padding активного слайда правильный
              if (window.innerWidth > 576) {
                activeReviewCard.style.padding = "35px";
              } else if (window.innerWidth > 480) {
                activeReviewCard.style.padding = "30px";
              } else {
                activeReviewCard.style.padding = "25px";
              }
            }
          }
        },
        resize: function () {
          // Обновим размеры при изменении размера окна
          this.update();

          document
            .querySelectorAll(".reviews-swiper .swiper-slide")
            .forEach((slide) => {
              if (window.innerWidth > 768) {
                slide.style.width = "363px";
                slide.style.height = "420px";
              }
            });

          // Переустановим opacity для всех карточек
          document
            .querySelectorAll(".reviews-swiper .swiper-slide .review-card")
            .forEach((card) => {
              card.style.opacity = "0.4";

              // Принудительно применяем padding в зависимости от размера экрана
              if (window.innerWidth > 576) {
                card.style.padding = "35px";
              } else if (window.innerWidth > 480) {
                card.style.padding = "30px";
              } else {
                card.style.padding = "25px";
              }
            });

          // Установим opacity 1 для активного слайда
          const activeSlide = document.querySelector(
            ".reviews-swiper .swiper-slide-active"
          );
          if (activeSlide) {
            const activeReviewCard = activeSlide.querySelector(".review-card");
            if (activeReviewCard) {
              activeReviewCard.style.opacity = "1";
            }
          }
        },
      },
    });

    // Connect custom navigation arrows for reviews
    const reviewLeftArrow = document.querySelector(".review-arrow-left");
    const reviewRightArrow = document.querySelector(".review-arrow-right");

    if (reviewLeftArrow && reviewRightArrow) {
      reviewLeftArrow.addEventListener("click", () => {
        const isFirstSlide = reviewsSwiper.isBeginning;

        if (isFirstSlide) {
          // Если это первый слайд, применим специальную логику для плавного перехода к последнему
          reviewsSwiper.el.style.transition = "none";

          // Используем особый метод для перехода в конец без анимации
          setTimeout(() => {
            const lastRealSlideIndex = reviewsSwiper.slides.length - 1;
            reviewsSwiper.slideToLoop(lastRealSlideIndex, 0); // Переходим к последнему слайду без анимации

            // Затем восстановим анимацию и плавно покажем последний слайд
            setTimeout(() => {
              reviewsSwiper.el.style.transition = "";
              reviewsSwiper.updateSlides();
            }, 50);
          }, 0);
        } else {
          // Обычное поведение для других слайдов
          reviewsSwiper.slidePrev();
        }
      });

      reviewRightArrow.addEventListener("click", () => {
        const isLastSlide = reviewsSwiper.isEnd;

        if (isLastSlide) {
          // Если это последний слайд, применим специальную логику для плавного перехода к первому
          reviewsSwiper.el.style.transition = "none";

          // Используем особый метод для перехода в начало без анимации
          setTimeout(() => {
            reviewsSwiper.slideToLoop(0, 0); // Переходим к первому слайду без анимации

            // Затем восстановим анимацию и плавно покажем первый слайд
            setTimeout(() => {
              reviewsSwiper.el.style.transition = "";
              reviewsSwiper.updateSlides();
            }, 50);
          }, 0);
        } else {
          // Обычное поведение для других слайдов
          reviewsSwiper.slideNext();
        }
      });
    }

    // Force update reviews swiper after initialization
    setTimeout(function () {
      if (reviewsSwiper) {
        reviewsSwiper.update();
        handleInfiniteLoop(reviewsSwiper);

        // Принудительно установим точные размеры для слайдов
        if (window.innerWidth > 768) {
          document
            .querySelectorAll(".reviews-swiper .swiper-slide")
            .forEach((slide) => {
              slide.style.width = "363px";
              slide.style.height = "420px";
            });

          // Повторное обновление после принудительной установки размеров
          setTimeout(() => {
            reviewsSwiper.update();
          }, 50);
        }
      }
    }, 100);

    // Form validation and success modal
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');
    const successModal = document.getElementById('successModal');
    const closeButton = document.querySelector('.close-button');
    const checkboxWrapper = document.querySelector('.checkbox-wrapper');
    const checkbox = document.querySelector('.checkbox');
    let isChecked = false;

    // Checkbox toggle
    if (checkboxWrapper) {
      checkboxWrapper.addEventListener('click', function() {
        isChecked = !isChecked;
        checkbox.classList.toggle('checked', isChecked);
        
        // Сбрасываем ошибку при клике
        if (isChecked) {
          checkboxWrapper.classList.remove('error');
        }
      });
    }

    // Form validation
    function validateInput(input, errorElement, errorMessage) {
      if (!input.value.trim()) {
        input.classList.add('error');
        input.classList.remove('valid');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('visible');
        return false;
      } else {
        input.classList.remove('error');
        input.classList.add('valid');
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
        return true;
      }
    }

    // Validate name
    nameInput.addEventListener('blur', function() {
      validateInput(nameInput, nameError, 'Пожалуйста, введите ваше имя');
    });

    // Validate phone
    phoneInput.addEventListener('blur', function() {
      validateInput(phoneInput, phoneError, 'Пожалуйста, введите номер телефона');
    });

    // Clear errors on input
    nameInput.addEventListener('input', function() {
      if (nameInput.value.trim()) {
        nameInput.classList.remove('error');
        nameError.classList.remove('visible');
      }
    });

    phoneInput.addEventListener('input', function() {
      if (phoneInput.value.trim()) {
        phoneInput.classList.remove('error');
        phoneError.classList.remove('visible');
      }
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nameValid = validateInput(nameInput, nameError, 'Пожалуйста, введите ваше имя');
      const phoneValid = validateInput(phoneInput, phoneError, 'Пожалуйста, введите номер телефона');
      
      // Проверка чекбокса
      if (!isChecked) {
        checkboxWrapper.classList.add('error');
      } else {
        checkboxWrapper.classList.remove('error');
      }
      
      if (nameValid && phoneValid && isChecked) {
        // Simulate form submission (in a real app, you'd send data to a server here)
        setTimeout(() => {
          // Show success modal
          successModal.classList.add('active');
          
          // Reset form
          contactForm.reset();
          nameInput.classList.remove('valid');
          phoneInput.classList.remove('valid');
          isChecked = false;
          checkbox.classList.remove('checked');
          checkboxWrapper.classList.remove('error');
        }, 500);
      }
    });

    // Close success modal
    closeButton.addEventListener('click', function() {
      successModal.classList.remove('active');
    });

    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && successModal.classList.contains('active')) {
        successModal.classList.remove('active');
      }
    });

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

    // Store slider instances globally for resize handling
    window.gallerySwiper = gallerySwiper;
    window.reviewsSwiper = reviewsSwiper;
  }

  // Function to initialize partners slider
  function initializePartnersSlider() {
    const partnersTrack = document.querySelector(".partners-track");
    if (!partnersTrack) return;

    // Clear any existing cloned logos first
    const originalLogos = Array.from(
      partnersTrack.querySelectorAll(".partner-logo")
    ).slice(0, 8);
    // Remove all previous clones to start fresh
    partnersTrack.innerHTML = "";

    // Add original set
    originalLogos.forEach((logo) => {
      partnersTrack.appendChild(logo.cloneNode(true));
    });

    // Calculate total width
    const totalWidth = calculateTotalWidth(partnersTrack);
    const viewportWidth = window.innerWidth;

    // We need at least 3x viewport width for ultra-smooth scrolling
    const multiplier = Math.max(Math.ceil((viewportWidth * 4) / totalWidth), 3);

    // Add enough duplicates to ensure smooth infinite scrolling
    for (let i = 0; i < multiplier; i++) {
      originalLogos.forEach((logo) => {
        const clone = logo.cloneNode(true);
        partnersTrack.appendChild(clone);
      });
    }

    // Set animation properly
    updatePartnersSlider();
  }

  // Function to calculate total width of partner logos
  function calculateTotalWidth(track) {
    if (!track) return 0;
    const logos = track.querySelectorAll(".partner-logo");
    let width = 0;
    logos.forEach((logo) => {
      width += logo.offsetWidth;
    });
    return width;
  }

  // Function to update partners slider animation
  function updatePartnersSlider() {
    const partnersTrack = document.querySelector(".partners-track");
    if (!partnersTrack) return;

    // Get the set of original logos (first 8)
    const firstSetWidth =
      calculateTotalWidth(partnersTrack) /
      (partnersTrack.querySelectorAll(".partner-logo").length / 8);

    // Calculate optimal duration - slower for smoother movement
    // Speed adjustment based on screen size
    const baseSpeed = window.innerWidth <= 768 ? 35 : 40;
    const duration = Math.max(firstSetWidth / baseSpeed, 15);

    // Stop current animation
    partnersTrack.style.animation = "none";

    // Force a reflow (repaint)
    void partnersTrack.offsetWidth;

    // Set custom property for the animation end value
    document.documentElement.style.setProperty(
      "--partner-track-width",
      `-${firstSetWidth}px`
    );

    // Start new animation with calculated duration
    partnersTrack.style.animation = `partnerScroll ${duration}s linear infinite`;
  }

  // Handle window resize events to maintain responsive layout
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Reinitialize sliders on significant width changes
      const newWidth = window.innerWidth;
      const wasLargeScreen = window.lastWidth >= 1441;
      const isLargeScreen = newWidth >= 1441;
      const wasExtraLargeScreen = window.lastWidth >= 1921;
      const isExtraLargeScreen = newWidth >= 1921;
      const wasSmallScreen = window.lastWidth <= 576;
      const isSmallScreen = newWidth <= 576;

      // Only reinitialize if crossing size thresholds
      if (wasLargeScreen !== isLargeScreen || 
          wasExtraLargeScreen !== isExtraLargeScreen || 
          wasSmallScreen !== isSmallScreen) {
        console.log('Screen size threshold crossed, reinitializing sliders');
        // Destroy and recreate sliders
        if (window.gallerySwiper) window.gallerySwiper.destroy(true, true);
        if (window.reviewsSwiper) window.reviewsSwiper.destroy(true, true);
        
        // Reinitialize sliders
        initializeSliders();
      } else {
        // Just update sliders on regular resize
        if (window.gallerySwiper) window.gallerySwiper.update();
        if (window.reviewsSwiper) window.reviewsSwiper.update();
      }
      
      // Update partners slider on any resize
      updatePartnersSlider();
      
      // Store current width for next comparison
      window.lastWidth = newWidth;
    }, 250);
  });

  // Store initial width
  window.lastWidth = window.innerWidth;
});
