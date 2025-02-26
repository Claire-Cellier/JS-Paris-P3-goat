import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdvertCard from "../components/AdvertCard";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
import type { Advert } from "../types/Advert";
import "./AdvertList.css";

function AdvertList() {
	const [adverts, setAdverts] = useState<Advert[]>([]);
	const [filteredAdverts, setFilteredAdverts] = useState<Advert[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMainTag, setSelectedMainTag] = useState<number | null>(null);
	const [selectedSubTag, setSelectedSubTag] = useState<number | null>(null);

	const location = useLocation();

	const applyAllFilters = useCallback(() => {
		let results = [...adverts];

		if (searchQuery.trim() !== "") {
			results = results.filter(
				(advert) =>
					advert.description
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					advert.main_tag_name
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					advert.sub_tag_name.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		if (selectedMainTag !== null) {
			results = results.filter(
				(advert) => advert.main_tag_id === selectedMainTag,
			);
		}
		if (selectedSubTag !== null) {
			results = results.filter(
				(advert) => advert.sub_tag_id === selectedSubTag,
			);
		}

		setFilteredAdverts(results);
	}, [adverts, searchQuery, selectedMainTag, selectedSubTag]);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/api/adverts`)
			.then((res) => res.json())
			.then((data: Advert[]) => {
				setAdverts(data);
				setFilteredAdverts(data);
			})
			.catch((error) => console.error("Erreur récupération annonces:", error));
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const tagId = params.get("tag");
		const subTagId = params.get("subtag");

		if (tagId) {
			setSelectedMainTag(Number(tagId));
		}
		if (subTagId) {
			setSelectedSubTag(Number(subTagId));
		}
	}, [location.search]);

	useEffect(() => {
		if (adverts.length > 0) {
			applyAllFilters();
		}
	}, [applyAllFilters, adverts.length]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const searchParam = params.get("search");
		const tagParam = params.get("tag");
		const subTagParam = params.get("subtag");

		if (searchParam) {
			setSearchQuery(decodeURIComponent(searchParam));
		}
		if (tagParam) {
			setSelectedMainTag(Number(tagParam));
		}
		if (subTagParam) {
			setSelectedSubTag(Number(subTagParam));
		}
	}, [location.search]);

	const resetFilters = () => {
		setSelectedMainTag(null);
		setSelectedSubTag(null);
		setSearchQuery("");
		setFilteredAdverts(adverts);
	};

	const handleFilters: (
		query: string,
		mainTagId?: number,
		subTagId?: number,
	) => void = (_: string, mainTagId?: number, subTagId?: number) => {
		setSearchQuery("");

		if (mainTagId !== undefined) {
			setSelectedMainTag(mainTagId);
			setSelectedSubTag(null);
		}
		if (subTagId !== undefined) {
			setSelectedSubTag(subTagId);
		}
	};

	return (
		<div>
			<SearchBar
				onSearchFocus={() => {
					resetFilters();
				}}
			/>
			<Filter
				onSearch={handleFilters}
				selectedMainTag={selectedMainTag}
				selectedSubTag={selectedSubTag}
			/>
			<div className="adverts">
				{filteredAdverts.length > 0 ? (
					filteredAdverts.map((advert) => (
						<AdvertCard key={advert.id} advert={advert} />
					))
				) : (
					<div className="no-results">
						<p>
							Aucune annonce ne correspond aux critères de recherche
							sélectionnés.
						</p>
						<br />
						<p>
							Essaie de modifier tes filtres ou ta recherche pour obtenir plus
							de résultats.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default AdvertList;
