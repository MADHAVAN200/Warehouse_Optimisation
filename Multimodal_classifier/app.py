from pathlib import Path

from flask import Flask, redirect, render_template, request, url_for

from pipeline import ProductAnalysisPipeline


PROJECT_ROOT = Path(__file__).resolve().parent
app = Flask(__name__)
pipeline = ProductAnalysisPipeline(PROJECT_ROOT)


@app.route("/", methods=["GET"])
def index():
    image_paths = pipeline.available_images()
    if not image_paths:
        return render_template(
            "index.html",
            images=[],
            selected_image=None,
            result=None,
            error="No images found in inference_data.",
        )

    selected_name = request.args.get("image", image_paths[0].name)
    selected_path = next(
        (image for image in image_paths if image.name == selected_name),
        image_paths[0],
    )

    result = None
    error = None
    if request.args.get("run") == "1":
        try:
            result = pipeline.analyze_image(selected_path)
        except Exception as exc:
            error = str(exc)

    return render_template(
        "index.html",
        images=[image.name for image in image_paths],
        selected_image=selected_path.name,
        result=result,
        error=error,
    )


@app.route("/analyze", methods=["POST"])
def analyze():
    image_name = request.form["image_name"]
    return redirect(url_for("index", image=image_name, run=1))


if __name__ == "__main__":
    app.run(debug=True)
