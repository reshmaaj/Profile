document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.querySelector(".avatar");
  const homeText = document.querySelector(".home-text");

  setTimeout(() => {
    avatar.classList.add("show-avatar");
  }, 300);

  setTimeout(() => {
    avatar.classList.add("move-avatar-right");
  }, 1300);

  setTimeout(() => {
    homeText.classList.add("show-text");
  }, 2500);
});

function createObserver(targets, showClass, delay = 0, hideClass = true) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add(showClass);
        }, delay);
      } else if (hideClass) {
        entry.target.classList.remove(showClass);
      }
    });
  }, { threshold: 0.3 });

  targets.forEach(target => observer.observe(target));
}

// About Section
const aboutAvatar = document.querySelector(".avatar-left");
const aboutText = document.querySelector(".about-text");

createObserver([aboutAvatar], "move-avatar-left", 0);
createObserver([aboutText], "show-about-text", 800);

// Projects
const projects = document.querySelectorAll(".project-container");
createObserver(projects, "show-project", 0);
