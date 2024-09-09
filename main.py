import os
import uuid
import logging
import base64
from flask import Flask, request, jsonify, make_response, render_template
from openai import OpenAI
from PIL import Image
from datetime import datetime
from prompts import prompts
import json
import psycopg2
from psycopg2 import sql
import io
import pytz
from datetime import datetime
import re



# Setup
app = Flask(__name__)
DATABASE_URL = os.environ.get('DATABASE_URL')  # Set this in your environment or .env file

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    return conn

# Настройка логгера
log_file = 'app.log'
logging.basicConfig(
    filename=log_file,
    level=logging.DEBUG,  # Используем DEBUG для подробных сообщений
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# OpenAI API Key
open_ai_api_key = os.environ.get('OPENAI_API')
if not open_ai_api_key:
    logger.error("OPENAI_API environment variable not set")
    raise ValueError("OPENAI_API environment variable is required")
client = OpenAI(api_key=open_ai_api_key)

# Helper function to encode image to base64
def encode_image_to_base64(image_data):
    return base64.b64encode(image_data).decode('utf-8')

# Function to receive messages
def receive_message(request):
    data = request.get_json()
    user_id = data.get('user_id')
    user_message = data.get('message')
    session_id = data.get('session_id')
    subject = data.get('subject')
    language = data.get('language')

    if not user_message:
        logger.error("Message not provided in the request")
        return jsonify({"error": "Message is required"}), 400

    logger.info(f"Received user_id: {user_id}")
    return user_id, user_message, subject, session_id, language

# Function to process chat messages
def process_chat_message(user_id, user_message, subject, session_id, language, comment_from_checker=None):
    previous_messages = fetch_previous_messages(user_id, subject, session_id)
    formatted_messages = format_messages(previous_messages, user_id, subject)
    system_prompt = prompts.get(f"system_{subject}")
    example_prompt = prompts.get(f"example_{subject}") if prompts.get(f"example_{subject}") is not None else []
    language_prompt = prompts.get(f"language_{language}") if prompts.get(f"language_{language}") is not None else []

    if not system_prompt:
        return jsonify({"error": "Unsupported subject"}), 400

    messages = [{"role": "system", "content": system_prompt}] + example_prompt + language_prompt + formatted_messages + [{"role": "user", "content": [{"type": "text", "text": user_message}]}]

    k = 0
    while k != 2:
        if comment_from_checker:
            messages.append({"role": "assistant", "content": [{"type": "text", "text": f"Прими комментарий от checker как истину,  ответь с учетом сведений от checker: {comment_from_checker}"}]})

        answer = get_openai_response(messages)
        if k == 1:
            break

        if not answer:
            answer = "Извините, что-то пошло не так."
            break

        double_check_result = double_check_answer(user_id, user_message, subject, session_id, language, answer)
        if double_check_result.get('check') == 1:
            break
        comment_from_checker = double_check_result.get('comment')
        k += 1

    save_messages(user_id, user_message, answer, subject, session_id, language)
    return {"response": answer, "session_id": session_id, "subject": subject, "language": language}


# Function to process image messages
def process_image_message(file_data, user_id, subject, session_id, language, comment_from_checker=None):
    try:
        base64_image = encode_image_to_base64(file_data)
        previous_messages = fetch_previous_messages(user_id, subject, session_id)
        formatted_messages = format_messages(previous_messages, user_id, subject)
        system_prompt = prompts.get(f"system_{subject}")
        example_prompt = prompts.get(f"example_{subject}") if prompts.get(f"example_{subject}") is not None else []
        img_addon_prompt = prompts.get(f"img_addon_{subject}")
        language_prompt = prompts.get(f"language_{language}") if prompts.get(f"language_{language}") is not None else []

        if not system_prompt:
            logger.error(f"System prompt not found for subject: {subject}")
            return {"error": "Unsupported subject"}, 400

        # Формируем сообщение для модели
        messages = [
            {"role": "system", "content": system_prompt}
        ] + example_prompt + language_prompt + formatted_messages + [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": img_addon_prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                ]
            }
        ]

        k = 0
        openai_response = None
        while k != 2:
            if comment_from_checker:
                messages.append({"role": "system", "content": [{"type": "text", "text": f"Please consider the following comment: {comment_from_checker}"}]})

            # Получаем ответ от модели на основе изображений
            openai_response = get_openai_image_response(messages)
            if k == 1 or not openai_response:
                break

            # Проверка ответа на корректность с помощью double_check_answer
            double_check_result = double_check_answer(
                user_id=user_id,
                user_message=messages[-1]['content'][0]['text'],  # передаем последний текстовый контент
                subject=subject,
                session_id=session_id,
                language=language,
                answer=openai_response  # сам ответ от OpenAI
            )

            if double_check_result.get('check') == 1:
                break

            comment_from_checker = double_check_result.get('comment')
            k += 1

        # Сохранение сообщений
        save_messages(user_id, "Image was provided by user", openai_response, subject, session_id, language, file_data)
        return {"response": openai_response, "session_id": session_id, "subject": subject, "language": language}

    except Exception as e:
        logger.error(f"Error during image processing: {e}")
        return {"error": "Internal server error"}, 500



