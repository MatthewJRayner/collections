from django.shortcuts import render
from rest_framework import viewsets
from .models import (
    Watch, Music, FilmCollection, BookCollection,
    Wardrobe, GameCollection, Art,
    ExtrasCategory, Extra, Film, Book,
    Instrument
)
from .serializers import (
    WatchSerializer, MusicSerializer, FilmCollectionSerializer, BookCollectionSerializer,
    WardrobeSerializer, GameCollectionSerializer, ArtSerializer,
    ExtrasCategorySerializer, ExtraSerializer, FilmSerializer, BookSerializer,
    InstrumentSerializer
)

# Create your views here.
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


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
class InstrumentViewSet(viewsets.ModelViewSet):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer