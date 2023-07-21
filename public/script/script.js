// add class navbarDark on navbar scroll
const header = document.querySelector('.navbar');
window.onscroll = function () {
  var top = window.scrollY;
  if (top >= 100) {
    header.classList.add('navbarDark');
  }
  else {
    header.classList.remove('navbarDark');
  }
}

const backgroundImages = [];
function loadBackgroundImages() {
  fetch('/api/background-images')
    .then((response) => response.json())
    .then((data) => {
      // Populate the backgroundImages array with the fetched URLs
      console.log('fetched image:', data);
      backgroundImages.push(...data);
      setInterval(changeBackgroundImage, 10000);
    })
    .catch((error) => {
      console.error('Error fetching image URLs:', error);
    });
}

//picture slider
/*const backgroundImages = ['images/heroImage.jpg',
'images/Isabelle_header.jpg']*/

let currentIndex = 0;

function changeBackgroundImage() {
  const backgroundContainer = document.querySelector('.background-container');
  // Set the opacity to 0 to fade out
  backgroundContainer.style.opacity = .7;

  setTimeout(() => {
    // After a short delay, change the background image

    let new_url = backgroundImages[currentIndex].replace(/\\/g, '/');
    backgroundContainer.style.backgroundImage = `url(${new_url})`;
    // Set the opacity back to 1 to fade in the new image
    backgroundContainer.style.opacity = .7;
    backgroundContainer.style.opacity = 1;
    currentIndex = (currentIndex + 1) % backgroundImages.length;
  }, 750); // Change image after 1 second (adjust the delay as desired)
}


const slideImage = document.getElementById('slideImage');

function slideImageOnScroll() {
  const windowHeight = window.innerHeight;
  const slideImagePosition = slideImage.getBoundingClientRect().top;

  // Check if the slideImage is visible within the viewport
  if (slideImagePosition < windowHeight * 0.6) {
    slideImage.style.opacity = 1;
    slideImage.style.transform = 'translateX(0)';
  } else {
    slideImage.style.opacity = 0;
    slideImage.style.transform = 'translateX(-100%)';

  }
}


// Add an event listener for the scroll event
window.addEventListener('scroll', slideImageOnScroll);

// Trigger the slideImageOnScroll function on page load
slideImageOnScroll();

loadBackgroundImages();

