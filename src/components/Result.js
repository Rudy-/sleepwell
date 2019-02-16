import React, { Component } from 'react';

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";

class Result extends Component {

   constructor(props) {
      super(props);

      this.state = {
         section: 'hotel'
      };
   }

   changeSection = (element) => {
      this.setState({section: element});
   }

   displayVariant(section) {
      const style = this.state.section === section ? 'primary' : 'secondary';
      
      return style
   }

   displayData = () => {
      switch (this.state.section) {
         case 'hotel':
            return (
               <div>
                  <ListGroup>
                     <ListGroup.Item><i class="fas fa-dollar-sign"></i> Price range : <b>{this.props.element.priceRange}</b></ListGroup.Item>
                     <ListGroup.Item><i class="fas fa-map-marker"></i> Address : <b>{this.props.element.address}</b></ListGroup.Item>
                  </ListGroup>

                  <a href={this.props.element.url}><Button variant="primary">Go to the website</Button></a>
               </div>
            )
         case 'restaurant':
            return (
               <div>
                  <ListGroup>
                     <ListGroup.Item><i class="fas fa-dollar-sign"></i> Price range : <b>{this.props.element.restaurantPrices}</b></ListGroup.Item>
                     <ListGroup.Item><i class="fas fa-user"></i> Chef : <b>{this.props.element.chef}</b></ListGroup.Item>
                     <ListGroup.Item><i class="fas fa-star"></i> Number of stars : <b>{this.props.element.nbStars}</b></ListGroup.Item>
                  </ListGroup>

                  <a href={this.props.element.restaurantUrl}><Button variant="primary">Go to the website</Button></a>
               </div>
            )
         default :
               return (
                  <div>
                     <h6>Hotel</h6>

                     <ListGroup>
                        <ListGroup.Item><i class="fas fa-dollar-sign"></i> Price range : <b>{this.props.element.priceRange}</b></ListGroup.Item>
                        <ListGroup.Item><i class="fas fa-map-marker"></i> Address : <b>{this.props.element.address}</b></ListGroup.Item>
                     </ListGroup>

                     <h6>Restaurant</h6>

                     <ListGroup>
                        <ListGroup.Item><i class="fas fa-dollar-sign"></i> Price range : <b>{this.props.element.restaurantPrices}</b></ListGroup.Item>
                        <ListGroup.Item><i class="fas fa-user"></i> Chef : <b>{this.props.element.chef}</b></ListGroup.Item>
                        <ListGroup.Item><i class="fas fa-star"></i> Number of stars : <b>{this.props.element.nbStars}</b></ListGroup.Item>
                     </ListGroup>

                     <a href={this.props.element.url}><Button variant="primary">Hotel</Button></a> <a href={this.props.element.restaurantUrl}><Button variant="primary">Restaurant</Button></a>
                  </div>
               )
      }
   }

   render() {
      return (
         <Card>
            <Card.Img variant="top" src={this.props.element.imageUrl} />
               <Card.Body>
                  <Card.Title>{this.props.element.hotelName}</Card.Title>
                  
                  <Card.Text>{this.props.element.description}</Card.Text>

                  <ButtonToolbar>
                     <Button onClick={() => this.changeSection('hotel')} variant={this.displayVariant('hotel')} size="sm">Hotel</Button>
                     <Button onClick={() => this.changeSection('restaurant')} variant={this.displayVariant('restaurant')} size="sm">Restaurant</Button>
                     <Button onClick={() => this.changeSection('overview')} variant={this.displayVariant('overview')} size="sm">Overview</Button>
                  </ButtonToolbar>

                  {this.displayData()}
               </Card.Body>
         </Card>
      );
   }
}

export default Result;