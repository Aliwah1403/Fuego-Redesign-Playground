// Code to Change Video after interval ends
const aboutVideo = document.getElementById('about-vid');

function changeVideo(videoUrl) {
    aboutVideo.classList.add('fade-out');
    setTimeout(() => {
        aboutVideo.src = videoUrl;
        aboutVideo.classList.remove('fade-out');
    }, 100); // duration of the fade-out transition (in milliseconds)
}

// A list of video URLs
const videoUrls = [
    'images/about-vids/Coastin-Tee-Final.mp4',
    'images/about-vids/Relvetti Tank top final promo vid.mp4',
];

let currentVideoIndex = 0;

// Function to change the video every 15 seconds
function changeVideoInterval() {
    const videoUrl = videoUrls[currentVideoIndex];
    changeVideo(videoUrl);
    // Increment the video index, and loop back to the start if we reach the end
    currentVideoIndex = (currentVideoIndex + 1) % videoUrls.length;
}
// Initial video change
changeVideoInterval();

// Change the video every 15 seconds
setInterval(changeVideoInterval, 15000);


// Adding more content after button press
const aboutBtn = document.querySelector('.about-btn');
const aboutContent = document.querySelector('.about-content');

let contentExpanded = false;

let additionalText = `
    Principles that we uphold as a brand are hard work and patience as
    these are virtues that can never go unrewarded, and our journey can
    and will be used as a testimony to that. As we will manage to stand
    the test of time by trusting our process and upholding what we truly
    believe in, in the most authentic way possible. This concept and
    principles we believe are applicable to every individual of all ages
    in their journey in life.
`;

aboutBtn.addEventListener('click', () => {
    if (!contentExpanded) {
        aboutContent.innerHTML += additionalText;
        aboutBtn.textContent = "Read Less";
    } else {
        aboutContent.innerHTML = aboutContent.innerHTML.replace(additionalText, '');
        aboutBtn.textContent = "Read More";
    }
    contentExpanded = !contentExpanded;
});