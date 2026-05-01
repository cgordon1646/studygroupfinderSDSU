# studygroupfinderSDSU

1. Project Title 
Smart Campus Safety and Emergency Response App 
2. Problem Description 
College campuses are large environments where students may face emergencies such as medical issues, unsafe situations, harassment, or mental health crises. In many cases, students do not know the fastest way to get help or may struggle to access campus safety resources quickly. Existing systems like phone hotlines or alert emails are often not immediate or user-friendly during urgent moments. This problem is important because delayed response time can increase risk and make students feel unsafe. The people most impacted are students, campus staff, and university safety departments who need faster communication and support tools. 
3. Proposed Software Solution 
The proposed solution is a mobile application designed to provide students with quick access to emergency support and campus safety resources. The app would allow users to send an emergency alert, share their real-time location with campus security or trusted contacts, and view nearby resources such as medical centers, counseling offices, or emergency phones. The platform would integrate with existing campus systems but include new development such as interactive maps, personalized safety options, and AI-assisted guidance to help students determine the right type of support. 
4. Technical Components 
Front-End Component: 
Users will interact with a mobile-friendly interface featuring large emergency buttons, a safety resource map, and simple forms for requesting help. The front end could be built using React Native or a responsive web framework for accessibility.
Back-End & Deployment: 
The back end will manage user accounts, emergency alert data, and campus resource information using a database such as Firebase or MongoDB. Deployment and version control could be handled through GitHub, with cloud hosting to ensure reliability. 
Validation & Verification: 
The system will be tested to ensure alerts are delivered correctly, location sharing works accurately, and user authentication is secure. Data validation, error handling, and automated test cases will help confirm the app functions properly under stress. 
UI/UX or AI: 
The app will focus on a clean and simple design for college students, with easy navigation and minimal steps during emergencies. An AI feature could include a basic chatbot assistant that helps users identify whether they need medical, counseling, or security support. 
5. Goal / Impact 
The goal of this project is to improve campus safety by giving students a fast, accessible way to request help and locate emergency resources. This software solution will reduce response time and provide stronger support for students during urgent situations.


In order to launch the app go to the root file and do 
cmake -S . -B build
cmake --build build

---

## Run the app

Use **two terminals**. Needs **Python 3** and **Node.js**.

**Terminal 1 — API**

```powershell
cd apps\api
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 — web**

```powershell
cd apps\web
npm install
npm run dev
```

Open the URL Vite prints. Demo login: `test@sdsu.edu` / `test123`.

**Production web build** (API on another host): `cd apps\web`, then set `VITE_API_BASE_URL` to your API URL and run `npm run build`.

**CMake** (`cmake -S . -B build` then `cmake --build build`): optional; only builds `packages/core` C++, not the web app or API.
