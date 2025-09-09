from rest_framework import serializers
from .models import (
    Watch, Music, FilmCollection, BookCollection,
    Wardrobe, GameCollection, Art,
    ExtrasCategory, Extra, Film, Book
)

class WatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watch
        fields = '__all__'
        
class MusicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Music
        fields = "__all__"


class FilmCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilmCollection
        fields = "__all__"


class BookCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCollection
        fields = "__all__"


class WardrobeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wardrobe
        fields = "__all__"


class GameCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameCollection
        fields = "__all__"


class ArtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Art
        fields = "__all__"


class ExtrasCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtrasCategory
        fields = "__all__"


class ExtraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Extra
        fields = "__all__"


class FilmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Film
        fields = "__all__"


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"