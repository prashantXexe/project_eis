import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "detections"),
      orderBy("timestamp", "desc") // 🔥 latest first
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();

        let dateObj;
        try {
          dateObj = d.timestamp?.toDate
            ? d.timestamp.toDate()
            : new Date(d.timestamp);
        } catch {
          dateObj = new Date();
        }

        return {
          id: doc.id,
          trackId: d.track_id,
          score: d.score,
          date: dateObj.toLocaleDateString(),
          time: dateObj.toLocaleTimeString(),
          imageUrl: d.image_url
        };
      });

      setLogs(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Logs</h2>

      <div className="logWrapper">
        <table className="logTable">
          <thead>
            <tr>
              <th>Track ID</th>
              <th>Score</th>
              <th>Date</th>
              <th>Time</th>
              <th>Image</th>
            </tr>
          </thead>

          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.trackId}</td>

                  <td
                    style={{
                      color: log.score >= 7 ? "#22c55e" : "#f59e0b",
                    }}
                  >
                    {log.score}
                  </td>

                  <td>{log.date}</td>
                  <td>{log.time}</td>

                  <td>
                    <button
                      className="viewBtn"
                      onClick={() => window.open(`${log.imageUrl}?t=${Date.now()}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "detections"),
      orderBy("timestamp", "desc") // 🔥 latest first
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();

        let dateObj;
        try {
          dateObj = d.timestamp?.toDate
            ? d.timestamp.toDate()
            : new Date(d.timestamp);
        } catch {
          dateObj = new Date();
        }

        return {
          id: doc.id,
          trackId: d.track_id,
          score: d.score,
          date: dateObj.toLocaleDateString(),
          time: dateObj.toLocaleTimeString(),
          imageUrl: d.image_url
        };
      });

      setLogs(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Logs</h2>

      <div className="logWrapper">
        <table className="logTable">
          <thead>
            <tr>
              <th>Track ID</th>
              <th>Score</th>
              <th>Date</th>
              <th>Time</th>
              <th>Image</th>
            </tr>
          </thead>

          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.trackId}</td>

                  <td
                    style={{
                      color: log.score >= 7 ? "#22c55e" : "#f59e0b",
                    }}
                  >
                    {log.score}
                  </td>

                  <td>{log.date}</td>
                  <td>{log.time}</td>

                  <td>
                    <button
                      className="viewBtn"
                      onClick={() => window.open(`${log.imageUrl}?t=${Date.now()}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}