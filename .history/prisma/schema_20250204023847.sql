-- Create Database
CREATE DATABASE five_star_restaurant;

-- Use the database
USE five_star_restaurant;

-- Create Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'STAFF') NOT NULL DEFAULT 'STAFF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add Restaurant table
CREATE TABLE restaurants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Reviews table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    restaurant_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    INDEX idx_date (date),
    INDEX idx_rating (rating),
    INDEX idx_restaurant_date (restaurant_id, date)
);

-- Create useful indexes
CREATE INDEX idx_reviews_date_rating ON reviews(date, rating);

-- Add Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    restaurant_id INT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- เพิ่ม Table สำหรับ Menu Items
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    available BOOLEAN DEFAULT true,
    image_url VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- เพิ่ม Table สำหรับ Tables
CREATE TABLE tables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    number INT NOT NULL,
    seats INT NOT NULL,
    status ENUM('available', 'occupied', 'reserved') DEFAULT 'available',
    restaurant_id INT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- เพิ่ม indices สำหรับการค้นหา
CREATE INDEX idx_menu_category ON menu_items(category_id);
CREATE INDEX idx_table_status ON tables(status);