# Function to send back responses
def send_response(response_data):
    response = make_response(jsonify(response_data))
    return response


def assemble_user_messages(user_id, user_message, subject, session_id, language):
    previous_messages = fetch_previous_messages(user_id, subject, session_id)
    formatted_messages = format_messages(previous_messages, user_id, subject)
    example_prompt = prompts.get(f"example_{subject}") if prompts.get(f"example_{subject}") is not None else []
    language_prompt = prompts.get(f"language_{language}") if prompts.get(f"language_{language}") is not None else []

    messages = language_prompt + formatted_messages + [{"role": "user", "content": [{"type": "text", "text": user_message}]}]
    return messages


def find_repeated_expressions(comment: str) -> bool:
    # Регулярное выражение для поиска математических выражений
    pattern = r'[-+*/=()\d\w\s]+'
    expressions = re.findall(pattern, comment)

    # Поиск повторяющихся выражений
    seen = set()
    for expr in expressions:
        expr = expr.strip()
        if expr in seen:
            return True
        seen.add(expr)
    return False


def double_check_answer(user_id, user_message, subject, session_id, language, answer, image_file_data=None):
    try:
        prompt_double_checker = prompts.get("double_check")
        example_conversations = prompts.get("example_conversations_double_check")
        user_messages = assemble_user_messages(user_id, user_message, subject, session_id, language)

        image_content = ""
        if image_file_data:
            base64_image = encode_image_to_base64(image_file_data)
            image_content = {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}

        check_messages = [
            {
                "role": "system",
                "content": f"{prompt_double_checker}. Example conversations for double-checking: {example_conversations}. History of communication: {user_messages}. User answer: {answer}"
            }
        ]

        if image_content:
            check_messages.append({"role": "user", "content": image_content})

        logger.debug(f"check_messages for OpenAI: {json.dumps(check_messages, indent=2)}")

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=check_messages,
            response_format={"type": "json_object"},
            temperature=0.8,
            max_tokens=1700,
            top_p=0.9,
            frequency_penalty=0,
            presence_penalty=0
        )
        content = response.choices[0].message.content
        content_json = json.loads(content)

        check = int(content_json.get('check'))
        comment = content_json.get('comment')

        # Проверка на повторяющиеся выражения
        if find_repeated_expressions(comment):
            check = 0  # Ставим флаг, что ошибка у дабл чекера
            comment = "Обнаружены повторяющиеся фрагменты в комментарии. Возможна ошибка в проверке. Проверьте решение и комментарий вручную. Optimus, не решай за User и не называй правильный ответ."

        print(f"Double-check result: check={check}, comment={comment}")
        return {'check': check, 'comment': comment}

    except Exception as e:
        logger.error(f"Error occurred in double_check_answer: {e}")
        return {'check': 1, 'comment': ''}


        
