import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Insights() {
  const [counts, setCounts] = useState({
    intrusion: 0,
    dwell: 0,
    loitering: 0
  });

  useEffect(() => {
    console.log("🔥 INSIGHTS PAGE RUNNING");

    const unsub = onSnapshot(collection(db, "alerts"), (snapshot) => {
      let intrusion = 0;
      let dwell = 0;
      let loitering = 0;

      snapshot.forEach((doc) => {
        const type = doc.data().type?.toLowerCase();

        if (type === "intrusion") intrusion++;
        if (type === "dwell") dwell++;
        if (type === "loiter" || type === "loitering") loitering++;
      });

      setCounts({ intrusion, dwell, loitering });
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h1>🔥 Insights Working</h1>

      <p>Intrusion: {counts.intrusion}</p>
      <p>Dwell: {counts.dwell}</p>
      <p>Loitering: {counts.loitering}</p>
    </div>
  );
}