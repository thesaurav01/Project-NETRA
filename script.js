const imageUpload = document.getElementById('imageUpload');

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('models')
]).then(start);
async function start() {
  const labeledFaceDescriptors = await loadLabeledImages();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
  imageUpload.addEventListener('change', async() => {
    image = await faceapi.bufferToImage(imageUpload.files[0]);
    canvas = faceapi.createCanvasFromMedia(image);
    const displaySize = { width:200, height: 200 };
    faceapi.matchDimensions(canvas, displaySize);
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
    const clientDataContainer = document.getElementById('client-data');
clientDataContainer.innerHTML = ''; // clear previous data

results.forEach(async (result, i) => {

  const detectedLabel = result.label;
  const response = await fetch('clients.json');
  const data = await response.json();
  const client = data.find(client => client.name === detectedLabel);
  
  if (client) {
    const clientElement = document.createElement('div');
    clientElement.innerHTML = `
      <h2>Name: ${client.name}</h2>
      <p>Email: ${client.email}</p>
      <p>Age: ${client.Age}</p>
      <p>Location: ${client.location}</p>
    `;
    clientDataContainer.append(clientElement);
  } else {
    const clientElement = document.createElement('div');
    clientElement.innerHTML = ('no missing report');
    clientDataContainer.append("File report");
  }
});

  });
}

async function loadLabeledImages() {
  const response = await fetch('a.json');
  const labels = await response.json();
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`/labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}
