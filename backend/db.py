import redis
import uuid

class DB:
    r = None
    ip = None
    port = None
    def __init__(self, ip, port):
        self.ip = ip
        self.port = port
        self.r = redis.Redis(host=self.ip, port=self.port, db=0)


    def add_user(self, username, password, friends, flangs, llangs):
        user_uuid = str(uuid.uuid4())
        user_key = f"user:{user_uuid}"
        
        self.r.hset(user_key, "username", username)
        self.r.hset(user_key, "password", password)
        self.r.hset(user_key, "uuid", user_uuid)

        # store friends, flangs, and llangs in separate lists
        if friends:
            self.r.rpush(f"{user_key}:friends", *friends)
        if flangs:
            self.r.rpush(f"{user_key}:flangs", *flangs)
        if llangs:
            self.r.rpush(f"{user_key}:llangs", *llangs)
        
        self.r.zadd('users', {user_key: 0})


    def get_all_users(self):
        # get all users sorted by username
        user_keys = self.r.zrange('users', 0, -1)
        sorted_users = []
        for key in user_keys:
            user_data = self.r.hgetall(key)
            friends = self.r.lrange(f"{key.decode('utf-8')}:friends", 0, -1)
            flangs = self.r.lrange(f"{key.decode('utf-8')}:flangs", 0, -1)
            llangs = self.r.lrange(f"{key.decode('utf-8')}:llangs", 0, -1)

            sorted_users.append({
                'username': user_data[b'username'].decode('utf-8'),
                'password': user_data[b'password'].decode('utf-8'),
                'uuid': user_data[b'uuid'].decode('utf-8'),
                'friends': [friend.decode('utf-8') for friend in friends],
                'flangs': [flang.decode('utf-8') for flang in flangs],
                'llangs': [llang.decode('utf-8') for llang in llangs]
            })
        return sorted_users


    def get_user_by_username(self, username):
        user_keys = self.r.zrange('users', 0, -1)
        for key in user_keys:
            key_str = key.decode('utf-8')
            user_data = self.r.hgetall(key_str)
            if user_data and user_data[b'username'].decode('utf-8') == username:
                friends = self.r.lrange(f"{key_str}:friends", 0, -1)
                flangs = self.r.lrange(f"{key_str}:flangs", 0, -1)
                llangs = self.r.lrange(f"{key_str}:llangs", 0, -1)

                return {
                    'username': user_data[b'username'].decode('utf-8'),
                    'password': user_data[b'password'].decode('utf-8'),
                    'uuid': user_data[b'uuid'].decode('utf-8'),
                    'friends': [friend.decode('utf-8') for friend in friends],
                    'flangs': [flang.decode('utf-8') for flang in flangs],
                    'llangs': [llang.decode('utf-8') for llang in llangs]
                }
        return None


    def get_user_by_uuid(self, user_uuid):
        # construct the user key
        user_key = f"user:{user_uuid}"
        
        user_data = self.r.hgetall(user_key)
        if not user_data:
            return None
        
        friends = self.r.lrange(f"{user_key}:friends", 0, -1)
        flangs = self.r.lrange(f"{user_key}:flangs", 0, -1)
        llangs = self.r.lrange(f"{user_key}:llangs", 0, -1)

        return {
            'username': user_data[b'username'].decode('utf-8'),
            'password': user_data[b'password'].decode('utf-8'),
            'uuid': user_data[b'uuid'].decode('utf-8'),
            'friends': [friend.decode('utf-8') for friend in friends],
            'flangs': [flang.decode('utf-8') for flang in flangs],
            'llangs': [llang.decode('utf-8') for llang in llangs]
        }

    def add_friend(self, uuid1, uuid2):
        # construct the user key for uuid1
        user1_key = f"user:{uuid1}"
        
        # get username of user2
        user2_data = self.get_user_by_uuid(uuid2)
        if not user2_data:
            return None
        
        user2_username = user2_data['username']
        
        # add user2's username to user1's friends list
        self.r.rpush(f"{user1_key}:friends", user2_username)
        return True
        