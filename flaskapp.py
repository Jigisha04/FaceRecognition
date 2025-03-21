from flask import Flask, render_template, Response, jsonify, request, session
from flask_wtf import FlaskForm
from wtforms import FileField, SubmitField
from werkzeug.utils import secure_filename
from wtforms.validators import InputRequired
import os
import cv2
from YOLO_Video import video_detection

app = Flask(__name__)
app.config['SECRET_KEY'] = 'void'
app.config['UPLOAD_FOLDER'] = 'static/files'

# Set to store unique objects detected in the current session
current_session_objects = set()

class UploadFileForm(FlaskForm):
    file = FileField("File", validators=[InputRequired()])
    submit = SubmitField("Run")

def generate_frames(path_x=''):
    yolo_detection = video_detection(path_x)
    for frame, objects in yolo_detection:
        # Get only the object names without confidence scores
        new_objects = {obj.split(' (')[0] for obj in objects}
        # Find objects that haven't been seen in this session
        unique_new_objects = new_objects - current_session_objects
        if unique_new_objects:
            current_session_objects.update(unique_new_objects)
            
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

def generate_frames_web(path_x):
    yolo_detection = video_detection(path_x)
    for frame, objects in yolo_detection:
        # Get only the object names without confidence scores
        new_objects = {obj.split(' (')[0] for obj in objects}
        # Find objects that haven't been seen in this session
        unique_new_objects = new_objects - current_session_objects
        if unique_new_objects:
            current_session_objects.update(unique_new_objects)
            
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/object_names')
def object_names():
    def generate():
        seen_objects = set()
        while True:
            # Get any new objects that haven't been sent to the client yet
            new_objects = current_session_objects - seen_objects
            if new_objects:
                for obj in new_objects:
                    yield f"data: {obj}\n\n"
                seen_objects.update(new_objects)
            # Small delay to prevent excessive CPU usage
            import time
            time.sleep(0.1)

    return Response(generate(), mimetype='text/event-stream')

@app.route('/', methods=['GET', 'POST'])
@app.route('/home', methods=['GET', 'POST'])
def home():
    session.clear()
    global current_session_objects
    current_session_objects.clear()
    return render_template('indexproject.html')

@app.route("/webcam", methods=['GET', 'POST'])
def webcam():
    session.clear()
    global current_session_objects
    current_session_objects.clear()
    return render_template('livecam.html')

@app.route('/FrontPage', methods=['GET', 'POST'])
def front():
    form = UploadFileForm()
    if form.validate_on_submit():
        file = form.file.data
        file.save(os.path.join(os.path.abspath(os.path.dirname(__file__)), app.config['UPLOAD_FOLDER'],
                              secure_filename(file.filename)))
        session['video_path'] = os.path.join(os.path.abspath(os.path.dirname(__file__)), app.config['UPLOAD_FOLDER'],
                                           secure_filename(file.filename))
    return render_template('recordedvideo.html', form=form)

@app.route('/video')
def video():
    return Response(generate_frames(path_x=session.get('video_path', None)),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/webapp')
def webapp():
    return Response(generate_frames_web(path_x=0),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)