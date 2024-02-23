import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS,cross_origin
import requests
import json
import time
import boto3
from dotenv import load_dotenv

app = Flask(__name__)



CORS(app, resources={
    r"/*"
})
app.config['CORS_HEADERS'] = 'Content-Type'



# Load environment variables from .env file
load_dotenv()

# Set your API key and S3 bucket name
api_key = os.environ.get("LEOAI_API_KEY")
S3_BUCKET_NAME = 'bucketforadgen'

# Set Leonardo.AI API and S3 endpoint URLs
url_init_image = "https://cloud.leonardo.ai/api/rest/v1/init-image"
url_generations = "https://cloud.leonardo.ai/api/rest/v1/generations"

# Set model ID for Leonardo Creative
model_id = "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3"

# Set up the S3 client
s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    
)
region=os.environ.get("AWS_DEFAULT_REGION")
# Set Leonardo.AI headers with API key
headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": f"Bearer {api_key}"
}





@app.route("/")
@cross_origin()
def read_root():
    return render_template("index.html")



def download_image(url):
    response = requests.get(url)
    response.raise_for_status()  # Check for HTTP errors
    return response.content

def generate_image_links(generated_image_urls):
    for idx, image_url in enumerate(generated_image_urls):
        print(f"Open Image {idx + 1}: {image_url}")

def upload_to_s3(image_bytes, user_prompt):
    try:
        # Replace spaces with underscores in the product name
        user_prompt_cleaned = user_prompt.replace(" ", "_")

        # Set S3 key based on cleaned product name
        s3_key = f"{user_prompt_cleaned}_ad_poster.png"

        # Upload the image to S3 with the correct content type
        s3.put_object(Body=image_bytes, Bucket=S3_BUCKET_NAME, Key=s3_key, ContentType="image/jpg")

        s3_public_url = f'https://{S3_BUCKET_NAME}.s3.amazonaws.com/{s3_key}'
        return s3_public_url
    
    except Exception as e:
        print(f"Error uploading to S3: {e}")
        return None

 
@app.route("/generate-imgtoimg/", methods=["POST"])
@cross_origin(allow_headers=['Content-Type'])
def generate_images():
    try:

        image_url  = request.json.get("image_url")
        user_prompt = request.json.get("user_prompt")
        
        # Download the image from the URL
        image_bytes = download_image(image_url)

        # Get a presigned URL for uploading an image
        payload_init_image = {"extension": "png"}
        response_init_image = requests.post(url_init_image, json=payload_init_image, headers=headers)
        response_init_image.raise_for_status()  # Check for HTTP errors

        # Upload image via presigned URL
        fields = response_init_image.json().get('uploadInitImage', {}).get('fields', {})
        fields = json.loads(fields) if isinstance(fields, str) else fields  # Ensure fields is a dictionary
        url_upload_image = response_init_image.json().get('uploadInitImage', {}).get('url', '')
        image_id = response_init_image.json().get('uploadInitImage', {}).get('id', '')

        # Modified line for the files parameter
        response_upload = requests.post(url_upload_image, files={'file': ('image.png', image_bytes)}, data=fields)
        response_upload.raise_for_status()  # Check for HTTP errors

        # # Check content type of the upload response
        # content_type_upload = response_upload.headers.get('Content-Type', 'image/png')

        # Generate with an image prompt
        payload_generations = {
            "height": 512,
            "modelId": model_id,
            "prompt": user_prompt,
            "width": 512,
            "imagePrompts": [image_id]
        }

        response_generate = requests.post(url_generations, json=payload_generations, headers=headers)
        response_generate.raise_for_status()  

        # Get the generation of images
        generation_id = response_generate.json().get('sdGenerationJob', {}).get('generationId', '')
        url_generation_result = f"https://cloud.leonardo.ai/api/rest/v1/generations/{generation_id}"

        # Implement webhook callback or polling instead of sleep
        # For simplicity, using sleep here
        time.sleep(20)

        response_result = requests.get(url_generation_result, headers=headers)
        response_result.raise_for_status()  # Check for HTTP errors

        # Upload the ad poster to S3 with the correct content type
        s3_public_url = upload_to_s3(response_result.content, user_prompt)

 # Upload generated images to S3
        generated_images = response_result.json().get("generations_by_pk", {}).get("generated_images", [])
        generated_image_urls = []
        for idx, image_info in enumerate(generated_images):
            image_url = image_info.get("url", "")
            image_bytes = download_image(image_url)
            generated_image_urls.append(upload_to_s3(image_bytes, f"{user_prompt}generated{idx}"))

        # Print image URLs in the console
        generate_image_links(generated_image_urls)

        return jsonify({"objects": generated_image_urls})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)