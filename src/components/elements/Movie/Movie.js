import React, { Component } from "react";
import { API_KEY, API_URL } from "../../../config";
import Navigation from "../Navigation/Navigation";
import MovieInfo from "../MovieInfo/MovieInfo";
import MovieInfoBar from "../MovieInfoBar/MovieInfoBar";
import FourColGrid from "../FourColGrid/FourColGrid";
import Actor from "../Actor/Actor";
import Spinner from "../Spinner/Spinner";
import "./Movie.css";
class Movie extends Component {
  state = {
    movie: null,
    actors: null,
    directors: [],
    loading: false
  };

  // Calling the API from
  componentDidMount() {
    if (localStorage.getItem(`${this.props.match.params.movieId}`)) {
      const state = JSON.parse(
        localStorage.getItem(`${this.props.match.params.movieId}`)
      );
      this.setState({ ...state });
    } else {
      this.setState({ loading: true });
      // First fetch the movie ...
      const endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-US`;
      this.fetchItems(endpoint);
    }
  }

  // Fetch items gets all the url data from API
  fetchItems = endpoint => {
    fetch(endpoint)
      .then(result => result.json())
      .then(result => {
        console.log(result);
        if (result.status_code) {
          // if result has status_code means data not exist
          this.setState({ status: false });
        } else {
          this.setState({ movie: result }, () => {
            // ..then fetch actors in the setState callback function
            const endpoint = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}&language=en-US`;
            fetch(endpoint)
              .then(result => result.json())
              .then(result => {
                const directors = result.crew.filter(
                  member => member.job === "Director"
                );

                this.setState(
                  {
                    actors: result.cast,
                    directors, // equivalent to directors:directors,
                    loading: false
                  },
                  () => {
                    // Trick - Hit API only once next time fetch from localstorage
                    localStorage.setItem(
                      `${this.props.match.params.movieId}`,
                      JSON.stringify(this.state)
                    );
                  }
                );
              });
          });
        }
      })
      .catch(error => console.error("Error:", error));
  };
  render() {
    return (
      <div className="rmdb-movie">
        {/* If movie exists in API */}
        {this.state.movie ? (
          <div>
            {/* movieName is the parameter we passed in <Link> */}
            <Navigation movie={this.props.location.movieName} />
            <MovieInfo
              movie={this.state.movie}
              directors={this.state.directors}
            />
            <MovieInfoBar
              time={this.state.movie.runtime}
              budget={this.state.movie.budget}
              revenue={this.state.movie.revenue}
            />
          </div>
        ) : null}
        {/* If actor exists in API */}
        {this.state.actors ? (
          <div className="rmdb-movie-grid">
            <FourColGrid header={"Actors"}>
              {this.state.actors.map((element, i) => {
                return <Actor key={i} actor={element} />;
              })}
            </FourColGrid>
          </div>
        ) : null}
        {/* If neither actor exists nor loading - no movie found message */}
        {!this.state.actors && !this.state.loading ? (
          <h1>No Movie Found!</h1>
        ) : null}
        {/* Show spinner for loading state */}
        {this.state.loading ? <Spinner /> : null}
      </div>
    );
  }
}
export default Movie;
