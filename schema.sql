DROP DATABASE if Exists bamazon;

CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products(
	item_id Int auto_increment NOT NULL,
    product_name VARCHAR(50),
    deparment_name VARCHAR(25),
    price DOUBLE,
    stock_quantity INT, 
    PRIMARY KEY(item_id)
);