import customers from "./mockdata/customer.json";
import products from "./mockdata/products.json";
import categories from "./mockdata/categories.json";
import orders from "./mockdata/orders.json";

export const executeQuery = (query) => {
  const index = Math.floor(Math.random() * 4);
  switch (index) {
    case 0:
      return products;
    case 1:
      return categories;
    case 2:
      return customers.map((item) => {
        return {
          customerID: item.customerID,
          companyName: item.companyName,
          contactName: item.contactName,
          contactTitle: item.contactTitle,
        };
      });
    default:
      return orders.map((item) => {
        return {
          orderID:item.orderID,
          customerID:item.customerID,
          employeeID:item.employeeID,
          shipVia:item.shipVia,
          freight:item.freight,
          shipName:item.shipName
        }
      });
  }
};
