    const dictionary = [
        "shovel", "trowel", "rake", "pruners", "hoe", "spade", "watering", "gloves", "secateurs", 
    "mulch", "compost", "fertilizer", "seeds", "soil", "garden", "planter", "trellis",
    "bulbs", "roots", "basket", "shed", "irrigation", "sunlight", "ladder",
    "sprout", "orchard", "greenhouse", "cultivator", "grafting", "harvest", "botanical",
    "pergola", "peat", "vermicompost", "wheelbarrow", "turf", "nursery", "hedge", "clippers",
    "pesticide", "landscape", "bloom", "flora", "vineyard", "sapling", "pruning", "weeder"
      ];
      const gridSize = 9; // Changed grid size to 9x9
      const crosswordContainer = document.getElementById('crossword-container');
      const submitBtn = document.getElementById('submit-btn');
      const resetBtn = document.getElementById('reset-btn');
      const popup = document.getElementById('popup');
      const popupMessage = document.getElementById('popup-message');
      const correctAnswersDiv = document.getElementById('correct-answers');
      let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

      function createGrid() {
        crosswordContainer.innerHTML = '';
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell non-interactive';
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.dataset.row = i;
            input.dataset.col = j;
            input.disabled = true; // Disable input by default

            // Move to the next cell automatically
            input.addEventListener('input', () => {
              const nextCol = parseInt(input.dataset.col) + 1;
              const nextCell = document.querySelector(
                `.cell input[data-row="${input.dataset.row}"][data-col="${nextCol}"]`
              );
              if (nextCell) {
                nextCell.focus();
              }
            });

            cell.appendChild(input);
            crosswordContainer.appendChild(cell);
          }
        }
      }

      function addWordsToGrid() {
        grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

        // Step 1: Place one longer word (up to 9 characters)
        const longWord = dictionary.find(word => word.length === 9);
        if (longWord) {
          const row = Math.floor(Math.random() * gridSize);
          const startCol = 0; // Align to the start of the row
          [...longWord].forEach((letter, index) => {
            grid[row][startCol + index] = letter.toUpperCase();
            const cell = document.querySelector(
              `.cell input[data-row="${row}"][data-col="${startCol + index}"]`
            );
            if (cell) {
              cell.disabled = false;
              cell.parentElement.classList.remove('non-interactive');
            }
          });
        }

        // Step 2: Fill shorter words in other rows
        dictionary.forEach(word => {
          if (word.length < 9) {
            const startRow = Math.floor(Math.random() * gridSize);
            const startCol = Math.floor(Math.random() * (gridSize - word.length));

            if (grid[startRow].some(cell => cell !== "")) {
              return; // Skip rows already occupied
            }

            [...word].forEach((letter, index) => {
              grid[startRow][startCol + index] = letter.toUpperCase();
              const cell = document.querySelector(
                `.cell input[data-row="${startRow}"][data-col="${startCol + index}"]`
              );
              if (cell) {
                cell.disabled = false;
                cell.parentElement.classList.remove('non-interactive');
              }
            });
          }
        });
      }

      function fillGrid() {
        const cells = document.querySelectorAll('.cell input');
        cells.forEach(input => {
          const row = parseInt(input.dataset.row);
          const col = parseInt(input.dataset.col);
          if (grid[row][col]) {
            input.placeholder = "_"; // Adds placeholders for word positions
          }
        });
      }

      function checkAnswers() {
        let correct = true;
        const cells = document.querySelectorAll('.cell input');

        cells.forEach(input => {
          const row = parseInt(input.dataset.row);
          const col = parseInt(input.dataset.col);
          if (grid[row][col] && input.value.toUpperCase() !== grid[row][col]) {
            correct = false;
          }
        });

        // Show popup with results
        popup.style.display = 'block';
        popupMessage.textContent = correct ? "🎉 Congratulations! You solved the puzzle! 🎉" : "Some answers are incorrect. Best of luck next time!";
        correctAnswersDiv.innerHTML = '<h2>Correct Answers:</h2>';
        grid.forEach(row => {
          const rowString = row.join(" ");
          correctAnswersDiv.innerHTML += `<span>${rowString}</span>`;
        });
      }

      function resetGame() {
        popup.style.display = 'none'; // Close popup
        createGrid(); // Reset grid
        addWordsToGrid(); // Add new words
        fillGrid(); // Fill placeholders
      }

      submitBtn.addEventListener('click', checkAnswers);
      resetBtn.addEventListener('click', resetGame);

      createGrid();
      addWordsToGrid();
      fillGrid();