// Travel Gallery Lightbox with Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <span class="lightbox-nav lightbox-prev">&#8249;</span>
        <span class="lightbox-nav lightbox-next">&#8250;</span>
        <img src="" alt="">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentImages = [];
    let currentIndex = 0;

    // Add click handlers to all gallery images
    document.querySelectorAll('.travel-gallery img').forEach((img, index) => {
        img.addEventListener('click', function() {
            // Get all images from the same gallery
            const gallery = this.closest('.travel-gallery');
            currentImages = Array.from(gallery.querySelectorAll('img'));
            currentIndex = currentImages.indexOf(this);
            
            showImage(currentIndex);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Navigation functions
    function showImage(index) {
        if (currentImages[index]) {
            lightboxImg.src = currentImages[index].src;
            lightboxImg.alt = currentImages[index].alt;
            
            // Hide/show navigation buttons
            prevBtn.style.display = index > 0 ? 'block' : 'none';
            nextBtn.style.display = index < currentImages.length - 1 ? 'block' : 'none';
        }
    }

    function showPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            showImage(currentIndex);
        }
    }

    function showNext() {
        if (currentIndex < currentImages.length - 1) {
            currentIndex++;
            showImage(currentIndex);
        }
    }

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevious);
    nextBtn.addEventListener('click', showNext);

    // Close lightbox when clicking background
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevious();
                    break;
                case 'ArrowRight':
                    showNext();
                    break;
            }
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
});
