import os
import json
import socket
import hashlib
import uuid
from threading import Thread
import datetime

from flask import Flask
from flask import redirect, request, session, make_response, url_for
from werkzeug import secure_filename

from flask_sqlalchemy import SQLAlchemy
from flask import current_app, render_template
from flask_mail import Mail,Message


def get_host_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    finally:
        s.close()

    return ip


app = Flask(__name__, static_url_path='',
            static_folder=os.environ.get('STATIC_FOLDER') or 'static')

app.config['SESSION_TYPE'] = os.environ.get("SESSION_TYPE") or 'filesystem'
app.config['SECRET_KEY'] = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = \
        os.environ.get('SQLALCHEMY_DATABASE_URI') \
            or 'sqlite:///./rosetta_stone.sqlite3'
db = SQLAlchemy(app)


# app.config['MAIL_SERVER'] = 'smtp.googlemail.com'

# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USE_TLS'] = True

# app.config['MAIL_PORT'] = 465
# app.config['MAIL_USE_SSL'] = True


app.config['MAIL_SERVER'] = 'smtp.live.com'
app.config['MAIL_PORT'] = 25
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

# !!!
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME') \
                              or ''
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD') \
                              or ''
mail = Mail(app)

app.config['ALLOW_EXTENSIONS'] = set(['txt'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOW_EXTENSIONS']

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)


def send_email(to, subject, body):
    app = current_app._get_current_object()
    msg = Message(subject,
                  sender=app.config['MAIL_USERNAME'], recipients=[to])
    msg.body = body
    # msg.html = render_template(template + '.html', **kwargs)
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()
    return thr


def isoformat(time):
    if isinstance(time, datetime.datetime):
        return time.isoformat()
    elif isinstance(time, datetime.timedelta):
        hours = time.seconds // 3600
        minutes = time.seconds % 3600 // 60
        seconds = time.seconds % 3600 % 60
        return 'P%sDT%sH%sM%sS' % (time.days, hours, minutes, seconds)


class User(db.Model):
    email = db.Column(db.Text, primary_key=True)
    password = db.Column(db.Text, nullable=False)
    activecode = db.Column(db.Text, nullable=False, unique=True)
    activity = db.Column(db.Integer, nullable=False)

    def __init__(self, email, password, activecode, activity):
        self.email = email
        self.password = password
        self.activecode = activecode
        self.activity = activity

    def __repr__(self):
        return '<User %>' % self.email


class File(db.Model):
    id = db.Column(db.Text, primary_key=True)
    email = db.Column(db.Text, db.ForeignKey('user.email'))
    name = db.Column(db.Text)
    title = db.Column(db.Text, nullable=False)
    submit_time = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text)
    status = db.Column(db.Text, nullable=False)

    def __init__(self, id, email, name, title, submit_time, content, status):
        self.id = id
        self.email = email
        self.name = name
        self.title = title
        self.submit_time = submit_time
        self. content = content
        self.status = status

    def __repr__(self):
        return '<File %>' % self.id



@app.before_request
def before_request():
    if request.path in ('/file_list.html',
                        '/submit_file.html',
                        '/type_text.html',
                        '/typetext',
                        '/file_info.html',
                        '/changepassword',
                        '/change_password.html',
                        '/upload'):
        if 'email' not in session:
            return redirect('index.html')


@app.route('/upload', methods=['POST'])
def upload():
    if 'POST' == request.method:
        title = request.form.get('title')
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            fileid = str(uuid.uuid1())
            filecontent = str(file.read()).encode(encoding='utf-8')
            submittime = isoformat(datetime.datetime.now())

            # id, email, name, title, submit_time, content, status
            record_file = File(fileid,
                               session['email'],
                               filename,
                               title,
                               submittime,
                               filecontent,
                               'submitted')
            db.session.add(record_file)
            db.session.commit()

            return redirect('file_list.html')


