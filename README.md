# Combat Corner BD - Full-Stack Multi-Language Blog Portal

Combat Corner BD is a premium, professional news and blog portal built for combat sports enthusiasts. It features a robust administrative dashboard, multi-language support (English & Bengali), and a highly responsive, modern UI.

## 🚀 Key Features

- **🌍 Bilingual Support (i18n)**: Full localization for the entire site. Users can switch between English and Bengali seamlessly.
- **📰 Multi-Language CMS**: Admins can create and edit blog posts with separate content for both English and Bengali versions.
- **🏷️ Smart Category Management**: Localized categories that automatically sync with associated blog posts.
- **✍️ Rich Text Editor**: Integrated `ReactQuill` for professional article formatting in both languages.
- **🖼️ Image Management**: High-performance image uploads powered by Vercel Blob storage.
- **🔐 Secure Authentication**: Role-based access control (Admin/User) with JWT-protected routes.
- **📱 Premium Responsive Design**: Mobile-first, sleek news interface with glassmorphism and modern typography.
- **🔍 Advanced Search & Filter**: Real-time search and category filtering for a seamless reading experience.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (RTK Query)
- **Localization**: i18next & react-i18next
- **Icons**: React Icons (Hi, Io, Fa)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Storage**: Vercel Blob
- **Auth**: JSON Web Tokens (JWT) & Bcrypt

## 📂 Project Structure

```bash
├── frontend
│   ├── src
│   │   ├── Component      # Global UI components (Navbar, Footer, etc.)
│   │   ├── pages          # Page views (Home, Blogs, Admin Dashboard)
│   │   ├── redux          # API services and state management
│   │   ├── i18n.js        # Internationalization config
│   │   └── assets         # Static images and styles
├── backend
│   ├── src
│   │   ├── routes         # API endpoints (Blogs, Categories, Auth)
│   │   ├── model          # Database schemas
│   │   └── middleware     # Auth and validation logic
│   └── index.js           # Server entry point
```

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file and add the following:
   ```env
   PORT=5001
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET_KEY=your_secret_key
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   ```
4. Start the server: `npm start` (or `npm run dev`)

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## 📖 Localization Guide
The project uses `react-i18next`. UI strings are stored in `frontend/src/i18n.js`. Database-driven content (Blogs/Categories) supports bilingual fields:
- `title_bn`, `content_bn`, `description_bn` for Blogs.
- `name_bn` for Categories.

## 🗄️ State Management (Redux Toolkit)

The application uses **Redux Toolkit (RTK)** for both global state management and efficient data fetching.

### 📡 RTK Query
Most data interactions are handled via **RTK Query**, which provides powerful caching, automatic re-fetching, and loading/error states out of the box.

- **APIs**: The app is split into several modular API services:
  - `blogApi`: Handles all CRUD operations for articles.
  - `authApi`: Manages user authentication and profile data.
  - `categoryApi`: Manages blog categories with localization support.
  - `commentApi`: Handles user interactions on blog posts.
- **Tags & Invalidation**: We use `providesTags` and `invalidatesTags` (e.g., `'Category'`, `'Post'`) to ensure the UI stays in sync. For example, updating a category automatically triggers a refresh of the category list across the app.

### 🔐 Auth Slice
Local state for the currently logged-in user is managed using a traditional Redux slice (`authSlice.js`), storing the user object and JWT token in both the Redux store and `localStorage` for persistence.

### 🛠️ Usage Example
Components interact with data using auto-generated hooks:
```javascript
// Example: Fetching categories in a component
const { data: categories, isLoading } = useFetchCategoriesQuery();

// Example: Updating a category
const [updateCategory] = useUpdateCategoryMutation();
await updateCategory({ id, name, name_bn }).unwrap();
```

---

## 📄 License
This project is for demonstration and development purposes.
