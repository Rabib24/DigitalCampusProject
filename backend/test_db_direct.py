
import psycopg2
import os

# DB Settings (matching your settings.py defaults)
DB_NAME = 'DigitalCampus'
DB_USER = 'postgres'
DB_PASSWORD = 'DigitalIUB'
DB_HOST = 'localhost'
DB_PORT = '5432'

print(f"🔌 Testing connection to PostgreSQL...")
print(f"   Host: {DB_HOST}:{DB_PORT}")
print(f"   Database: {DB_NAME}")
print(f"   User: {DB_USER}")

try:
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        connect_timeout=3
    )
    print("\n✅ Connection SUCCESSFUL!")
    
    # Check for the user
    cur = conn.cursor()
    cur.execute("SELECT username, first_name, last_name, email FROM users_user WHERE username = '190001';")
    user = cur.fetchone()
    
    if user:
        print(f"\n👤 Found user: {user[0]}")
        print(f"   First Name: '{user[1]}'")
        print(f"   Last Name: '{user[2]}'")
        
        if user[1] != 'Austin':
            print("\n⚠️ Name is incorrect in database. Fixing it now...")
            cur.execute("UPDATE users_user SET first_name = 'Austin', last_name = 'Student' WHERE username = 'Student190001';")
            conn.commit()
            print("✅ Name updated to 'Austin Student'")
        else:
            print("\n✅ Name is correct in database.")
    else:
        print("\n❌ User 'Student190001' not found in database.")
        
    conn.close()

except Exception as e:
    print(f"\n❌ Connection FAILED: {str(e)}")
