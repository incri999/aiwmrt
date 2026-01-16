import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set")

def get_connection():
    return psycopg2.connect(DATABASE_URL, sslmode="require")

def ensure_table_exists():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS waste_records (
            id SERIAL PRIMARY KEY,
            waste_type TEXT,
            confidence INTEGER,
            disposal_method TEXT,
            sustainability_tip TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    conn.commit()
    cur.close()
    conn.close()

def save_record(result: dict):
    ensure_table_exists()

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO waste_records (
            waste_type,
            confidence,
            disposal_method,
            sustainability_tip
        ) VALUES (%s, %s, %s, %s)
    """, (
        result.get("waste_type"),
        result.get("confidence"),
        result.get("disposal_method"),
        result.get("sustainability_tip"),
    ))

    conn.commit()
    cur.close()
    conn.close()
