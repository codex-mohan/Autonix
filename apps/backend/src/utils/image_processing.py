from io import BytesIO
import base64
from typing import Literal


def convert_to_base64(pil_image, format=Literal["JPEG", "PNG"]):
    """
    Convert PIL images to Base64 encoded strings

    :param pil_image: PIL image
    :return: Re-sized Base64 string
    """

    buffered = BytesIO()
    pil_image.save(buffered, format=format)  # You can change the format if needed
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str
