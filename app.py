from flask import Flask, request, jsonify, render_template, redirect, url_for
import sqlite3

app = Flask(__name__)

# Database setup
def init_db():
    conn = sqlite3.connect('project_evaluations.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS judges
                 (username TEXT PRIMARY KEY, password TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS evaluations
                 (judge_name TEXT, group_members TEXT, group_number INTEGER, project_title TEXT,
                  articulate_requirements INTEGER, articulate_requirements_acc INTEGER,
                  tools_methods INTEGER, tools_methods_acc INTEGER,
                  oral_presentation INTEGER, oral_presentation_acc INTEGER,
                  teamwork INTEGER, teamwork_acc INTEGER, comments TEXT)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def login_page():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    
    conn = sqlite3.connect('project_evaluations.db')
    c = conn.cursor()
    c.execute("SELECT * FROM judges WHERE username=? AND password=?", (username, password))
    judge = c.fetchone()
    conn.close()

    if judge:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'})

@app.route('/main')
def main_page():
    return render_template('main.html')

@app.route('/submit_evaluation', methods=['POST'])
def submit_evaluation():
    data = request.json
    conn = sqlite3.connect('project_evaluations.db')
    c = conn.cursor()
    c.execute('''INSERT INTO evaluations (judge_name, group_members, group_number, project_title, 
                                          articulate_requirements, articulate_requirements_acc,
                                          tools_methods, tools_methods_acc,
                                          oral_presentation, oral_presentation_acc,
                                          teamwork, teamwork_acc, comments)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', 
              (data['judgeName'], data['groupMembers'], data['groupNumber'], data['projectTitle'],
               data['articulateRequirements'], data['articulateRequirementsAcc'],
               data['toolsMethods'], data['toolsMethodsAcc'],
               data['oralPresentation'], data['oralPresentationAcc'],
               data['teamwork'], data['teamworkAcc'], data['comments']))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/admin')
def admin_page():
    return render_template('admin.html')

@app.route('/get_averages', methods=['GET'])
def get_averages():
    conn = sqlite3.connect('project_evaluations.db')
    c = conn.cursor()
    c.execute('''SELECT group_number, group_members, project_title, 
                        AVG(articulate_requirements + articulate_requirements_acc +
                            tools_methods + tools_methods_acc +
                            oral_presentation + oral_presentation_acc +
                            teamwork + teamwork_acc) AS average_grade
                 FROM evaluations
                 GROUP BY group_number, group_members, project_title''')
    averages = c.fetchall()
    conn.close()
    return jsonify(averages)

if __name__ == '__main__':
    app.run(debug=True)
