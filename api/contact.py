from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

app = Flask(__name__)

def add_cors(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    return response

@app.route('/api/contact', methods=['POST', 'OPTIONS'])
def contact():
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return add_cors(jsonify({}))
    
    try:
        data = request.get_json()
        
        if not data:
            return add_cors(jsonify({'error': 'No data provided'})), 400
        
        # Get form data
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        school = data.get('school', '').strip()
        interest = data.get('interest', '').strip()
        message = data.get('message', '').strip()
        
        # Validate required fields
        if not name or not email or not message:
            return add_cors(jsonify({'error': 'Name, email, and message are required'})), 400
        
        # Gmail SMTP credentials
        gmail_user = os.environ.get('GMAIL_USER', 'lsistreamai@gmail.com')
        gmail_password = os.environ.get('GMAIL_APP_PASSWORD', '')
        
        if not gmail_password:
            print("ERROR: GMAIL_APP_PASSWORD not set in environment")
            return add_cors(jsonify({'error': 'Email service not configured. Please contact us directly at info@lsistream.ai'})), 500
        
        # Create email
        msg = MIMEMultipart()
        msg['From'] = gmail_user
        msg['To'] = gmail_user
        msg['Reply-To'] = email
        msg['Subject'] = f"[LSI Website Contact] {name}"
        
        interest_labels = {
            'platform': 'LSI AI Platform',
            'cypress': 'Cypress Student Companion',
            'vispace': 'Vispace Metaverse Learning',
            'courses': 'Courses & Training',
            'partnership': 'Partnership Opportunities',
            'other': 'Other'
        }
        
        body = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW CONTACT FORM SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: {name}
Email: {email}
School/Organization: {school or 'Not provided'}
Interest: {interest_labels.get(interest, interest) or 'Not specified'}

Message:
{message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reply directly to: {email}
"""
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Send email via Gmail SMTP
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(gmail_user, gmail_password)
            server.send_message(msg)
        
        print(f"Email sent successfully from {email}")
        return add_cors(jsonify({
            'success': True, 
            'message': 'Your message has been sent successfully!'
        }))
        
    except smtplib.SMTPAuthenticationError:
        print("SMTP Authentication Error")
        return add_cors(jsonify({'error': 'Email service authentication failed'})), 500
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return add_cors(jsonify({'error': f'Failed to send message: {str(e)}'})), 500

# For Vercel serverless
handler = app
