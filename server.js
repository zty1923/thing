const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

db.run(`CREATE TABLE IF NOT EXISTS evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    groupNumber TEXT,
    groupMembers TEXT,
    projectTitle TEXT,
    articulateRequirements INTEGER,
    chooseTools INTEGER,
    presentation INTEGER,
    teamwork INTEGER,
    judgeName TEXT,
    comments TEXT,
    total INTEGER,
    average REAL
)`);

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/submit', (req, res) => {
    const data = req.body;
    const total = parseInt(data.articulateRequirements) + parseInt(data.chooseTools) + parseInt(data.presentation) + parseInt(data.teamwork);
    const average = total / 4;

    db.run(`INSERT INTO evaluations (groupNumber, groupMembers, projectTitle, articulateRequirements, chooseTools, presentation, teamwork, judgeName, comments, total, average)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.groupNumber, data.groupMembers, data.projectTitle, data.articulateRequirements, data.chooseTools, data.presentation, data.teamwork, data.judgeName, data.comments, total, average],
        function(err) {
            if (err) {
                return res.json({ message: 'Error submitting the form' });
            }
            res.json({ message: 'Form submitted successfully' });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
