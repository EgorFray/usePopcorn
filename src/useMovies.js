import { useState, useEffect } from "react";

export function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(
		function () {
			const controller = new AbortController();
			async function fetchMovies() {
				try {
					setIsLoading(true);
					setError("");
					const res = await fetch(
						`http://www.omdbapi.com/?i=tt3896198&apikey=60db7bff&s=${query}`,
						{ signal: controller.signal }
					);
					if (!res.ok) throw new Error("Something went wrong whil fetching movies");
					const data = await res.json();
					if (data.Response === "False") throw new Error(data.Error);
					setMovies(data.Search);
					setError("");
				} catch (err) {
					if (err.name !== "AbortError") {
						setError(err.message);
					}
				} finally {
					setIsLoading(false);
				}
			}
			if (query.length < 3) {
				setMovies([]);
				setError("");
				return;
			}
			// handleCloseMovie();
			fetchMovies();

			return function () {
				controller.abort();
			};
		},
		[query]
	);

	return { movies, isLoading, error };
}
