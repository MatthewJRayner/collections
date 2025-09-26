# collections_site/management/commands/import_letterboxd_films.py
import csv
from django.core.management.base import BaseCommand
from django.conf import settings
from ...models import Film
from ...serializers import FilmSerializer
from ...views import fetch_tmdb_data, batch_import_films  # Import from your views
from django.core import management
from datetime import timedelta

class Command(BaseCommand):
    help = 'Import Letterboxd CSV data into Film model'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the Letterboxd CSV file')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        imported = 0
        updated = 0
        skipped = 0

        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                title = row.get('Name', '').strip()
                rating = float(row.get('Rating', 0)) * 2 if row.get('Rating') else None
                year = int(row.get("Year", 0)) if row.get("Year") else None

                if not title:
                    self.stdout.write(self.style.ERROR(f'Skipped row with empty title: {row}'))
                    skipped += 1
                    continue

                # Check if film already exists by title (case-insensitive)
                existing_film = Film.objects.filter(title__iexact=title).first()
                if existing_film:
                    # Update rating if provided and different
                    if rating is not None and existing_film.rating != rating:
                        existing_film.rating = rating
                        existing_film.save()
                        updated += 1
                        self.stdout.write(self.style.SUCCESS(f'Updated rating for existing film: {title} to {rating}'))
                    else:
                        skipped += 1
                        self.stdout.write(self.style.WARNING(f'Skipped existing film with same rating: {title}'))
                else:
                    # Import new film using your existing TMDb logic
                    tmdb_data = fetch_tmdb_data(title, year=year)
                    if tmdb_data:
                        film_title = tmdb_data.get("title") or title
                        director = next(
                            (c["name"] for c in tmdb_data.get("credits", {}).get("crew", []) if c["job"] == "Director"),
                            None,
                        )
                        # Set alt_title and alt_name to None if they match title or director
                        alt_title = tmdb_data.get("original_title")
                        if alt_title == film_title:
                            alt_title = None
                        alt_name = next(
                            (c["original_name"] for c in tmdb_data.get("credits", {}).get("crew", []) if c["job"] == "Director"),
                            None,
                        )
                        if alt_name == director:
                            alt_name = None
                            
                        film_data = {
                            # ... (your existing film_data mapping from views.py)
                            "tmdb_id": tmdb_data.get("id"),
                            "title": film_title,
                            "alt_title": alt_title,
                            "director": director,
                            "alt_name": alt_name,
                            "cast": [
                                {"actor": c.get("name"), "role": c.get("character") or ""}
                                for c in tmdb_data.get("credits", {}).get("cast", [])
                            ],
                            "crew": [
                                {"name": c.get("name"), "role": c.get("job") or ""}
                                for c in tmdb_data.get("credits", {}).get("crew", [])
                            ],
                            "industry_rating": round(float(tmdb_data.get("vote_average") or 0.0), 1),
                            "series": tmdb_data.get("belongs_to_collection", {}).get("name") if tmdb_data.get("belongs_to_collection") else None,
                            "blurb": tmdb_data.get("tagline"),
                            "synopsis": tmdb_data.get("overview"),
                            "language": tmdb_data.get("original_language"),
                            "country": ", ".join(tmdb_data.get("origin_country", []) or []),
                            "poster": f"https://image.tmdb.org/t/p/original{tmdb_data.get('poster_path')}" if tmdb_data.get("poster_path") else None,
                            "background_pic": f"https://image.tmdb.org/t/p/original{tmdb_data.get('backdrop_path')}" if tmdb_data.get("backdrop_path") else None,
                            "runtime": timedelta(minutes=tmdb_data.get("runtime", 0)) if tmdb_data.get("runtime") else None,
                            "genre": [g["name"] for g in tmdb_data.get("genres", [])] or [],
                            "budget": tmdb_data.get("budget") or 0,
                            "box_office": tmdb_data.get("revenue") or 0,
                            "release_date": tmdb_data.get("release_date"),
                            "seen": True,
                            "rating": rating,  # Set your Letterboxd rating
                        }

                        serializer = FilmSerializer(data=film_data)
                        if serializer.is_valid():
                            film = serializer.save()
                            imported += 1
                            self.stdout.write(self.style.SUCCESS(f'Imported new film: {title} with rating {rating}'))
                        else:
                            skipped += 1
                            self.stdout.write(self.style.ERROR(f'Validation failed for {title}: {serializer.errors}'))
                    else:
                        skipped += 1
                        self.stdout.write(self.style.WARNING(f'No TMDb data found for {title}'))

        self.stdout.write(
            self.style.SUCCESS(
                f'Import complete: {imported} imported, {updated} updated, {skipped} skipped.'
            )
        )