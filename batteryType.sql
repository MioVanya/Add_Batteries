CREATE TABLE battery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marka VARCHAR(100),
    price DECIMAL(10,2),
    available INT,
    length INT,
    width INT,
    height INT,
    amper INT,
    amp INT
);