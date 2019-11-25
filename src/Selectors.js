import React, { Component } from "react";

class Selectors extends Component {
  handleSelect = event => {
    // const name = event.target.name;
    const filter = event.target.value;
    this.props.onSelect(filter);
  };

  render() {
    const { base, filter } = this.props;
    const categoriesOptions = base.map(elem => (
      <option key={elem.category} value={elem.category}>
        {elem.category}
      </option>
    ));

    return (
      <form className="selects-container">
        <div className="one-selector">
          <div className="one-selector-title">Category</div>
          <select
            name="category"
            className="selector-box"
            onChange={this.handleSelect}
            value={filter}
          >
            <option value="">all</option>
            {categoriesOptions}
          </select>
        </div>
      </form>
    );
  }
}

export default Selectors;
