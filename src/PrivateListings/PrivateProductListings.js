import React, { Component } from "react";
import { Table, Icon } from "semantic-ui-react";
import adapter from "../adapter.js";
import { updateProductListings, removeCurrentProductListing } from "../actions/index.js";
import { connect } from "react-redux";

//This component was once a presentation component for the purpose of listing
//an user's own product listings. Now, it is a class component since I need to
//use the componentDidMount method to reset the currentProductListing to null
//so that when the user switches from this page to the all productListings page,
//they WILL see all product listings rather than once single product listing details.
class PrivateProductListings extends Component {
  constructor(props) {
    super(props);
  }
  
  //This is very important because if the user decided to switch to this page
  //after viewing the product details for a particular product and then switch it
  //back to the all product listings page, then we want to show all the
  //products, not the previous product details. We need to this on all pages, except
  //all product listings page
  componentDidMount() {
    this.props.removeCurrentProductListing();
  }

  productListingsRows = () => {
    console.log("INSIDE PRIVATE ProductListings", this.props)
    const rows = this.props.productListings.filter((productListingObj) => {
      return productListingObj.user_id === this.props.userId
    }).map((productListingObj) => {
      return (
        <Table.Row>
          <Table.Cell>
            <img src={productListingObj.image}/>
            <p>{productListingObj.name}</p>
            <p>{productListingObj.description}</p>
          </Table.Cell>
          <Table.Cell>${productListingObj.value}</Table.Cell>
          <Table.Cell>{
            productListingObj.exchange_item === null ?
              "Cash"
              :
              productListingObj.exchange_item
            }
          </Table.Cell>
          <Table.Cell>{
            productListingObj.isSold ?
              <img src="../assets/images/sold-out-png-19.png"/>
              :
              null
            }
          </Table.Cell>
          <Table.Cell>{productListingObj.created_at}</Table.Cell>
          <Table.Cell>
            <Icon
              name="delete"
              onClick={
                (() => {
                  //Upon clicking the delete icon, we will make a DELETE request
                  //to delete a particular product listing from the backend and then
                  //update the product listings in the global state, thus causing
                  //a rerender of PrivateProductListings
                  adapter.delete(`product_listings/${productListingObj.id}`)
                  // .then(response => response.json())
                  // .then(data => console.log(data));
                  .then(() => {
                    const newProductListings = this.props.productListings.filter((plObj) => {
                      return plObj.id !== productListingObj.id && plObj.user_id === this.props.userId;
                    });

                    this.props.updateProductListings(newProductListings);
                  });
                })
              }
          />
          </Table.Cell>
        </Table.Row>
      );
    });

    return rows;
  }
  //Filter the product listings for a particular user.


  render() {
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Content</Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
            <Table.HeaderCell>Exchange Item</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Del</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.productListingsRows()}
        </Table.Body>
      </Table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
    productListings: state.productListings
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateProductListings: (newProductListings) => {
      dispatch(updateProductListings(newProductListings));
    },
    removeCurrentProductListing: () => {
      dispatch(removeCurrentProductListing());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateProductListings);