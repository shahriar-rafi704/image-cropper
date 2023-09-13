const fileInput = document.getElementById("file");
const image = document.getElementById("image");
const downloadButton = document.getElementById("download");
const aspectRatioButtons = document.querySelectorAll(".aspect-ratio-button");
const previewButton = document.getElementById("preview");
const previewImage = document.getElementById("preview-image");
const options = document.querySelector(".options");
const widthInput = document.getElementById("width-input");
const heightInput = document.getElementById("height-input");
const rotateClockwiseButton = document.getElementById("rotateClockwise");

// Initialize Cropper instance
let cropper = null;
let fileName = "";

// Function to reset the UI
function resetUI() {
  previewImage.src = "";
  heightInput.value = 0;
  widthInput.value = 0;
  downloadButton.classList.add("hide");
  if (cropper) {
    cropper.destroy();
  }
  options.classList.add("hide");
  previewButton.classList.add("hide");
}

// Event listener for file input change
fileInput.addEventListener("change", () => {
  resetUI();

  // FileReader to read the selected file
  const reader = new FileReader();
  reader.readAsDataURL(fileInput.files[0]);

  reader.onload = () => {
    image.setAttribute("src", reader.result);
    cropper = new Cropper(image);
    options.classList.remove("hide");
    previewButton.classList.remove("hide");
  };

  fileName = fileInput.files[0].name.split(".")[0];
});

// Event listener for aspect ratio buttons
aspectRatioButtons.forEach((element) => {
  element.addEventListener("click", () => {
    if (element.innerText === "Free") {
      cropper.setAspectRatio(NaN);
    } else {
      cropper.setAspectRatio(eval(element.innerText.replace(":", "/")));
    }
  });
});

// Event listener for height input
heightInput.addEventListener("input", () => {
  const { height } = cropper.getImageData();
  let newHeight = parseInt(heightInput.value);
  
  if (newHeight > Math.round(height)) {
    newHeight = Math.round(height);
    heightInput.value = newHeight;
  }

  cropper.setCropBoxData({ height: newHeight });
});

// Event listener for width input
widthInput.addEventListener("input", () => {
  const { width } = cropper.getImageData();
  let newWidth = parseInt(widthInput.value);

  if (newWidth > Math.round(width)) {
    newWidth = Math.round(width);
    widthInput.value = newWidth;
  }

  cropper.setCropBoxData({ width: newWidth });
});

// Event listener for rotating the image clockwise
rotateClockwiseButton.addEventListener("click", () => {
  if (cropper) {
    cropper.rotate(90); 
  }
});

previewButton.addEventListener("click", (e) => {
  e.preventDefault();
  downloadButton.classList.remove("hide");
  const imgSrc = cropper.getCroppedCanvas({}).toDataURL();
  previewImage.src = imgSrc;
  downloadButton.download = `cropped_${fileName}.png`;
  downloadButton.setAttribute("href", imgSrc);
});

window.onload = () => {
  resetUI();
};