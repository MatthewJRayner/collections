import { Film } from "@/types/film";
import { Book } from "@/types/book";

export function getMostRecent(films: Film[], count = 4) {
    return [...films]
        .filter(f => f.date_watched)
        .sort((a, b) =>
            new Date(b.date_watched!).getTime() - new Date(a.date_watched!).getTime()    
        )
        .slice(0, count);
}

export function getRandomWatchlist(films: Film[], count = 4) {
    const watchlist = films.filter(f => f.watchlist);
    return watchlist.sort(() => 0.5 - Math.random()).slice(0, count);
}

export function getRandomFavourites(films: Film[], count = 4) {
    const favs = films.filter(f => f.favourite);
    return favs.sort(() => 0.5 - Math.random()).slice(0, count);
}

export function getTopDirectors(films: Film[], count = 4) {
    const grouped: Record<string, Film[]> = {};
    for (const film of films) {
        if (!film.director) continue;
        grouped[film.director] = grouped[film.director] || [];
        grouped[film.director].push(film);
    }

    const averages = Object.entries(grouped).map(([director, movies]) => {
        const rated = movies.filter(m => m.rating != null);
        const avg =
            rated.reduce((sum, m) => sum + Number(m.rating ?? 0), 0) / rated.length;
        return { director, avg, films: movies };
    });

    return averages
        .sort((a, b) => b.avg - a.avg)
        .slice(0, count);
}

export function getMostRecentBooks(books: Book[], count = 4) {
    return [...books]
        .filter(b => b.date_read) // or "date_released" if you meant release
        .sort((a, b) =>
            new Date(b.date_read!).getTime() - new Date(a.date_read!).getTime()
        )
        .slice(0, count);
}

export function getRandomReadlistBooks(books: Book[], count = 4) {
    const readlist = books.filter(b => b.readlist);
    return readlist.sort(() => 0.5 - Math.random()).slice(0, count);
}

export function getRandomFavouriteBooks(books: Book[], count = 4) {
    const favs = books.filter(b => b.favourite);
    return favs.sort(() => 0.5 - Math.random()).slice(0, count);
}

export function getTopAuthors(books: Book[], count = 4) {
    const grouped: Record<string, Book[]> = {};
    for (const book of books) {
        if (!book.author) continue;
        grouped[book.author] = grouped[book.author] || [];
        grouped[book.author].push(book);
    }

    const averages = Object.entries(grouped).map(([author, works]) => {
        const rated = works.filter(b => b.rating != null);
        const avg =
            rated.reduce((sum, b) => sum + Number(b.rating ?? 0), 0) / rated.length;
        return { author, avg, books: works };
    });

    return averages
        .sort((a, b) => b.avg - a.avg) // fixed your film function bug (was `b.avg = a.avg`)
        .slice(0, count);
}