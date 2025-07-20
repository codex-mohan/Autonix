import logging
from apps.backend.utils.logging import setup_rich_logging


def main():
    setup_rich_logging()
    logging.info("Hello from backend!")


if __name__ == "__main__":
    main()
