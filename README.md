# 🌱 SproutCircle

**SproutCircle** is a teacher‑parent communication platform designed for improved engagement in a child’s day-to-day learning and developmental activities. Teachers or admins can update timetables, educational games, location info, gallery images, and interact via an AI chatbot.

---

## 🚀 Features

- 📅 **Timetable** – Weekly schedule, viewable by parents.
- 🎮 **Games** – Display and assignment of educational or fun games.
- 📍 **Child Location** – Real‑time or last known position inside campus or mapped area.
- 🖼️ **Gallery** – Classroom activity media uploads and display.
- 🤖 **AI Chatbot** – Instant conversational aid for parents.
- 🧑‍🏫 **Admin Console** – Teachers and admins upload/manage content.

---
## 📸 Preview

![Screenshot 2025-06-23 152005](https://github.com/user-attachments/assets/f4eab620-a6d3-4644-a520-f76982a83401)

![Screenshot 2025-06-23 152022](https://github.com/user-attachments/assets/b8e3866e-9991-4bcb-98e4-c25e0784ce43)

![Screenshot 2025-06-23 152035](https://github.com/user-attachments/assets/8fee9615-1359-49d8-826d-500a7b18e989)

![Screenshot 2025-06-23 152045](https://github.com/user-attachments/assets/680564f7-794c-4bb8-93a8-11aae5fc9097)





## 🛠️ Tech Stack

- **Frontend / Backend**: Next.js 15 (App Router) + Tailwind CSS
- **Authentication**: NextAuth.js (supports teacher/admin/parent roles)
- **Database**: MongoDB (hosted)
- **Image Storage**: Pinata (IPFS-based)
- **AI Bot**: Integrated OpenAI API
- **Deployment**: Vercel / custom host

---

## 📁 Repository Structure

Based on the repo you provided ([@VampKunal/sproutcircle](https://github.com/VampKunal/sproutcircle)):


---

## 🔐 Roles & Permissions

- **Teacher/Admin**
  - Full CRUD access: games, timetable, location data, gallery uploads.
  - Communicate via chatbot console.
- **Parent**
  - View-only access for all modules.
  - Chat with the AI chatbot.

---

## 🧑‍💻 Quick Start

1. **Clone repo**
   ```bash
   git clone https://github.com/VampKunal/sproutcircle.git
   cd sproutcircle
   
2.Install dependencies
    
      npm install


3.Environment Variables
    

    MONGODB_URI=..

    //NextAuth Secret - Generate a good secret with `openssl rand -base64 32`
    NEXTAUTH_SECRET= ..
    NEXTAUTH_URL=..
    OPENAI_API_KEY=..
    
    PINATA_API_KEY..
    PINATA_API_SECRET=..
    PINATA_JWT=...

 
4.Run project

    npm run dev
    
Access The App

Admin/Teacher: http://localhost:3000/login

Parent: After invite/login

🔮 Roadmap & Next Steps
🛎️ Push notifications for key updates.

📊 Analytics: view usage stats, parent logins, etc.

🗺️ Improved map UI for location tracking.

👥 Multi-language UI support.

🌐 Progressive Web App support (offline-first usage).

🤝 Contributing
Contributions welcome! Feel free to:

Fork the repo

Create feature branches

Submit PRs and issues

Add tests/documentation as needed

📜 License
Licensed under MIT.

✨ Credits
Built by Kunal Rai (VampKunal), with ❤️ using Next.js, NextAuth, MongoDB, Pinata, and OpenAI.

Feel free to adjust anything—let me know if you'd like to include Firestore-to-Mongo migration notes, deployment examples, Postman collections, or overall diagrams!













