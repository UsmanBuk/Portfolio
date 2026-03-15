import os

DATABASE_URL = os.getenv("DATABASE_URL")
REDIS_URL = os.environ.get("REDIS_URL")
SENTRY_DSN = os.getenv("SENTRY_DSN")
PAYMENTS_API_KEY = os.getenv("PAYMENTS_API_KEY")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is required")

print("Service bootstrapped with env config.")

