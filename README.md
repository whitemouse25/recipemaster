# RecipeMaster

A modern web application for discovering, creating, and managing your favorite recipes. Built with React and Firebase.

## Features

- 🔍 Search recipes from TheMealDB API
- 👤 User authentication with email/password and Google sign-in
- 📝 Create and manage your own recipes
- ❤️ Save favorite recipes
- 📱 Responsive design for all devices
- 🔒 Secure user data with Firebase Authentication
- 💾 Store custom recipes in Firebase Firestore

## Tech Stack

- React.js
- Firebase (Authentication & Firestore)
- Tailwind CSS
- TheMealDB API
- React Router

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- TheMealDB API access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/whitemouse25/RecipeMaster.git
cd RecipeMaster
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a Firebase project and enable:
   - Authentication (Email/Password and Google)
   - Firestore Database
   - Storage (optional, for image uploads)

4. Create a `.env` file in the root directory with your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/         # Reusable components
├── contexts/          # React contexts (Auth, etc.)
├── config/           # Configuration files
├── pages/            # Page components
├── styles/           # Global styles
└── utils/            # Utility functions
```

## Features in Detail

### Authentication
- Email/Password login and registration
- Google sign-in integration
- Protected routes for authenticated users

### Recipe Management
- Create custom recipes with:
  - Title and description
  - Category and cuisine area
  - Ingredients with measurements
  - Step-by-step instructions
  - Image URL
- Edit existing recipes
- Delete recipes
- View recipe details

### Recipe Discovery
- Search recipes from TheMealDB API
- View detailed recipe information
- Save favorite recipes
- Browse by category or cuisine

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TheMealDB](https://www.themealdb.com/) for providing the recipe API
- [Firebase](https://firebase.google.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/RecipeMaster](https://github.com/yourusername/RecipeMaster)
