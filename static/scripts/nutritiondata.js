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

  // Function to create a button for each logged food item
function addFoodButton(foodName) {
    const foodButtonsContainer = document.getElementById('food-buttons-container');
    
    // Create a button element
    const foodButton = document.createElement('button');
    foodButton.textContent = foodName;
    foodButton.className = 'food-button'; // Add a class for styling
    foodButton.addEventListener('click', () => fetchNutritionalDetails(foodName));
    
    // Append the button to the container
    foodButtonsContainer.appendChild(foodButton);
  }
  
  // Update the logFoodItem function to include button creation
  function logFoodItem(foodName) {
    const logEntry = document.createElement('li');
    logEntry.textContent = foodName;
    foodLogList.appendChild(logEntry);
  
    // Store in localStorage
    let foodLog = JSON.parse(localStorage.getItem('foodLog')) || [];
    foodLog.push({ item: foodName, timestamp: new Date().toLocaleString() });
    localStorage.setItem('foodLog', JSON.stringify(foodLog));
  
    // Create a button for the new food item
    addFoodButton(foodName);
  }
  
  // Load the food log from localStorage and create buttons on page load
  function loadFoodLog() {
    const storedLog = JSON.parse(localStorage.getItem('foodLog')) || [];
    storedLog.forEach(entry => {
      const logEntry = document.createElement('li');
      logEntry.textContent = `${entry.item} (logged at ${entry.timestamp})`;
      foodLogList.appendChild(logEntry);
  
      // Create a button for each stored food item
      addFoodButton(entry.item);
    });
  }
  
  // Load existing food log and buttons on page load
  document.addEventListener('DOMContentLoaded', loadFoodLog);
  
  