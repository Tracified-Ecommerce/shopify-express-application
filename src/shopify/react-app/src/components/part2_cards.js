import React, { Component } from "react";
import * as axios from "axios";
import { Container, Row, Col } from "reactstrap";
import {
  Thumbnail,
  Card,
  Page,
  List,
  RadioButton,
  Button,
  Select,
  Stack,
  TextField
} from "@shopify/polaris";
import Loading from "./Loading";
// import CollapseMain from './CollapseMain';
import Uncollapsed from "./Uncollapsed";
import ErrorMsgSearch from "./errorMsgSearch";
import "./untracifiedOrders_mediaQueries.css";
import "./pagination.css";

class Part2Cards extends Component {
  constructor() {
    super();

    this.selectPreviousPage = this.selectPreviousPage.bind(this);
    this.selectNextPage = this.selectNextPage.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      orders: [],
      products: {},
      isOrderListLoading: true,
      search: "",
      isExpanded: true,
      isCheckedCus: false,
      isCheckedOrd: true,
      errorText: "No Result Found",
      pageNo: 1,
      itemsPerPage: 10,
      selected: 10,
      buttonDisable: false
    };

    this.orderArray = [];
    this.paginatedArray = [];
    this.totalPages;
  }

  componentDidMount() {
    axios
      .get("/shopify/shop-api/products")
      .then(response => {
        const products = response.data.products;
        this.setState({ products: response.data.products });
      })
      .catch(function(error) {
        console.log(error);
      });

    axios
      .get("/shopify/shop-api/orderCount")
      .then(response => {
        console.log("order count is : " + response.data.orderCount);
        console.log("page count is : " + response.data.pageCount);
        const pageCount = response.data.pageCount;
        for (let i = 1; i <= pageCount; i++) {
          const orderPageURL = "/shopify/shop-api/orders/" + i;
          axios
            .get(orderPageURL)
            .then(response => {
              console.log("got orders from backend");
              console.log(JSON.stringify(response.data));
              let updatedOrderArray = this.state.orders;
              updatedOrderArray = updatedOrderArray.concat(
                response.data.orders
              );
              this.setState({
                orders: updatedOrderArray,
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

  resetOrders = () => {
    this.setState({
      isOrderListLoading: true
    });
    axios
      .get("/shopify/shop-api/orders")
      .then(response => {
        this.setState(
          {
            orders: response.data.orders,
            isOrderListLoading: false
          },
          () => {
            this.setState({
              search: ""
            });
          }
        );
      })
      .catch(error => {
        console.log(error);
      });
  };

  updateSearch(event) {
    this.setState({
      search: event.target.value.substr(0, 20)
    });
  }

  clickOrder() {
    this.setState({
      isCheckedCus: false,
      isCheckedOrd: true,
      search: ""
    });
  }

  clickCustomer() {
    this.setState({
      isCheckedCus: true,
      isCheckedOrd: false,
      search: ""
    });
  }

  render() {
    if (this.state.isOrderListLoading) {
      return (
        <Loading loadMsg=" Please wait. Loading your orders from Shopify..." />
      );
    } else {
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
        console.log(orders);

        console.log(orders);

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

        this.pages = Array.apply(null, { length: this.totalPages });

        if (this.totalPages <= 10) {
          var startPage, endPage;

          startPage = 1;
          endPage = this.totalPages;
        } else {
          if (this.state.pageNo <= 6) {
            startPage = 1;
            endPage = 10;
          } else if (this.state.pageNo + 4 >= this.totalPages) {
            startPage = this.totalPages - 9;
            endPage = this.totalPages;
          } else {
            startPage = this.state.pageNo - 5;
            endPage = this.state.pageNo + 4;
          }
        }
      } else {
        var orders = this.state.orders;

        console.log(orders);

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
      }

      var inputStyle = {
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

      var toggleBtnStyle = {
        paddingBottom: "10px",
        marginLeft: "5%",
        width: "105%"
      };

      return (
        <div className="pageWrapper">
          <Page title="UnTracified Orders" separator>
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
            <Stack distribution="trailing">
              <div className="toggleBtn" style={toggleBtnStyle}>
                <Stack.Item />
              </div>
            </Stack>
            <div
              className="untraciFilterBy"
              style={{ paddingBottom: 5, textAlign: "center" }}
            >
              <Stack alignment="center">
                <Stack.Item>
                  <div
                    style={{
                      marginBottom: 5,
                      fontWeight: "bold",
                      fontSize: "140%",
                      paddingBottom: "9%"
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
                  <div className="searchOdrs">
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

            {!Array.isArray(this.orderArray) || !this.orderArray.length ? (
              <ErrorMsgSearch errorMessage={this.state.errorText} />
            ) : (
              this.paginatedArray.map((order, index) => {
                const qrValue = order.order_number.toString();
                const title = "Order ID: " + order.order_number;

                console.log("correct 1");

                if (this.state.isExpanded) {
                  console.log("correct 1= uncollapased");
                  return (
                    <Uncollapsed
                      key={index}
                      order={order}
                      productsProp={this.state.products}
                      resetOrders={this.resetOrders}
                      qrVal={qrValue}
                      title={title}
                    />
                  );
                }
              })
            )}
            <div className="pagination_stack">
              <Stack distribution="center">
                <Stack.Item>
                  <ul className="paginationUl">
                    <li className={this.state.pageNo === 1 ? "disabled" : ""}>
                      <a onClick={() => this.setPage(0)}>First</a>
                    </li>
                    <li className={this.state.pageNo === 1 ? "disabled" : ""}>
                      <a onClick={() => this.selectPreviousPage()}>Previous</a>
                    </li>
                    {this.pages.map((page, index) => (
                      <li
                        key={index}
                        className={
                          this.state.pageNo === index + 1 ? "active" : ""
                        }
                      >
                        <a onClick={() => this.setPage(index)}>{index + 1}</a>
                      </li>
                    ))}
                    <li
                      className={
                        this.state.pageNo === this.totalPages ? "disabled" : ""
                      }
                    >
                      <a onClick={() => this.selectNextPage()}>Next</a>
                    </li>
                    <li
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
        </div>
      );
    }
  }
}

export default Part2Cards;
