<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



# LOVE404 


## Basic Details
### Team Name:HackHive


### Team Members
- Team Lead: Neha Arun - Toc H Institute of Science and Technology
- Member 2: Vaisakh Ajithan - Toc H Institute of Science and Technology

### Project Description
Love404 is a fun, browser-based AI Breakup Predictor that uses image
recognition to understand what has been uploaded and then generates a
completely questionable prediction based on the detected context.

Upload a couple photo, individual subject photos, fruits, animals, food,
vehicles, or other recognizable objects. The application automatically
detects the context using AI and generates humorous, context-specific
results. The prediction itself is intentionally fake and exists purely
for entertainment.

### The Problem (that doesn't exist)
Relationships are complicated.

People spend hours wondering:

"Are we actually compatible?"

"Why did they reply with 'K'?"

"Who is going to cause the next argument?"

"Is this relationship going to survive?"

Unfortunately, nobody has invented a completely unnecessary machine that
can answer these questions from a random photograph.

So we decided to solve this extremely important problem that nobody
asked us to solve.

### The Solution (that nobody asked for)
Love404 takes an uploaded image and lets AI figure out what is actually
in it.

If it detects two people, it generates a ridiculous relationship/breakup
prediction.

If it detects animals, fruits, food, vehicles, or other subjects, the
application automatically switches to a matching context and generates
equally questionable results.

For example:

👤 + 👤 → Relationship / Breakup Analysis

🍎 + 🍎 → Fruit Compatibility

🐶 + 🐱 → Animal Compatibility

🍕 + 🍔 → Food Compatibility

🚗 + 🏍️ → Vehicle Compatibility

The image recognition is real, but the prediction is deliberately fake.

Real AI detection + fake AI opinions = Love404.
https://useless-project-temp-tawny.vercel.app/

## Technical Details
### Technologies/Components Used
For Software:
- Languages used : JavaScript - HTML - CSS
- Frameworks - React - Vite
- Libraries / AI - TensorFlow.js - COCO-SSD / browser-based object detection - React hooks and browser APIs
- Tools used - Kiro - Visual Studio Code - Git - GitHub - Vercel - Chrome / modern web browsers


### Implementation
For Software:
# Installation
Installation

Clone the repository:

git clone <YOUR_GITHUB_REPOSITORY_URL>

Navigate into the project:

cd Love404

Install dependencies:

npm install

# Run
Start the development server:

npm run dev

### Project Documentation
For Software:
How the Application Works

Love404 follows a simple browser-based pipeline:

User
  ↓
Upload Image
  ↓
Browser-Side AI Image Detection
  ↓
Identify People / Objects / Context
  ↓
Validate Uploaded Subjects
  ↓
Select Context-Specific Analysis
  ↓
Generate Fake Random Metrics
  ↓
Display Humorous Results
  ↓
Generate Full Report
  ↓
Share / Download Results

Image Analysis

The application does not ask the user to manually select what is present
in the image.

Instead, the uploaded image is processed by the browser-side image
recognition model.

The application can identify supported objects and group them into
contexts such as:

Human

Animal

Fruit

Food

Vehicle

Nature / Plant

Object

Unknown

Human Validation

For couple-photo mode:

Exactly 2 people → valid relationship analysis

Exactly 1 person → error asking for both people

3 or more people → error because the relationship has become a
group project

No people → the application checks whether another supported
context can be identified

For individual upload mode:

Each image is analyzed separately

Each subject is automatically identified

Matching contexts are allowed

Different contexts produce a humorous context-mismatch message

Fake Prediction Engine

After the image context is identified, the application generates
fictional metrics.

For human relationship analysis, examples include:

Relationship Strength

Breakup Probability

Drama Potential

Ghosting Risk

Vibe Compatibility

Communication Score

These values are intentionally generated for entertainment and have no
scientific or psychological validity.

# Screenshots (Add at least 3)
![https://github.com/vaisakh18/useless_project_temp/blob/main/Screenshot%202026-09-12%20102823.png] (Home Page)

![https://github.com/vaisakh18/useless_project_temp/blob/main/Screenshot%202026-09-12%20102846.png] (Upload Photo)

![https://github.com/vaisakh18/useless_project_temp/blob/main/Screenshot%202026-09-12%20102951.png] (Result)

# Diagrams
![https://github.com/vaisakh18/useless_project_temp/blob/main/ChatGPT%20Image%20Sep%2012%2C%202026%2C%2010_44_52%20AM.png] 
The architecture of Love404 illustrates the complete flow of the application, from image upload to the generation and sharing of context-aware results. Users upload a couple photo or individual subject images through the React + Vite frontend. The images are analyzed directly in the browser using TensorFlow.js and COCO-SSD to detect people and other objects and determine the appropriate context, such as human, fruit, animal, food, vehicle, or object. The detected context is then validated before being passed to the fake prediction engine, which generates humorous random scores and context-specific comments. Finally, the results are displayed through the results dashboard, with options to generate, download, copy, print, and share the full report. All image processing is performed client-side without uploading images to a backend server.


### Project Demo
# Video
[https://drive.google.com/file/d/1c5MlDwvp9wMiG3b9Qgvj4I3h6FCgiYiG/view?usp=drivesdk]
The demo video demonstrates image upload, automatic AI detection,validation, context-aware analysis, results, full report generation, andsharing/download functionality.


## Team Contributions
- [Neha Arun]: [Project concept, React/Vite application development, UI/UX design, image-analysis integration, result-generation logic, and deployment.]
- [Vaisakh Ajithan]: [AI image detection, context classification, validation logic, and testing,Animations, responsive design, report generation, documentation, testing, and presentation.]

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)



