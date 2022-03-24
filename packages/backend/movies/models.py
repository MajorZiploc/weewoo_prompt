from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Movie(models.Model):
  id = models.AutoField(primary_key=True)
  title = models.CharField(max_length=100)
  genre = models.CharField(max_length=100)
  year = models.IntegerField()
  rating = models.IntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(10)])
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  creator = models.ForeignKey('auth.User', related_name='movies', on_delete=models.CASCADE)

  class Meta:
    ordering = ['-id']
