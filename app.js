// TODA ESTA PARTE ME HE AYUDADO CON CLAUDE PASO A PASO PARA ENTENDER LA LOGICA DETRAS DEL FUNCIONAMIENTO DE JS //

// Wait for DOM to be fully loaded before running any JavaScript
document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== LIKE BUTTON FUNCTIONALITY ====================
  // Get the heart icon and likes count from the first post
  const likeBtn = document.getElementById('likeBtn');
  const likesCount = document.querySelector('.fw-bold.mb-1');
  
  // Only run if both elements exist on the page
  if (likeBtn && likesCount) {
    // Add click event listener to the heart button
    likeBtn.addEventListener('click', function() {
      // Extract the number from "1,234 likes" text
      // Remove commas and " likes" text, then convert to integer
      let currentLikes = parseInt(likesCount.textContent.replace(/,/g, '').replace(' likes', ''));
      
      // Check if heart is empty (not liked yet)
      if (this.classList.contains('far')) {
        // LIKE ACTION: Change from outline to filled heart
        this.classList.remove('far'); // Remove outline class
        this.classList.add('fas', 'heart-liked'); // Add filled + red color classes
        
        // Increase likes count by 1
        currentLikes++;
        // Update the text with formatted number (adds commas)
        likesCount.textContent = currentLikes.toLocaleString() + ' likes';
      } else {
        // UNLIKE ACTION: Change from filled to outline heart
        this.classList.remove('fas', 'heart-liked'); // Remove filled + red classes
        this.classList.add('far'); // Add outline class back
        
        // Decrease likes count by 1
        currentLikes--;
        // Update the text with formatted number
        likesCount.textContent = currentLikes.toLocaleString() + ' likes';
      }
    });
  }

  // ==================== IMAGE PREVIEW FUNCTIONALITY ====================
  // Get the file input and preview image elements
  const postImageInput = document.getElementById('postImage');
  const imagePreview = document.getElementById('imagePreview');
  
  // Only run if both elements exist
  if (postImageInput && imagePreview) {
    // Listen for when user selects a file
    postImageInput.addEventListener('change', function(e) {
      // Get the first selected file
      const file = e.target.files[0];
      
      // Check if a file was actually selected
      if (file) {
        // FileReader allows us to read the image file
        const reader = new FileReader();
        
        // When file is loaded, this function runs
        reader.onload = function(e) {
          // Set the preview image source to the loaded file
          imagePreview.src = e.target.result;
          // Make the preview visible by adding 'show' class
          imagePreview.classList.add('show');
        }
        
        // Start reading the file as a data URL (base64 string)
        reader.readAsDataURL(file);
      }
    });
  }

  // ==================== CANCEL POST FUNCTIONALITY ====================
  // Get modal and form elements
  const createPostModal = document.getElementById('createPostModal');
  const createPostForm = document.getElementById('createPostForm');
  
  // Only run if all required elements exist
  if (createPostModal && createPostForm && imagePreview) {
    // Listen for when modal is completely hidden (after closing animation)
    createPostModal.addEventListener('hidden.bs.modal', function () {
      // Reset all form fields to empty (caption, location, file input)
      createPostForm.reset();
      // Hide the image preview
      imagePreview.classList.remove('show');
      // Clear the preview image source
      imagePreview.src = '';
    });
  }

  // ==================== GET USER INFO FROM FIRST POST ====================
  // Find the first post card on the page
  const firstPost = document.querySelector('.card');
  // Set default values in case we can't find the first post
  let userProfileImg = 'https://i.pravatar.cc/150?img=12';
  let username = 'your_username';
  
  // If first post exists, extract user info from it
  if (firstPost) {
    // Find the profile image in the card header
    const profileImgElement = firstPost.querySelector('.card-header img');
    // Find the username (strong text) in the card header
    const usernameElement = firstPost.querySelector('.card-header strong');
    
    // If profile image found, use its source
    if (profileImgElement) {
      userProfileImg = profileImgElement.src;
    }
    // If username found, use its text content
    if (usernameElement) {
      username = usernameElement.textContent;
    }
  }

  // ==================== CREATE NEW POST FUNCTIONALITY ====================
  // Get share button and both feeds (single & grid)
  const sharePostBtn = document.getElementById('sharePostBtn');
  const singleFeedContainer = document.getElementById('singleFeed');
  const gridFeedContainer = document.getElementById('gridFeed');
  
  // Only run if required elements exist
  if (sharePostBtn && createPostForm && singleFeedContainer && gridFeedContainer) {
    sharePostBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Validate form
      if (createPostForm.checkValidity()) {
        const caption = document.getElementById('postCaption').value;
        const location = document.getElementById('postLocation').value;
        const imageSrc = imagePreview.src;

        // Build Single View post
        const newPost = document.createElement('div');
        newPost.className = 'card border mb-4';
        newPost.innerHTML = `
          <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
            <div class="d-flex align-items-center">
              <img src="${userProfileImg}" class="rounded-circle me-2" width="40" height="40" alt="User">
              <div>
                <strong>${username}</strong>
                ${location ? `<br><small class="text-muted"><i class="fas fa-map-marker-alt"></i> ${location}</small>` : ''}
              </div>
            </div>
            <button class="btn btn-link text-danger delete-post-btn" title="Delete post">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <img src="${imageSrc}" class="card-img-top" alt="New Post">
          <div class="card-body">
            <div class="post-actions">
              <div class="actions-left">
                <i class="far fa-heart post-like-btn"></i>
                <i class="far fa-comment"></i>
                <i class="far fa-paper-plane"></i>
              </div>
              <div class="actions-right">
                <i class="far fa-bookmark"></i>
              </div>
            </div>
            <p class="fw-bold mb-1 post-likes-count">0 likes</p>
            <p class="card-text mb-1">
              <strong>${username}</strong> ${caption}
            </p>
            <small class="text-muted">Just now</small>
          </div>
        `;

        // Prepend to Single View
        singleFeedContainer.insertBefore(newPost, singleFeedContainer.firstChild);

        // Build Grid View item (uses your CSS .feed-container.grid-view)
        const gridItem = document.createElement('div');
        gridItem.className = 'card';
        gridItem.innerHTML = `
          <img class="card-img-top" src="${imageSrc}" alt="Grid Item">
          <div class="grid-overlay">
            <span><i class="fas fa-heart"></i> 0 likes</span>
          </div>
        `;

        // Prepend to Grid View
        gridFeedContainer.insertBefore(gridItem, gridFeedContainer.firstChild);

        // Add like functionality to the new post (single view)
        const newLikeBtn = newPost.querySelector('.post-like-btn');
        const newLikesCount = newPost.querySelector('.post-likes-count');
        newLikeBtn.addEventListener('click', function() {
          let currentLikes = parseInt(newLikesCount.textContent.replace(/,/g, '').replace(' likes', ''));
          if (this.classList.contains('far')) {
            this.classList.remove('far');
            this.classList.add('fas', 'heart-liked');
            currentLikes++;
            newLikesCount.textContent = currentLikes.toLocaleString() + ' likes';
          } else {
            this.classList.remove('fas', 'heart-liked');
            this.classList.add('far');
            currentLikes--;
            newLikesCount.textContent = currentLikes.toLocaleString() + ' likes';
          }
        });

        // Delete functionality (single view card only)
        const deleteBtn = newPost.querySelector('.delete-post-btn');
        deleteBtn.addEventListener('click', function() {
          if (confirm('Are you sure you want to delete this post?')) {
            newPost.remove();
          }
        });

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(createPostModal);
        if (modal) modal.hide();
        createPostForm.reset();
        imagePreview.classList.remove('show');
        imagePreview.src = '';

        // Feedback
        alert('Post shared!');
      } else {
        createPostForm.reportValidity();
      }
    });
  }
});