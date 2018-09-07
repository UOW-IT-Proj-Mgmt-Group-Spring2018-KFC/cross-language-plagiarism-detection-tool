from flask import Flask
from flask import redirect
import socket


def get_host_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    finally:
        s.close()

    return ip


app = Flask(__name__, static_url_path='', static_folder='static')


@app.route('/')
def index():
    return redirect('index.html')


ip = get_host_ip()
print(ip)
app.run(host=ip, port=8080, debug=False)
# app.run(host='0.0.0.0', port=8080, debug=False)
# app.run(host='0.0.0.0', port=443, ssl_context='adhoc', debug=False)
# app.run(host='192.168.1.6', port=8080, debug=False)
