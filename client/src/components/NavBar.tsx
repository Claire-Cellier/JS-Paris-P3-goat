import "./NavBar.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import connexionIcon from "../assets/connexion-icon.png";
import logo from "../assets/logoGOAT.png";
import type { User } from "../types/user.type";

interface NavBarProps {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

function NavBar({ user }: NavBarProps) {
	const navigate = useNavigate();

	return (
		<div className="navbar">
			<img
				src={logo}
				alt="logo"
				className="logo"
				onClick={() => navigate("/home")}
				onKeyPress={() => navigate("/home")}
			/>
			<section className="title-container">
				<h1 className="title">
					<b>GOAT</b>
				</h1>
				<h2 className="subtitle">
					<b>GO A</b>pprendre & <b>T</b>ransmettre
				</h2>
			</section>
			<div className="navbar-links">
				<button
					type="button"
					className="yellow-button"
					onClick={() => {
						if (user) {
							navigate("/adverts/add");
						} else {
							toast.error("Tu dois être connecté pour créer une annonce !");
							navigate("/profile");
						}
					}}
				>
					Crée ton annonce !
				</button>
				<img
					src={connexionIcon}
					alt="connexion"
					className="connexion-icon"
					onClick={() => navigate("/profile")}
					onKeyPress={() => navigate("/profile")}
					title="Connecte toi"
				/>
			</div>
		</div>
	);
}

export default NavBar;
