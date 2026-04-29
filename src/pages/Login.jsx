const handleLogin = async () => {
  if (loading) return;

  setLoading(true);
  setError("");

  try {
    const q = query(
      collection(db, "users"),
      where("username", "==", username.trim().toLowerCase())
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      setError("User not found ❌");
      setLoading(false);
      return;
    }

    const userData = snapshot.docs[0].data();

    // 🔥 disabled check
    if (userData.disabled) {
      setError("User disabled ❌");
      setLoading(false);
      return;
    }

    await signInWithEmailAndPassword(
      auth,
      userData.email,
      password
    );

    window.location.href = "/";
  } catch {
    setError("Login failed ❌");
  }

  setLoading(false);
};