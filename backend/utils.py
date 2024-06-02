from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError

# Create a PasswordHasher with custom parameters
ph = PasswordHasher(
    time_cost=2,    # Number of iterations
    memory_cost=512 * 1024,  # Memory cost in kibibytes (e.g., 512MB)
    parallelism=8,  # Number of parallel threads
)

def argon_hash(password):
    return ph.hash(password)

def verify_hash(hash, password):
    try: return ph.verify(hash, password)
    except VerifyMismatchError: return False
