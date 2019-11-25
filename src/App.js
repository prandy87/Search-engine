import React, { Component } from "react";
import axios from "axios";
import queryString from "querystringify";
import { DebounceInput } from "react-debounce-input";
import Cards from "./Cards";
import Selectors from "./Selectors";
import "./css/search.css";

class App extends Component {
  constructor(props) {
    super(props);
    const parsed = queryString.parse(this.props.location.search);
    this.state = {
      results: null,
      loaded: false,
      filter: parsed.filter || "",
      search: parsed.search || ""
    };
  }

  changeUrl = (search, filter) => {
    const { pathname } = this.props.location;
    const newUrl = `${pathname}?search=${search}&filter=${filter}`;
    this.props.history.push(newUrl);
  };

  async componentDidMount() {
    this.base = [
      { category: "people", nbPage: 0 },
      { category: "planets", nbPage: 0 },
      { category: "species", nbPage: 0 },
      { category: "vehicles", nbPage: 0 },
      { category: "starships", nbPage: 0 }
    ];
    // get number of pages for each category
    const urls = this.base.map(elem =>
      axios.get(this.getUrl(elem.category, 1))
    );
    const firstOfEach = await Promise.all(urls);
    firstOfEach.forEach(
      (elem, index) =>
        (this.base[index].nbPage = Math.ceil(elem.data.count / 10))
    );
    // call API for all data: every page for each category
    const promiseData = [];
    this.base.forEach(elem => {
      for (let i = 1; i < elem.nbPage; i += 1) {
        const data = axios.get(this.getUrl(elem.category, i));
        promiseData.push(data);
      }
    });
    const data = await Promise.all(promiseData);
    // from unformated data retrieved, get only 'results' and aggregate in one array
    // adding the category for use in filter
    this.starBase = [];
    data.forEach(elem => {
      const { results } = elem.data;
      const category = elem.config.url
        .split("api/")
        .pop()
        .split("/")
        .shift();
      results.forEach(result => (result.category = category));
      this.starBase.push(...results);
    });

    this.setState({ loaded: true });

    // if reload on search (query in url)
    const parsed = queryString.parse(this.props.location.search);
    if (Object.keys(parsed).length) {
      this.getResults(parsed.search, parsed.filter);
    }
  }

  componentWillReceiveProps(nextProps) {
    // if navigate through history
    const parsed = queryString.parse(nextProps.location.search);
    if (Object.keys(parsed).length) {
      this.getResults(parsed.search, parsed.filter);
    }
  }

  getUrl = (category, page) => `https://swapi.co/api/${category}/?page=${page}`;

  getResults = (search, filter) => {
    if (!search) {
      this.setState({ results: null, search: "", filter });
    } else {
      const results = this.starBase.filter(elem => {
        // cancel case sensitivity
        const name = elem.name.toLocaleLowerCase();
        const compare = search.toLocaleLowerCase();
        // find elems in base where 'name' includes the search, and filter on category
        if (!filter) {
          return name.includes(compare) ? elem : "";
        }
        return name.includes(compare) && elem.category === filter ? elem : "";
      });
      this.setState({ results, search, filter });
    }
  };

  search = event => {
    const search = event.target.value;
    const { filter } = this.state;
    this.changeUrl(search, filter);
  };

  filter = filter => {
    const { search } = this.state;
    this.changeUrl(search, filter);
  };

  render() {
    if (!this.state.loaded) return <div>Loading...</div>;

    const { results, filter, search } = this.state;

    return (
      <div className="app-container">
        <div className="app-title">Star Wars Search</div>
        <DebounceInput
          minLength={1}
          debounceTimeout={1000}
          onChange={this.search}
          className="search-bar"
          value={search}
        />
        <Selectors base={this.base} onSelect={this.filter} filter={filter} />
        <Cards results={results} />
      </div>
    );
  }
}

export default App;
