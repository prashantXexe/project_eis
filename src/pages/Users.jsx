import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  setDoc
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [editUser, setEditUser] = useState(null);

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

  // 🔥 CREATE USER (AUTH + FIRESTORE)
  const handleAddUser = async () => {
    if (!form.email || !form.password) {
      setToast("Invalid entry ❌");
      return;
    }

    try {
      // ✅ CREATE AUTH USER
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const uid = userCred.user.uid;

      // ✅ SAVE FIRESTORE WITH UID AS DOC ID
      await setDoc(doc(db, "users", uid), {
        uid,
        name: form.name,
        username: form.username.toLowerCase(),
        email: form.email,
        role: form.role
      });

      setToast("User created ✅");

      setShowModal(false);
      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "user"
      });

    } catch (err) {
      console.log("CREATE ERROR:", err);
      setToast(err.message);
    }

    setTimeout(() => setToast(""), 3000);
  };

  // 🔥 UPDATE USER
  const handleUpdateUser = async () => {
    try {
      const ref = doc(db, "users", editUser.uid);

      await updateDoc(ref, {
        name: form.name,
        username: form.username.toLowerCase(),
        email: form.email,
        role: form.role
      });

      setToast("User updated ✅");
      setShowModal(false);
      setEditUser(null);

    } catch (err) {
      console.log(err);
      setToast("Update failed ❌");
    }

    setTimeout(() => setToast(""), 3000);
  };

  // 🔥 DELETE USER (Firestore only)
  const handleDelete = async (user) => {
    try {
      await deleteDoc(doc(db, "users", user.uid));
      setToast("User deleted ❌");
    } catch (err) {
      console.log(err);
      setToast("Delete failed ❌");
    }

    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "16px"
      }}>
        <h2>Admin Panel</h2>

        <button
          className="createBtn"
          onClick={() => {
            setEditUser(null);
            setForm({
              name: "",
              username: "",
              email: "",
              password: "",
              role: "user"
            });
            setShowModal(true);
          }}
        >
          + Create User
        </button>
      </div>

      {/* TABLE */}
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
            <tr key={u.uid}>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>

              {/* EDIT */}
              <td>
                <button
                  className="viewBtn"
                  onClick={() => {
                    setEditUser(u);
                    setForm({
                      name: u.name,
                      username: u.username,
                      email: u.email,
                      password: "",
                      role: u.role
                    });
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
              </td>

              {/* DELETE */}
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

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modalContent">

            <h3>{editUser ? "Edit User" : "Create User"}</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />

            {!editUser && (
              <input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            )}

            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="modalActions">
              <button onClick={editUser ? handleUpdateUser : handleAddUser}>
                {editUser ? "Update" : "Create"}
              </button>

              <button onClick={() => setShowModal(false)}>
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