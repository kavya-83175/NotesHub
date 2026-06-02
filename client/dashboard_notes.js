// DOM Elements
const noteModal = document.getElementById('note-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const noteForm = document.getElementById('note-form');
const notesContainer = document.getElementById('notes-container');
const searchInput = document.getElementById('search-input');

// --- Modal Logic ---
openModalBtn.addEventListener('click', () => {
    noteModal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
    noteModal.classList.remove('active');
    noteForm.reset();
});

// --- Create Note Logic ---
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('note-title-input').value;
    const content = document.getElementById('note-content-input').value;
    const date = new Date().toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
    });

    fetch("http://localhost:5001/notes", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        title,
        content,
        date,
        email
    })
})
.then(res => res.json())
.then(data => {
    createNoteCard(data.title, data.content, data.date);
})
.catch(err => console.log(err));

    noteModal.classList.remove('active');
    noteForm.reset();
});

function createNoteCard(title, content, date) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
        <div class="menu-container">
            <button class="menu-dots" onclick="toggleMenu(event)">&#8942;</button>
            <div class="dropdown-menu">
                <button class="dropdown-item" onclick="editNote(this)">Edit</button>
                <button class="dropdown-item delete-item" onclick="deleteNote(this)">Delete</button>
            </div>
        </div>
        <div>
            <h3 class="note-title">${title}</h3>
            <p class="note-content">${content}</p>
        </div>
        <div class="note-footer">
            <span>${date}</span>
        </div>
    `;
    notesContainer.prepend(card);
}



// --- 3-Dots Menu Logic ---
function toggleMenu(event) {
    event.stopPropagation();
    const menu = event.target.nextElementSibling;
    
    // Close other menus
    document.querySelectorAll('.dropdown-menu').forEach(m => {
        if (m !== menu) m.classList.remove('active');
    });

    menu.classList.toggle('active');
}

function deleteNote(button) {
    if (confirm("Delete this note?")) {
        button.closest('.note-card').remove();
    }
}

function editNote(button) {
    const card = button.closest('.note-card');
    const title = card.querySelector('.note-title').innerText;
    const content = card.querySelector('.note-content').innerText;
    
    // Fill modal with existing data to "edit"
    document.getElementById('note-title-input').value = title;
    document.getElementById('note-content-input').value = content;
    
    noteModal.classList.add('active');
}

// --- Search Logic ---
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const notes = document.querySelectorAll('.note-card');

    notes.forEach(note => {
        const title = note.querySelector('.note-title').innerText.toLowerCase();
        const content = note.querySelector('.note-content').innerText.toLowerCase();
        
        if (title.includes(term) || content.includes(term)) {
            note.style.display = 'flex';
        } else {
            note.style.display = 'none';
        }
    });
});

// Close menu on outside click
window.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
});

// --- Fetch and Display Existing Notes on Page Load ---
function loadNotesFromDatabase() {
    fetch("http://localhost:5001/notes")
        .then(res => res.json())
        .then(notesArray => {
            // Clear current container to avoid duplicates
            notesContainer.innerHTML = ""; 
            
            // Loop through your Atlas data and build cards for them
            notesArray.forEach(note => {
                createNoteCard(note.title, note.content, note.date);
            });
        })
        .catch(err => console.error("Error loading notes from history:", err));
}

// Call this function instantly when the script runs
loadNotesFromDatabase();
