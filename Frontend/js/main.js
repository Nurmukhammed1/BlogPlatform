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
  logoutUser();
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

async function fetchPosts() {
    try {
        let accessToken = localStorage.getItem('accessToken');
        
        let response = await fetch('https://blogerusplatformormer.onrender.com/posts', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (response.status === 403) {  // Если accessToken истёк
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                handleLogout(); // Разлогиниваем, если refreshToken недействителен
                return;
            }

            response = await fetch('https://blogerusplatformormer.onrender.com/posts', {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Fetch and render posts on page load
fetchPosts();

// Function to add comment styles that match the N-platform dark theme
function addCommentStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .comments-section {
            margin-top: 10px;
            border-top: 1px solid #2a2d35;
            padding-top: 10px;
            background-color: #1e2129;
            border-radius: 0 0 8px 8px;
        }
        
        .comments-container {
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 10px;
            padding: 0 12px;
        }
        
        .comment {
            padding: 12px;
            margin-bottom: 8px;
            background-color: #282c37;
            border-radius: 4px;
        }
        
        .comment-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        
        .comment-author {
            font-weight: bold;
            font-size: 0.9em;
            color: #e0e0e0;
        }
        
        .comment-text {
            margin: 0;
            font-size: 0.95em;
            color: #d0d0d0;
        }
        
        .comment-form {
            display: flex;
            gap: 8px;
            padding: 0 12px 12px;
        }
        
        .comment-input {
            flex: 1;
            padding: 10px;
            background-color: #282c37;
            color: #e0e0e0;
            border: 1px solid #3a3f4c;
            border-radius: 4px;
            resize: none;
            min-height: 40px;
        }
        
        .comment-input::placeholder {
            color: #6c7088;
        }
        
        .send-comment-btn {
            padding: 8px 16px;
            background-color: #7c4dff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
        }
        
        .send-comment-btn:hover {
            background-color: #6c3fef;
        }
        
        .delete-comment-btn {
            background: none;
            border: none;
            color: #ff5370;
            cursor: pointer;
            font-size: 0.8em;
        }
        
        .no-comments {
            color: #6c7088;
            font-style: italic;
            text-align: center;
            padding: 16px;
        }
    `;
    document.head.appendChild(style);
}

// Modify the renderPosts function to match the updated styling
function renderPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) {
        console.error('Error: posts-container element not found.');
        return;
    }

    postsContainer.innerHTML = ''; // Clear previous posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <span>${post.author?.fullName || 'Unknown Author'}</span>
            </div>
            <h2>${post.title}</h2>
            <p>${post.text}</p>
            <div class="post-actions">
                <button class="like-btn" data-id="${post._id}">
                    <i class="ri-heart-line"></i> <span>${post.likeCount || 0}</span>
                </button>
                <button class="bookmark-btn" data-id="${post._id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-bookmark" viewBox="0 0 16 16">
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223
                            2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1
                            .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                    </svg>
                </button>
                <button class="comment-btn" data-id="${post._id}">
                    <i class="ri-chat-3-line"></i> <span>${post.comments?.length || 0}</span>
                </button>
            </div>
            <div class="comments-section" id="comments-section-${post._id}" style="display: none;">
                <div class="comments-container" id="comments-container-${post._id}">
                    <!-- Comments will be loaded here -->
                </div>
                <div class="comment-form">
                    <textarea class="comment-input" placeholder="Write a comment..." id="comment-input-${post._id}"></textarea>
                    <button class="send-comment-btn" data-id="${post._id}">Send</button>
                </div>
            </div>
        `;

        postsContainer.appendChild(postElement);
    });

    // Attach event listeners
    attachEventListeners();
}

// Function to attach all event listeners (separated for cleaner code organization)
function attachEventListeners() {
    // Like button event listeners
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const postId = e.currentTarget.dataset.id;
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`https://blogerusplatformormer.onrender.com/posts/${postId}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Like request failed');
                }
                // Optionally re-fetch posts to update like count
                fetchPosts();
            } catch (error) {
                console.error('Error liking post:', error);
            }
        });
    });

    // Bookmark button event listeners
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const postId = e.currentTarget.dataset.id;
            const svgIcon = e.currentTarget.querySelector('svg');
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`https://blogerusplatformormer.onrender.com/bookmark/${postId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Bookmark request failed');
                }

                // Toggle the icon
                if (svgIcon.classList.contains('bi-bookmark')) {
                    svgIcon.outerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             class="bi bi-bookmark-fill" viewBox="0 0 16 16">
                             <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0
                                     14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
                        </svg>`;
                } else {
                    svgIcon.outerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             class="bi bi-bookmark" viewBox="0 0 16 16">
                             <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0
                                     1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0
                                     1 2 15.5zm2-1a1 1 0 0 0-1
                                     1v12.566l4.723-2.482a.5.5 0 0 1
                                     .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                        </svg>`;
                }
            } catch (error) {
                console.error('Error bookmarking post:', error);
            }
        });
    });

    // Comment button event listeners
    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const postId = e.currentTarget.dataset.id;
            const commentsSection = document.getElementById(`comments-section-${postId}`);
            
            // Toggle comments section visibility
            if (commentsSection.style.display === 'none') {
                commentsSection.style.display = 'block';
                // Load comments when opening the section
                await loadComments(postId);
            } else {
                commentsSection.style.display = 'none';
            }
        });
    });

    // Send comment button event listeners
    document.querySelectorAll('.send-comment-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const postId = e.currentTarget.dataset.id;
            const commentInput = document.getElementById(`comment-input-${postId}`);
            const commentText = commentInput.value.trim();
            
            if (commentText) {
                await addComment(postId, commentText);
                commentInput.value = ''; // Clear the input after sending
                await loadComments(postId); // Refresh comments
                
                // Update comment count in the UI
                updateCommentCount(postId, 1);
            }
        });
    });

    // Enter key to send comment
    document.querySelectorAll('.comment-input').forEach(input => {
        input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const postId = input.id.replace('comment-input-', '');
                const commentText = input.value.trim();
                
                if (commentText) {
                    await addComment(postId, commentText);
                    input.value = ''; // Clear the input after sending
                    await loadComments(postId); // Refresh comments
                    
                    // Update comment count in the UI
                    updateCommentCount(postId, 1);
                }
            }
        });
    });
}

