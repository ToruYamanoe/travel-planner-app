import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# OpenRouter用設定
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

def generate_plan(form_data: dict) -> str:
    prompt = f"""
    あなたはプロの旅行プランナーです。
    以下の条件で旅行プランをJSON形式で生成してください：

    - 出発地: {form_data['departure']}
    - 目的地: {form_data['destination']}
    - 日数: {form_data['days']}日
    - 出発日: {form_data['startDate']}
    - 人数: {form_data['people']}
    - 予算: {form_data['budget']}円
    - ホテル: {form_data.get('hotelName', '未予約') or "未予約"}
    - 移動手段: {"車" if form_data['hasCar'] else "公共交通機関"}
    - 希望する旅行スタイル: {"ゆったり" if form_data['relaxingTrip'] else "観光重視"}
    - 配慮事項: {form_data['considerations']}

    出力は次の形式でお願いします（JSON）：
    {{
      "days": [
        {{
          "date": "YYYY-MM-DD",
          "spots": [
            {{
              "time": "10:00",
              "name": "スポット名",
              "description": "概要説明"
            }}
          ]
        }}
      ]
    }}
    """

    print("📤 ChatGPTへ送信中...")
    res = client.chat.completions.create(
        model="mistralai/mistral-7b-instruct",  # OpenRouter経由のモデル名
        messages=[{"role": "user", "content": prompt}],
        temperature=0.8
    )

    return res.choices[0].message.content

if __name__ == '__main__':
    import sys
    import json

    form_data = json.loads(sys.argv[1])
    plan = generate_plan(form_data)

    print(plan, flush=True)