// Ingredient Safety Checker - Complete JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const pages = {
        analyze: document.getElementById('analyzePage'),
        scan: document.getElementById('scanPage'),
        results: document.getElementById('resultsPage'),
        history: document.getElementById('historyPage'),
        learn: document.getElementById('learnPage')
    };

    const tabs = document.querySelectorAll('.tab');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const scanBtn = document.getElementById('scanBtn');
    const backBtns = document.querySelectorAll('.back-btn');
    const saveAnalysisBtn = document.getElementById('saveAnalysisBtn');
    const fileUpload = document.getElementById('fileUpload');
    const productNameInput = document.getElementById('productName');
    const ingredientsListInput = document.getElementById('ingredientsList');
    const resultsProductName = document.getElementById('resultsProductName');
    const ingredientsCount = document.getElementById('ingredientsCount');
    const riskLevel = document.getElementById('riskLevel');
    const riskScore = document.getElementById('riskScore');
    const riskIndicator = document.getElementById('riskIndicator');
    const ingredientsAnalysis = document.getElementById('ingredientsAnalysis');
    const historyList = document.getElementById('historyList');
    const imageModal = document.getElementById('imageModal');
    const modalMediaContainer = document.getElementById('modalMediaContainer');
    const closeModal = document.querySelector('.close-modal');
    const cameraBtn = document.getElementById('cameraBtn');
    const captureBtn = document.getElementById('captureBtn');
    const cameraPreview = document.getElementById('cameraPreview');
    const processImageBtn = document.getElementById('processImageBtn');
    const ocrProgress = document.querySelector('.ocr-progress');
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle');

    // Camera stream and OCR worker
    let cameraStream = null;
    let worker = null;

    // Complete Ingredient Database
    const ingredientDatabase = {
        // Basic Ingredients
        "Potato": {
            risk: "low",
            desc: "Natural vegetable, generally safe and nutritious.",
            icon: "fas fa-seedling",
            category: "vegetables"
        },
        "Edible Vegetable Oil": {
            risk: "low",
            desc: "Plant-based oils, nutritional value depends on specific type.",
            icon: "fas fa-oil-can",
            category: "fats"
        },
        "Salt": {
            risk: "medium",
            desc: "Excessive sodium intake may lead to high blood pressure.",
            icon: "fas fa-mortar-pestle",
            category: "minerals",
            reference: "WHO Sodium Guidelines"
        },
        "Sugar": {
            risk: "medium",
            desc: "Excessive consumption linked to weight gain and diabetes.",
            icon: "fas fa-cube",
            category: "sweeteners",
            reference: "WHO Sugar Guidelines"
        },
        "Wheat Flour": {
            risk: "medium",
            desc: "High glycemic index causing blood sugar spikes.",
            icon: "fas fa-bread-slice",
            category: "grains"
        },
        "Palm Oil": {
            risk: "medium",
            desc: "High in saturated fats linked to heart disease.",
            icon: "fas fa-oil-can",
            category: "fats",
            reference: "WHO Guidelines"
        },

        // Additives and E-numbers
        "Potassium Chloride (508)": {
            risk: "medium",
            desc: "Gelling agent. May cause hyperkalemia in sensitive individuals.",
            icon: "fas fa-heartbeat",
            category: "thickeners",
            reference: "FDA GRAS Notice"
        },
        "Guar Gum (412)": {
            risk: "low",
            desc: "Natural thickener. May cause digestive issues.",
            icon: "fas fa-seedling",
            category: "thickeners"
        },
        "Citric Acid (330)": {
            risk: "low",
            desc: "Common preservative. May erode tooth enamel.",
            icon: "fas fa-lemon",
            category: "preservatives"
        },
        "TBHQ": {
            risk: "high",
            desc: "Preservative with potential cancer risk at high doses.",
            icon: "fas fa-radiation-alt",
            category: "preservatives",
            reference: "IARC Monographs"
        },
        "Disodium 5'-Ribonucleotides (635)": {
            risk: "medium",
            desc: "Flavor enhancer similar to MSG.",
            icon: "fas fa-head-side-virus",
            category: "flavor enhancers"
        },
        "Sodium Benzoate": {
            risk: "high",
            desc: "Preservative that may form carcinogenic benzene with vitamin C.",
            icon: "fas fa-prescription-bottle-alt",
            category: "preservatives",
            reference: "FDA Report"
        },
        "Monosodium Glutamate (MSG)": {
            risk: "medium",
            desc: "Flavor enhancer that may cause headaches in sensitive individuals.",
            icon: "fas fa-head-side-virus",
            category: "flavor enhancers"
        },
        "High Fructose Corn Syrup": {
            risk: "high",
            desc: "Linked to obesity, diabetes and fatty liver disease.",
            icon: "fas fa-weight",
            category: "sweeteners",
            reference: "AJCN Study"
        },
        "Sodium Nitrite": {
            risk: "high",
            desc: "Preservative that may form carcinogenic nitrosamines.",
            icon: "fas fa-drumstick-bite",
            category: "preservatives",
            reference: "WHO IARC"
        },
        "Caramel Color (150d)": {
            risk: "medium",
            desc: "May contain 4-MEI which has potential carcinogenic effects.",
            icon: "fas fa-palette",
            category: "colorings",
            reference: "IARC Evaluation"
        },
        "Acesulfame K": {
            risk: "medium",
            desc: "Artificial sweetener with debated cancer links.",
            icon: "fas fa-exclamation-triangle",
            category: "artificial sweeteners"
        },
        "Sucralose (E955)": {
            risk: "medium",
            desc: "Artificial sweetener that may affect gut health.",
            icon: "fas fa-pills",
            category: "artificial sweeteners"
        },
        "Potassium Sorbate": {
            risk: "low",
            desc: "Preservative that may cause allergic reactions.",
            icon: "fas fa-prescription-bottle-alt",
            category: "preservatives"
        },
        "Sodium Metabisulfite (223)": {
            risk: "high",
            desc: "Can trigger asthma and allergic reactions.",
            icon: "fas fa-lungs",
            category: "preservatives",
            reference: "FDA Allergen Notice"
        },
        "Sodium Sulphite (220)": {
            risk: "high",
            desc: "Preservative that can cause respiratory issues.",
            icon: "fas fa-lungs",
            category: "preservatives"
        },
        "Calcium Disodium EDTA (E385)": {
            risk: "medium",
            desc: "Preservative problematic for those with kidney issues.",
            icon: "fas fa-kidneys",
            category: "preservatives"
        },

        // Energy Drink Components
        "Taurine": {
            risk: "medium",
            desc: "May affect cardiovascular system with caffeine.",
            icon: "fas fa-heartbeat",
            category: "supplements",
            reference: "EFSA Assessment"
        },
        "Caffeine": {
            risk: "medium",
            desc: "May cause anxiety, insomnia in high doses.",
            icon: "fas fa-coffee",
            category: "stimulants"
        },
        "Inositol": {
            risk: "low",
            desc: "May cause digestive issues at high doses.",
            icon: "fas fa-exclamation-circle",
            category: "supplements"
        },
        "Beta Carotene": {
            risk: "low",
            desc: "Natural coloring and vitamin A source.",
            icon: "fas fa-palette",
            category: "colorings"
        }
    };

    // Initialize the app
    function init() {
        setupEventListeners();
        loadHistory();
        initDarkMode();
        
        if (!localStorage.getItem('analysisHistory')) {
            const sampleHistory = [
                {
                    id: 1,
                    productName: "Sample Instant Noodles",
                    ingredientCount: "8",
                    score: "2.1/3.0",
                    level: "high",
                    date: new Date().toLocaleDateString(),
                    ingredients: ["Wheat Flour", "Palm Oil", "Salt", "MSG", "TBHQ", "Artificial Colors", "Sodium Triphosphate", "Sugar"]
                },
                {
                    id: 2,
                    productName: "Energy Drink Sample",
                    ingredientCount: "5",
                    score: "1.8/3.0",
                    level: "medium",
                    date: new Date().toLocaleDateString(),
                    ingredients: ["Taurine", "Caffeine", "Sucralose", "Acesulfame K", "Citric Acid"]
                }
            ];
            localStorage.setItem('analysisHistory', JSON.stringify(sampleHistory));
        }
    }

    // Dark mode functions
    function initDarkMode() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            updateDarkModeIcons(true);
        }
    }

    function toggleDarkMode() {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark);
        updateDarkModeIcons(isDark);
    }

    function updateDarkModeIcons(isDark) {
        const icon = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        darkModeToggles.forEach(toggle => {
            toggle.innerHTML = icon;
        });
    }

    // Event listeners
    function setupEventListeners() {
        // Tab navigation
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                switchTab(tabName);
            });
        });

        // Analyze button
        analyzeBtn.addEventListener('click', analyzeIngredients);

        // Scan button
        scanBtn.addEventListener('click', () => {
            showPage('scan');
            stopCamera();
        });

        // Back buttons
        backBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                showPage('analyze');
                stopCamera();
            });
        });

        // File upload
        fileUpload.addEventListener('change', handleFileUpload);

        // Save analysis
        saveAnalysisBtn.addEventListener('click', saveAnalysis);

        // Modal close
        closeModal.addEventListener('click', closeImageModal);
        
        window.addEventListener('click', (e) => {
            if (e.target === imageModal) closeImageModal();
        });

        // Camera buttons
        cameraBtn.addEventListener('click', startCamera);
        captureBtn.addEventListener('click', captureImage);

        // Process image button
        processImageBtn.addEventListener('click', processImageWithOCR);

        // Dark mode toggles
        darkModeToggles.forEach(toggle => {
            toggle.addEventListener('click', toggleDarkMode);
        });
    }

    // Navigation functions
    function switchTab(tabName) {
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        showPage(tabName);
        if (tabName === 'history') loadHistory();
    }

    function showPage(pageName) {
        Object.values(pages).forEach(page => page.classList.remove('active'));
        if (pages[pageName]) pages[pageName].classList.add('active');
        window.scrollTo(0, 0);
    }

    // Analysis functions
    function analyzeIngredients() {
        const productName = productNameInput.value.trim() || "Unnamed Product";
        const ingredients = ingredientsListInput.value
            .split(/[\n,]/)
            .map(i => i.trim())
            .filter(i => i);

        if (ingredients.length === 0) {
            alert("Please enter at least one ingredient");
            return;
        }

        showResults(productName, ingredients);
    }

    function showResults(productName, ingredients) {
        resultsProductName.textContent = productName;
        ingredientsCount.textContent = `${ingredients.length} ingredients analyzed`;
        
        let baseScore = 0;
        let compoundRiskFactors = 1;
        const riskCategories = {
            preservatives: 0,
            artificial: 0,
            allergens: 0,
            additives: 0
        };
        
        ingredientsAnalysis.innerHTML = '';

        ingredients.forEach(ingredient => {
            const found = Object.entries(ingredientDatabase).find(([name]) => 
                ingredient.toLowerCase().includes(name.toLowerCase()) ||
                name.toLowerCase().includes(ingredient.toLowerCase()) ||
                levenshteinDistance(ingredient.toLowerCase(), name.toLowerCase()) <= 2
            );
            
            const data = found ? ingredientDatabase[found[0]] : { 
                risk: "medium", 
                desc: "No specific safety data available.",
                icon: "fas fa-question",
                category: "unknown"
            };

            // Advanced scoring
            let ingredientScore = 0;
            switch(data.risk) {
                case "high": 
                    ingredientScore = 0.5;
                    compoundRiskFactors *= 1.3;
                    break;
                case "medium": 
                    ingredientScore = 0.2; 
                    compoundRiskFactors *= 1.1;
                    break;
                case "low": 
                    ingredientScore = 0.05;
                    break;
            }

            // Category-specific scoring
            if (data.category) {
                riskCategories[data.category] += ingredientScore * 1.5;
            }

            baseScore += ingredientScore;

            // Display ingredient
            const ingredientEl = document.createElement('div');
            ingredientEl.className = 'ingredient-item';
            ingredientEl.style.borderLeftColor = getRiskColor(data.risk);
            ingredientEl.innerHTML = `
                <div class="ingredient-header">
                    <i class="${data.icon} ingredient-icon ${data.risk}"></i>
                    <div class="ingredient-name">${ingredient}</div>
                    <div class="ingredient-risk ${data.risk}">${data.risk.toUpperCase()}</div>
                </div>
                <div class="ingredient-desc">${data.desc}</div>
                ${data.reference ? `<div class="ingredient-reference">Source: ${data.reference}</div>` : ''}
            `;
            ingredientsAnalysis.appendChild(ingredientEl);
        });

        // Check for compound warnings
        const compoundWarnings = checkCompoundRisks(ingredients);
        if (compoundWarnings.length > 0) {
            compoundWarnings.forEach(warning => {
                const warningEl = document.createElement('div');
                warningEl.className = `risk-warning ${warning.severity}`;
                warningEl.innerHTML = `
                    <i class="${warning.icon}"></i>
                    <strong>${warning.severity === 'high' ? 'Warning' : 'Note'}:</strong> ${warning.message}
                `;
                ingredientsAnalysis.prepend(warningEl);
            });
        }

        // Calculate final score
        let finalScore = Math.min(baseScore * compoundRiskFactors, 3);
        finalScore += Math.min(
            (riskCategories.preservatives * 0.7) + 
            (riskCategories.artificial * 0.9) + 
            (riskCategories.allergens * 0.5),
            1.5
        );

        // Determine risk level
        let level = "low";
        if (finalScore >= 2.0 || riskCategories.artificial > 1.2) {
            level = "high";
        } else if (finalScore >= 1.2 || riskCategories.preservatives > 0.8) {
            level = "medium";
        }

        // Update UI
        riskLevel.innerHTML = `<i class="${getLevelIcon(level)}"></i> ${level.charAt(0).toUpperCase() + level.slice(1)} Risk`;
        riskLevel.className = `risk-badge ${level}`;
        riskScore.textContent = `Score: ${finalScore.toFixed(1)}/3.0`;
        riskIndicator.style.left = `${(finalScore / 3) * 100}%`;

        saveAnalysisBtn.disabled = false;
        saveAnalysisBtn.textContent = 'Save Analysis';
        showPage('results');
    }

    // Check for dangerous ingredient combinations
    function checkCompoundRisks(ingredients) {
        const compoundWarnings = [];
        const lowerCaseIngredients = ingredients.map(i => i.toLowerCase());

        // Caffeine + Taurine
        if (lowerCaseIngredients.some(i => i.includes('caffeine')) && 
            lowerCaseIngredients.some(i => i.includes('taurine'))) {
            compoundWarnings.push({
                severity: "high",
                message: "Caffeine and Taurine combination may cause cardiovascular stress",
                icon: "fas fa-heartbeat"
            });
        }

        // Multiple preservatives
        const preservativeCount = lowerCaseIngredients.filter(i => 
            ['tbhq', 'sodium benzoate', 'potassium sorbate', 'sodium metabisulfite'].some(p => i.includes(p))
        ).length;
        if (preservativeCount > 2) {
            compoundWarnings.push({
                severity: "high",
                message: `Multiple preservatives (${preservativeCount}) may increase health risks`,
                icon: "fas fa-prescription-bottle-alt"
            });
        }

        // Multiple artificial sweeteners
        const sweetenerCount = lowerCaseIngredients.filter(i => 
            ['acesulfame k', 'sucralose', 'aspartame'].some(s => i.includes(s))
        ).length;
        if (sweetenerCount > 1) {
            compoundWarnings.push({
                severity: "medium",
                message: "Multiple artificial sweeteners may affect gut health",
                icon: "fas fa-poop"
            });
        }

        // MSG combinations
        if (lowerCaseIngredients.some(i => i.includes('monosodium glutamate') || i.includes('msg'))) {
            if (lowerCaseIngredients.some(i => i.includes('disodium 5\'-ribonucleotides') || i.includes('635'))) {
                compoundWarnings.push({
                    severity: "high",
                    message: "MSG with ribonucleotides may intensify flavor-enhancing effects and reactions",
                    icon: "fas fa-head-side-virus"
                });
            }
        }

        return compoundWarnings;
    }

    // Utility functions
    function getRiskColor(riskLevel) {
        const colors = {
            low: '#8BC34A',
            medium: '#FF9800',
            high: '#F44336'
        };
        return colors[riskLevel];
    }

    function getLevelIcon(level) {
        const icons = {
            low: 'fas fa-leaf',
            medium: 'fas fa-exclamation-circle',
            high: 'fas fa-radiation-alt'
        };
        return icons[level];
    }

    // Levenshtein distance for fuzzy matching
    function levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const cost = a.charAt(j - 1) === b.charAt(i - 1) ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        return matrix[b.length][a.length];
    }

    // History functions
    function saveAnalysis() {
        const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
        
        const newAnalysis = {
            id: Date.now(),
            productName: resultsProductName.textContent,
            ingredientCount: ingredientsCount.textContent.split(' ')[0],
            score: riskScore.textContent.split(' ')[1],
            level: riskLevel.className.replace('risk-badge ', ''),
            date: new Date().toLocaleDateString(),
            ingredients: Array.from(document.querySelectorAll('.ingredient-item .ingredient-name'))
                .map(el => el.textContent)
        };

        history.unshift(newAnalysis);
        localStorage.setItem('analysisHistory', JSON.stringify(history.slice(0, 50)));
        alert('Analysis saved to history!');
        loadHistory();
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
        historyList.innerHTML = '';

        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty">
                    <i class="fas fa-history"></i>
                    <p>No analysis history yet</p>
                </div>
            `;
            return;
        }

        const template = document.getElementById('historyItemTemplate');

        history.forEach(item => {
            const clone = template.content.cloneNode(true);
            const historyItem = clone.querySelector('.history-item');
            const productElement = clone.querySelector('.history-product');
            const dateElement = clone.querySelector('.history-date');
            const riskElement = clone.querySelector('.history-risk');
            const deleteBtn = clone.querySelector('.delete-history-btn');

            productElement.textContent = item.productName;
            dateElement.textContent = `${item.date} • ${item.ingredientCount} ingredients`;
            riskElement.textContent = item.level.toUpperCase();
            riskElement.className = `history-risk ${item.level}`;
            
            historyItem.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-history-btn')) {
                    viewHistoricalAnalysis(item);
                }
            });

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteAnalysis(item.id);
            });

            historyList.appendChild(clone);
        });
    }

    function deleteAnalysis(id) {
        if (confirm('Are you sure you want to delete this analysis?')) {
            let history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
            history = history.filter(item => item.id !== id);
            localStorage.setItem('analysisHistory', JSON.stringify(history));
            loadHistory();
        }
    }

    function viewHistoricalAnalysis(item) {
        showResults(item.productName, item.ingredients || []);
        riskScore.textContent = `Score: ${item.score}`;
        const scoreValue = parseFloat(item.score.split('/')[0]);
        riskIndicator.style.left = `${(scoreValue / 3) * 100}%`;
        saveAnalysisBtn.disabled = true;
        saveAnalysisBtn.textContent = 'Previously Saved';
    }

    // Camera and OCR functions
    function handleFileUpload(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                modalMediaContainer.innerHTML = `
                    <img src="${event.target.result}" alt="Uploaded Image">
                `;
                imageModal.classList.add('active');
            };
            
            reader.readAsDataURL(file);
        }
    }

    async function startCamera() {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' },
                audio: false 
            });
            cameraPreview.srcObject = cameraStream;
            cameraPreview.style.display = 'block';
            cameraBtn.style.display = 'none';
            captureBtn.style.display = 'block';
        } catch (err) {
            console.error("Camera error:", err);
            alert("Could not access the camera. Please check permissions.");
        }
    }

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
        cameraPreview.style.display = 'none';
        cameraBtn.style.display = 'block';
        captureBtn.style.display = 'none';
    }

    function captureImage() {
        const canvas = document.createElement('canvas');
        canvas.width = cameraPreview.videoWidth;
        canvas.height = cameraPreview.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
        
        modalMediaContainer.innerHTML = `
            <img src="${canvas.toDataURL('image/jpeg')}" alt="Captured Image">
        `;
        
        imageModal.classList.add('active');
        stopCamera();
    }

    async function processImageWithOCR() {
        const image = modalMediaContainer.querySelector('img');
        if (!image) return;

        ocrProgress.textContent = "Initializing OCR...";
        processImageBtn.disabled = true;
        
        try {
            if (!worker) {
                worker = await Tesseract.createWorker({
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            ocrProgress.textContent = `Processing: ${Math.round(m.progress * 100)}%`;
                        }
                    }
                });
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                await worker.setParameters({
                    tessedit_pageseg_mode: '6',
                    preserve_interword_spaces: '1',
                    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789(),.-% ',
                    user_defined_dpi: '300'
                });
            }

            ocrProgress.textContent = "Processing image...";
            
            const { data: { text } } = await worker.recognize(image);
            
            // Advanced ingredient list parsing
            let cleanedText = text
                .replace(/(nutrition facts|serving size|daily value|ingredients?[:]?|contains?[:]?|may contain|product of|packaged? in|distributed? by|manufactured? for)/gi, '')
                .replace(/(\d+%|\d+\.\d+%|\d+\s?g|\d+\s?mg|\d+\s?mcg|\d+\s?oz|\d+\s?ml|\d+\s?kcal|\d+\s?kJ)\b/gi, '')
                .replace(/[•*_\-–—]/g, ',')
                .replace(/\b([A-Z])([A-Z]+)\b/g, (match, p1, p2) => p1 + p2.toLowerCase())
                .replace(/\b(\w+)\s+\1\b/gi, '$1')
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/\s{2,}/g, ' ')
                .replace(/,\s*,/g, ',')
                .trim();

            // Smart comma and newline handling
            const lines = cleanedText.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 2 && !/^\d/.test(line));

            // Further processing
            const finalIngredients = [];
            lines.forEach(line => {
                const items = line.split(/(?<!\([^)]*),(?![^(]*\))/g);
                items.forEach(item => {
                    item = item.trim()
                        .replace(/^[.,]+|[.,]+$/g, '')
                        .replace(/\s*\([^)]*\)/g, '');
                    
                    if (item.length > 2 && !/^and$|^or$/i.test(item)) {
                        finalIngredients.push(item);
                    }
                });
            });

            ingredientsListInput.value = finalIngredients.join('\n');
            closeImageModal();
            
            const productName = productNameInput.value.trim() || "Scanned Product";
            showResults(productName, finalIngredients);
            
        } catch (error) {
            console.error("OCR Error:", error);
            ocrProgress.textContent = "Error processing image. Please try again.";
        } finally {
            processImageBtn.disabled = false;
        }
    }

    function closeImageModal() {
        if (worker) {
            worker.terminate();
            worker = null;
        }
        modalMediaContainer.innerHTML = '';
        imageModal.classList.remove('active');
        ocrProgress.textContent = "Ready to process";
    }

    // Initialize the app
    init();
});