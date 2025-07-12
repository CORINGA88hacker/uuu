
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getDatabase, ref, get, set, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
  import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBHIc2E4XwRO5FXo4uHlTQVRArOis73MjE",
    authDomain: "projeto-deus-yato-928-sk-default-rtdb.firebaseapp.com",
    databaseURL: "https://projeto-deus-yato-928-sk-default-rtdb.firebaseio.com",
    projectId: "projeto-deus-yato-928-sk-default-rtdb",
    storageBucket: "projeto-deus-yato-928-sk-default-rtdb.appspot.com",
    messagingSenderId: "790408726854",
    appId: "1:790408726854:android:e2f0de7b7d5dba96b0fd47"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const auth = getAuth(app);

  window.db = db;
  window.auth = auth;
  window.firebaseRef = ref;
  window.firebaseGet = get;
  window.firebaseSet = set;
  window.firebaseChild = child;
  window.signInWithEmailAndPassword = signInWithEmailAndPassword;
  window.onAuthStateChanged = onAuthStateChanged;
  window.signOut = signOut;
</script>
