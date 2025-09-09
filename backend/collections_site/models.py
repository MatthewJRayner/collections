from django.db import models

# Create your models here.
class Watch(models.Model):
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    reference_number = models.CharField(max_length=50, blank=True, null=True)
    registration_number = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    case_size = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    photo = models.URLField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    owned = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.brand} {self.model} ({self.reference_number})"

class Music(models.Model):
    FORMAT_CHOICES = [
        ("vinyl", "Vinyl"),
        ("cd", "CD"),
        ("cassette", "Cassette"),
        ("8cm", "8CM"),
        ("digital", "Digital"),
        ("other", "Other"),
    ]
    TYPE_CHOICES = [
        ("album", "Album"),
        ("single", "Single"),
        ("ep", "EP"),
        ("live", "Live"),
        ("compilation", "Compilation"),
        ("other", "Other"),
    ]

    owned = models.BooleanField(default=False)
    format = models.CharField(max_length=50, choices=FORMAT_CHOICES)
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    release_date = models.DateField(blank=True, null=True)
    catalog_number = models.CharField(max_length=50, blank=True, null=True)
    genre = models.JSONField(default=list, blank=True, null=True)
    length = models.DurationField(blank=True, null=True)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    cover_art = models.URLField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    label = models.CharField(max_length=200, blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.artist} - {self.title} ({self.format})"

class FilmCollection(models.Model):
    FORMAT_CHOICES = [
        ("dvd", "DVD"),
        ("blu-ray", "Blu-ray"),
        ("4k", "4K"),
        ("vhs", "VHS"),
        ("laserdisc", "LaserDisc"),
        ("betamax", "Betamax"),
        ("film", "Film"),
        ("digital", "Digital"),
        ("other", "Other"),
    ]
    TYPE_CHOICES = [
        ("movie", "Movie"),
        ("series", "Series"),
        ("documentary", "Documentary"),
        ("short", "Short Film"),
        ("other", "Other"),
    ]

    owned = models.BooleanField(default=False)
    format = models.CharField(max_length=50, choices=FORMAT_CHOICES)
    title = models.CharField(max_length=200)
    director = models.CharField(max_length=200, blank=True, null=True)
    release_year = models.PositiveIntegerField(blank=True, null=True)
    genre = models.JSONField(default=list, blank=True, null=True)
    length = models.DurationField(blank=True, null=True)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    cover_art = models.URLField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    studio = models.CharField(max_length=200, blank=True, null=True)
    runtime = models.DurationField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.format})"

class BookCollection(models.Model):
    FORMAT_CHOICES = [
        ("hardcover", "Hardcover"),
        ("paperback", "Paperback"),
        ("ebook", "eBook"),
        ("audiobook", "Audiobook"),
        ("other", "Other"),
    ]

    owned = models.BooleanField(default=False)
    format = models.CharField(max_length=50, choices=FORMAT_CHOICES)
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    publication_date = models.DateField(blank=True, null=True)
    isbn = models.CharField(max_length=20, blank=True, null=True)
    genre = models.JSONField(default=list, blank=True, null=True)
    page_count = models.PositiveIntegerField(blank=True, null=True)
    cover_image = models.URLField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    publisher = models.CharField(max_length=200, blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} by {self.author} ({self.format})"

class Wardrobe(models.Model):
    CATEGORY_CHOICES = [
        ("shirts", "Shirts"),
        ("trousers", "Trousers"),
        ("suits", "Suits"),
        ("coats_jackets", "Coats & Jackets"),
        ("shoes", "Shoes"),
        ("neckwear", "Neckwear"),
        ("knitwear", "Knitwear"),
        ("hosiery", "Hosiery"),
        ("underpinnings", "Underpinnings"),
        ("shirt_accessories", "Shirt Accessories"),
        ("leather_goods", "Leather Goods"),
        ("hats", "Hats"),
        ("tools_essentials", "Gentlemans Tools & Essentials"),
        ("other", "Other"),
    ]
    
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    brands = models.JSONField(blank=True, null=True)
    type = models.CharField(max_length=50, blank=True, null=True)
    style = models.CharField(max_length=100, blank=True, null=True)
    colour = models.JSONField(blank=True, null=True)
    pictures = models.JSONField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    preferred_quantity = models.IntegerField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.category} - {self.type} ({self.style})"
    