# Routes
@app.route('/')
def index():
    return render_template('index.html')

from PIL import Image

@app.route('/upload_img', methods=['POST'])
def upload_file():
  try:
      if 'image' not in request.files or request.files['image'].filename == '':
          return jsonify({'error': 'No file selected'}), 400

      file = request.files['image']
      user_id = request.form.get('user_id')
      subject = request.form.get('subject')
      session_id = request.form.get('session_id')
      language = request.form.get('language')
      if not user_id:
          return jsonify({'error': 'User ID is required'}), 400

      img = Image.open(file)
      img_format = 'png'  # Use 'png' for consistency in saving format

      # Save the original image
      img_byte_arr = io.BytesIO()
      img.save(img_byte_arr, format=img_format.upper())
      img_byte_arr = img_byte_arr.getvalue()

      save_messages(user_id, None, None, subject, session_id, language, img_byte_arr)

      # Create a thumbnail for preview
      img.thumbnail((300, 300))  # Resize image for preview
      preview_byte_arr = io.BytesIO()
      img.save(preview_byte_arr, format=img_format.upper())
      preview_byte_arr = preview_byte_arr.getvalue()
      preview_base64 = base64.b64encode(preview_byte_arr).decode('utf-8')
      preview_url = f"data:image/png;base64,{preview_base64}"

      return jsonify({'success': True, 'filename': file.filename, 'preview': preview_url, 'session_id': session_id, 'subject': subject, 'language': language}), 200
  except Exception as e:
      logger.error(f"Error during file upload: {e}")
      return jsonify({'error': 'Internal server error'}), 500


@app.route('/process_image', methods=['POST'])
def process_image_route():
    data = request.get_json()
    filename = data.get('filename')
    user_id = data.get('user_id')
    subject = data.get('subject', 'History')
    session_id = data.get('session_id')
    language = data.get('language')

    if not filename or not user_id or not session_id or not language:
        return jsonify({'error': 'Filename, user ID, session ID, and language are required'}), 400

    img_data = fetch_image(user_id, subject, session_id)
    if not img_data:
        return jsonify({'error': 'Image not found'}), 400

    response_data = process_image_message(img_data, user_id, subject, session_id, language)
    return send_response(response_data)


@app.route('/chat', methods=['POST'])
def chat():
    print("Chat route called")
    user_id, user_message, subject, session_id, language = receive_message(request)
    response_data = process_chat_message(user_id, user_message, subject, session_id, language)
    return send_response(response_data)


@app.route('/clear_chat', methods=['POST'])
def clear_chat():
    # data = request.get_json()
    # user_id = data.get('user_id')
    # subject = data.get('subject')
    # session_id = data.get('session_id')

    # if not user_id or not subject or not session_id:
    #     return '', 400

    # delete_chat_history(user_id, subject, session_id)
    return '', 204


# Helper Functions
def fetch_previous_messages(user_id, subject, session_id):
  conn = get_db_connection()
  cursor = conn.cursor()
  try:
      cursor.execute('''
          SELECT user_message, bot_response, user_img, img_flag 
          FROM optimus_messages
          WHERE user_id = %s AND subject = %s AND session_id = %s
          ORDER BY id DESC LIMIT 10
      ''', (user_id, subject, session_id))
      return cursor.fetchall()
  except psycopg2.Error as e:
      logger.error(f"An error occurred while fetching messages: {e}")
      return []
  finally:
      cursor.close()
      conn.close()


