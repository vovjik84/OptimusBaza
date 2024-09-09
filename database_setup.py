import sqlite3
import os

def create_database():
    db_file = 'chatbot.db'

    # Если файл существует, удалим его
    if os.path.exists(db_file):
        os.remove(db_file)

    # Соединяемся с базой данных, создаем ее, если не существует
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    # Создаем таблицу сообщений
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            user_message TEXT,
            bot_response TEXT,
            subject TEXT
        )
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    create_database()
