import React, { Component } from 'react'
import axios from "axios";
import Joke from './Joke';
import "./JokeList.css";

const API_URL = "https://icanhazdadjoke.com/";
//const API_USER_AGENT = "My Library (https://github.com/Unicycle77/rbc-dad-jokes)"

class Jokelist extends Component {
  static defaultProps = {
    numJokesToGet: 10
  }

  constructor(props) {
    super(props);
    this.state = {jokes:[]};
    this.getJokes = this.getJokes.bind(this);
  }

  componentDidMount() {
    this.getJokes(this.props.numJokesToGet);
  }

  async getJokes(count) {
    let jokes = this.state.jokes;
    //Load jokes
    while (jokes.length < count) {
      let res = await axios.get(API_URL, { headers: { Accept: "application/json" } });
      let newJoke = res.data;
      // if it's a new joke add it to the new joke array
      // TODO: Check if the joke is new
      jokes.push(newJoke);
      console.log(newJoke);
    }
    this.setState({jokes: jokes});
  }

  render() {
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokes
          </h1>
          <img alt="Laughing Emoji" src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
          <button className="JokeList-getmore">New Jokes</button>
        </div>
        <div className="JokeList-jokes">
          {this.state.jokes.map(j => {
            return ( <Joke key={j.id} joke={j.joke} /> )
          })
          }
        </div>
      </div>
    )
  }
}

export default Jokelist;