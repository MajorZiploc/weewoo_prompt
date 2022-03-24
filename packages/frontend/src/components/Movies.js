import React from 'react';
import DataContext from '../context/DataContext';
import GenericCrudTable from './GenericCrudTable';

const Movies = () => {
  const data = React.useContext(DataContext);
  const validatedMovie = enteredMovie => {
    var isValid = true;
    var errorMessage = '';
    if (enteredMovie.title.trim() === '') {
      isValid = false;
      errorMessage += 'Title must be filled.';
    }
    if (enteredMovie.genre.trim() === '') {
      isValid = false;
      errorMessage += 'Genre must be filled.';
    }
    if (enteredMovie.year === '' || isNaN(Number(enteredMovie.year))) {
      isValid = false;
      errorMessage += 'Year must be a number.';
    }
    return { isValid, errorMessage };
  };

  const crudTableProps = {
    modelName: 'Movie',
    defaultModel: {
      id: 0,
      title: '',
      genre: '',
      year: '',
    },
    modelId: 'id',
    modelFields: ['title', 'genre', 'year'],
    modelData: {
      postModel: data.postMovie.bind(data),
      putModel: data.putMovie.bind(data),
      getModels: data.getMovies.bind(data),
      deleteModel: data.deleteMovie.bind(data),
    },
    validatedModel: validatedMovie,
    tableId: 'moviesTable',
  };
  return <GenericCrudTable {...crudTableProps} />;
};

export default Movies;
