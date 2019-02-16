import React, { Component } from 'react';

import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

class Search extends Component {

   constructor(props) {
      super(props);

      this.state = {
         inputValue: '',
         sortingBy: ''
      };
   }


   handleChange = (event) => {
      const newValue = event.target.value;

      this.setState({ inputValue: newValue });
      this.props.callback(newValue, this.state.sortingBy);
   };

   changeSorting = (element) => {
      const sortBy = element;

      this.setState({sortingBy: sortBy});
      this.props.callback(this.state.inputValue, sortBy);
   }

   render() {

      return (
         <div>
            <InputGroup>
                <FormControl placeholder="What do you want to search ? (name, city, chef...)" value={this.state.inputValue} aria-label="What do you want to search ?" aria-describedby="basic-addon2" onChange={this.handleChange}/>

                <DropdownButton as={InputGroup.Append} variant="outline-secondary" title="Sorting" id="input-group-dropdown-2">
                   <Dropdown.Item onClick={() => this.changeSorting('name')}>By name</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.changeSorting('stars')}>By stars</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.changeSorting('hotelPrice')}>By hotel price</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.changeSorting('restaurantPrice')}>By restaurant price</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.changeSorting('distance')}>By distance</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => this.changeSorting('')}>No sorting</Dropdown.Item>
                </DropdownButton>
            </InputGroup>
         </div>
      );
   }
}

export default Search;
 
 