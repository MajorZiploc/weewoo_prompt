import axios from 'axios';

class Data {
  constructor() {
    this.baseUrl = `${process.env.REACT_APP_PUBLIC_URL}:${process.env.REACT_APP_BACKEND_PORT}`;
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setAccessToken(v) {
    localStorage.setItem('accessToken', v);
  }

  setRefreshToken(v) {
    localStorage.setItem('refreshToken', v);
  }

  async refreshAuth() {
    return axios
      .post(
        this.baseUrl + '/api/v1/auth/token/refresh/',
        {
          refresh: this.getRefreshToken(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      )
      .then(r => {
        this.setAccessToken(r.data.access);
        return r.data;
      });
  }

  async login(username, password) {
    return axios
      .post(
        this.baseUrl + '/api/v1/auth/token/',
        {
          username: username,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      )
      .then(r => {
        this.setAccessToken(r.data.access);
        this.setRefreshToken(r.data.refresh);
        return r.data;
      });
  }

  async register(email, username, password, firstName, lastName) {
    return axios
      .post(
        this.baseUrl + '/api/v1/auth/register/',
        {
          email: email,
          username: username,
          password: password,
          password2: password,
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      )
      .then(r => r.data);
  }

  async _getMoviesHelper() {
    return axios
      .get(this.baseUrl + '/api/v1/movies/', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
      })
      .then(r => r.data.results);
  }

  async getMovies() {
    return await this._getMoviesHelper().catch(
      async _e => await this.refreshToken().then(async _r => await this._getMoviesHelper())
    );
  }

  async _postMovieHelper(movie) {
    return axios
      .post(this.baseUrl + '/api/v1/movies/', movie, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
      })
      .then(r => r.data);
  }

  async postMovie(movie) {
    return await this._postMovieHelper(movie).catch(
      async _e => await this.refreshToken().then(async _r => await this._postMovieHelper(movie))
    );
  }

  async _getMovieHelper(id) {
    return axios
      .get(this.baseUrl + `/api/v1/movies/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
      })
      .then(r => r.data.results);
  }

  async getMovie(id) {
    return await this._getMovieHelper(id).catch(
      async _e => await this.refreshToken().then(async _r => await this._getMovieHelper(id))
    );
  }

  async _putMovieHelper(id, movie) {
    return axios
      .put(this.baseUrl + `/api/v1/movies/${id}/`, movie, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
      })
      .then(r => r.data);
  }

  async putMovie(id, movie) {
    return await this._putMovieHelper(id, movie).catch(
      async _e => await this.refreshToken().then(async _r => await this._putMovieHelper(id, movie))
    );
  }

  async _patchMovieHelper(id, movie) {
    return axios
      .patch(this.baseUrl + `/api/v1/movies/${id}`, movie, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
      })
      .then(r => r.data);
  }

  async patchMovie(id, movie) {
    return await this._patchMovieHelper(id, movie).catch(
      async _e => await this.refreshToken().then(async _r => await this._patchMovieHelper(id, movie))
    );
  }

}

export const data = new Data();
