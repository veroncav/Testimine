from flask import Flask, request
import uuid, time

app = Flask(__name__)

USERS = { "alice@example.com":{"password": "pass123","role":"user"},
         "admin@example.com":{"password": "admin123","role":"admin"} 
        }

TOKENS = {}

def requirer_bearer(req):
    auth = req.headers.get("Authorization","")
    if not auth.startswith("Bearer "):
        return None
    token = auth.split(" ",1)[1].strip()
    return TOKENS.get(token)

@app.get('/health')
def health():
    return {"status":"ok"}

@app.post("/login")
def login():
    data = request.get_json()
    print(data)
    email = data.get('email')
    password = data.get('password')
    user = USERS.get(email)
    if not user or user['password'] != password:
        return {"error": "Credentials are bad"}, 401
    tok = str(uuid.uuid4())
    TOKENS[tok] = {"email":email, 'role':user['role']}
    time.sleep(0.15)

    return {"token": tok,'role': user['role']}

@app.get("/me")
def me():
    principals = requirer_bearer(request)
    if not principals:
        return  {"error": "unathorized"}, 401
    return {"email": principals["email"], "role":principals['role']}

# 0.1) GET /admin
@app.get("/admin")
def admin():
    principals = requirer_bearer(request)
    if principals and principals.get("role") != "admin":
        return  {"error": "forbidden"}, 403
    elif principals and principals.get("role") == "admin":
        return {"ok": True, "secret": "flag-123"}, 200
    return  {"error": "unathorized"}, 401

# 1) POST /register
@app.post("/register")
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or '@' not in email:
        return {"error": "Invalid email"}, 400
    if not password or len(password) < 6:
        return {"error": "Password too short"}, 400
    if email in USERS:
        return {"error": "User already exists"}, 409
    
    USERS[email] = {"password": password, "role": "user"}
    token = str(uuid.uuid4())
    TOKENS[token] = {"email": email, "role": "user"}

    return {"token": token, "email": email, "role": "user"}, 201

# 2) POST /change-password
@app.post("/change-password")
def change_password():
    principals = requirer_bearer(request)
    if not principals:
        return {"error": "unauthorized"}, 401

    data = request.get_json()
    old_password = data.get("old_password")
    new_password = data.get("new_password")
    email = principals.get("email")

    if not old_password or not new_password:
        return {"error": "Missing fields"}, 400
    if new_password == old_password or len(new_password) < 6:
        return {"error": "Invalid new password"}, 400
    if USERS[email]["password"] != old_password:
        return {"error": "Old password incorrect"}, 400

    USERS[email]["password"] = new_password

    for token, info in list(TOKENS.items()):
        if info.get("email") == email:
            del TOKENS[token]
            break

    new_token = str(uuid.uuid4())
    TOKENS[new_token] = {"email": email, "role": principals.get("role")}

    return {"token": new_token}, 200


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)
    

