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
const logoutMobile = document.querySelector("#logout-btn1");

if (logout) {
  logout.addEventListener("click", () => {
    logoutUser();
  });
}

if (logoutMobile) {
  logoutMobile.addEventListener("click", () => {
    logoutUser();
  });
}

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

async function fetchUserBio(){
    try {
        let accessToken = localStorage.getItem('accessToken');
        console.log("Access token:", accessToken ? "Found" : "Not found");
        
        let response = await fetch('https://blogerusplatformormer.onrender.com/me', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (response.status === 403) {  // Если accessToken истёк
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                logoutUser(); // Разлогиниваем, если refreshToken недействителен
                return;
            }

            response = await fetch('https://blogerusplatformormer.onrender.com/me', {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const user = await response.json();
        renderUserBio(user);
    } catch (error) {
        console.error('Error fetching user bio:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, fetching user bio...");
    fetchUserBio();
    fetchUserPosts();
});

function renderUserBio(user) {
    console.log("Rendering user bio:", user);
    const userBioContainer = document.getElementById('user-bio');
    if (!userBioContainer) {
        console.error('Error: user-bio element not found.');
        return;
    }

    userBioContainer.innerHTML = `
        <h2>${user.fullName}</h2>
        <p>${user.email}</p>
    `;
}

async function fetchUserPosts() {
    console.log("Fetching user posts...");

    try {
        let accessToken = localStorage.getItem('accessToken');
        console.log("Access token:", accessToken ? "Found" : "Not found");
        
        let response = await fetch('https://blogerusplatformormer.onrender.com/my-posts', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (response.status === 403) {  // Если accessToken истёк
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                logoutUser(); // Разлогиниваем, если refreshToken недействителен
                return;
            }

            response = await fetch('https://blogerusplatformormer.onrender.com/my-posts', {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const posts = await response.json();
        renderUserPosts(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
    }
}

function renderUserPosts(posts) {
    console.log("Rendering user posts:", posts);
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) {
        console.error('Error: posts-container element not found.');
        return;
    }

    postsContainer.innerHTML = ''; // Clear previous posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.postId = post._id; // Store post ID for edit/delete operations
        
        postElement.innerHTML = `
            <div class="post-header">
                <span>${post.author.fullName || 'Alibek Tasten'}</span>
                <div class="post-actions">
                    <button class="btn edit-post-btn" data-id="${post._id}">
                        <i class="ri-edit-line"></i> Edit
                    </button>
                    <button class="btn delete-post-btn" data-id="${post._id}">
                        <i class="ri-delete-bin-line"></i> Delete
                    </button>
                </div>
            </div>
            <h2 class="post-title">${post.title}</h2>
            <p class="post-text">${post.text}</p>
            
            <div class="edit-form" style="display: none;">
                <div class="form-group">
                    <input type="text" class="edit-title-input" value="${post.title}" placeholder="Title">
                </div>
                <div class="form-group">
                    <textarea class="edit-text-input" placeholder="Content">${post.text}</textarea>
                </div>
                <div class="form-actions">
                    <button class="btn save-post-btn" data-id="${post._id}">Save</button>
                    <button class="btn cancel-edit-btn">Cancel</button>
                </div>
            </div>
        `;

        postsContainer.appendChild(postElement);
        
        // Attach event listeners to the buttons for this post
        const editBtn = postElement.querySelector('.edit-post-btn');
        const deleteBtn = postElement.querySelector('.delete-post-btn');
        const saveBtn = postElement.querySelector('.save-post-btn');
        const cancelBtn = postElement.querySelector('.cancel-edit-btn');
        
        editBtn.addEventListener('click', () => toggleEditMode(post._id));
        deleteBtn.addEventListener('click', () => deletePost(post._id));
        saveBtn.addEventListener('click', () => updatePost(post._id));
        cancelBtn.addEventListener('click', () => cancelEdit(post._id));
    });
}

function toggleEditMode(postId) {
    const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
    if (!postElement) return;
    
    const postTitle = postElement.querySelector('.post-title');
    const postText = postElement.querySelector('.post-text');
    const editForm = postElement.querySelector('.edit-form');
    const postActions = postElement.querySelector('.post-actions');
    
    // Toggle visibility
    postTitle.style.display = 'none';
    postText.style.display = 'none';
    postActions.style.display = 'none';
    editForm.style.display = 'block';
}

function cancelEdit(postId) {
    const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
    if (!postElement) return;
    
    const postTitle = postElement.querySelector('.post-title');
    const postText = postElement.querySelector('.post-text');
    const editForm = postElement.querySelector('.edit-form');
    const postActions = postElement.querySelector('.post-actions');
    
    // Toggle visibility back
    postTitle.style.display = 'block';
    postText.style.display = 'block';
    postActions.style.display = 'flex';
    editForm.style.display = 'none';
}

async function updatePost(postId) {
    const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
    if (!postElement) return;
    
    const titleInput = postElement.querySelector('.edit-title-input');
    const textInput = postElement.querySelector('.edit-text-input');
    
    const updatedTitle = titleInput.value.trim();
    const updatedText = textInput.value.trim();
    
    if (!updatedTitle || !updatedText) {
        alert('Both title and content are required!');
        return;
    }
    
    try {
        let accessToken = localStorage.getItem('accessToken');
        
        let response = await fetch(`https://blogerusplatformormer.onrender.com/posts/${postId}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` 
            },
            body: JSON.stringify({
                title: updatedTitle,
                text: updatedText
            })
        });
        
        if (response.status === 403) {
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                logoutUser();
                return;
            }
            
            response = await fetch(`https://blogerusplatformormer.onrender.com/posts/${postId}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` 
                },
                body: JSON.stringify({
                    title: updatedTitle,
                    text: updatedText
                })
            });
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Post updated:', result);
        
        // Update the UI with the new content
        const postTitle = postElement.querySelector('.post-title');
        const postText = postElement.querySelector('.post-text');
        
        postTitle.textContent = updatedTitle;
        postText.textContent = updatedText;
        
        // Switch back to view mode
        cancelEdit(postId);
        
    } catch (error) {
        console.error('Error updating post:', error);
        alert('Failed to update post. Please try again.');
    }
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    try {
        let accessToken = localStorage.getItem('accessToken');
        
        let response = await fetch(`https://blogerusplatformormer.onrender.com/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        if (response.status === 403) {
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                logoutUser();
                return;
            }
            
            response = await fetch(`https://blogerusplatformormer.onrender.com/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Remove the post from the UI
        const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
        if (postElement) {
            postElement.remove();
        }
        
        console.log('Post deleted successfully');
        
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
    }
}