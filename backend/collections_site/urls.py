from django.urls import path, include
from rest_framework import routers
from .views import (
    WatchViewSet, MusicViewSet, FilmCollectionViewSet, BookCollectionViewSet,
    WardrobeViewSet, GameCollectionViewSet, ArtViewSet,
    ExtrasCategoryViewSet, ExtraViewSet, FilmViewSet, BookViewSet,
    InstrumentViewSet, ListViewSet, batch_import_films
)

router = routers.DefaultRouter()
router.register(r'watches', WatchViewSet)
router.register(r'music', MusicViewSet)
router.register(r'film-collections', FilmCollectionViewSet)
router.register(r'book-collections', BookCollectionViewSet)
router.register(r'wardrobe', WardrobeViewSet)
router.register(r'games', GameCollectionViewSet)
router.register(r'art', ArtViewSet)
router.register(r'extras-categories', ExtrasCategoryViewSet)
router.register(r'extra', ExtraViewSet)
router.register(r'films', FilmViewSet)
router.register(r'books', BookViewSet)
router.register(r'instruments', InstrumentViewSet)
router.register(r'lists', ListViewSet, basename="list")

urlpatterns = [
    path("", include(router.urls)),
    path("batch-import-films/", batch_import_films, name="batch_import_films")
] 