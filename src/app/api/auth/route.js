import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "src", "data", "users.json");

function readUsers() {
  try {
    if (!fs.existsSync(usersFilePath)) {
      return [];
    }
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading users.json:", err);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing users.json:", err);
    return false;
  }
}

// GET: Returns list of demo profiles (passwords omitted)
export async function GET() {
  const users = readUsers();
  const safeUsers = users.map(({ password, ...rest }) => rest);
  return NextResponse.json({ success: true, users: safeUsers });
}

// POST: Handles Login and Signup
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, name, role, organization } = body;

    const users = readUsers();

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: "Email and password are required." },
          { status: 400 }
        );
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = users.find(
        (u) => (u.email || "").trim().toLowerCase() === normalizedEmail
      );

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error:
              "No account found with this email. Try demo: aarohisaxena1011@gmail.com or create a new account.",
          },
          { status: 401 }
        );
      }

      if (user.password !== password.trim()) {
        return NextResponse.json(
          {
            success: false,
            error: "Incorrect password. (Default demo password is 'demo')",
          },
          { status: 401 }
        );
      }

      // Login success
      const { password: _, ...safeUser } = user;
      return NextResponse.json({
        success: true,
        message: "Login successful.",
        user: safeUser,
      });
    }

    if (action === "signup") {
      if (!email || !password || !name) {
        return NextResponse.json(
          { success: false, error: "Name, email, and password are required." },
          { status: 400 }
        );
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existing = users.find(
        (u) => (u.email || "").trim().toLowerCase() === normalizedEmail
      );

      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: "An account with this email already exists. Please log in.",
          },
          { status: 409 }
        );
      }

      const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join("") || name.slice(0, 2).toUpperCase();

      const newUser = {
        id: "user-" + Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password: password.trim(),
        role: role || "Licensed Architect",
        organization: organization || "Council of Architecture (MP)",
        badge: (role || "").includes("Officer")
          ? "Official Municipal Clerk"
          : "Verified Professional",
        avatar: initials,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      writeUsers(users);

      const { password: _, ...safeUser } = newUser;
      return NextResponse.json({
        success: true,
        message: "Account created and saved to users.json successfully.",
        user: safeUser,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Authentication failed." },
      { status: 500 }
    );
  }
}
