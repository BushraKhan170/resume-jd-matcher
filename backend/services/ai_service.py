import os
import json
import time

from dotenv import load_dotenv
from google import genai

from backend.services.prompt import PROMPT_TEMPLATE

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


def analyze_resume(resume_text: str, job_description: str):

    prompt = PROMPT_TEMPLATE.format(
        resume=resume_text,
        job_description=job_description
    )

    max_retries = 3

    for attempt in range(max_retries):

        try:
            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt,
            )

            result = response.text.strip()

            print("========== GEMINI RESPONSE ==========")
            print(result)
            print("=====================================")

            # Remove markdown formatting
            result = result.replace("```json", "")
            result = result.replace("```", "")
            result = result.strip()

            # Validate JSON
            parsed_result = json.loads(result)

            return parsed_result


        except json.JSONDecodeError:
            print(f"Invalid JSON received. Retry {attempt + 1}/{max_retries}")

            time.sleep(2)

            if attempt == max_retries - 1:
                return {
                    "success": False,
                    "message": "Gemini returned invalid JSON after multiple attempts."
                }


        except Exception as e:
            print("Gemini Error:", e)

            return {
                "success": False,
                "message": "Unable to analyze resume.",
                "details": str(e)
            }