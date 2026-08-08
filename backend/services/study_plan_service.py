import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_study_plan(query, retrieved_chunks):

    context = "\n\n".join(retrieved_chunks)

    prompt = f"""
You are an AI Study Planner.

Using ONLY the notes below, generate a study plan.

Return ONLY valid JSON.

Format:

{{
    "topic": "",
    "study_plan": [
        {{
            "day": 1,
            "title": "",
            "tasks": []
        }}
    ]
}}

Topic:
{query}

Notes:
{context}
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt,
    )

    result = response.text.strip()

    result = result.replace("```json", "")
    result = result.replace("```", "")

    return json.loads(result)