const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/find', (req, res) => {
    res.render('find');
});

app.get('/home', (req, res) => {
    res.render('index');
});

app.get('/dash', (req, res) => {
    res.redirect('http://127.0.0.1:5500/index.html');
});



// app.post('/Addhar', (req, res) => {
//   const data = req.body;
//   const last4Digits = data.Addhar.slice(-4);
//   // read existing data from JSON file
//   fs.readFile('clients.json', (err, jsonData) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error reading client data');
//     } else {
//       // parse data into array of objects
//       let clients = JSON.parse(jsonData);

//       // make sure clients is an array
//       if (!Array.isArray(clients)) {
//         clients = [];
//       }

//       // create new data object
//       const newClient = { 
//         addhar: data.Addhar,
//         last4Digits:last4Digits
//        };

//       // add new data to array
//       clients.push(newClient);

//       // write updated array to JSON file
//       fs.writeFile('clients.json', JSON.stringify(clients), (err) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send('Error saving Aadhaar data');
//         } else {
//           res.status(200).send('Aadhaar data saved successfully');
//         }
//       });
//     }
//   });


// });


app.post('/report', (req, res) => {
    const data = req.body;
    const name = data.name;
    // Add last4Digits to the JSON file
    fs.readFile('a.json', (err, jsonData) => {
        if (err) {
            console.error(err);
        } else {
            let name = JSON.parse(jsonData);

            // Make sure last4DigitsArray is an array
            if (!Array.isArray(name)) {
                name = [];
            }

            // Add new last4digit to the array
            const newname = data.name;
            name.push(newname);

            // Write updated array to JSON file
            fs.writeFile('a.json', JSON.stringify(name), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('New last4digit added to a.json file');
                }
            });
        }
    });

    fs.readFile('clients.json', (err, jsonData) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading client data');
        } else {
            let clients = JSON.parse(jsonData);

            // Make sure clients is an array
            if (!Array.isArray(clients)) {
                clients = [];
            }

            // Create a new client object
            const newClient = {
                name: data.name,
                Age: data.age,
                email: data.email,
                addhar: data.addhar,
                location: data.city
            };

            // Add the new client to the clients array
            clients.push(newClient);

            // Write updated array to clients.json
            fs.writeFile('clients.json', JSON.stringify(clients), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error saving client data');
                } else {
                    console.log('New client added to clients.json file');
                    res.redirect('/');
                }
            });
        }
    });


});


// const upload = multer({ dest: 'uploads/' });

// app.post('/save-image', upload.single('im1'), (req, res) => {
//   const image = req.body.im1;

//   if (!image) {
//     res.status(400).send('No image file uploaded');
//     return;
//   }

//   // Check if the uploaded file is in the correct format (JPG)
//   if (image.mimetype !== 'image/jpeg') {
//     res.status(400).send('Invalid image format');
//     return;
//   }

//   const dirName = req.body.Addhar;

//   // Create a new directory with the specified name
//   const dirPath = path.join(__dirname, `/labeled_images/${dirName}`);
//   fs.mkdir(dirPath, { recursive: true }, (err) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error creating directory');
//     } else {
//       // Move the uploaded file to the new directory
//       const imagePath = path.join(dirPath, 'image.jpg');
//       fs.rename(image.path, imagePath, (err) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send('Error saving image');
//         } else {
//           res.send('Image saved successfully');
//         }
//       });
//     }
//   });
// });


app.listen(3000, () => {
    console.log('Server started on port 3000');
});