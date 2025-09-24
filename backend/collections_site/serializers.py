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
    films_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    books = BookSerializer(many=True, read_only=True)
    books_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = List
        fields = [
            "id",
            "name",
            "description",
            "category",
            "films",
            "films_ids",
            "books",
            "books_ids",
            "created_at",
        ]

    def validate(self, data):
        category = data.get("category")
        films = data.get("films", [])
        books = data.get("books", [])
        if category == "film":
            if books or data.get("books_ids"):
                raise serializers.ValidationError("Book items are not allowed in a Film list.")
            data["books_ids"] = []  # Ensure books_ids is empty
        elif category == "book":
            if films or data.get("films_ids"):
                raise serializers.ValidationError("Film items are not allowed in a Book list.")
            data["films_ids"] = []  # Ensure films_ids is empty
        return data

    def validate_films_ids(self, value):
        if not value:
            return []
        invalid_ids = []
        for fid in value:
            try:
                film_id = int(fid)  # Ensure integer
                if not Film.objects.filter(id=film_id).exists():
                    invalid_ids.append(f"{film_id} (not found in database)")
            except (ValueError, TypeError) as e:
                invalid_ids.append(f"{fid} (invalid format: {type(fid)})")
        if invalid_ids:
            raise serializers.ValidationError(f"Invalid film IDs: {invalid_ids}")
        return value

    def create(self, validated_data):
        films_ids = validated_data.pop("films_ids", [])
        books_ids = validated_data.pop("books_ids", [])
        instance = super().create(validated_data)
        if films_ids:
            instance.films.set(films_ids)
        if books_ids:
            instance.books.set(books_ids)
        return instance

    def update(self, instance, validated_data):
        films_ids = validated_data.pop("films_ids", [])
        books_ids = validated_data.pop("books_ids", [])
        instance = super().update(instance, validated_data)
        if films_ids:
            instance.films.set(films_ids)
        if books_ids:
            instance.books.set(books_ids)
        return instance

    def validate_books_ids(self, value):
        if not value:
            return []
        invalid_ids = []
        for bid in value:
            try:
                book_id = int(bid)
                if not Book.objects.filter(id=book_id).exists():
                    invalid_ids.append(f"{book_id} (not found in database)")
            except (ValueError, TypeError) as e:
                invalid_ids.append(f"{bid} (invalid format: {type(bid)})")
        if invalid_ids:
            raise serializers.ValidationError(f"Invalid book IDs: {invalid_ids}")
        return value