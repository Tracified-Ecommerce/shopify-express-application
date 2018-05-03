import React, { Component } from "react";
import * as axios from "axios";
import {
  Page,
  RadioButton,
  Card,
  Stack,
  Select,
  TextField
} from "@shopify/polaris";
import { Container, Row, Col } from "reactstrap";
import FulfilledOrder from "./FulfilledOrder";
import Loading from "./Loading";
import SearchInput, { createFilter } from "react-search-input";
import ErrorMsgSearch from "./errorMsgSearch";
import "./tracifiedOdrs_MediaQueries.css";
import "./pagination.css";

const KEYS_TO_FILTER = ["order.order_number"];
const QRCode = require("qrcode.react");

class FulfilledOrdersPage extends Component {
  constructor() {
    super();

    this.selectPreviousPage = this.selectPreviousPage.bind(this);
    this.selectNextPage = this.selectNextPage.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      orders: [],
      mapping: {},
      products: {},
      items: [],
      shopDomain: "",
      isOrderListLoading: true,
      isMappingLoading: true,
      search: "",
      inputType: "number",
      isCheckedCus: false,
      isCheckedOrd: true,
      errorText: "No Result found",
      pageNo: 1,
      itemsPerPage: 10,
      selected: 10,
      buttonDisable: false
    };

