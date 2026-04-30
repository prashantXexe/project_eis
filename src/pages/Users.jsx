import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
  getDocs
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import { db, auth } from "../firebase";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  // 🔥 REALTIME USERS
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 CREATE / UPDATE USER
  const handleSubmit = async () => {
    if (!form.email || !form.username) {
      showToast("All fields required ❌");
      return;
    }

    try {
      // 🔴 CHECK UNIQUE USERNAME
      const q = query(
        collection(db, "users"),
        where("username", "==", form.username.toLowerCase())
      );

      const existing = await getDocs(q);

      if (!existing.empty && !editId) {
        showToast("Username already exists ❌");
        return;
      }

      // 🔥 EDIT MODE
      if (editId) {
        await updateDoc(doc(db, "users", editId), {
          name: form.name,
          username: form.username.toLowerCase(),
          role: form.role
        });

        showToast("User updated ✏️");
      }

      // 🔥 CREATE MODE
      else {
        if (!form.password) {
          showToast("Password required ❌");
          return;
        }

        // 🔐 Create Auth user
        const userCred = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

        // 💾 Save Firestore (NO PASSWORD)
        await addDoc(collection(db, "users"), {
          name: form.name,
          username: form.username.toLowerCase(),
          email: form.email,
          role: form.role,
          uid: userCred.user.uid
        });

        showToast("User created ✅");
      }

      resetForm();

    } catch (err) {
      showToast(err.message);
    }
  };

  // 🔥 DELETE USER (Firestore only)
  const handleDelete = async (user) => {
    try {
      await deleteDoc(doc(db, "users", user.id));
      showToast("User deleted ❌");
    } catch {
      showToast("Delete failed ❌");
    }
  };

  // 🔥 EDIT CLICK
  const handleEditClick = (user) => {
    setForm({
      name: user.name,
      username: user.username,
      email: user.email,
      password: "",
      role: user.role
    });

    setEditId(user.id);
    setShowModal(true);
  };

  // 🔥 HELPERS
  const resetForm = () => {
    setForm({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "user"
    });
    setEditId(null);
    setShowModal(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Admin Panel</h2>
        <button onClick={() => setShowModal(true)}>
          + Create User
        </button>
      </div>

      {/* TABLE */}
      <table style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>

              <td>
                <button onClick={() => handleEditClick(u)}>
                  Edit
                </button>
              </td>

              <td>
                <button onClick={() => handleDelete(u)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modalContent">

            <h3>{editId ? "Edit User" : "Create User"}</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Username"
              value={form.username}
              onChange={e =>
                setForm({ ...form, username: e.target.value })
              }
            />

            <input
              placeholder="Email"
              value={form.email}
              disabled={editId} // email edit disabled
              onChange={e =>
                setForm({ ...form, email: e.target.value })
              }
            />

            {!editId && (
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            )}

            <select
              value={form.role}
              onChange={e =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div style={{ marginTop: "10px" }}>
              <button onClick={handleSubmit}>
                {editId ? "Update" : "Create"}
              </button>

              <button onClick={resetForm}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}