@app.route('/typetext', methods=['POST'])
def typetext():
    if 'POST' == request.method:
        title = request.form.get('title')
        textarea = request.form.get('textarea')

        filename = ""
        fileid = str(uuid.uuid1())
        filecontent = str(textarea.encode(encoding='utf-8'))
        submittime = isoformat(datetime.datetime.now())

        # id, email, name, title, submit_time, content, status
        record_file = File(fileid,
                           session['email'],
                           filename,
                           title,
                           submittime,
                           filecontent,
                           'submitted')
        db.session.add(record_file)
        db.session.commit()

        return redirect('file_list.html')


@app.route('/')
def index():
    if 'email' in session:
        return redirect('file_list.html')
    else:
        return redirect('index.html')


@app.route('/signin', methods=['POST'])
def signin():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        rememberme = request.form.get('remember-me')

        data = {}

        md5 = hashlib.md5(password.encode(encoding='utf-8')).hexdigest()
        user = User.query.filter_by(email=email,
                                    password=md5,
                                    activity=1).first()
        if user:
            session['email'] = email
            data['success'] = True
            data['url'] = 'file_list.html'

            if 'true' == rememberme:
                session.permanent = True
                # app.permanent_session_lifetime = timedelta(hours=1)
            else:
                session.permanent = False
        else:
            data['success'] = False
            data['errmsg'] = 'this user does not exist or incorrect password'

        return json.dumps(data, ensure_ascii=False)


@app.route('/signup', methods=['POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        data = {}

        user = User.query.filter_by(email=email).first()
        if user:
            data['success'] = False
            data['errmsg'] = 'this email has existed'
            return json.dumps(data, ensure_ascii=False)

        password_md5 = hashlib.md5(
            password.encode(encoding='utf-8')).hexdigest()

        activecode = str(uuid.uuid1())  # ?

        user = User(email=email, password=password_md5,
                    activecode=activecode, activity=0)
        db.session.add(user)
        db.session.commit()

        # send activecode to user's email
        email_body = app.config['PROTOCOL'] + \
            '://' + \
            app.config['IP'] + \
            ':' + \
            str(app.config['PORT']) + \
            '/active/' + activecode

        send_email(email, 'Active your account from Rosetta Stone', email_body)
        # print(email_body)

        data['success'] = True
        data['url'] = 'index.html'

        return json.dumps(data, ensure_ascii=False)


@app.route('/active/<activecode>')
def active(activecode):
    user = User.query.filter_by(activecode=activecode,
                                activity=0).first()
    if user:
        user.activity = 1
        db.session.commit()

    return redirect('index.html')


@app.route('/changepassword', methods=['POST'])
def changepassword():
    if request.method == 'POST':
        password = request.form.get('password')
        new_password = request.form.get('new-password')

        data = {}

        md5_password = \
            hashlib.md5(password.encode(encoding='utf-8')).hexdigest()
        user = User.query.filter_by(email=session['email'],
                                    password=md5_password,
                                    activity=1).first()
        if user:
            md5_newpassword = \
                hashlib.md5(new_password.encode(encoding='utf-8')).hexdigest()
            user.password = md5_newpassword
            db.session.commit()

            data['success'] = True
            data['errmsg'] = 'Password has been changed!'
        else:
            data['success'] = False
            data['errmsg'] = 'Change password failed!'

        return json.dumps(data, ensure_ascii=False)


@app.route('/logout')
def logout():
    session.pop('email', None)
    # print(session.get('email'))
    return redirect('index.html')


app.config['PROTOCOL'] = 'http'
app.config['IP'] = get_host_ip()
app.config['PORT'] = 8080
app.run(host=app.config['IP'], port=app.config['PORT'], debug=False)
#app.run(host=ip, port=8443, ssl_context='adhoc', debug=False)

# app.run(host='0.0.0.0', port=8080, debug=False)
# app.run(host='0.0.0.0', port=443, ssl_context='adhoc', debug=False)
# app.run(host='192.168.1.6', port=8080, debug=False)
