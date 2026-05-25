# Backend Cookie Auth Setup

Use this setup in your Express backend when the frontend sends requests with `credentials: "include"`.

## 1. Install Required Packages

```bash
npm install cors cookie-parser jsonwebtoken
```

## 2. App Setup

In your main backend file, for example `server.js` or `app.js`:

```js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

router.use("/api/user", UserRoutes);
router.use("/api/project", ProjectRoutes);
router.use("/api/task", TaskRoutes);
```

## 3. Login Controller

Your login controller must set the cookie and also send a JSON response.

```js
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
```

## 4. Auth Middleware

Your `auth` middleware should read the token from `req.cookies.token`.

```js
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
```

## 5. Logout Route

Add this if you want backend logout support.

```js
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
```

## 6. Common Bug

If the frontend shows no response for login, your backend route probably does not call `return res.json(...)` in every branch. Every success and error path must send a response.
