import ImageHome from "../assets/home_image.jpg";
import FilterMainTag from "../components/FilterMainTag";
import SearchBar from "../components/SearchBar";
import "./Home.css";
export interface Advert {
	id: number;
	title: string;
	description: string;
	main_tag_id: number;
	sub_tag_id: number;
}
function Home() {
	return (
		<div className="search">
			<SearchBar onSearchFocus={() => {}} />
			<div className="banner">
				<img src={ImageHome} alt="ImageHome" className="image-home" />
			</div>

			<FilterMainTag />
		</div>
	);
}

export default Home;
