document.addEventListener('DOMContentLoaded', function () {
  // Initialize drinks variable
  let drinks = [];

  // Load drinks data from the JSON file
  fetch('drinks.json')
    .then(response => response.json())
    .then(data => {
      drinks = data;
      renderDrinks(drinks); // Render all drinks initially
    })
    .catch(error => {
      console.error('Error loading the JSON:', error);
    });
    function filterDrinks() {
      const flavorProfile = document.getElementById('flavor-profile-filter').value;
      const baseSpirit = document.getElementById('base-spirit-filter').value;
      const complexity = document.getElementById('complexity-filter').value;
      const priceRange = document.getElementById('price-range-filter').value;
    
      const filteredDrinks = drinks.filter(drink => {
        const drinkFlavorProfile = drink['Flavor Profile'] || '';
        const drinkBaseSpirit = drink['Base Spirit'] || '';
        const drinkComplexity = drink['Complexity'] || '';
        const drinkPrice = parseFloat(drink['Price'].replace('CAD ', '').trim()) || 0;
    
        let complexityMatch = true;
        if (complexity === 'Simple' && drinkComplexity !== 'Simple') complexityMatch = false;
        else if (complexity === 'Medium' && drinkComplexity !== 'Medium') complexityMatch = false;
        else if (complexity === 'Complex' && drinkComplexity !== 'Complex') complexityMatch = false;
    
        let priceMatch = true;
        if (priceRange === '0-15' && (drinkPrice < 0 || drinkPrice > 15)) priceMatch = false;
        else if (priceRange === '16-20' && (drinkPrice < 16 || drinkPrice > 20)) priceMatch = false;
        else if (priceRange === '21-25' && (drinkPrice < 21 || drinkPrice > 25)) priceMatch = false;
        else if (priceRange === '25+' && drinkPrice <= 25) priceMatch = false;
    
        return (
          (flavorProfile === '' || drinkFlavorProfile.includes(flavorProfile)) &&
          (baseSpirit === '' || drinkBaseSpirit.includes(baseSpirit)) &&
          complexityMatch &&
          priceMatch
        );
      });
    
      renderDrinks(filteredDrinks);
    }
  

  // Render drinks to the page
  function renderDrinks(drinks) {
    const drinksContainer = document.getElementById('drinks-container');
    drinksContainer.innerHTML = ''; // Clear existing content

    drinks.forEach(drink => {
      const drinkCard = document.createElement('div');
      drinkCard.classList.add('drink-card');

      // Cocktail Name and Tag (on same line)
      const drinkHeader = document.createElement('div');
      drinkHeader.classList.add('drink-header');

      const drinkName = document.createElement('h3');
      drinkName.textContent = drink['Cocktail'];

      const dollarTag = document.createElement('span');
      dollarTag.classList.add('dollar-tag');
      dollarTag.textContent = drink['Tag']; // Adds the $$$ or $$ tag

      drinkHeader.appendChild(drinkName);
      drinkHeader.appendChild(dollarTag);
      drinkCard.appendChild(drinkHeader);

      const layersContainer = document.createElement('div');
      layersContainer.classList.add('layers-container');

      // Add layers in reverse stacking order
      createLayer(layersContainer, 'blue', drink['Mixer Count']);
      createLayer(layersContainer, 'green', drink['Modifier Count']);
      createLayer(layersContainer, 'red', drink['Base Count']);

      drinkCard.appendChild(layersContainer);

      // Bar name, price, and flavor profile container
      const barPriceContainer = document.createElement('div');
      barPriceContainer.classList.add('bar-price-container');

      const barName = document.createElement('p');
      barName.classList.add('bar-name');
      barName.textContent = drink['Bar'];

      const price = document.createElement('span');
      price.classList.add('price');
      price.textContent = drink['Price'];

      // Flavor Profile Circle
      const flavorProfileCircle = document.createElement('div');
      flavorProfileCircle.classList.add('flavor-profile-circle');
      flavorProfileCircle.style.backgroundColor = getFlavorProfileColor(drink['Flavor Profile']);

      barPriceContainer.appendChild(barName);
      barPriceContainer.appendChild(price);
      barPriceContainer.appendChild(flavorProfileCircle);

      drinkCard.appendChild(barPriceContainer);

      // Add the ingredients hover effect
      const layerHover = document.createElement('div');
      layerHover.classList.add('layer-hover');

      // Ensure Ingredients is an array before using .join()
      const ingredients = Array.isArray(drink['Ingredients']) 
        ? drink['Ingredients'].join(', ') 
        : 'Ingredients not available';

        layerHover.innerHTML = 
        `<p><strong>Ingredients:</strong> ${ingredients}</p>`;
    
      drinkCard.appendChild(layerHover);

      drinksContainer.appendChild(drinkCard);
    });
  }

  // Create stacked bars for each category
  function createLayer(container, color, count) {
    for (let i = 0; i < count; i++) {
      const layer = document.createElement('div');
      layer.classList.add('layer', color);
      container.appendChild(layer);
    }
  }

  // Get the flavor profile color based on the name
  function getFlavorProfileColor(flavor) {
    switch (flavor) {
      case 'Rich & Spiced':
        return '#a0522d'; // Rich & Spiced
      case 'Fruity & Sweet':
        return '#ffa07a'; // Fruity & Sweet
      case 'Bitter & Complex':
        return '#8b0000'; // Bitter & Complex
      case 'Herbal & Aromatic':
        return '#228b22'; // Herbal & Aromatic
      case 'Creamy & Indulgent':
        return '#d5e807'; // Creamy & Indulgent
      case 'Smoky & Earthy':
        return '#8b4513'; // Smoky & Earthy
      case 'Citrusy & Refreshing':
        return '#00ced1'; // Citrusy & Refreshing
      case 'Strong & Spirit-Forward':
        return '#4682b4'; // Strong & Spirit-Forward
      default:
        return '#000'; // Default to black if unknown
    }
  }

  // Attach event listeners to filters
  document.getElementById('flavor-profile-filter').addEventListener('change', filterDrinks);
  document.getElementById('base-spirit-filter').addEventListener('change', filterDrinks);
  document.getElementById('complexity-filter').addEventListener('change', filterDrinks);
  document.getElementById('price-range-filter').addEventListener('change', filterDrinks);
});
