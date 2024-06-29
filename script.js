document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/main';
        } else {
            document.getElementById('loginError').innerText = data.message;
        }
    });
});

document.getElementById('evaluationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => { data[key] = value });

    fetch('/submit_evaluation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('submissionMessage').innerText = 'Submission successful!';
            event.target.reset();
        } else {
            document.getElementById('submissionMessage').innerText = 'Submission failed. Please try again.';
        }
    });
});
