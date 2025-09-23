from rest_framework import serializers
from .models import (
    Watch, Music, FilmCollection, BookCollection,
    Wardrobe, GameCollection, Art,
    ExtrasCategory, Extra, Film, Book,
    Instrument, List
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
        
class InstrumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = "__all__"
        
class ListSerializer(serializers.ModelSerializer):
    films = FilmSerializer(many=True, read_only=True)
    books = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Book.objects.all(), required=False
    )
    
    class Meta:
        model = List
        fields = [
            "id",
            "name",
            "description",
            "category",
            "films",
            "books",
            "created_at",
        ]
    
    def validate(self, data):
        category = data.get("category")
        films = data.get("films", [])
        books = data.get("books", [])
        
        if category == "film" and books:
            raise serializers.ValidationError("Book items are not allowed in a Film list.")
        if category == "book" and films:
            raise serializers.ValidationError("Film items are not allowed in a Book list.")
        
        return data