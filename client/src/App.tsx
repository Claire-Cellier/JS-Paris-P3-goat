import "./App.css";
import "./Reset.css";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import NavBar from "./components/NavBar";
import type { User } from "./types/user.type";

function App() {
	const [user, setUser] = useState<User | null>(null);
	return (
		<>
			<NavBar user={user} setUser={setUser} />
			<Outlet context={{ user, setUser }} />
			<ToastContainer
				position="top-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
				transition={Bounce}
			/>
		</>
	);
}

export default App;
