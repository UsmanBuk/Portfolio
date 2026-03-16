import os


def get_runtime_config() -> dict[str, str]:
    return {
        "api_key": os.getenv("OPENAI_API_KEY", ""),
        "log_level": os.environ.get("LOG_LEVEL", "INFO"),
    }


if __name__ == "__main__":
    print(get_runtime_config())

