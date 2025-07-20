import logging
from rich.logging import RichHandler
from rich.console import Console


def setup_rich_logging():
    """
    Sets up rich-compatible logging with colorful output.
    """
    # Create a console for rich output
    console = Console(color_system="truecolor")

    # Configure logging to use RichHandler
    logging.basicConfig(
        level="INFO",
        format="%(message)s",
        datefmt="[%X]",
        handlers=[RichHandler(console=console)],
    )

    # Optional: Set a higher level for specific loggers if needed
    logging.getLogger("httpx").setLevel(logging.WARNING)
    # logging.getLogger("httpcore").setLevel(logging.WARNING)
