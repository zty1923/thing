document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple login validation
    if (username === 'judge1' && password === 'password1') {
        window.location.href = 'index.html';
    } else if (username === 'judge2' && password === 'password2') {
        window.location.href = 'index.html';
    } else if (username === 'judge3' && password === 'password3') {
        window.location.href = 'index.html';
    } else if (username === 'judge4' && password === 'password4') {
        window.location.href = 'index.html';
    } else {
        document.getElementById('error').innerText = 'Invalid credentials';
    }
});

document.getElementById('evaluationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch('/submit', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(data => {
        document.getElementById('message').innerText = data.message;
    }).catch(error => {
        document.getElementById('message').innerText = 'Error submitting the form';
    });
});
