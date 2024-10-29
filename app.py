from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# 假设你的通讯录数据以字典形式存储
contacts = {}

@app.route('/')
def index():
    return render_template('index.html', contacts=contacts)

@app.route('/add', methods=['POST'])
def add_contact():
    name = request.form['name']
    phone = request.form['phone']
    contacts[name] = phone
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
@app.route('/delete', methods=['POST'])
def delete_contact():
    name = request.form['name']
    if name in contacts:
        del contacts[name]  # 从字典中删除联系人
    return redirect(url_for('index'))