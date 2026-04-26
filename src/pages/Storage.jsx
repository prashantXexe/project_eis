import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import {
  ref,
  deleteObject,
  getBlob
} from "firebase/storage";

export default function Storage() {
  const [images, setImages] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [toast, setToast] = useState("");

  const user = { role: "admin" };

  // 🔔 Toast
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // 🔥 REALTIME IMAGES FROM FIRESTORE
  useEffect(() => {
    const q = query(
      collection(db, "detections"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();

        return {
          id: doc.id,
          url: d.image_url,
          path: d.path
        };
      });

      setImages(data);
    });

    return () => unsubscribe();
  }, []);

  // ⬇️ DOWNLOAD
  const handleDownload = async (path) => {
    try {
      const fileRef = ref(storage, path);
      const blob = await getBlob(fileRef);

      const fileName = path.split("/").pop();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      a.click();

      window.URL.revokeObjectURL(blobUrl);

      showToast("Image Downloaded ✅");
    } catch {
      showToast("Download Failed ❌");
    }
  };

  // ❌ DELETE
  const handleDelete = async (path) => {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);

      setSelectedImg(null);
      showToast("Image Deleted 🗑️");
    } catch {
      showToast("Delete Failed ❌");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Storage</h2>

      {/* 🔲 GRID */}
      <div className="gridContainer">
        {images.map((img) => (
          <div className="imageCard" key={img.id}>
            <img
              src={img.url}
              alt=""
              onClick={() => setSelectedImg(img)}
            />
          </div>
        ))}
      </div>

      {/* 🔥 MODAL */}
      {selectedImg && (
        <div className="modal" onClick={() => setSelectedImg(null)}>
          <div
            className="modalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedImg.url} className="modalImg" />

            <div className="modalActions">
              <button onClick={() => handleDownload(selectedImg.path)}>
                Download
              </button>

              {user.role === "admin" && (
                <button
                  onClick={() => handleDelete(selectedImg.path)}
                  className="deleteBtn"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔔 TOAST */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}