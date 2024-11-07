const apiKey = '323d6f5173af5d4a052f92f718b4860a';
const city = 'phagwara,in';

// Function to fetch and display the temperature
const fetchTemperature = async () => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    const temperatureElement = document.getElementById('temperature');
    temperatureElement.textContent = `${data.main.temp} °C`;
  } catch (error) {
    console.error('Error fetching temperature:', error);
    const temperatureElement = document.getElementById('temperature');
    temperatureElement.textContent = 'Error fetching temperature'; // Inform user of error
  }
};

fetchTemperature();

// Function to hide placeholder
function hidePlaceholder() {
  document.getElementById('video-placeholder').style.display = 'none';
}

// Declare the EventSource variable globally so we can manage it
let source = null;

// Start detection - creates a new EventSource connection
function startDetection() {
  // Only start a new connection if it's not already active
  if (!source) {
    source = new EventSource("/object_names");

    // Event listener for new object detection
    source.onmessage = function(event) {
      const objectName = event.data;

      // Display detected object
      const listItem = document.createElement("li");
      listItem.textContent = objectName;
      objectNamesList.appendChild(listItem);

      // Check if the detected object is food and log it
      const knownFoods = ['apple', 'banana', 'carrot', 'sandwich']; // Add more as needed
      if (knownFoods.includes(objectName.toLowerCase())) {
        logFoodItem(objectName);
      }
    };

    // Handle errors
    source.onerror = function(error) {
      console.error("EventSource failed:", error);
      const errorElement = document.createElement('p');
      errorElement.textContent = "Error receiving object detection data.";
      objectNamesList.appendChild(errorElement);
    };

    // Button state change
    document.getElementById("start-detection").disabled = true;
    document.getElementById("stop-detection").disabled = false;
  }
}

// Stop detection - closes the EventSource connection
function stopDetection() {
  if (source) {
    source.close();
    source = null; // Reset the EventSource

    // Button state change
    document.getElementById("start-detection").disabled = false;
    document.getElementById("stop-detection").disabled = true;
  }
}

const objectNamesList = document.getElementById("object-names-list");
const foodLogList = document.getElementById("food-log-list");

// Function to add detected food to the log
function logFoodItem(foodName) {
  const logEntry = document.createElement("li");
  logEntry.textContent = foodName;
  foodLogList.appendChild(logEntry);

  // Store in localStorage
  let foodLog = JSON.parse(localStorage.getItem('foodLog')) || [];
  foodLog.push({ item: foodName, timestamp: new Date().toLocaleString() });
  localStorage.setItem('foodLog', JSON.stringify(foodLog));
}

// Load the food log from localStorage on page load
function loadFoodLog() {
  const storedLog = JSON.parse(localStorage.getItem('foodLog')) || [];
  storedLog.forEach(entry => {
    const logEntry = document.createElement("li");
    logEntry.textContent = `${entry.item} (logged at ${entry.timestamp})`;
    foodLogList.appendChild(logEntry);
  });
}

// Load existing food log on page load
document.addEventListener('DOMContentLoaded', loadFoodLog);

// Attach event listeners to buttons
document.getElementById("start-detection").addEventListener("click", startDetection);
document.getElementById("stop-detection").addEventListener("click", stopDetection);

