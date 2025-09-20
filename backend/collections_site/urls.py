from rest_framework import routers
from .views import (
    WatchViewSet, MusicViewSet, FilmCollectionViewSet, BookCollectionViewSet,
    WardrobeViewSet, GameCollectionViewSet, ArtViewSet,
    ExtrasCategoryViewSet, ExtraViewSet, FilmViewSet, BookViewSet,
    InstrumentViewSet
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

urlpatterns = router.urls