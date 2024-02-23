import requests

# Payload data

payload = {
   "image_url":"https://bucketforadgen.s3.ap-south-1.amazonaws.com/macbook_air_ad_poster.png",
   "user_prompt":"Make the hairstyle curly"
}


# API endpoint URL
url = "http://imgtoimg.pythonanywhere.com/generate-imgtoimg/"

# Making a POST request
response = requests.post(url, json=payload)

# Checking the response
if response.status_code == 200:
    output = response.json()
    print(output)
else:
    print(f"Error: {response.status_code}, {response.text}")