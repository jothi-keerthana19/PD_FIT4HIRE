from groq import Groq
import base64

def encode_image(image_path):
    """
    Encode an image file to base64 string.
    
    Args:
        image_path (str): Path to the image file
        
    Returns:
        str: Base64 encoded string of the image
    """
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def analyze_image(image_path, prompt="What's in this image?"):
    """
    Analyze an image using Groq's vision model.
    
    Args:
        image_path (str): Path to the image file
        prompt (str): Custom prompt for image analysis
        
    Returns:
        str: Model's response describing the image
    """
    # Initialize Groq client with API key
    client = Groq(api_key="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")
    
    # Encode image to base64
    base64_image = encode_image(image_path)
    
    # Create chat completion request
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                        },
                    },
                ],
            }
        ],
        model="llama-3.2-11b-vision-preview",
    )
    
    # Return the model's response
    return chat_completion.choices[0].message.content

if __name__ == "__main__":
    # Get image path from user
    image_path = input("Enter the path to your image: ")
    
    try:
        result = analyze_image(image_path)
        print(result)
    except FileNotFoundError:
        print(f"Error: Could not find image at path '{image_path}'")
    except Exception as e:
        print(f"Error: {str(e)}")
