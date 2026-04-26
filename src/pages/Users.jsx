import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  // 🔥 REALTIME USERS LISTENER
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

  // 🔥 ADD USER
  const handleAddUser = async () => {
    if (!form.email || !form.username || !form.password) {
      setToast("Invalid entry ❌");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    try {
      await addDoc(collection(db, "users"), form);

      setToast(`${form.role === "admin" ? "Admin" : "User"} created ✅`);

      setShowModal(false);
      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "user"
      });
    } catch {
      setToast("Something went wrong ❌");
    }

    setTimeout(() => setToast(""), 3000);
  };

  // 🔥 DELETE USER
  const handleDelete = async (user) => {
    try {
      await deleteDoc(doc(db, "users", user.id));

      setToast(`${user.role === "admin" ? "Admin" : "User"} deleted ❌`);
    } catch {
      setToast("Delete failed ❌");
    }

    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔥 HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}
      >
        <h2 style={{ margin: 0 }}>Admin Panel</h2>

        <button
          className="createBtn"
          onClick={() => setShowModal(true)}
        >
          + Create User
        </button>
      </div>

      {/* 🔥 TABLE */}
      <div className="logWrapper">
        <table className="logTable">
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
                  <button className="viewBtn">Edit</button>
                </td>

                <td>
                  <button
                    className="deleteBtn"
                    onClick={() => handleDelete(u)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modalContent">

            <h3>Create User</h3>

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
              onChange={e =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={e =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <select
              value={form.role}
              onChange={e =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="modalActions">
              <button onClick={handleAddUser}>
                Create
              </button>

              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔥 TOAST */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}