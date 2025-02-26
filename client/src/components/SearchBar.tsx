import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import searchIcon from "../assets/search_icon_white.png";

interface SearchBarProps {
	onSearchFocus: () => void;
}

function SearchBar({ onSearchFocus }: SearchBarProps) {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [isOnSearch, setIsOnSearch] = useState(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);

	const suggestionsRef = useRef<HTMLUListElement | null>(null);
	const categoriesRef = useRef<HTMLDivElement | null>(null);
	const searchContainerRef = useRef<HTMLDivElement | null>(null);

	const fetchSuggestions = useCallback(async (searchQuery: string) => {
		if (searchQuery.trim() === "") {
			setSuggestions([]);
			return;
		}

		try {
			const [descriptionResponse, mainTagResponse, subTagResponse] =
				await Promise.all([
					fetch(
						`${import.meta.env.VITE_API_URL}/api/search/description?q=${encodeURIComponent(searchQuery)}`,
					),
					fetch(
						`${import.meta.env.VITE_API_URL}/api/search/maintags?q=${encodeURIComponent(searchQuery)}`,
					),
					fetch(
						`${import.meta.env.VITE_API_URL}/api/search/subtags?q=${encodeURIComponent(searchQuery)}`,
					),
				]);

			const [descriptions, mainTags, subTags] = await Promise.all([
				descriptionResponse.json(),
				mainTagResponse.json(),
				subTagResponse.json(),
			]);

			const combinedSuggestions = [
				...new Set([
					...mainTags.slice(0, 5).map((tag: { name: string }) => tag.name),
					...subTags.slice(0, 5).map((tag: { name: string }) => tag.name),
					...descriptions.slice(0, 5),
				]),
			];

			setSuggestions(combinedSuggestions);
		} catch (error) {
			setSuggestions([]);
		}
	}, []);

	const fetchCategories = useCallback(async (searchQuery: string) => {
		try {
			const categoryResponse = await fetch(
				`${import.meta.env.VITE_API_URL}/api/search/categories?q=${encodeURIComponent(searchQuery)}`,
			);
			const categories = await categoryResponse.json();
			setCategories(categories);
			setIsCategoriesVisible(true);
		} catch (error) {
			setCategories([]);
		}
	}, []);

	useEffect(() => {
		if (isOnSearch && query !== undefined) {
			const delayDebounce = setTimeout(() => {
				fetchSuggestions(query);
			}, 300);
			return () => clearTimeout(delayDebounce);
		}
	}, [query, fetchSuggestions, isOnSearch]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsOnSearch(true);
		setQuery(e.target.value);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && query !== undefined && query.trim()) {
			navigate(`/adverts?search=${encodeURIComponent(query)}`);
			setIsOnSearch(false);
			setSuggestions([]);
		}
	};

	const handleSuggestionClick = (suggestion: string) => {
		setQuery(suggestion);
		navigate(`/adverts?search=${encodeURIComponent(suggestion)}`);
		setIsOnSearch(false);
		setSuggestions([]);
		setCategories([]);
		setIsCategoriesVisible(false);
		fetchCategories(suggestion);
	};

	const handleFocus = () => {
		setIsOnSearch(false);
		setSuggestions([]);
		setCategories([]);
		setIsCategoriesVisible(false);
		onSearchFocus();
	};

	const handleClickOutside = useCallback((event: MouseEvent) => {
		const target = event.target as Node;
		const isClickInsideSearchContainer =
			searchContainerRef.current?.contains(target);
		const isClickInsideSuggestions = suggestionsRef.current?.contains(target);
		const isClickInsideCategories = categoriesRef.current?.contains(target);

		if (
			!isClickInsideSearchContainer &&
			!isClickInsideSuggestions &&
			!isClickInsideCategories
		) {
			setIsOnSearch(false);
			setSuggestions([]);
			setCategories([]);
			setIsCategoriesVisible(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [handleClickOutside]);

	return (
		<div ref={searchContainerRef} className="search-container">
			<img src={searchIcon} alt="Search Icon" className="search-icon" />
			<input
				type="text"
				placeholder="Rechercher..."
				value={query}
				onChange={handleInputChange}
				onKeyPress={handleKeyPress}
				onFocus={handleFocus}
			/>
			{suggestions.length > 0 && (
				<ul ref={suggestionsRef} className="suggestions-list">
					{suggestions.map((suggestion) => (
						<li
							key={suggestion}
							onClick={() => handleSuggestionClick(suggestion)}
							onKeyUp={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleSuggestionClick(suggestion);
								}
							}}
							className="suggestion-item"
						>
							{suggestion.toLowerCase()}
						</li>
					))}
				</ul>
			)}

			{isCategoriesVisible && categories.length > 0 && (
				<div ref={categoriesRef} className="categories-container">
					<h3>Catégories associées :</h3>
					<ul>
						{categories.map((category) => (
							<li key={category}>{category}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default SearchBar;
