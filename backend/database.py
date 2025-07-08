import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os

# Fix database path
current_dir = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(current_dir, 'users.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database
init_db()

def add_user(username, email, password):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    try:
        password_hash = generate_password_hash(password)
        c.execute('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                 (username, email, password_hash))
        conn.commit()
        print(f"User added: {username}, {email}") # Debug line
        return True
    except sqlite3.IntegrityError as e:
        print(f"Database error: {e}") # Debug line
        return False
    finally:
        conn.close()

def verify_user(email, password):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    try:
        c.execute('SELECT id, username, password_hash FROM users WHERE email = ?', (email,))
        user = c.fetchone()
        print(f"Login attempt for: {email}") # Debug line
        if user and check_password_hash(user[2], password):
            print(f"Login successful for: {email}") # Debug line
            return {'id': user[0], 'username': user[1]}
        print(f"Login failed for: {email}") # Debug line
        return None
    finally:
        conn.close()