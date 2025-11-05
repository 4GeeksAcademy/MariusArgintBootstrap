// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Heart like functionality
  const likeBtn = document.getElementById('likeBtn');
  const likesCount = document.querySelector('.fw-bold.mb-1');
  
  if (likeBtn && likesCount) {
    likeBtn.addEventListener('click', function() {
      // Get current likes count
      let currentLikes = parseInt(likesCount.textContent.replace(/,/g, '').replace(' likes', ''));
      
      if (this.classList.contains('far')) {
        // Like the post
        this.classList.remove('far');
        this.classList.add('fas', 'heart-liked');
        
        // Increment likes
        currentLikes++;
        likesCount.textContent = currentLikes.toLocaleString() + ' likes';
      } else {
        // Unlike the post
        this.classList.remove('fas', 'heart-liked');
        this.classList.add('far');
        
        // Decrement likes
        currentLikes--;
        likesCount.textContent = currentLikes.toLocaleString() + ' likes';
      }
    });
  }

  // Image preview functionality
  const postImageInput = document.getElementById('postImage');
  const imagePreview = document.getElementById('imagePreview');
  
  if (postImageInput && imagePreview) {
    postImageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.src = e.target.result;
          imagePreview.classList.add('show');
        }
        reader.readAsDataURL(file);
      }
    });
  }

  // Share post functionality - CREATE NEW POST
  const sharePostBtn = document.getElementById('sharePostBtn');
  const createPostForm = document.getElementById('createPostForm');
  const feedContainer = document.querySelector('.container.py-4');
  
  if (sharePostBtn && createPostForm && feedContainer) {
    sharePostBtn.addEventListener('click', function() {
      if (createPostForm.checkValidity()) {
        // Get form values
        const caption = document.getElementById('postCaption').value;
        const location = document.getElementById('postLocation').value;
        const imageSrc = imagePreview.src;
        
        // Create new post HTML
        const newPost = document.createElement('div');
        newPost.className = 'card border mb-4';
        newPost.innerHTML = `
          <!-- Post Header -->
          <div class="card-header bg-white border-0 d-flex align-items-center py-3">
            <img src="https://i.pravatar.cc/150?img=12" class="rounded-circle me-2" width="40" height="40" alt="User">
            <div>
              <strong>your_username</strong>
              ${location ? `<br><small class="text-muted"><i class="fas fa-map-marker-alt"></i> ${location}</small>` : ''}
            </div>
          </div>
          
          <!-- Post Image -->
          <img src="${imageSrc}" class="card-img-top" alt="New Post">
          
          <!-- Post Body -->
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
              <strong>your_username</strong> ${caption}
            </p>
            <small class="text-muted">Just now</small>
          </div>
        `;
        
        // Add new post at the top of the feed
        feedContainer.insertBefore(newPost, feedContainer.firstChild);
        
        // Add like functionality to the new post
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
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('createPostModal'));
        modal.hide();
        
        // Reset form
        createPostForm.reset();
        imagePreview.classList.remove('show');
        
        // Success message
        alert('Post shared successfully! 🎉');
      } else {
        createPostForm.reportValidity();
      }
    });
  }

});