def format_messages(previous_messages, user_id, subject):
  messages = []
  img_addon_prompt = prompts.get(f"img_addon_{subject}")

  for user_msg, bot_resp, user_img, img_flag in reversed(previous_messages):
      if img_flag == 1:
          base64_image = encode_image_to_base64(user_img)
          user_message = {
              "role": "user",
              "content": [
                  {
                      "type": "text",
                      "text": f"{img_addon_prompt}"
                  },
                  {
                      "type": "image_url",
                      "image_url": {
                          "url": f"data:image/jpeg;base64,{base64_image}"
                      }
                  }
              ]
          }
      else:
          user_message = {
              "role": "user",
              "content": [
                  {
                      "type": "text",
                      "text": f"{user_msg}"
                  }
              ]
          }
      messages.append(user_message)

      if bot_resp:
          bot_message = {
              "role": "assistant",
              "content": [
                  {
                      "type": "text",
                      "text": f"{bot_resp}"
                  }
              ]
          }
          messages.append(bot_message)
  return messages


def get_openai_response(messages):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.8,
            max_tokens=1700,
            top_p=0.9,
            frequency_penalty=0,
            presence_penalty=0
        )
        content = response.choices[0].message.content
        content = preprocess_message(content)
        print(f"Assistant's response: {content}") 
        return content
    except Exception as e:
        logger.error(f"An error occurred with OpenAI API request: {e}")
        return None

def get_openai_image_response(messages):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=1000
        )
        content = response.choices[0].message.content
        content = preprocess_message(content)
        return content
    except Exception as e:
        logger.error(f"An error occurred with OpenAI API image request: {e}")
        return "Image recognition failed."

def preprocess_message(text):
    # Replace custom delimiters with standard LaTeX delimiters
    text = text.replace('$begin:math:inline$', '$').replace('$end:math:inline$', '$')
    text = text.replace('$begin:math:display$', '\\[').replace('$end:math:display$', '\\]')
    text = text.replace('\(', '$').replace('\)', '$')
    return text

def save_messages(user_id, user_message, bot_response, subject, session_id, language, img_data=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        utc_now = datetime.now(pytz.utc)
        user_now = utc_now.astimezone(pytz.timezone('Europe/Moscow'))
  
        print(f"Language: {language}")
  
        if img_data:
            cursor.execute('''
                INSERT INTO optimus_messages (user_id, user_message, bot_response, subject, user_img, img_flag, utc_timestamp, user_timestamp, session_id, language)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (user_id, None, bot_response, subject, psycopg2.Binary(img_data), 1, utc_now, user_now, session_id, language))
        else:
            cursor.execute('''
                INSERT INTO optimus_messages (user_id, user_message, bot_response, subject, img_flag, utc_timestamp, user_timestamp, session_id, language)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (user_id, user_message, bot_response, subject, 0, utc_now, user_now, session_id, language))
        conn.commit()
    except psycopg2.Error as e:
        logger.error(f"An error occurred while saving messages: {e}")
    finally:
        cursor.close()
        conn.close()


def fetch_image(user_id, subject, session_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            SELECT id, user_img 
            FROM optimus_messages
            WHERE user_id = %s AND subject = %s AND session_id = %s AND img_flag = 1 AND user_message IS NULL AND bot_response IS NULL
            ORDER BY id DESC LIMIT 1
        ''', (user_id, subject, session_id))
  
        result = cursor.fetchone()
        if result:
            image_id, user_img = result
  
            # Delete the image record after fetching it
            cursor.execute('''
                DELETE FROM optimus_messages
                WHERE id = %s
            ''', (image_id,))
  
            conn.commit()
            return user_img
  
        return None
    except psycopg2.Error as e:
        logger.error(f"An error occurred while fetching the image: {e}")
        return None
    finally:
        cursor.close()
        conn.close()
  


def delete_chat_history(user_id, subject, session_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            DELETE FROM optimus_messages
            WHERE user_id = %s AND subject = %s AND session_id = %s
        ''', (user_id, subject, session_id))
        conn.commit()
    except psycopg2.Error as e:
        logger.error(f"An error occurred while deleting chat history: {e}")
    finally:
        cursor.close()
        conn.close()




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
