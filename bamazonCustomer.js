var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table3");

//create a connection and store it in a variable
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "daphnemax12",
    database: "bamazon"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected on " + connection.threadId);
    showAllProducts();
});
  
var showAllProducts = function(){
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        if(err) throw err;
        var table = new Table({
            head: ["Item ID", "Product Name", "Department", "Price", "Quantity"],
            colWidths: [10, 25, 20, 6, 5]
        });
        for(var i = 0; i < res.length; i++){
            var itemId = res[i].item_id,
            productName = res[i].product_name,
            departmentName = res[i].department_name,
            price = res[i].price,
            stockQuantity = res[i].stock_quantity;

      table.push(
          [itemId, productName, departmentName, price, stockQuantity]);
        }
        console.log(table.toString());
    });
}     