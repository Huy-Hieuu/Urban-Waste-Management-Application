CREATE TABLE employee (
  id INT NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phoneNumber VARCHAR(20),
  hired_date DATE
);

CREATE TABLE vehicle (
  id INT NOT NULL ,
  driver_name VARCHAR(255),
  type_of_vehicle VARCHAR(255),
  capacity INT,
  PRIMARY KEY (id)
);