import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { deleteDoc, doc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { ref, deleteObject, getBlob } from "firebase/storage";

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
      snapshot.docChanges().forEach((change) => {
        const d = change.doc.data();

        if (change.type === "added") {
          setImages((prev) => {
            if (prev.find((p) => p.id === change.doc.id)) return prev;

            return [
              {
                id: change.doc.id,
                url: d.image_url,
                path: d.path
              },
              ...prev
            ];
          });
        }

        if (change.type === "removed") {
          setImages((prev) =>
            prev.filter((img) => img.id !== change.doc.id)
          );
        }
      });
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
  const handleDelete = async () => {
    try {
      const fileRef = ref(storage, selectedImg.path);

      await deleteObject(fileRef);
      await deleteDoc(doc(db, "detections", selectedImg.id));

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
      {images.filter(img => img.url).length === 0 ? (
        <div style={{ color: "#9ca3af", marginTop: "20px" }}>
          No images found 📭
        </div>
      ) : (
        <div className="gridContainer">
          {images
            .filter(img => img.url)
            .map((img) => (
              <div className="imageCard" key={img.id}>
                <img
                  src={`${img.url}?t=${Date.now()}`}
                  alt=""
                  onClick={() => setSelectedImg(img)}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            ))}
        </div>
      )}

      {/* 🔥 MODAL */}
      {selectedImg && (
        <div className="modal" onClick={() => setSelectedImg(null)}>
          <div
            className="modalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`${selectedImg.url}?t=${Date.now()}`}
              className="modalImg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />

            <div className="modalActions">
              <button onClick={() => handleDownload(selectedImg.path)}>
                Download
              </button>

              {user.role === "admin" && (
                <button
                  onClick={handleDelete}
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