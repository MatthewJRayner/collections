from django.contrib import admin
from .models import (
    Watch, Music, FilmCollection, BookCollection, GameCollection,
    Wardrobe, Art, ExtrasCategory, 
    Extra, Film, Book,
    Instrument, List, LivePerformance
)

# Register your models here.
@admin.register(Watch)
class WatchAdmin(admin.ModelAdmin):
    list_display = ("brand", "model", "reference_number", "country", "owned", "price")
    list_filter = ("owned", "country")
    search_fields = ("brand", "model", "reference_number")
    

@admin.register(Music)
class MusicAdmin(admin.ModelAdmin):
    list_display = ("artist", "title", "format", "type", "owned", "release_date", "genre")
    list_filter = ("format", "type", "owned", "genre", "language", "country")
    search_fields = ("artist", "title", "catalog_number", "label")


@admin.register(FilmCollection)
class FilmCollectionAdmin(admin.ModelAdmin):
    list_display = ("title", "format", "type", "owned", "release_year", "genre")
    list_filter = ("format", "type", "owned", "genre", "language", "country")
    search_fields = ("title", "director", "studio")


@admin.register(BookCollection)
class BookCollectionAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "format", "owned", "publication_date", "genre")
    list_filter = ("format", "owned", "genre", "language", "country")
    search_fields = ("title", "author", "isbn", "publisher")


@admin.register(Wardrobe)
class WardrobeAdmin(admin.ModelAdmin):
    list_display = ("category", "type", "style", "preferred_quantity", "price")
    list_filter = ("category",)
    search_fields = ("type", "brands")


@admin.register(GameCollection)
class GameCollectionAdmin(admin.ModelAdmin):
    list_display = ("title", "platform", "owned", "release_date", "genre")
    list_filter = ("platform", "owned", "genre", "language", "country")
    search_fields = ("title", "developer", "publisher")


@admin.register(Art)
class ArtAdmin(admin.ModelAdmin):
    list_display = ("title", "artist", "year", "year_specificity", "culture", "owned", "price")
    list_filter = ("year_specificity", "owned", "culture")
    search_fields = ("title", "artist", "culture")


@admin.register(ExtrasCategory)
class ExtrasCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name", "description")


@admin.register(Extra)
class ExtraAdmin(admin.ModelAdmin):
    list_display = ("model", "brand", "category", "year", "year_specificity", "owned", "price")
    list_filter = ("year_specificity", "owned", "category")
    search_fields = ("model", "brand", "additional_info")


@admin.register(Film)
class FilmAdmin(admin.ModelAdmin):
    list_display = ("title", "director", "release_date", "genre", "rating", "rewatch_count")
    list_filter = ("genre", "language", "country", "festival")
    search_fields = ("title", "director", "cast", "crew")


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "year_released", "year_specificity", "genre", "rating")
    list_filter = ("year_specificity", "genre", "language", "publisher")
    search_fields = ("title", "author", "ISBN", "series", "publisher")
    
@admin.register(Instrument)
class InstrumentAdmin(admin.ModelAdmin):
    list_display = ("brand", "category", "year", "name", "type")
    list_filter = ("category", "brand")
    search_fields = ("brand", "category", "type")

@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "category")
    search_fields = ("name", "films", "books", "category")
    
@admin.register(LivePerformance)
class LivePerformanceAdmin(admin.ModelAdmin):
    list_display = ("title", "composer", "performance_type")
    search_fields = ("title", "composer", "performance_type", "original_language", "locatio_seen")