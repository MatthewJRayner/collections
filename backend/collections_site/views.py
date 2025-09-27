import requests
import logging
from django.shortcuts import render
from django.conf import settings
from django.contrib.postgres.fields import JSONField, ArrayField
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework import status
from datetime import timedelta
import time
from django.db.models import Q
from django.db.models.expressions import RawSQL
from .models import (
    Watch, Music, FilmCollection, BookCollection,
    Wardrobe, GameCollection, Art,
    ExtrasCategory, Extra, Film, Book,
    Instrument, List
)
from .serializers import (
    WatchSerializer, MusicSerializer, FilmCollectionSerializer, BookCollectionSerializer,
    WardrobeSerializer, GameCollectionSerializer, ArtSerializer,
    ExtrasCategorySerializer, ExtraSerializer, FilmSerializer, BookSerializer,
    InstrumentSerializer, ListSerializer
)

# Set up logging
logger = logging.getLogger(__name__)

# Existing ViewSets unchanged
class WatchViewSet(viewsets.ModelViewSet):
    queryset = Watch.objects.all()
    serializer_class = WatchSerializer
    
class MusicViewSet(viewsets.ModelViewSet):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer

class FilmCollectionViewSet(viewsets.ModelViewSet):
    queryset = FilmCollection.objects.all()
    serializer_class = FilmCollectionSerializer

class BookCollectionViewSet(viewsets.ModelViewSet):
    queryset = BookCollection.objects.all()
    serializer_class = BookCollectionSerializer

class WardrobeViewSet(viewsets.ModelViewSet):
    queryset = Wardrobe.objects.all()
    serializer_class = WardrobeSerializer

class GameCollectionViewSet(viewsets.ModelViewSet):
    queryset = GameCollection.objects.all()
    serializer_class = GameCollectionSerializer

class ArtViewSet(viewsets.ModelViewSet):
    queryset = Art.objects.all()
    serializer_class = ArtSerializer

class ExtrasCategoryViewSet(viewsets.ModelViewSet):
    queryset = ExtrasCategory.objects.all()
    serializer_class = ExtrasCategorySerializer

class ExtraViewSet(viewsets.ModelViewSet):
    queryset = Extra.objects.all()
    serializer_class = ExtraSerializer

class FilmViewSet(viewsets.ModelViewSet):
    queryset = Film.objects.all()
    serializer_class = FilmSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title', 'alt_title', 'director', 'alt_name']

    def get_queryset(self):
        queryset = super().get_queryset()
        director = self.request.query_params.get('directors')
        actor = self.request.query_params.get('actor')
        genre = self.request.query_params.get('genre')
        crew = self.request.query_params.get('crew')

        logger.debug(f"Query params: director={director}, actor={actor}, genre={genre}, crew={crew}")

        if director:
            queryset = queryset.filter(director__iexact=director)
        elif actor:
            queryset = queryset.filter(cast__contains=[{'actor': actor}])
        elif genre:
            queryset = queryset.filter(genre__contains=[genre])
        elif crew:
            queryset = queryset.filter(crew__contains=[{'name': crew}])

        logger.debug(f"Filtered queryset count: {queryset.count()}")
        logger.debug(f"Filtered films: {[film.title for film in queryset]}")
        return queryset

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title', 'alt_title', 'author', 'alt_name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        author = self.request.query_params.get('author')
        genre = self.request.query_params.get('genre')

        logger.debug(f"Query params: author={author}, genre={genre}, ")

        if author:
            queryset = queryset.filter(author__iexact=author)
        elif genre:
            # Use json_each to iterate over genre array in SQLite
            queryset = queryset.filter(
                id__in=RawSQL(
                    """
                    SELECT id FROM collections_site_book
                    WHERE EXISTS (
                        SELECT 1 FROM json_each(collections_site_book.genre)
                        WHERE json_each.value LIKE %s
                    )
                    """,
                    (f'%{genre}%',)
                )
            )
        logger.debug(f"Filtered queryset count: {queryset.count()}")
        logger.debug(f"Filtered films: {[book.title for book in queryset]}")
        return queryset
    
    
    
class InstrumentViewSet(viewsets.ModelViewSet):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer
    
