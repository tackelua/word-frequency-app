/**
 * Word Frequency Analyzer - Frontend Application
 * Handles file uploads, caching, vocabulary saving, and visualization
 */

// ==========================================
// State Management
// ==========================================
let filesData = JSON.parse(localStorage.getItem('wfa_files') || '{}');
let savedWords = JSON.parse(localStorage.getItem('wfa_saved') || '[]');
let selectedFiles = new Set(); // Multi-select files
let showSavedOnly = false;

// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const uploadCard = document.querySelector('.upload-card');
const resultsSection = document.getElementById('resultsSection');
const errorToast = document.getElementById('errorToast');
const errorMessage = document.getElementById('errorMessage');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');
const searchBox = document.getElementById('searchBox');
const exportBtn = document.getElementById('exportBtn');
const tableBody = document.getElementById('tableBody');
const fileSelector = document.getElementById('fileSelector');
const savedCountEl = document.getElementById('savedCount');

// ==========================================
// Initialization
// ==========================================
function init() {
    if (Object.keys(filesData).length > 0) {
        // Select all files by default
        selectedFiles = new Set(Object.keys(filesData));
        showResults();
    }
}

// ==========================================
// File Upload Handling
// ==========================================
uploadZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
});

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
});

// ==========================================
// File Upload & Analysis
// ==========================================
async function handleFileUpload(file) {
    const allowedExts = ['pdf', 'docx', 'doc', 'txt', 'csv'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!allowedExts.includes(ext)) {
        showError(`Unsupported file type. Allowed: ${allowedExts.join(', ')}`);
        return;
    }

    if (file.size > 100 * 1024 * 1024) {
        showError('File size exceeds 100MB limit');
        return;
    }

    uploadZone.style.display = 'none';
    uploadProgress.style.display = 'block';

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to process file');
        }

        const data = await response.json();

        filesData[data.fileName] = {
            fileName: data.fileName,
            analysis: data.analysis,
            uploadedAt: new Date().toISOString()
        };
        saveFilesData();

        // Auto-select new file
        selectedFiles.add(data.fileName);

        showResults();

    } catch (error) {
        console.error('Upload error:', error);
        showError(error.message || 'Failed to process file');
        resetUpload();
    }
}

// ==========================================
// Results Display
// ==========================================
function showResults() {
    uploadCard.style.display = 'none';
    resultsSection.style.display = 'block';

    updateFileSelector();
    updateStats();
    renderWordCloud();
    renderTable();
}

function updateFileSelector() {
    const files = Object.keys(filesData);

    let html = `
    <div class="file-filters">
      <div class="file-checkboxes">
  `;

    // All files checkbox
    const allChecked = selectedFiles.size === files.length && !showSavedOnly;
    html += `
    <label class="file-checkbox ${allChecked ? 'active' : ''}">
      <input type="checkbox" value="all" ${allChecked ? 'checked' : ''} onchange="toggleAllFiles(this.checked)">
      <span>All (${files.length})</span>
    </label>
  `;

    // Individual file checkboxes
    files.forEach(fileName => {
        const checked = selectedFiles.has(fileName);
        const shortName = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
        html += `
      <label class="file-checkbox ${checked && !showSavedOnly ? 'active' : ''}" title="${fileName}">
        <input type="checkbox" value="${fileName}" ${checked && !showSavedOnly ? 'checked' : ''} onchange="toggleFile('${fileName}', this.checked)">
        <span>${shortName}</span>
      </label>
    `;
    });

    // Saved words option
    if (savedWords.length > 0) {
        html += `
      <label class="file-checkbox saved-filter ${showSavedOnly ? 'active' : ''}">
        <input type="checkbox" value="saved" ${showSavedOnly ? 'checked' : ''} onchange="toggleSavedOnly(this.checked)">
        <span>⭐ Saved (${savedWords.length})</span>
      </label>
    `;
    }

    html += `
      </div>
    </div>
  `;

    fileSelector.innerHTML = html;
}

