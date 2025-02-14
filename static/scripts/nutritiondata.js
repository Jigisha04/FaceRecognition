
  // Function to fetch nutritional details from a nutrition API
  async function fetchNutritionalDetails(foodName) {
    const apiKey = 'baa8a0e97917d1b5e9bab6c5b32ba4b9'; // Replace with your actual API key
    const appId = '41dafeed'; // Replace with your actual app ID (if required)
  
    try {
      const response = await fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(foodName)}&app_id=${appId}&app_key=${apiKey}`);
      const data = await response.json();
  
      if (data.hints && data.hints.length > 0) {
        const nutrients = data.hints[0].food.nutrients;

        const nutritionInfoContainer = document.createElement('div');
        nutritionInfoContainer.className = 'nutrition-info-container';
  
        const caloriesItem = document.createElement('div');
        caloriesItem.className = 'nutrition-info-item';
        caloriesItem.innerHTML = `
          <h3>Calories</h3>
          <p id="calories">${nutrients.ENERC_KCAL} kcal</p>
        `;
  
        const totalFatItem = document.createElement('div');
        totalFatItem.className = 'nutrition-info-item';
        totalFatItem.innerHTML = `
          <h3>Total Fat</h3>
          <p id="total-fat">${nutrients.FAT} g</p>
        `;
  
        const totalCarbsItem = document.createElement('div');
        totalCarbsItem.className = 'nutrition-info-item';
        totalCarbsItem.innerHTML = `
          <h3>Total Carbohydrates</h3>
          <p id="total-carbs">${nutrients.CHOCDF} g</p>
        `;
  
        const fiberItem = document.createElement('div');
        fiberItem.className = 'nutrition-info-item';
        fiberItem.innerHTML = `
          <h3>Dietary Fiber</h3>
          <p id="dietary-fiber">${nutrients.FIBTG} g</p>
        `;
  
        const proteinItem = document.createElement('div');
        proteinItem.className = 'nutrition-info-item';
        proteinItem.innerHTML = `
          <h3>Protein</h3>
          <p id="protein">${nutrients.PROCNT} g</p>
        `;

        const healthBenefitsItem = document.createElement('div');
        // healthBenefitsItem.className = 'nutrition-info-item';
        healthBenefitsItem.innerHTML = `
          <h3>Health Benefits</h3>
          <p>This food item is generally healthy. However, please consult a nutritionist for personalized advice.</p>
        `;
  
        const diabeticSuitabilityItem = document.createElement('div');
        // diabeticSuitabilityItem.className = 'nutrition-info-item';
        diabeticSuitabilityItem.innerHTML = `
          <h3>Diabetic Suitability</h3>
          <p>Consult with a doctor if you're diabetic, as nutrition varies by individual.</p>
        `;
  
        nutritionInfoContainer.appendChild(caloriesItem);
        nutritionInfoContainer.appendChild(totalFatItem);
        // nutritionInfoContainer.appendChild(saturatedFatItem);
        // nutritionInfoContainer.appendChild(cholesterolItem);
        // nutritionInfoContainer.appendChild(sodiumItem);
        nutritionInfoContainer.appendChild(totalCarbsItem);
        nutritionInfoContainer.appendChild(fiberItem);
        // nutritionInfoContainer.appendChild(sugarsItem);
        nutritionInfoContainer.appendChild(proteinItem);
        // nutritionInfoContainer.appendChild(healthBenefitsItem);
        // nutritionInfoContainer.appendChild(diabeticSuitabilityItem);

  
        const nutritionContentElement = document.getElementById('nutrition-content');
        nutritionContentElement.innerHTML = `
        <p><strong>Food:</strong> ${foodName}</p>
        <p><strong>Nutritional Facts:</strong></p>
      `;
        nutritionContentElement.appendChild(nutritionInfoContainer);
        nutritionContentElement.appendChild(healthBenefitsItem);
        nutritionContentElement.appendChild(diabeticSuitabilityItem);

        
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
    const foodButtonsContainer = document.getElementById('food-buttons');
    
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
  
  