from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Watch(models.Model):
    brand = models.CharField(max_length=100)
    collection = models.CharField(max_length=100, blank=True, null=True)
    model = models.CharField(max_length=100)
    reference_number = models.CharField(max_length=50, blank=True, null=True)
    registration_number = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    diameter = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    photo = models.URLField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
    movement = models.CharField(max_length=100, blank=True, null=True)
    winding = models.CharField(max_length=100, blank=True, null=True)
    complications = models.JSONField(default=list, blank=True, null=True) # Format: ["Small Seconds", "Date", "Chronograph"] etc.
    strap = models.CharField(max_length=100, blank=True, null=True)
    dial = models.CharField(max_length=100, blank=True, null=True)
    case = models.CharField(max_length=100, blank=True, null=True)
    numerals = models.CharField(max_length=100, blank=True, null=True)
    owned = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    date_bought = models.DateField(blank=True, null=True)
    
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
    genre = models.JSONField(default=list, blank=True, null=True) # Format: ["Rock", "Pop"]
    length = models.DurationField(blank=True, null=True)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    cover_art = models.URLField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    label = models.CharField(max_length=200, blank=True, null=True)
    tracklist = models.JSONField(blank=True, null=True) # Format: {"track_number": 1, "title":  "Song Title", "lyrics": "Lyrics here", "length": "4:53"}
    link = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    date_bought = models.DateField(blank=True, null=True)

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
    genre = models.JSONField(default=list, blank=True, null=True) # Format: ['Comedy', 'Romance]
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    cover_art = models.URLField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    studio = models.CharField(max_length=200, blank=True, null=True)
    runtime = models.DurationField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    special_features = models.BooleanField(blank=True, null=True)
    features = models.JSONField(default=list, blank=True, null=True)
    date_bought = models.DateField(blank=True, null=True)

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
    edition = models.CharField(max_length=50, blank=True, null=True)
    printing = models.CharField(max_length=50, blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    date_bought = models.DateField(blank=True, null=True)

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
    material = models.CharField(max_length=100, blank=True, null=True)
    colour = models.JSONField(blank=True, null=True)
    pictures = models.JSONField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    preferred_quantity = models.IntegerField(blank=True, null=True)
    owned = models.BooleanField(default=False)
    features = models.JSONField(default=list, null=True, blank=True)
    collection = models.CharField(max_length=200, blank=True, null=True)
    notes = models.TextField(null=True, blank=True)
    date_bought = models.DateField(null=True, blank=True)
    
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
    console = models.CharField(max_length=200, blank=True, null=True)
    title = models.CharField(max_length=200)
    special_title = models.CharField(max_length=200, blank=True, null=True)
    developer = models.CharField(max_length=200, blank=True, null=True)
    bonus_content = models.JSONField(default=list, null=True, blank=True)
    release_date = models.DateField(blank=True, null=True)
    genre = models.JSONField(default=list, blank=True, null=True)
    cover_art = models.URLField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    publisher = models.CharField(max_length=200, blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    series = models.CharField(max_length=200, default="")
    date_bought = models.DateField(blank=True, null=True)

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
    movement = models.CharField(max_length=200, blank=True, null=True)
    tags = models.JSONField(default=list, blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    photo = models.URLField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    date_bought = models.DateField(blank=True, null=True)

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
    category = models.ForeignKey(ExtrasCategory, on_delete=models.CASCADE, related_name="extra", null=True, blank=True)
    theme = models.CharField(max_length=200)
    brand = models.CharField(max_length=200, blank=True, null=True)
    model = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    links = models.JSONField(blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
    year_specificity = models.CharField(max_length=50, choices=YEAR_SPECIFICITY_CHOICES, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    photo = models.URLField(blank=True, null=True)
    date_bought = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.brand} {self.model} ({self.category})"
    
class Film(models.Model):
    title = models.CharField(max_length=200)
    alt_title = models.CharField(max_length=200, blank=True, null=True)
    director = models.CharField(max_length=200, default="")
    alt_name = models.CharField(max_length=200, blank=True, null=True)
    cast = models.JSONField(blank=True, null=True) # Format: [{"actor": "Actor Name", "role": "Role Name"}, ...]
    crew = models.JSONField(blank=True, null=True) # Format: [{"name": "Crew Member Name", "role": "Role Description"}, ...]
    rating = models.DecimalField(max_digits=4, blank=True, null=True, decimal_places=1)
    industry_rating = models.DecimalField(max_digits=4, blank=True, null=True, decimal_places=1)
    review = models.TextField(blank=True, null=True)
    series = models.CharField(max_length=200, blank=True, null=True)
    volume = models.IntegerField(blank=True, null=True)
    blurb = models.TextField(blank=True, null=True)
    synopsis = models.TextField(blank=True, null=True)
    external_links = models.URLField(blank=True, null=True)
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
    genre = models.JSONField(default=list, blank=True, null=True) # Format: ["Drama", "Comedy"]
    tags = models.JSONField(default=list, blank=True, null=True) # Format: ["80s", "Cult Classic"]
    awards_won = models.JSONField(blank=True, null=True) # Format: [{"name": "Award Name", "won": true, "category": "Category Name"}, ...]
    budget = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    box_office = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    release_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    favourite = models.BooleanField(default=False)
    seen = models.BooleanField(default=False)
    date_watched = models.DateField(blank=True, null=True)
    watchlist = models.BooleanField(default=False)
    tmdb_id = models.IntegerField(blank=True, null=True)
    
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
    alt_title = models.CharField(max_length=200, blank=True, null=True)
    author = models.CharField(max_length=200)
    alt_name = models.CharField(max_length=200, blank=True, null=True)
    series = models.CharField(max_length=200, blank=True, null=True)
    volume = models.IntegerField(blank=True, null=True)
    date_published = models.DateField(blank=True, null=True)
    year_released = models.IntegerField(blank=True, null=True)
    year_specificity = models.CharField(max_length=50, choices=YEAR_SPECIFICITY_CHOICES, blank=True, null=True)
    rating = models.DecimalField(max_digits=4, blank=True, null=True, decimal_places=1)
    industry_rating = models.DecimalField(max_digits=4, blank=True, null=True, decimal_places=1)
    genre = models.JSONField(default=list, blank=True, null=True)
    tags = models.JSONField(default=list, blank=True, null=True)
    review = models.TextField(blank=True, null=True)
    page_count = models.IntegerField(blank=True, null=True)
    format = models.CharField(max_length=50, blank=True, null=True)
    cover = models.URLField(blank=True, null=True)
    external_links = models.JSONField(blank=True, null=True)
    ISBN = models.CharField(max_length=20, blank=True, null=True)
    synopsis = models.TextField(blank=True, null=True)
    publisher = models.CharField(max_length=200, blank=True, null=True)
    edition = models.CharField(max_length=50, blank=True, null=True)
    edition_read_year = models.IntegerField(blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    og_language = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    read = models.BooleanField(default=False)
    favourite = models.BooleanField(default=False)
    readlist = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    date_read = models.DateField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.title} ({self.author})"

class Instrument(models.Model):
    CATEGORY_CHOICES = [
        ("string", "String"),
        ("keyboard", "keyboard"),
        ("percussion", "Percussion"),
        ("wind", "Wind"),
        ("brass", "Brass"),
        ("electronic", "Electronic"),
        ("other", "Other"),
    ]
    
    instrument = models.CharField(max_length=200)
    brand = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=200)
    maker = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    type = models.CharField(max_length=100, null=True, blank=True)
    year = models.IntegerField(null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    owned = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    photo = models.URLField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    date_bought = models.DateField(blank=True, null=True)
    materials = models.CharField(max_length=100, blank=True, null=True)
    
class List(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=10)
    
    films = models.ManyToManyField("Film", blank=True, related_name="lists")
    books = models.ManyToManyField("Book", blank=True, related_name="lists")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.category})"
    
class LivePerformance(models.Model):
    YEAR_SPECIFICITY_CHOICES = [
        ("exact", "Exact"),
        ("year", "Year"),
        ("decade", "Decade"),
        ("century", "Century"),
        ("millennium", "Millennium"),
        ("unknown", "Unknown"),
    ]
    
    title = models.CharField(max_length=255)
    original_title = models.CharField(max_length=255, blank=True, null=True)
    performance_type = models.CharField(max_length=50)
    original_language = models.CharField(max_length=100, blank=True, null=True)
    language_heard = models.CharField(max_length=100, blank=True, null=True)
    creator = models.CharField(max_length=255)
    alt_name = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    conductor = models.CharField(max_length=255, blank=True, null=True)
    director = models.CharField(max_length=255, blank=True, null=True)
    orchestra_ensemble = models.CharField(max_length=255, blank=True, null=True)
    seen = models.BooleanField(default=True)
    date_seen = models.DateField(blank=True, null=True)
    location_seen = models.CharField(max_length=255, blank=True, null=True)
    location_premiered = models.CharField(max_length=255, blank=True, null=True)
    date_premiered = models.DateField(blank=True, null=True)
    pieces = models.JSONField(default=list, blank=True) # Format: [{"title": TITLE, "composer": COMPOSER, "movement": [MOVEMENTS]}, ]
    cast = models.JSONField(default=list, blank=True) # Format: [{"character": NAME, "performer": NAME}, ]
    rating = models.IntegerField(blank=True, null=True)
    review = models.TextField(blank=True, null=True)
    images = models.URLField(blank=True, null=True)
    external_links = models.URLField(blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
    year_specificity = models.CharField(max_length=50, choices=YEAR_SPECIFICITY_CHOICES, blank=True, null=True)