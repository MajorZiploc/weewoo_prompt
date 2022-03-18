from django.urls.base import reverse
from django.http import HttpResponse
from rest_framework.test import APIClient
# useful to have this in INSTALLED_APPS in your settings.py for the following import 'rest_framework.authtoken',
# from rest_framework.authtoken.models import Token
from movies import models

def create_movie_db_entry(user, title='Ants', genre='Action', year=1999):
  movie = models.Movie.objects.create(title=title, genre=genre, year=year, creator=user)
  return movie

def create_movie_rest_payload(title='Ants', genre='Action', year=1999):
  return {
    'title': title,
    'genre': genre,
    'year': year
  }

def post_thing(end_point, data, user):
  client = APIClient()
  client.force_authenticate(user=user, token=None)
  response: HttpResponse = client.post(reverse(end_point), data, format='json')
  return response

def put_thing(end_point, data, user, args):
  client = APIClient()
  client.force_authenticate(user=user, token=None)
  response: HttpResponse = client.put(reverse(end_point, args=args), data, format='json')
  return response

def patch_thing(end_point, data, user, args):
  client = APIClient()
  client.force_authenticate(user=user, token=None)
  response: HttpResponse = client.patch(reverse(end_point, args=args), data, format='json')
  return response

def delete_thing(end_point, user, args):
  client = APIClient()
  client.force_authenticate(user=user, token=None)
  response: HttpResponse = client.delete(reverse(end_point, args=args), format='json')
  return response

def get_thing(end_point, user):
  client = APIClient()
  client.force_authenticate(user=user, token=None)
  response: HttpResponse = client.get(reverse(end_point), format='json')
  return response