def fetch_tmdb_data(query: str, year: int = None):
    """
    Accepts either a TMDb key or a title and fetches film data.
    Optionall filters results by release year
    Returns JSON or None.
    """
    base = "https://api.themoviedb.org/3"
    read_token = settings.CONFIG['TMDB_READ_TOKEN']
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {read_token}"
    }
    
    if query.isdigit():
        url = f"{base}/movie/{query}?append_to_response=credits"
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            logger.error(f"Failed to fetch movie by ID {query}: {response.status_code}")
            return None
        return response.json()

    search_url = f"{base}/search/movie?query={query}"
    response = requests.get(search_url, headers=headers)
    if response.status_code != 200:
        logger.error(f"Failed to search movie {query}: {response.status_code}")
        return None

    data = response.json()
    results = data.get("results", [])

    if not results:
        logger.warning(f"No results found for query: {query}")
        return None

    # If year provided, filter by release year
    movie_id = None
    if year:
        for r in results:
            if r.get("release_date"):
                release_year = int(r["release_date"].split("-")[0])
                if release_year == year:
                    movie_id = r["id"]
                    break
        if not movie_id:
            logger.warning(f"No results matched year {year} for query: {query}")
            return None
    else:
        movie_id = results[0]["id"]
    
    details_url = f"{base}/movie/{movie_id}?append_to_response=credits"
    response = requests.get(details_url, headers=headers)
    if response.status_code != 200:
        logger.error(f"Failed to fetch movie details for ID {movie_id}: {response.status_code}")
        return None
    return response.json()

@api_view(["POST"])
def batch_import_films(request):
    """
    Accepts a list of titles or TMDb IDs, fetches from TMDb,
    saves them to the DB, and returns a progress report.
    """
    items = request.data.get("items", [])
    if not items:
        return Response({"error": "No items provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    results = []
    for entry in items:
        entry = entry.strip()
        if not entry:
            continue
        
        data = fetch_tmdb_data(entry)
        if not data:
            results.append({"item": entry, "status": "not found"})
            continue
        
        if Film.objects.filter(tmdb_id=data["id"]).exists():
            results.append({"item": entry, "status": "duplicate"})
            continue
        
        runtime = None
        runtime_value = data.get("runtime")
        if runtime_value is not None:
            try:
                runtime = timedelta(minutes=int(runtime_value))
            except (ValueError, TypeError):
                logger.warning(f"Invalid runtime for {entry}: {runtime_value}")
                runtime = None
        
        # Find director's name and original_name
        director_data = next(
            (c for c in data.get("credits", {}).get("crew", []) if c["job"] == "Director"),
            None
        )
        director_name = director_data.get("name") if director_data else None
        director_original_name = director_data.get("original_name") if director_data else None
        alt_name = director_original_name if director_original_name and director_original_name != director_name else None
        
        film_data = {
            "tmdb_id": data.get("id"),
            "title": data.get("title") or "Unknown Title",
            "alt_title": data.get("original_title") if data.get("original_title") != data.get("title") else None,
            "director": director_name,
            "alt_name": alt_name,
            "cast": [
                {"actor": c.get("name"), "role": c.get("character") or ""}
                for c in data.get("credits", {}).get("cast", [])
            ],
            "crew": [
                {"name": c.get("name"), "role": c.get("job") or ""}
                for c in data.get("credits", {}).get("crew", [])
            ],
            "industry_rating": round(float(data.get("vote_average") or 0.0), 1),
            "series": data.get("belongs_to_collection", {}).get("name") if data.get("belongs_to_collection") else None,
            "blurb": data.get("tagline"),
            "synopsis": data.get("overview"),
            "language": data.get("original_language"),
            "country": ", ".join(data.get("origin_country", []) or []),
            "poster": f"https://image.tmdb.org/t/p/original{data.get('poster_path')}" if data.get("poster_path") else None,
            "background_pic": f"https://image.tmdb.org/t/p/original{data.get('backdrop_path')}" if data.get("backdrop_path") else None,
            "runtime": runtime,
            "genre": [g["name"] for g in data.get("genres", [])] or [],
            "budget": data.get("budget") or 0,
            "box_office": data.get("revenue") or 0,
            "release_date": data.get("release_date") or None,
        }

        logger.debug(f"Film data for {entry}: {film_data}")
        serializer = FilmSerializer(data=film_data)
        if serializer.is_valid():
            serializer.save()
            results.append({"item": entry, "status": "imported"})
        else:
            logger.error(f"Validation failed for {entry}: {serializer.errors}")
            results.append({"item": entry, "status": "validation failed", "errors": serializer.errors})
            
        time.sleep(0.25)
    
    return Response({"results": results}, status=status.HTTP_200_OK)

class ListViewSet(viewsets.ModelViewSet):
    serializer_class = ListSerializer
    
    def get_queryset(self):
        queryset = List.objects.all().order_by("-created_at")
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset