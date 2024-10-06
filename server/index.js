const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');

const path = require('path');
const fs = require('fs');

const UserModel = require('./models/Data');
const TemplateModel = require('./models/Template');
const Resume = require('./models/Design');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://localhost:27017/Resume');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "secret123", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


//design data save
app.post('/resume', upload.single('profileImage'),authenticateToken, (req, res) => {
  console.log(req.body);
  console.log(req.file);  
  const resumeData = {
    fullname: req.body.fullname,
    professionalTitle: req.body.professionalTitle,
    personalDescription: req.body.personalDescription,
    refererName: req.body.refererName, 
    refererRole: req.body.refererRole,
    address: req.body.address,
    mobile: req.body.mobile,
    email: req.body.email,
    website: req.body.website,
    education: JSON.parse(req.body.education), 
    experiences: JSON.parse(req.body.experiences),
    skills: JSON.parse(req.body.skills),
    image: req.file ? req.file.filename : '' ,
    userId: req.user.id, 
  };

  Resume.create(resumeData)
    .then((savedResume) => {
      res.status(201).json({ message: 'Resume saved successfully', data: savedResume });
    })
    .catch((error) => {
      res.status(400).json({ message: 'Error saving resume', error: error.message });
    });
});

app.get('/resume', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// admin side
// select n upload on left side
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ filePath: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` });
});

// delete image on left side
app.delete('/delete-image', (req, res) => {
  const { imagePath } = req.body;
  if (!imagePath) {
    return res.status(400).json({ message: 'Image path is required' });
  }

  const filePath = path.join(__dirname, 'uploads', path.basename(imagePath));

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting file', error: err });
    }
    res.json({ message: 'File deleted successfully' });
  });
});

// create template in admin
app.post('/save-template', (req, res) => {
  TemplateModel.create(req.body)
    .then((template) => res.json(template))
    .catch((error) => res.status(500).json({ message: 'Error saving template', error: error.message }));
});

// show  all template in admin on right side
app.get('/templates', (req, res) => {
  TemplateModel.find({})
    .then((templates) => res.json(templates))
    .catch((error) => res.status(500).json({ message: 'Error fetching templates', error: error.message }));
});

// delete template in admin  on right side
app.delete('/templates/:id', (req, res) => {
  const { id } = req.params;
  TemplateModel.findByIdAndDelete(id)
    .then((template) => res.json(template))
    .catch((error) => res.status(500).json({ message: 'Error deleting template', error: error.message }));
});


// Register and signup
app.post("/signup", async (req, res) => {
  const encPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = encPassword;
  await UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err))
});

app.post('/login', (req, res) => {
  UserModel.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return bcrypt.compare(req.body.password, user.password)
        .then(isPasswordValid => {
          if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
          }
          const token = jwt.sign({ id: user._id, email: user.email }, "secret123");
          res.json({ token });
        });
    })
    .catch(err => res.json(err))
});

app.post('/admin', async (req, res) => {
  const { email, password } = req.body;
  const admin = await UserModel.findOne({ email });
  console.log("Entering")
  res.status(200).json({'message': 'This is a message'});
});

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
