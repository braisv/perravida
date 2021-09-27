const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const APIHandler = require("../service/APIhandler.js");
const moviesDB = new APIHandler('https://api.themoviedb.org/3/movie/');
const User = require("../models/User");
const Review = require("../models/Review");
const secure = require("../middlewares/secure.mid");

router.get('/search', (req, res, next) => {
  const user = req.user;
  moviesDB.getPopular()
    .then((response) => {
      const movie = response.data.results
      res.render('movies/search', { movie, user })
    })
})

router.post('/result', (req, res, next) => {
  const query = req.body.search;
  const user = req.user;
  moviesDB.getBySearch(query)
    .then((response) => {
      const movie = response.data.results
      res.render('movies/result', { movie, user })
    })
})

router.post('/cast', (req, res, next) => {
  const query = req.body.searchCast;
  const user = req.user;
  moviesDB.getActor(query)
    .then((response) => {
      console.log(response)
      const cast = response.data.results
      console.log(cast)
      res.render('movies/cast', { cast, user })
    })
})

router.post('/search/user', (req, res, next) => {
  const search = req.body.searchUser;
  const user = req.user;
  User.find({ username: search })
    .then((userFound) => {
      res.render('users/search', { userFound, user })
    })
})

router.get('/info/:id', (req, res, next) => {
  const id = req.params.id;
  const user = req.user;
  moviesDB.getById(id)
    .then((response) => {
      const movie = response.data
      Movie.findOne({ APIid: id })
        .populate('review')
        .then((movieLocal) => {
          if (!!movieLocal) {
            if (movieLocal.review.some(rew => (rew.user).toString() == (req.user._id).toString())) {
              let score;
              movieLocal.review.map((rew) => {
                ((rew.user).toString() === (req.user._id).toString()) ? score = rew : 0
              });
              res.render('movies/info', { movie, score, user })
            } else res.render('movies/info', { movie, user })
          }
          else res.render('movies/info', { movie, user })
        })
        .catch(err => {
          throw err
        })
    })
    .catch(err => next(err))
})

router.post('/info/score/:scoreId', secure.checkIfLogged, (req, res, next) => {
  const rating = req.body.rating;
  const user = req.user;
  Review.findByIdAndUpdate(req.params.scoreId, { score: rating }, { new: true })
    .then(res.redirect('back', { user }))
    .catch((err) => {
      throw err
    })
})

router.get('/movies/:id', (req, res, next) => {
  const user = req.user;
  const id = req.params.id;
  moviesDB.getActingMovies(id)
    .then((response) => {
      const movie = response.data.cast
      console.log(movie)
      res.render('movies/acting', { movie, user })
    })
})

router.get('/cast/:id', (req, res, next) => {
  const user = req.user;
  const id = req.params.id;
  moviesDB.getCast(id)
    .then((response) => {
      const cast = response.data.cast
      res.render('movies/cast-movie', { cast, user })
    })
})

router.post('/info/:id', secure.checkIfLogged, (req, res, next) => {
  const movieId = req.params.id;
  const userId = req.user;
  const rating = req.body.rating;

  //TODO faltan director y casting
  //TODO comprobacion de que la peli
  // no esta ya en nuestra BD
  Movie.findOne({ APIid: movieId })
    .then((movie) => {
      if (!!movie) {
        Review.create({
          user: userId,
          movie: movie._id,
          score: rating
        }).then((newReview) => {
          Movie.updateOne(
            { APIid: movieId },
            { $push: { review: newReview._id } },
            { new: true }
          ).then(() => {
            res.redirect('back'), { user };
          })
        })
      } else {
        moviesDB.getById(movieId).
          then((response) => {
            const movie = response.data
            Movie.create({
              APIid: movieId,
              title: movie.title,
              year: movie.release_date,
              poster: movie.poster_path,
              duration: movie.runtime,
              genre: movie.genres,
              sinopsis: movie.overview,
            }).then((movie) => {
              Review.create({
                user: userId,
                movie: movie._id,
                score: rating
              }).then((newReview) => {
                Movie.updateOne(
                  { APIid: movieId },
                  { $push: { review: newReview._id } },
                  { new: true }
                ).then(() => {
                  res.redirect('back'), { user };
                })
              })
            })
          }).catch((err) => next(err));
      }
    })

});

module.exports = router;