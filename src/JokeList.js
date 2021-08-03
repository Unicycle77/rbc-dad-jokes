import React, { Component } from 'react'
import axios from "axios";
import Joke from './Joke';
import "./JokeList.css";

const API_URL = "https://icanhazdadjoke.com/";
//const API_USER_AGENT = "My Library (https://github.com/Unicycle77/rbc-dad-jokes)"

class Jokelist extends Component {
  static defaultProps = {
    numJokesToGet: 5,
  }

  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      loading: false
    };
    this.getJokes = this.getJokes.bind(this);
    this.handleVote = this.handleVote.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if(this.state.jokes.length === 0) {
      this.getJokes(this.props.numJokesToGet);
    }
  }

  async getJokes() {
    let jokes = [];

    //Load jokes
    while (jokes.length < this.props.numJokesToGet) {
      try {
        let res = await axios.get(API_URL, { headers: { Accept: "application/json" } });
        console.log(res);
        //{ "Accept": "application/json", "Access-Control-Allow-Origin": "*" } 
        let newJoke = {
          id: res.data.id,
          text: res.data.joke,
          votes: 0
        };
        // if it's a new joke add it to the new joke array
        // TODO: Check if the joke is new
        if(![...jokes, ...this.state.jokes].some(j => j.id === newJoke.id)) {
          jokes.push(newJoke);
          // console.log(newJoke);
        } else {
          console.log("duplicate", newJoke)
        }
      } catch (e) {
        console.log('Something went wrong', e);
      }
    }
    this.setState(
      st => ({
        jokes: [...st.jokes, ...jokes],
        loading: false
      }),
      () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }

  handleVote(id, delta) {
    this.setState(
      st => ({
        jokes: st.jokes.map(j =>
          j.id === id ? {...j, votes: j.votes + delta} : j)
      }),
      () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }

  handleClick() {
    if(this.state.jokes.length < this.props.maxJokes) {
      this.setState({loading: true}, this.getJokes);
    }
  }

  render() {
    if(this.state.loading) {
      return (
        <div className="JokeList-spinner">
          <i className="far fa-8x fa-laugh fa-spin"></i>
          <h1 className="JokeList-title">Loading...</h1>
        </div>
      )
    } else {
      return (
        <div className="JokeList">
          <div className="JokeList-sidebar">
            <h1 className="JokeList-title">
              <span>Dad</span> Jokes
            </h1>
            <img alt="Laughing Emoji" src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
            <button className="JokeList-getmore" onClick={this.handleClick}>New Jokes</button>
          </div>
          <div className="JokeList-jokes">
            {this.state.jokes.map(j => (
              <Joke
                key={j.id}
                text={j.text}
                votes={j.votes}
                upvote={() => this.handleVote(j.id, 1)}
                downvote={() => this.handleVote(j.id, -1)}
              />
            ))}
          </div>
        </div>
      )
    }
  }
}

export default Jokelist;