// Helper function to update comment count
function updateCommentCount(postId, change) {
    const commentCountElement = document.querySelector(`.comment-btn[data-id="${postId}"] span`);
    if (commentCountElement) {
        const currentCount = parseInt(commentCountElement.textContent) || 0;
        commentCountElement.textContent = Math.max(0, currentCount + change);
    }
}

// Function to load comments for a specific post
async function loadComments(postId) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`https://blogerusplatformormer.onrender.com/posts/${postId}/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load comments');
        }
        
        const comments = await response.json();
        renderComments(postId, comments);
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Function to render comments
function renderComments(postId, comments) {
    const commentsContainer = document.getElementById(`comments-container-${postId}`);
    commentsContainer.innerHTML = ''; // Clear existing comments
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
        return;
    }
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author?.fullName || 'Unknown User'}</span>
                ${comment.author?._id === localStorage.getItem('userId') ? 
                    `<button class="delete-comment-btn" data-post-id="${postId}" data-comment-id="${comment._id}">
                        <i class="ri-delete-bin-line"></i>
                    </button>` : ''
                }
            </div>
            <p class="comment-text">${comment.text}</p>
        `;
        
        commentsContainer.appendChild(commentElement);
    });
    
    // Attach delete comment button event listeners
    document.querySelectorAll('.delete-comment-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const postId = e.currentTarget.dataset.postId;
            const commentId = e.currentTarget.dataset.commentId;
            
            if (confirm('Are you sure you want to delete this comment?')) {
                await deleteComment(postId, commentId);
                await loadComments(postId); // Refresh comments
                
                // Update comment count in the UI
                updateCommentCount(postId, -1);
            }
        });
    });
}

// Function to add a comment
async function addComment(postId, text) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`https://blogerusplatformormer.onrender.com/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) {
            throw new Error('Failed to add comment');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error adding comment:', error);
        return null;
    }
}

// Function to delete a comment
async function deleteComment(postId, commentId) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`https://blogerusplatformormer.onrender.com/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting comment:', error);
        return null;
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    addCommentStyles();
});



// Example usage (attach this function to a form submission)
document.getElementById('new-post-form').addEventListener('click', async function(event) {
    event.preventDefault();
    
    const title = document.getElementById('post-title').value.trim();
    const text = document.getElementById('post-description').value.trim();

    try {
        console.log('Creating post with:', title, text);
        let accessToken = localStorage.getItem('accessToken');

        const response = await fetch('https://blogerusplatformormer.onrender.com/posts', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ title, text })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message}`);
        }

        const newPost = await response.json();
        console.log('Post created successfully:', newPost);

        // Optionally re-fetch posts to update the list
        fetchPosts();
        newPostModal.style.display = 'none';

    } catch (error) {
        console.error('Error creating post:', error);
    }
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


