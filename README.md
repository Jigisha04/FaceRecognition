
# NutriVision

NutriVision is an interactive web-based application designed to detect food items using a webcam. It provides users with nutritional information and recipes for the detected food, making it easy to understand and manage dietary choices.

## Features

- **Real-time food detection using webcam input.**
- **Nutritional analysis** of the detected food items.
- **Recipe suggestions** for detected foods to inspire healthy meal ideas.
- **User-friendly web interface** built with Flask.

## Requirements

Ensure that your system meets the following requirements:

- **Python 3.8 or higher**

Install the required dependencies using:

```bash
pip install Flask Flask-WTF opencv-python-headless ultralytics Werkzeug
```

## Installation

Follow these steps to set up and run the NutriVision project:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/NutriVision.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd NutriVision
   ```

3. **Create a virtual environment (optional but recommended):**

   ```bash
   python -m venv venv
   ```

4. **Activate the virtual environment:**

   On Windows:

   ```bash
   venv\Scripts\activate
   ```

   On macOS/Linux:

   ```bash
   source venv/bin/activate
   ```

5. **Install the required packages:**

   ```bash
   pip install -r requirements.txt
   ```

   Alternatively, manually install with:

   ```bash
   pip install Flask Flask-WTF opencv-python-headless ultralytics Werkzeug
   ```

## Running the Application

To start the application, run:

```bash
python flaskapp.py
```

Once the application is running, open your web browser and navigate to:

```plaintext
http://127.0.0.1:5000/
```

## Usage

1. **Launch the application** as instructed above.
2. **Access the web page** and enable your webcam when prompted.
3. The system will detect the food items in real-time and display the nutritional data and recipes.

## Troubleshooting

Verify your installed packages with:

```bash
pip list
```

Ensure all required packages are present. If any issues arise, reinstall or check for version conflicts.

## Contributing

Contributions are welcome! If you'd like to contribute:

1. **Fork the repository.**
2. **Create a feature branch:**

   ```bash
   git checkout -b feature-name
   ```

3. **Commit your changes** and push them to your branch.
4. **Create a pull request** for review.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- **Flask** for providing the web framework.
- **OpenCV** for real-time image processing.
- **Ultralytics** for enabling advanced object detection.

