// Grab elements
const selectElement = (selector) => {
    const element = document.querySelector(selector);
    if(element) return element;
    throw new Error(`Something went wrong! Make sure that ${selector} exists/is typed correctly.`);  
};

//Nav styles on scroll
const scrollHeader = () =>{
    const navbarElement = selectElement('#header');
    if(this.scrollY >= 15) {
        navbarElement.classList.add('activated');
    } else {
        navbarElement.classList.remove('activated');
    }
}

window.addEventListener('scroll', scrollHeader);

// Open menu & search pop-up
const menuToggleIcon = selectElement('#menu-toggle-icon');
const formOpenBtn = selectElement('#search-icon');
const formCloseBtn = selectElement('#form-close-btn');
const searchContainer = selectElement('#search-form-container');

const toggleMenu = () =>{
    const mobileMenu = selectElement('#menu');
    mobileMenu.classList.toggle('activated');
    menuToggleIcon.classList.toggle('activated');
}

menuToggleIcon.addEventListener('click', toggleMenu);

// Open/Close search form popup
formOpenBtn.addEventListener('click', () => searchContainer.classList.add('activated'));
formCloseBtn.addEventListener('click', () => searchContainer.classList.remove('activated'));
// -- Close the search form popup on ESC keypress
window.addEventListener('keyup', (event) => {
    if(event.key === 'Escape') searchContainer.classList.remove('activated');
});

// Switch theme/add to local storage
const body = document.body;
const themeToggleBtn = selectElement('#theme-toggle-btn');
const currentTheme = localStorage.getItem('currentTheme');

// Check to see if there is a theme preference in local Storage, if so add the ligt theme to the body
if (currentTheme) {
    body.classList.add('light-theme');
}

themeToggleBtn.addEventListener('click', function () {
    // Add light theme on click
    body.classList.toggle('light-theme');

    // If the body has the class of light theme then add it to local Storage, if not remove it
    if (body.classList.contains('light-theme')) {
        localStorage.setItem('currentTheme', 'themeActive');
    } else {
        localStorage.removeItem('currentTheme');
    }
});

// Swiper
const swiper = new Swiper(".swiper", {
    // How many slides to show
    slidesPerView: 1,
    // How much space between slides
    spaceBetween: 20,
    // Make the next and previous buttons work
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    // Make the pagination indicators work
    pagination: {
        el: '.swiper-pagination'
    },
    //Responsive breakpoints for how many slides to show at that view
    breakpoints: {
        // 700px and up shoes 2 slides
        700: {
          slidesPerView: 2
        },
        // 1200px and up shoes 3 slides
        1200: {
            slidesPerView: 3
        }
    }   
});
// log in 
const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");
// Add click event listener to each eye icon for toggling password visibility
pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => {
    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
    pwFields.forEach(password => {
      if (password.type === "password") { // If password is hidden
        password.type = "text"; // Show password
        eyeIcon.classList.replace("bx-hide", "bx-show"); // Change icon to show state
        return;
      }
      password.type = "password"; // Hide password
      eyeIcon.classList.replace("bx-show", "bx-hide"); // Change icon to hide state
    });
  });
});
// Add click event listener to each link to toggle between forms
links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault(); // Prevent default link behavior
    forms.classList.toggle("show-signup");
  });
});

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault(); // Prevent default link behavior
    forms.classList.toggle("show-signup");
  });
});

const logout = document.querySelector("#logout-btn");

logout.addEventListener("click", () => {
  // Perform logout actions here
  console.log("User logged out");
  // Redirect to login page or home page
  window.location.href = "../html/login.html";
});

const newPostBtn = document.getElementById('new-post-btn');
const newPostModal = document.getElementById('new-post-modal');
const closeModalBtns = document.querySelectorAll('.close-modal-btn');

newPostBtn.addEventListener('click', () => {
    newPostModal.style.display = 'flex';
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        newPostModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === newPostModal) {
        newPostModal.style.display = 'none';
    }
});
const posts = [
  {
      id: 1,
      userImage: '../pic/user1.jpg',
      username: 'User1',
      image: '../pic/post1.jpg',
      title: "This is a title",
      description: 'This is a beautiful sunset!',
      likes: 10,
      comments: 2
  },
 /* {
      id: 2,
      userImage: '../pic/user2.jpg',
      username: 'User2',
      image: '../pic/post2.jpg',
      description: 'Check out this amazing landscape.',
      likes: 15,
      comments: 4
  }*/ 
];

const postsContainer = document.getElementById('posts-container');

// Функция для рендеринга постов
function renderPosts() {
  posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.innerHTML = `
          <div class="post-header">
              <img src="${post.userImage}" alt="User">
              <span>${post.username}</span>
          </div>
          <img src="${post.image}" alt="Post Image">
          <div class="post-content">
              <h2>${post.title}</h2>
              <p>${post.description}</p>
              <div class="post-actions">
                  <button class="like-btn" data-id="${post.id}">
                      <i class="ri-heart-line"></i> <span>${post.likes}</span>
                  </button>
                  <button class="comment-btn" data-id="${post.id}">
                      <i class="ri-chat-3-line"></i> <span>${post.comments}</span>
                  </button>
                  <button class="bookmark-btn" data-id="${post.id}">
                      <i class="ri-bookmark-line"></i>
                  </button>
              </div>
          </div>
      `;
      postsContainer.appendChild(postElement);
  });
}

// Обработчики событий для кнопок
postsContainer.addEventListener('click', (event) => {
  const target = event.target;
  if (target.closest('.like-btn')) {
      const postId = target.closest('.like-btn').dataset.id;
      const post = posts.find(p => p.id == postId);
      post.likes += 1;
      target.querySelector('span').textContent = post.likes;
  }
  if (target.closest('.comment-btn')) {
      const postId = target.closest('.comment-btn').dataset.id;
      alert(`Open comments for post ${postId}`);
  }
  if (target.closest('.bookmark-btn')) {
      const postId = target.closest('.bookmark-btn').dataset.id;
      alert(`Post ${postId} bookmarked!`);
  }
});

// Вызов функции рендеринга
renderPosts();