class GameCollection(models.Model):
    PLATFORM_CHOICES = [
        ("pc", "PC"),
        ("playstation", "PlayStation"),
        ("xbox", "Xbox"),
        ("nintendo", "Nintendo"),
        ("mobile", "Mobile"),
        ("other", "Other"),
    ]

    owned = models.BooleanField(default=False)
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    title = models.CharField(max_length=200)
    developer = models.CharField(max_length=200, blank=True, null=True)
    release_date = models.DateField(blank=True, null=True)
    genre = models.JSONField(default=list, blank=True, null=True)
    cover_art = models.URLField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    publisher = models.CharField(max_length=200, blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.platform})"
    
class Art(models.Model):
    YEAR_SPECIFICITY_CHOICES = [
        ("exact", "Exact"),
        ("year", "Year"),
        ("decade", "Decade"),
        ("century", "Century"),
        ("millennium", "Millennium"),
        ("unknown", "Unknown"),
    ]
    
    owned = models.BooleanField(default=False)
    title = models.CharField(max_length=200, blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
    year_specificity = models.CharField(max_length=50, choices=YEAR_SPECIFICITY_CHOICES, blank=True, null=True)
    artist = models.CharField(max_length=200, blank=True, null=True)
    culture = models.CharField(max_length=200, blank=True, null=True)
    type = models.CharField(max_length=100, blank=True, null=True)
    format = models.CharField(max_length=100, blank=True, null=True)
    info = models.TextField(blank=True, null=True)
    techniques = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    photo = models.URLField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} by {self.artist} ({self.year})"

class ExtrasCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    
class Extra(models.Model):
    YEAR_SPECIFICITY_CHOICES = [
        ("exact", "Exact"),
        ("year", "Year"),
        ("decade", "Decade"),
        ("century", "Century"),
        ("millennium", "Millennium"),
        ("unknown", "Unknown"),
    ]

    owned = models.BooleanField(default=False)
    category = models.ForeignKey(ExtrasCategory, on_delete=models.CASCADE, related_name="extras", null=True, blank=True)
    brand = models.CharField(max_length=200, blank=True, null=True)
    model = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    links = models.JSONField(blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
    year_specificity = models.CharField(max_length=50, choices=YEAR_SPECIFICITY_CHOICES, blank=True, null=True)
    additional_info = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.brand} {self.model} ({self.category})"
    
class Film(models.Model):
    director = models.CharField(max_length=200, blank=True, null=True)
    cast = models.JSONField(blank=True, null=True)
    crew = models.JSONField(blank=True, null=True)
    title = models.CharField(max_length=200)
    owned = models.ForeignKey(FilmCollection, on_delete=models.SET_NULL, null=True, blank=True, related_name="seen_entries")
    rating = models.IntegerField(blank=True, null=True)
    review = models.TextField(blank=True, null=True)
    synopsis = models.TextField(blank=True, null=True)
    external_links = models.JSONField(blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    festival = models.CharField(max_length=200, blank=True, null=True)
    rewatch_count = models.IntegerField(default=0)
    poster = models.URLField(blank=True, null=True)
    background_pic = models.URLField(blank=True, null=True)
    medium = models.CharField(max_length=50, blank=True, null=True)
    sound = models.BooleanField(default=True)
    colour = models.BooleanField(default=True)
    runtime = models.DurationField(blank=True, null=True)
    genre = models.JSONField(default=list, blank=True, null=True)
    tags = models.JSONField(default=list, blank=True, null=True)
    awards_won = models.JSONField(blank=True, null=True)
    budget = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    box_office = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    release_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.title} ({self.director})"

class Book(models.Model):
    YEAR_SPECIFICITY_CHOICES = [
        ("exact", "Exact"),
        ("year", "Year"),
        ("decade", "Decade"),
        ("century", "Century"),
        ("millennium", "Millennium"),
        ("unknown", "Unknown"),
    ]

    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    owned = models.ForeignKey(BookCollection, on_delete=models.SET_NULL, null=True, blank=True, related_name="read_entries")
    year_released = models.IntegerField(blank=True, null=True)
    year_specificity = models.CharField(max_length=50, choices=YEAR_SPECIFICITY_CHOICES, blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    genre = models.JSONField(default=list, blank=True, null=True)
    tags = models.JSONField(default=list, blank=True, null=True)
    review = models.TextField(blank=True, null=True)
    page_count = models.IntegerField(blank=True, null=True)
    format = models.CharField(max_length=50, blank=True, null=True)
    cover = models.URLField(blank=True, null=True)
    external_links = models.JSONField(blank=True, null=True)
    ISBN = models.CharField(max_length=20, blank=True, null=True)
    series = models.CharField(max_length=200, blank=True, null=True)
    synopsis = models.TextField(blank=True, null=True)
    publisher = models.CharField(max_length=200, blank=True, null=True)
    edition = models.CharField(max_length=50, blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)