function toggleAllFiles(checked) {
    showSavedOnly = false;
    if (checked) {
        selectedFiles = new Set(Object.keys(filesData));
    } else {
        selectedFiles.clear();
    }
    updateFileSelector();
    updateStats();
    renderWordCloud();
    renderTable();
}

function toggleFile(fileName, checked) {
    showSavedOnly = false;
    if (checked) {
        selectedFiles.add(fileName);
    } else {
        selectedFiles.delete(fileName);
    }
    updateFileSelector();
    updateStats();
    renderWordCloud();
    renderTable();
}

function toggleSavedOnly(checked) {
    showSavedOnly = checked;
    if (checked) {
        // When showing saved only, still use all files for counts
        selectedFiles = new Set(Object.keys(filesData));
    }
    updateFileSelector();
    updateStats();
    renderWordCloud();
    renderTable();
}

// Make these global
window.toggleAllFiles = toggleAllFiles;
window.toggleFile = toggleFile;
window.toggleSavedOnly = toggleSavedOnly;

function updateStats() {
    const data = getAggregatedData();
    document.getElementById('totalWords').textContent = data.totalWords.toLocaleString();
    document.getElementById('uniqueWords').textContent = data.uniqueWords.toLocaleString();
    savedCountEl.textContent = savedWords.length.toLocaleString();
}

function getAggregatedData() {
    const wordMap = new Map();
    let totalWords = 0;

    // Aggregate selected files only
    Object.entries(filesData).forEach(([fileName, file]) => {
        if (!selectedFiles.has(fileName)) return;

        file.analysis.results.forEach(item => {
            const existing = wordMap.get(item.word) || 0;
            wordMap.set(item.word, existing + item.count);
            totalWords += item.count;
        });
    });

    let results = Array.from(wordMap.entries())
        .map(([word, count]) => ({
            word,
            count,
            percentage: totalWords > 0 ? ((count / totalWords) * 100).toFixed(2) : '0.00'
        }))
        .sort((a, b) => b.count - a.count);

    // Filter for saved words only
    if (showSavedOnly) {
        results = results.filter(item => savedWords.includes(item.word));
    }

    results = results.slice(0, 500);

    return {
        results,
        totalWords,
        uniqueWords: wordMap.size
    };
}

