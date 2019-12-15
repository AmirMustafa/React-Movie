import React, { Component } from "react";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
  POSTER_SIZE
} from "../../config";

import HeroImage from "../elements/HeroImage/HeroImage";
import SearchBar from "../elements/SearchBar/SearchBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import MovieThumb from "../elements/MovieThumb/MovieThumb";
import LoadMoreBtn from "../elements/LoadMoreBtn/LoadMoreBtn";
import Spinner from "../elements/Spinner/Spinner";

import "./Home.css";

class Home extends Component {
  // setting default data 0 or null or empty as per datatype
  state = {
    movies: [],
    heroImage: null,
    loading: false,
    currentPage: 0,
    totalPages: 0,
    searchTerm: ""
  };

  // This life cycle method is called after render - here we will call our API
  componentDidMount() {
    // Fetch from localStorage if exists - optimizing code
    if (localStorage.getItem("HomeState")) {
      const state = JSON.parse(localStorage.getItem("HomeState"));
      this.setState({ ...state });
    }

    // First time fetch from API and save in localStorage,
    else {
      this.setState({ loading: true });
      const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`; // API for getting popular movie
      this.fetchItems(endpoint);
    }
  }

  searchItem = searchTerm => {
    let endpoint = "";
    this.setState({
      movies: [],
      loading: true,
      searchTerm
    });

    // Without search - 1st page data
    if (searchTerm === "") {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    }
    // With search - 1st page data
    else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`; // Search API
      console.log("Search = " + endpoint); // amir
    }

    this.fetchItems(endpoint);
  };

  loadMoreItems = () => {
    let endpoint = "";
    this.setState({ loading: true });

    // Without search - loading button
    if (this.state.searchTerm === "") {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${this
        .state.currentPage + 1}`;
    }
    // search case - loading button
    else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${
        this.state.searchTerm
      }&page=${this.state.currentPage + 1}`;
    }

    this.fetchItems(endpoint);
  };

  fetchItems = endpoint => {
    // a fetch promise that will get data from the API
    fetch(endpoint)
      .then(result => result.json())
      .then(result => {
        // console.log("New result = ");
        // console.log(result); // get complete data from API

        this.setState(
          {
            movies: [...this.state.movies, ...result.results], // 1st spread - get old data in state + append new data
            heroImage: this.state.heroImage || result.results[0], // if old image show otherwise get 1st result image
            loading: false,
            currentPage: result.page, // with page we get current page no. of API
            totalPages: result.total_pages // with total_pages we get total pages (check API result for better understanding)
          },
          () => {
            // if you need state in some other page - here once we get API data save it
            if (this.state.searchTerm === "") {
              // save only not search case
              localStorage.setItem("HomeState", JSON.stringify(this.state));
            }
          }
        );
      });
  };

  render() {
    /* ES6 Destructuring State */
    const {
      movies,
      heroImage,
      loading,
      currentPage,
      totalPages,
      searchTerm
    } = this.state;
    return (
      <div className="rmdb-home">
        {heroImage ? ( // if hero image exists
          <div>
            {/* sample image = http://image.tmdb.org/t/p/w1280/mSQjVoZJaZkaHpdLIahh04bfGDr.jpg */}
            <HeroImage
              image={
                `${IMAGE_BASE_URL}/${BACKDROP_SIZE}/` + heroImage.backdrop_path
              }
              title={heroImage.original_title}
              text={heroImage.overview}
            />
            <SearchBar callback={this.searchItem} />
          </div>
        ) : null}
        <div className="rmdb-home-grid">
          <FourColGrid
            header={searchTerm ? "Search Result" : "Popular Movies"}
            loading={loading}
          >
            {movies.map((element, i) => {
              return (
                <MovieThumb
                  key={i}
                  clickable={true}
                  image={
                    element.poster_path
                      ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}`
                      : "./images/no_image.jpg"
                  }
                  movieId={element.id}
                  movieName={element.original_title}
                />
              );
            })}
          </FourColGrid>
        </div>
        {loading ? <Spinner /> : null}{" "}
        {/* Show spinner only when it is loading case */}
        {currentPage < totalPages && !this.loading} ?
        <LoadMoreBtn text="Load More" onClick={this.loadMoreItems} /> :
      </div>
    );
  }
}

export default Home;
