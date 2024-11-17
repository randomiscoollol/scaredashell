// Function to start the scary experience after confirmation
document.getElementById('confirmButton').addEventListener('click', () => {
  // Hide the confirmation button and warning message
  document.getElementById('confirmButton').style.display = 'none';
  document.getElementById('message').style.display = 'none';

  // Change background and text color
  document.body.style.backgroundColor = 'black';
  document.body.style.color = 'red';

  // Start the scary sequence
  morseAnimation();
});

// Morse code for "run, run, you are next"
const morseCode = {
  "run": "-.-. .- .-.. .-.. --- .--."
};

function morseAnimation() {
  let morseText = morseCode.run.split("").join(" ");
  let morseIndex = 0;
  let morseInterval = setInterval(() => {
    if (morseIndex < morseText.length) {
      document.getElementById("message").textContent = morseText.substring(0, morseIndex + 1);
      morseIndex++;
    } else {
      clearInterval(morseInterval);
      setTimeout(flashRunText, 500); // Start flashing after morse ends
    }
  }, 500);
}

function flashRunText() {
  let runText = "R.U.N.";
  let flashIndex = 0;
  let flashInterval = setInterval(() => {
    if (flashIndex % 2 === 0) {
      document.getElementById("message").textContent = runText;
    } else {
      document.getElementById("message").textContent = '';
    }
    flashIndex++;
  }, 500);

  setTimeout(() => {
    clearInterval(flashInterval);
    showScaryMessage();
  }, 5000); // Flash for 5 seconds
}

function showScaryMessage() {
  // Fetch the user's IP address from ipapi (no API key required for basic use)
  fetch('https://api.ipapi.com/api/check?format=json')
    .then(response => response.json())
    .then(data => {
      let ip = data.ip; // Get the IP address from the response
      document.getElementById("message").textContent = `WE ARE COMING... ${ip}`;
      setTimeout(() => {
        document.getElementById("message").textContent = "Accept the camera to escape...";
        promptCameraPermission();
      }, 5000); // Show scary message for 5 seconds
    })
    .catch(error => {
      console.error('Error fetching IP:', error);
      document.getElementById("message").textContent = "Failed to fetch IP address. Please try again later.";
    });
}

function promptCameraPermission() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      // Show camera if permission is granted
      let cameraElement = document.getElementById("camera");
      cameraElement.srcObject = stream;
      cameraElement.style.display = 'block';
      setTimeout(() => {
        // Stop camera after 5 seconds
        stream.getTracks().forEach(track => track.stop());
        cameraElement.style.display = 'none';
        flashBlackAndWhite(); // Start flashing after camera feed
      }, 5000);
    })
    .catch(err => {
      // Handle error if camera permission is denied
      document.getElementById("message").textContent = "Camera permission denied. You can't escape.";
      flashBlackAndWhite(); // Flash black and white if camera is denied
    });
}

function flashBlackAndWhite() {
  // Flashing black and white for 5 seconds
  let flashCount = 0;
  let flashInterval = setInterval(() => {
    if (flashCount % 2 === 0) {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    } else {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'red';
    }
    flashCount++;
  }, 250); // Flash every 250ms (black & white)

  setTimeout(() => {
    clearInterval(flashInterval);
    spamImages(); // After flashing ends, start spamming images
  }, 5000); // Flash for 5 seconds
}

function spamImages() {
  const imageUrls = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-okuvTLzBNx6JrsVVCSa-u6pWpLl-5fV8Kg&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2E7GGWd6mOejD2ieR8RP1rzKAqEfZgDk22g&s',
    'https://images.theconversation.com/files/626315/original/file-20241016-19-8dy57l.jpg?ixlib=rb-4.1.0&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip',
    'https://img.freepik.com/premium-photo/person-with-scary-face-big-green-eye_905510-50942.jpg'
  ];

  let endTime = Date.now() + 5000; // Run for 5 seconds
  let imageIndex = 0;

  let interval = setInterval(() => {
    if (Date.now() > endTime) {
      clearInterval(interval);
      endExperience(); // End the experience after 5 seconds
      return;
    }

    let imgElement = document.createElement('img');
    imgElement.src = imageUrls[imageIndex];
    imgElement.style.position = 'absolute';
    imgElement.style.left = `${Math.random() * window.innerWidth}px`; // Random horizontal position
    imgElement.style.top = `${Math.random() * window.innerHeight}px`;  // Random vertical position
    imgElement.style.width = '200px'; // Resize images
    imgElement.style.height = '200px';
    document.body.appendChild(imgElement);

    imageIndex = (imageIndex + 1) % imageUrls.length; // Loop through the images
  }, 1); // Show an image every 1 millisecond
}

function endExperience() {
  // Final step: show that the experience is over
  document.getElementById("message").textContent = "The experience is over... for now.";
  // Optionally, you could trigger an exit fullscreen here if needed
  document.exitFullscreen();
}