// ==========================================
// Word Cloud Visualization
// ==========================================
function renderWordCloud() {
    const container = document.getElementById('wordCloud');
    container.innerHTML = '';

    const data = getAggregatedData();
    if (data.results.length === 0) {
        container.innerHTML = '<p style="color: #6b6b7b; text-align: center;">No words to display</p>';
        return;
    }

    const width = container.offsetWidth;
    const height = 300;

    const words = data.results.slice(0, 60).map(item => ({
        text: item.word,
        size: 12 + (item.count / data.results[0].count) * 50
    }));

    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(4)
        .rotate(() => (Math.random() > 0.7 ? 90 : 0))
        .font('Inter')
        .fontSize(d => d.size)
        .on('end', draw);

    layout.start();

    function draw(words) {
        d3.select('#wordCloud')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`)
            .selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .style('font-size', d => `${d.size}px`)
            .style('font-family', 'Inter')
            .style('font-weight', '600')
            .style('fill', () => colors[Math.floor(Math.random() * colors.length)])
            .style('cursor', 'pointer')
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .text(d => d.text)
            .on('click', function (event, d) {
                toggleSave(d.text);
                renderWordCloud();
            });
    }
}

// ==========================================
// Data Table
// ==========================================
let tableData = [];
let sortColumn = 'count';
let sortDirection = 'desc';

function renderTable() {
    const data = getAggregatedData();
    tableData = data.results;
    updateTable();

    if (!fileSelector.dataset.initialized) {
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.sort;
                if (sortColumn === column) {
                    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    sortColumn = column;
                    sortDirection = column === 'word' ? 'asc' : 'desc';
                }
                document.querySelectorAll('.sortable').forEach(h => h.classList.remove('active'));
                header.classList.add('active');
                updateTable();
            });
        });
        fileSelector.dataset.initialized = 'true';

        // Save header click to toggle filter
        const saveHeader = document.getElementById('saveHeader');
        if (saveHeader) {
            saveHeader.addEventListener('click', () => {
                showSavedOnly = !showSavedOnly;
                saveHeader.classList.toggle('filter-active', showSavedOnly);
                updateFileSelector();
                updateStats();
                renderWordCloud();
                renderTable();
            });
        }
    }
}

function updateTable() {
    const searchTerm = searchBox.value.toLowerCase();

    let filtered = tableData.filter(item =>
        item.word.toLowerCase().includes(searchTerm)
    );

    filtered.sort((a, b) => {
        let aVal, bVal;
        switch (sortColumn) {
            case 'rank':
                aVal = tableData.indexOf(a);
                bVal = tableData.indexOf(b);
                break;
            case 'word':
                aVal = a.word;
                bVal = b.word;
                break;
            case 'count':
                aVal = a.count;
                bVal = b.count;
                break;
            case 'percentage':
                aVal = parseFloat(a.percentage);
                bVal = parseFloat(b.percentage);
                break;
        }

        if (sortColumn === 'word') {
            return sortDirection === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        } else {
            return sortDirection === 'asc'
                ? aVal - bVal
                : bVal - aVal;
        }
    });

    tableBody.innerHTML = filtered.map((item, index) => {
        const isSaved = savedWords.includes(item.word);
        const rank = tableData.indexOf(item) + 1;
        return `
    <tr>
      <td>${rank}</td>
      <td>${item.word}</td>
      <td>${item.count.toLocaleString()}</td>
      <td>${item.percentage}%</td>
      <td>
        <button class="save-btn ${isSaved ? 'saved' : ''}" 
                onclick="toggleSave('${item.word}')" 
                title="${isSaved ? 'Remove from saved' : 'Save word'}">
          ${isSaved ? '⭐' : '☆'}
        </button>
      </td>
    </tr>
  `;
    }).join('');
}

// ==========================================
// Save Words Feature
// ==========================================
function toggleSave(word) {
    const index = savedWords.indexOf(word);
    if (index > -1) {
        savedWords.splice(index, 1);
    } else {
        savedWords.push(word);
    }
    saveSavedWords();
    updateFileSelector();
    updateTable();
    updateStats();
}

window.toggleSave = toggleSave;

// ==========================================
// File Source Selection (for compatibility)
// ==========================================

// ==========================================
// Search & Export
// ==========================================
searchBox.addEventListener('input', updateTable);

exportBtn.addEventListener('click', () => {
    const data = getAggregatedData();
    if (!data.results.length) return;

    const csv = [
        ['Rank', 'Word', 'Count', 'Percentage', 'Saved'],
        ...data.results.map((item, idx) => [
            idx + 1,
            item.word,
            item.count,
            item.percentage + '%',
            savedWords.includes(item.word) ? 'Yes' : ''
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word-frequency-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
});

// ==========================================
// New Analysis
// ==========================================
newAnalysisBtn.addEventListener('click', () => {
    resetUpload();
});

// ==========================================
// Utility Functions
// ==========================================
function showError(message) {
    errorMessage.textContent = message;
    errorToast.style.display = 'flex';
    setTimeout(() => errorToast.style.display = 'none', 5000);
}

function resetUpload() {
    uploadZone.style.display = 'block';
    uploadProgress.style.display = 'none';
    fileInput.value = '';
}

function saveFilesData() {
    localStorage.setItem('wfa_files', JSON.stringify(filesData));
}

function saveSavedWords() {
    localStorage.setItem('wfa_saved', JSON.stringify(savedWords));
}

// Initialize
init();