    this.orderArray = [];
    this.paginatedArray = [];
    this.totalPages;
    this.startPage;
    this.endPage;
  }

  componentDidMount() {
    axios
      .get("/shopify/config/mapping")
      .then(response => {
        if (response.status == 200) {
          this.setState({
            mapping: response.data
          });
        }
        this.setState({
          isMappingLoading: false
        });
      })
      .catch(function(error) {
        console.error(error);
      });

    axios
      .get("/shopify/shop-api/itemnames")
      .then(response => {
        if (response.status == 200) {
          console.log("itemnames : " + JSON.stringify(response.data.products));
          this.setState({
            items: response.data.products
          });
        }
      })
      .catch(function(error) {
        console.error(error);
      });

    axios
      .get("/shopify/shop-api/orderCount")
      .then(response => {
        console.log("order count is : " + response.data.orderCount);
        console.log("page count is : " + response.data.pageCount);
        const pageCount = response.data.pageCount;
        for (let i = 1; i <= pageCount; i++) {
          const orderPageURL = "/shopify/shop-api/fulfilled-orders/" + i;
          axios
            .get(orderPageURL)
            .then(response => {
              console.log("got tracified orders from backend");
              console.log(JSON.stringify(response.data));
              let updatedOrderArray = this.state.orders;
              updatedOrderArray = updatedOrderArray.concat(
                response.data.fulfilledOrders
              );
              this.setState({
                orders: updatedOrderArray,
                shopDomain: response.data.shopDomain,
                isOrderListLoading: false
              });
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  /** Uncomment this method if there is a need to restrict the input to a pattern.
   * (insert-regex-here) can be changed to a test for the pattern
   */

  // onKeyPress(event) {
  //     const keyCode = event.keyCode || event.which;
  //     const keyValue = String.fromCharCode(keyCode);
  //      if (/insert-regex-here/.test(keyValue))
  //        event.preventDefault();
  //    }

  updateSearch(event) {
    this.setState({
      search: event.target.value.substr(0, 20)
    });
  }

  clickOrder() {
    this.setState({
      isCheckedCus: false,
      isCheckedOrd: true
    });
  }

  clickCustomer() {
    this.setState({
      isCheckedCus: true,
      isCheckedOrd: false
    });
  }

  handleChange = (newValue, id) => {
    this.setState({ selected: newValue });

    if (newValue == 10) {
      this.setState({
        itemsPerPage: 10,
        pageNo: 1
      });
    } else if (newValue == 25) {
      this.setState({
        itemsPerPage: 25,
        pageNo: 1
      });
    } else if (newValue == 50) {
      this.setState({
        itemsPerPage: 50,
        pageNo: 1
      });
    } else if (newValue == 100) {
      this.setState({
        itemsPerPage: 100,
        pageNo: 1
      });
    } else {
      this.setState({
        itemsPerPage: 1000,
        pageNo: 1
      });
    }
  };

  selectPreviousPage() {
    this.totalPages = Math.ceil(
      this.orderArray.length / this.state.itemsPerPage
    );
    console.log("total pages : " + this.totalPages);
    // this.state.startPage = 1;
    // this.state.endPage = this.state.totalPages;

    if (this.state.pageNo == 1) {
      this.setState({
        buttonDisable: true
      });
    } else {
      this.setState({
        pageNo: this.state.pageNo - 1
      });
    }
  }

  selectNextPage() {
    this.totalPages = Math.ceil(
      this.orderArray.length / this.state.itemsPerPage
    );
    console.log("total pages : " + this.totalPages);

    if (this.state.pageNo == this.totalPages) {
      this.setState({
        buttonDisable: true
      });
    } else {
      this.setState({
        pageNo: this.state.pageNo + 1
      });
    }
  }

  setPage(pageNumber) {
    this.setState({
      pageNo: pageNumber + 1
    });
  }

  paginateArray(pageNumber, itemsPerPage, array) {
    return array.filter(function(item, i) {
      return (
        i >= itemsPerPage * (pageNumber - 1) && i < pageNumber * itemsPerPage
      );
    });
  }

  render() {
    if (this.state.isOrderListLoading || this.state.isMappingLoading) {
      return (
        <Loading loadMsg="Please wait. Loading your orders from Shopify..." />
      );
    } else {
      // All the order details

      if (this.state.isCheckedCus) {
        let orders = this.state.orders.filter(order => {
          let customer = "Admin created order";

          if (order.customer) {
            customer =
              order.customer.first_name + " " + order.customer.last_name;
          }
          const customer1 = customer.toLowerCase();
          const customer2 = customer.toUpperCase();
          return (
            customer1.indexOf(this.state.search) !== -1 ||
            customer2.indexOf(this.state.search) !== -1 ||
            customer.indexOf(this.state.search) !== -1
          );
        });

        this.orderArray = [];
        orders.forEach(order => {
          var items = order.line_items;
          var lineItems = [];
          items.forEach(item => {
            lineItems.push({
              id: item.id,
              title: item.title,
              quantity: item.quantity,
              variant_title: item.variant_title,
              product_id: item.product_id
            });
          });

          let customer = "Admin created order";

          if (order.customer) {
            customer =
              order.customer.first_name + " " + order.customer.last_name;
          }

          this.orderArray.push({
            id: order.id,
            order_number: order.order_number,
            lineItems: lineItems,
            customer: customer,
            created_at: order.created_at.substring(0, 10)
          });
        });

        this.paginatedArray = this.paginateArray(
          this.state.pageNo,
          this.state.itemsPerPage,
          this.orderArray
        );
      } else if (this.state.isCheckedOrd) {
        let orders = this.state.orders.filter(order => {
          return order.name.indexOf(this.state.search) !== -1;
        });

        this.orderArray = [];
        orders.forEach(order => {
          var items = order.line_items;
          var lineItems = [];
          items.forEach(item => {
            lineItems.push({
              id: item.id,
              title: item.title,
              quantity: item.quantity,
              variant_title: item.variant_title,
              product_id: item.product_id
            });
          });

          let customer = "Admin created order";

          if (order.customer) {
            customer =
              order.customer.first_name + " " + order.customer.last_name;
          }

          this.orderArray.push({
            id: order.id,
            order_number: order.order_number,
            lineItems: lineItems,
            customer: customer,
            created_at: order.created_at.substring(0, 10)
          });
        });

        this.paginatedArray = this.paginateArray(
          this.state.pageNo,
          this.state.itemsPerPage,
          this.orderArray
        );

        this.totalPages = Math.ceil(
          this.orderArray.length / this.state.itemsPerPage
        );

        this.startPage;
        this.endPage;
        if (this.totalPages <= 10) {

          this.startPage = 1;
          this.endPage = this.totalPages;

        } else {
          if (this.state.pageNo <= 6) {
            this.startPage = 1;
            this.endPage = 10;

          } else if (this.state.pageNo + 4 >= this.totalPages) {
            this.startPage = this.totalPages - 9;
            this.endPage = this.totalPages;

          } else {
            this.startPage = this.state.pageNo - 5;
            this.endPage = this.state.pageNo + 4;

          }
        }

        this.pages = [...Array((this.endPage + 1) - this.startPage).keys()].map(i => this.startPage + i);
      } else {
        var orders = this.state.orders;

        this.orderArray = [];
        orders.forEach(order => {
          var items = order.line_items;
          var lineItems = [];
          items.forEach(item => {
            lineItems.push({
              id: item.id,
              title: item.title,
              quantity: item.quantity,
              variant_title: item.variant_title,
              product_id: item.product_id
            });
          });

          const customer =
            order.customer.first_name + " " + order.customer.last_name;

          this.orderArray.push({
            id: order.id,
            order_number: order.order_number,
            lineItems: lineItems,
            customer: customer,
            created_at: order.created_at.substring(0, 10)
          });
        });

        this.paginatedArray = this.paginateArray(
          this.state.pageNo,
          this.state.itemsPerPage,
          this.orderArray
        );
      }

      let orders = this.state.orders.filter(order1 => {
        return order1.name.indexOf(this.state.search) !== -1;
      });

      var inputStyle = {
        // marginLeft: '1%',
        // float: 'center',
        // fontSize: '14px',
        // marginTop: '1%',
        // marginBottom:'2%'
        marginLeft: "1%",
        float: "center",
        fontSize: "14px",
        marginTop: "-4%",
        marginBottom: "1%",
        fontWeight: 400,
        lineHeight: "2.4rem",
        textTransform: "none",
        letterSpacing: "normal",
        position: "relative",
        display: "-ms-flexbox",
        display: "flex",
        msFlexAlign: "center",
        alignItems: "center",
        padding: "0 1.2rem",
        color: "#919eab",
        borderRadius: "4px",
        height: "30px",
        paddingLeft: "5%"
      };

      var tableStyle = {
        backgroundColor: "white"
      };

      var filterStyle = {
        paddingBottom: 21
        // marginTop:'-5%',
      };

      return (
        <Page title="Tracified Orders" separator>
          <Stack wrap={false} distribution="trailing">
            <Stack.Item />
            <div> Items per page</div>
            <Stack.Item>
              <Select
                options={[
                  { label: "10", value: 10 },
                  { label: "25", value: 25 },
                  { label: "50", value: 50 },
                  { label: "100", value: 100 }
                ]}
                onChange={this.handleChange}
                value={this.state.selected}
              />
            </Stack.Item>
          </Stack>
          <div className="filterWrapper" style={filterStyle}>
            <Stack alignment="center">
              <Stack.Item>
                <div
                  style={{
                    padding: "0.4rem",
                    marginBottom: 5,
                    fontWeight: "bold",
                    fontSize: "140%",
                    paddingBottom: "9.5%"
                  }}
                >
                  Filter By :
                </div>
              </Stack.Item>
              <Stack.Item>
                <RadioButton
                  id="id1"
                  label="Order ID"
                  checked={this.state.isCheckedOrd}
                  onFocus={this.clickOrder.bind(this)}
                />
              </Stack.Item>
              <Stack.Item>
                <RadioButton
                  label="Customer Name"
                  checked={this.state.isCheckedCus}
                  onFocus={this.clickCustomer.bind(this)}
                />
              </Stack.Item>
              <Stack.Item>
                <div className="searchText">
                  <input
                    type="text"
                    value={this.state.search}
                    onChange={this.updateSearch.bind(this)}
                    style={inputStyle}
                  />
                </div>
              </Stack.Item>
            </Stack>
          </div>
          <table className="table table-striped" id="tblHeaderWrapper">
            <thead>
              <tr>
                <td>
                  <b>Order No</b>
                </td>
                <td>
                  <b>Customer</b>
                </td>
                <td>
                  <b>Order Item to View</b>
                </td>
                <td>
                  <b>Trace</b>
                </td>
              </tr>
            </thead>
            <tbody>
              {!Array.isArray(this.orderArray) || !this.orderArray.length ? (
                <ErrorMsgSearch errorMessage={this.state.errorText} />
              ) : (
                this.paginatedArray.map((order, index) => {
                  return (
                    <FulfilledOrder
                      key={order.order_number}
                      order={order}
                      shopDomain={this.state.shopDomain}
                      mapping={this.state.mapping}
                      items={this.state.items}
                    />
                  );
                })
              )

              /* {orderArray.map((order, index) => {

                                return (
                                    <FulfilledOrder
                                        key={order.order_number}
                                        order={order}
                                        shopDomain={this.state.shopDomain}
                                        mapping={this.state.mapping}
                                    />
                                )
                            })} */
              }
              <tfoot>
                {/* {
                                
                                ( !Array.isArray(orderArray) || !orderArray.length)   ? (
                
                                    <ErrorMsgSearch errorMessage={this.state.errorText}/> ) : (
                                        "True"
                                    )
                                }  */}
              </tfoot>
            </tbody>
          </table>
          <div className="pagination_stack">
            <Stack distribution="center">
              <Stack.Item>
                <ul className="paginationUl">
                  <li id="first" className={this.state.pageNo === 1 ? "disabled" : ""}>
                    <a onClick={() => this.setPage(0)}>First</a>
                  </li>
                  <li id="previous" className={this.state.pageNo === 1 ? "disabled" : ""}>
                    <a onClick={() => this.selectPreviousPage()}>Previous</a>
                  </li>
                  {this.pages.map((page, index) => (
                    <li key={index}  className={this.state.pageNo === (index+1) ? 'active' : ''}>
                      <a onClick={() => this.setPage(index)}>{index + 1}</a>
                    </li>
                  ))}
                  <li id="next"
                    className={
                      this.state.pageNo === this.totalPages ? "disabled" : ""
                    }
                  >
                    <a onClick={() => this.selectNextPage()}>Next</a>
                  </li>
                  <li id="last"
                    className={
                      this.state.pageNo === this.totalPages ? "disabled" : ""
                    }
                  >
                    <a onClick={() => this.setPage(this.totalPages - 1)}>
                      Last
                    </a>
                  </li>
                </ul>
              </Stack.Item>
            </Stack>
          </div>
        </Page>
      );
    }
  }
}

export default FulfilledOrdersPage;
