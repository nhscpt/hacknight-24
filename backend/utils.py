from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError

ph = PasswordHasher(
    time_cost=2,
    memory_cost=512 * 1024,
    parallelism=8,
)

def hash_password(password):
    return ph.hash(password)

def verify_hash(hash, password):
    try: return ph.verify(hash, password)
    except argon2.exceptions.VerifyMismatchError: return False

