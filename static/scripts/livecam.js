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
  document.getElementById("webcam-video").src = "/webapp";

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
  document.getElementById("webcam-video").src = "";
  document.getElementById('video-placeholder').style.display = 'block';


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




// Add an event listener to handle click events on food log items
document.getElementById('food-log-list').addEventListener('click', async function (event) {
    if (event.target.tagName === 'LI') {
      const foodName = event.target.textContent;
      fetchNutritionalDetails(foodName);
    }
  });
  
  // Function to fetch nutritional details from a nutrition API
  async function fetchNutritionalDetails(foodName) {
    const apiKey = 'baa8a0e97917d1b5e9bab6c5b32ba4b9'; // Replace with your actual API key
    const appId = '41dafeed'; // Replace with your actual app ID (if required)
    
    try {
      // Example API request to Edamam or Spoonacular
      const response = await fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(foodName)}&app_id=${appId}&app_key=${apiKey}`);
      const data = await response.json();
  
      if (data.hints && data.hints.length > 0) {
        const nutrients = data.hints[0].food.nutrients;
        const healthBenefits = `Calories: ${nutrients.ENERC_KCAL} kcal, Carbs: ${nutrients.CHOCDF} g, Protein: ${nutrients.PROCNT} g, Fat: ${nutrients.FAT} g`;
  
        document.getElementById('nutrition-content').innerHTML = `
          <p><strong>Food:</strong> ${foodName}</p>
          <p><strong>Nutritional Facts:</strong></p>
          <ul>
            <li>Calories: ${nutrients.ENERC_KCAL} kcal</li>
            <li>Carbohydrates: ${nutrients.CHOCDF} g</li>
            <li>Protein: ${nutrients.PROCNT} g</li>
            <li>Fat: ${nutrients.FAT} g</li>
          </ul>
          <p><strong>Health Benefits:</strong> This food item is generally healthy. However, please consult a nutritionist for personalized advice.</p>
          <p><strong>Diabetic Suitability:</strong> Consult with a doctor if you're diabetic, as nutrition varies by individual.</p>
        `;
      } else {
        document.getElementById('nutrition-content').textContent = 'No nutritional information found for this item.';
      }
    } catch (error) {
      console.error('Error fetching nutritional information:', error);
      document.getElementById('nutrition-content').textContent = 'Error fetching nutritional information. Please try again later.';
    }
  }
  

