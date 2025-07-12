
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

  window.db = db;
  window.firebaseRef = ref;
  window.firebaseGet = get;
  window.firebaseChild = child;
</script>
