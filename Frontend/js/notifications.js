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

const toggleMenu = () =>{
    const mobileMenu = selectElement('#menu');
    mobileMenu.classList.toggle('activated');
    menuToggleIcon.classList.toggle('activated');
}

menuToggleIcon.addEventListener('click', toggleMenu);



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
  logoutUser();
});


async function refreshAccessToken() {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await fetch('https://blogerusplatformormer.onrender.com/refresh-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }
            return data.accessToken;
        } else {
            throw new Error('No access token returned');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        logoutUser(); // Только если обновление действительно провалилось
    }
}


function logoutUser() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = 'login.html';
}


async function fetchNotifications() {

    console.log("Fetching notifications...");

    try {
        let accessToken = localStorage.getItem('accessToken');
        console.log("Access token:", accessToken ? "Found" : "Not found");
        
        let response = await fetch('https://blogerusplatformormer.onrender.com/notifications', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (response.status === 403) {  // Если accessToken истёк
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                handleLogout(); // Разлогиниваем, если refreshToken недействителен
                return;
            }

            response = await fetch('https://blogerusplatformormer.onrender.com/notifications', {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const notifications = await response.json();
        renderNotifications(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
}

// Fetch and render posts on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, fetching notifications...");
    fetchNotifications();
});

// Function to render posts
function renderNotifications(notifications) {
    console.log("Rendering notifications:", notifications);
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        console.error('Error: notification-container element not found.');
        return;
    }

    notificationContainer.innerHTML = ''; // Clear previous posts

    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = 'post'; // Пока что используем класс post для уведомлений
        notificationElement.innerHTML = `
            <div class="post-header">
                from <span>${notification.sender.fullName || 'Alibek Tasten'}</span>
            </div>
            <h2>${notification.post.title}</h2>
            <p>${notification.type}d</p>
        `;

        notificationContainer.appendChild(notificationElement);
    });

    
}

