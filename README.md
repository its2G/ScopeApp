
# 📸 Location-Based Photography Social App

## 🧭 About the Project

This is a mobile social media app that combines photography, geolocation, and swiping interactions. Users can take photos only within specific geographic areas and then interact with each other's content through a like/dislike swipe engine. The app is designed to create a dynamic, place-based photo-sharing experience where engagement is tied to location.

This app was built using:
- **React Native** (with Expo)
- **Supabase** for backend storage, auth, and database
- **Vision Camera API** for capturing high-quality photos
- **REST API** for handling custom server communication

---

## 🚀 Features

- **Geofenced Camera Access**: Users can only open the camera in predefined regions.
- **Swipe Engine**: Like/Dislike photos similar to Tinder, specific to location.
- **Photo Storage & Retrieval**: Photos are uploaded to Supabase and retrieved based on location.
- **User Authentication**: Sign-up and login via Supabase with unique profiles.
- **Interactive Map**: Users see where photos were taken, tap markers to see regional content.
- **Leaderboard (Planned)**: Most-liked photos and photographers get promoted in-app.
- **Offline Storage Exploration**: Future plans to use an external PC as a dedicated storage server.

---

## 📅 Development Log

> A timeline of major development milestones:

- **12/06/2024** – Project started at 16:05. Set up React Native with Expo and began using Supabase for backend. Planned future support for self-hosted photo storage.
- **27/03/2025** – Added `fetch` POST requests to send photos to server using RNFS to handle local file paths created by VisionCamera.
- **05/04/2025** – Swipe Engine development began, fetching image URLs from Supabase for user interaction.
- **09/04/2025** – Swipe Engine working. Began logic to prevent duplicate swipe experiences for same user.
- **16/04/2025** – Added photo IDs for better tracking. Working on tying swipes to users via a new Supabase User table.
- **21/04/2025** – Implemented user authentication (sign up/login). Each user’s data and photos are now stored uniquely.
- **25/04/2025** – Major improvements to `MapScreen`. Markers are now clickable to reveal photos taken in that region. Added conditionally visible "Swipe" button if user is within a geofenced region.
- **27/04/2025** – Improved navigation across screens. Replaced swipe gestures with buttons. Successfully used EAS Build and prepared iOS beta build for TestFlight.

---

## 📷 Final Year Project

This app was developed as a **final year university project**, exploring mobile UX, social interactions, and geolocation APIs in mobile development.

---

## 🛠️ Technologies

| Tech         | Usage                                   |
|--------------|------------------------------------------|
| React Native | Core mobile app framework                |
| Supabase     | Backend-as-a-service (auth, DB, storage) |
| VisionCamera | High-perf camera integration             |
| RNFS         | Accessing and moving local photo files   |
| Fetch API    | Client-server communication              |
| EAS Build    | App distribution for iOS TestFlight      |

---

## ✅ Completed Milestones

- ✅ Integrated a local storage server for offline media archiving
- ✅ Developed and deployed a dynamic leaderboard system based on user likes
- ✅ Implemented swipe logic to filter out previously seen photos per user
- ✅ Successfully ran beta testing via TestFlight for iOS

---

## 🧪 User Feedback & Opportunities for Improvement

Real-world testing during the public exhibition surfaced valuable insights for refining the user experience:

- 🔄 **Onboarding Clarity**: Some users found the login and registration flow unclear. Future iterations will streamline navigation and provide contextual cues for a smoother start.
- 📧 **Email Verification**: A few users experienced minor delays in receiving verification emails. Improving backend reliability and messaging will help reduce friction.
- 🧭 **In-App Guidance**: Users appreciated hands-on explanations, highlighting the need for built-in onboarding or tooltips to guide first-time users independently.
- 📱 **Public Display Context**: At the exhibition, some visitors misunderstood the projected gallery as the full experience. Enhancing signage and in-app prompts will align expectations better.
- 📤 **Android Beta Access**: Manual email-based beta access for Android created slight delays. Future versions will explore easier distribution methods for wider access.
- 🛠️ **App Store Preparation**: Preparing the app for full release uncovered typical platform requirements (e.g., content classification and child safety policies), which are now being addressed.


---

## 📎 License

This project is currently not under an open-source license. Contributions or collaborations welcome after beta phase.

<img width="207" height="448" alt="ScreenShot1" src="https://github.com/user-attachments/assets/98558cd0-3539-4742-8ede-317a8d63da01" />
<img width="207" height="448" alt="ScreenShot2" src="https://github.com/user-attachments/assets/23ec4dca-a621-48f8-b128-f8984dc7597f" />
<img width="207" height="448" alt="ScreenShot3" src="https://github.com/user-attachments/assets/988147d0-cd93-47a9-a75e-1fd8b480910e" />
<img width="207" height="448" alt="ScreenShot4" src="https://github.com/user-attachments/assets/fe55c741-acef-46ba-a176-98fc0507025b" />


## 🗄️ Supabase Integration

Below are some screenshots showing the backend structure used in this project.

### Database Structure
<img width="1538" height="748" alt="supabase-schema-gasujtndtzfkqilxmibz" src="https://github.com/user-attachments/assets/11470eac-371d-4c46-8a96-1392b393203e" />

### Regions Table 
<img width="1107" height="430" alt="regionstable" src="https://github.com/user-attachments/assets/5b65b3ce-0e43-441f-a12f-52f733a55502" />
