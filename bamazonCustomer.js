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
        getProductId();
    });
} 
function getProductId(){
    inquirer
    .prompt([
        {
            name: "itemId",
            type: "input",
            message: "What is the Item Id of the product you would like to purchase?",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        },
        {
            name: "numOfItem",
            type: "input",
            message: "How many of this item would you like to purchase?",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer){
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, {item_id:answer.itemId}, function(err, res){
            if(err) throw err;
            if(answer.numOfItem > res[0].stock_quantity){
                console.log("Insufficient inventory to fulfill this order");
            }else{
                console.log("We can fulfill your order");
                var newStockAmount = res[0].stock_quantity - answer.numOfItem;
                var itemPurchased = answer.itemId;
                var totalCost = parseInt(answer.numOfItem) * parseFloat(res[0].price);
                fulfillOrder(newStockAmount, itemPurchased, totalCost);
            }
            
        })
    })

    }
function fulfillOrder(newStockAmount, itemPurchased, totalCost){
    var query = "UPDATE products SET ? WHERE ?";
    connection.query(query, [{stock_quantity: newStockAmount}, {item_id: itemPurchased}], function(err,res){
        if(err) throw err;
        console.log("Database updated");
        console.log("The total cost of your order is $" + totalCost);

    })    
}
    