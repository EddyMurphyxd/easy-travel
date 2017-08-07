import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native';
import MoviePoster from './MoviePoster';
import MoviePopup from './MoviePopup';

@connect(
  state => ({
    movies: state.reducer.movies,
    loading: state.reducer.loading,
  }),
  dispatch => ({
    refresh: () => dispatch({type: 'GET_MOVIE_DATA'}),
  }),
)
export default class Movies extends Component {
  state = {
    popupIsOpen: false,
    // Day chosen by user
    chosenDay: 0,       // choose first day by default
    // Time chosen by user
    chosenTime: null,
    bookedMovies: [],
  }

  openMovie = (movie) => {
    this.setState({
      popupIsOpen: true,
      movie,
    });
  }

  closeMovie = () => {
    this.setState({
      popupIsOpen: false,
      // Reset values to default ones
      chosenDay: 0,
      chosenTime: null,
    });
  }

  chooseDay = (day) => {
    this.setState({
      chosenDay: day,
    });
  }

  chooseTime = (time) => {
    this.setState({
      chosenTime: time,
    });
  }

  bookTicket = (movie) => {
    // Make sure they selected time
    if (!this.state.chosenTime) {
      alert('Please select show time');
    } else {
      // Close popup
      this.closeMovie();

      const bookedMovies = this.state.bookedMovies.concat([movie]);
      this.setState({
        bookedMovies
      });
      // Navigate away to Confirmation route
      this.props.navigation.navigate('Confirmation', {code: Math.random().toString(36).substring(6).toUpperCase()})
    }
  }

  renderBookedMovies() {
    return (
      <View>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Booked movies:</Text>

        {this.state.bookedMovies.map((movie, index) => {
          return (
            <Text
              style={{fontWeight: 'bold'}}
              key={`${movie.title}-${movie._id}`}
            >{movie.title}</Text>
          );
        })}
      </View>
    )
  }

  render() {
    const { movies, loading, refresh } = this.props;

    return (
      <View style={styles.container}>
        <View style={{paddingBottom: 20}}>
          {this.state.bookedMovies.length ?
          this.renderBookedMovies() :
          <Text>No movies booked atm :(</Text>}
        </View>
        {movies
          ? <ScrollView
              contentContainerStyle={styles.scrollContent}
              // Hide all scroll indicators
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={refresh}
                />
              }
            >
              {movies.map((movie, index) => <MoviePoster
                movie={movie}
                onOpen={this.openMovie}
                key={index}
              />)}
            </ScrollView>
          : <ActivityIndicator
              animating={loading}
              style={styles.loader}
              size="large"
            />
        }
        <MoviePopup
          movie={this.state.movie}
          isOpen={this.state.popupIsOpen}
          onClose={this.closeMovie}
          chosenDay={this.state.chosenDay}
          chosenTime={this.state.chosenTime}
          onChooseDay={this.chooseDay}
          onChooseTime={this.chooseTime}
          onBook={this.bookTicket}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                // take up all screen
    paddingTop: 20,         // start below status bar
  },
  loader: {
    flex: 1,
    alignItems: 'center',     // center horizontally
    justifyContent: 'center', // center vertically
  },
  scrollContent: {
    flexDirection: 'row',   // arrange posters in rows
    flexWrap: 'wrap',       // allow multiple rows
  },
});
