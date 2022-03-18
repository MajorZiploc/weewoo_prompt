from rest_framework.test import APITestCase
# useful to have this in INSTALLED_APPS in your settings.py for the following import 'rest_framework.authtoken',
# from rest_framework.authtoken.models import Token
from movies import models
from movies import views
from django.contrib.auth.models import User
import json
from . import utils_for_tests as u

get_endpoint = 'movies:get_post_movies'
post_endpoint = 'movies:get_post_movies'
put_endpoint = 'movies:get_delete_update_movie'
patch_endpoint = 'movies:get_delete_update_movie'
delete_endpoint = 'movies:get_delete_update_movie'

class MoviesTests(APITestCase):

  def setUp(self):
    # self.factory = APIRequestFactory()  # usefule for just calling the api but not inspecting responses
    # self.client = APIClient()  # useful for calling api and inspecting responses
    self.user1 = User.objects.create_user(
        username='user@foo.com', email='user@foo.com', password='top_secret')
    self.user2 = User.objects.create_user(
        username='tom@foo.com', email='tom@foo.com', password='top_secret2')
    self.create_view = views.ListCreateMovieAPIView.as_view()
    self.rud_view = views.RetrieveUpdateDestroyMovieAPIView.as_view()

  def test_create_a_movie(self):
    data = u.create_movie_rest_payload()
    response = u.post_thing(get_endpoint, data, self.user1)
    self.assertEqual(response.status_code, 201)
    self.assertEqual(models.Movie.objects.count(), 1)

  def test_user_can_see_all_movies_from_all_users(self):
    data = u.create_movie_rest_payload()
    response = u.post_thing(post_endpoint, data, self.user1)
    data = u.create_movie_rest_payload(title='Ants2')
    response = u.post_thing(post_endpoint, data, self.user2)
    response = u.get_thing(get_endpoint, self.user1)
    self.assertEqual(response.status_code, 200)
    actual = json.loads(response.content)['results']
    self.assertEqual(len(actual), 2)

  def test_update_a_movie_with_put(self):
    movie = u.create_movie_db_entry(user=self.user1)
    data = u.create_movie_rest_payload(title='Cats')
    args = (movie.pk,)
    response = u.put_thing(put_endpoint, data, self.user1, args)
    self.assertEqual(response.status_code, 200)
    self.assertEqual(models.Movie.objects.filter(title='Cats').count(), 1)

  def test_update_a_movie_with_patch(self):
    movie = u.create_movie_db_entry(user=self.user1)
    data = {'title': 'Cats'}
    args = (movie.pk,)
    response = u.patch_thing(patch_endpoint, data, self.user1, args)
    self.assertEqual(response.status_code, 200)
    self.assertEqual(models.Movie.objects.filter(title='Cats').count(), 1)

  def test_delete_the_right_movie(self):
    movie = u.create_movie_db_entry(user=self.user1)
    args = (movie.pk,)
    response = u.delete_thing(delete_endpoint, self.user1, args)
    movie2 = u.create_movie_db_entry(title='Good Boys', user=self.user2)
    self.assertEqual(response.status_code, 204)
    self.assertEqual(models.Movie.objects.count(), 1)
    self.assertQuerysetEqual(models.Movie.objects.all(), [movie2])
