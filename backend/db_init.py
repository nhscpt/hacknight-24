import redis
import uuid

IP = 'localhost'
PORT = 6379

def initialize_redis():
    r = redis.Redis(host=IP, port=PORT, db=0)

    r.flushdb()

    initial_users = [
        {
            'username': 'TheGurch42',
            'password': '$argon2id$v=19$m=524288,t=2,p=8$P79FpOS8UlCPPGKgxZmTPQ$P4PowxzBV8FlA9HGJTBu7JduaeVhaezEj3ydGu37ZdY',
            'friends': ['Landevious99'],
            'flangs': ['English', 'Russian'],
            'llangs': ['Spanish']
        },
        {
            'username': 'Landevious99',
            'password': '$argon2id$v=19$m=524288,t=2,p=8$P79FpOS8UlCPPGKgxZmTPQ$P4PowxzBV8FlA9HGJTBu7JduaeVhaezEj3ydGu37ZdY',
            'friends': ['TheGurch42'],
            'flangs': ['English', 'Russian', 'Spanish'],
            'llangs': ['French']
        }
    ]

    for user in initial_users:
        add_user(r, user['username'], user['password'], user['friends'], user['flangs'], user['llangs'])

    print("Redis database initialized with initial users.")

def add_user(r, username, password, friends, flangs, llangs):
    user_uuid = str(uuid.uuid4())
    user_key = f"user:{user_uuid}"
    
    r.hset(user_key, "username", username)
    r.hset(user_key, "password", password)
    r.hset(user_key, "uuid", user_uuid)

    # store friends, flangs, and llangs in separate lists
    if friends:
        r.rpush(f"{user_key}:friends", *friends)
    if flangs:
        r.rpush(f"{user_key}:flangs", *flangs)
    if llangs:
        r.rpush(f"{user_key}:llangs", *llangs)
    
    # add to a sorted set with a generated score
    r.zadd('users', {user_key: 0})

if __name__ == "__main__":
    initialize_redis()
