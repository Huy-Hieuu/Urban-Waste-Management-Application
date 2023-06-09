drop schema if exists public cascade;
create schema public;
DROP TABLE IF EXISTS worktime;
DROP TABLE IF EXISTS janitor;
DROP TABLE IF EXISTS collector;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS vehicle;
DROP TABLE IF EXISTS contains_mcp;
DROP TABLE IF EXISTS mcp;
DROP TABLE IF EXISTS asset_supervisors;
DROP TABLE IF EXISTS main_asset;
DROP TABLE IF EXISTS route;
DROP TABLE IF EXISTS back_officer;
DROP TABLE IF EXISTS user_system;
create extension if not exists postgis;
--
-- Create model Asset
--
CREATE TABLE main_asset (
  id bigint PRIMARY KEY, 
  is_vehicle boolean NOT NULL,
  longitude numeric(10, 7) NOT NULL, 
  latitude numeric(10, 7) NOT NULL, 
  load numeric(9, 3) NOT NULL, 
  capacity numeric(9, 3) NOT NULL,
 	asset_location geometry
);

CREATE TABLE vehicle (
  asset_id bigint NOT NULL PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK (type IN ('truck', 'trolley')), 
  CONSTRAINT vehicle_asset_id_b86671db_fk_asset_id 
    FOREIGN KEY (asset_id) REFERENCES main_asset (id) ON DELETE CASCADE
);

CREATE TABLE mcp (
  asset_id bigint NOT NULL PRIMARY KEY,
  pop_density numeric(9, 3) NOT NULL, 
  janitor_count bigint NOT NULL DEFAULT 0,
  CONSTRAINT mcp_asset_id_b4092464_fk_asset_id 
    FOREIGN KEY (asset_id) REFERENCES main_asset (id) ON DELETE CASCADE
);

CREATE TABLE user_system (
  id bigint PRIMARY KEY, 
  username varchar(150) NOT NULL UNIQUE, 
  password varchar(128) NOT NULL,
  name varchar(150) NOT NULL,   
  date_joined timestamp DEFAULT CURRENT_TIMESTAMP, 
  phone varchar(15) NULL,
  email varchar(254) NOT NULL UNIQUE, 
  last_login timestamp NULL
);

CREATE TABLE back_officer (
  user_id bigint NOT NULL PRIMARY KEY,
  employee_count bigint NOT NULL DEFAULT 0,
  route_count bigint NOT NULL DEFAULT 0,
  vehicle_count bigint NOT NULL DEFAULT 0,
  mcp_count bigint NOT NULL DEFAULT 0,
  CONSTRAINT back_officer_user_id_813c1bfc_fk_user_id 
    FOREIGN KEY (user_id) REFERENCES user_system (id) ON DELETE CASCADE
);

CREATE TABLE employee (
  user_id bigint NOT NULL PRIMARY KEY, 
  manager_id bigint NULL, 
  vehicle_id bigint NULL, 
  role		 varchar(50) not null check (role in ('janitor','collector')),
  start_date date DEFAULT CURRENT_DATE, 
  salary bigint NOT NULL DEFAULT 6000000,
  CONSTRAINT employee_vehicle_id_d04fc52a_fk_vehicle_id 
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(asset_id) ON DELETE SET NULL,
  CONSTRAINT employee_manager_id_54b357b6_fk_back_officer_id 
    FOREIGN KEY (manager_id) REFERENCES back_officer (user_id) ON DELETE SET NULL,
  CONSTRAINT employee_id_cc4f5a1c_fk_user_id 
    FOREIGN KEY (user_id) REFERENCES user_system (id) ON DELETE CASCADE
);

--
-- Create model WorkTime
--
CREATE TABLE worktime (
  start time NOT NULL, 
  "end" time NOT NULL, 
  weekday VARCHAR(3) NOT NULL CHECK (weekday IN ('Mon','Tue','Wed','Thur','Fri','Sat','Sun')), 
  employee_id bigint NOT NULL,
  id bigserial NOT NULL UNIQUE,
  CONSTRAINT schedule_employee_prime
    PRIMARY KEY (start, "end", weekday, employee_id),
  CONSTRAINT worktime_employee_id_b2364680_fk_employee_id 
    FOREIGN KEY (employee_id) REFERENCES employee (user_id) ON DELETE CASCADE
);

CREATE TABLE "route" (
  "id" bigint NOT NULL PRIMARY KEY, 
  "last_update" timestamp DEFAULT CURRENT_TIMESTAMP, 
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP, 
  "distance" numeric(9, 3) NULL, 
  "manager_id" bigint NULL,
  CONSTRAINT "route_manager_id_77cebb21_fk_back_officer_id" 
    FOREIGN KEY ("manager_id") REFERENCES "back_officer" ("user_id") ON DELETE SET NULL
);



CREATE TABLE janitor (
  mcp_start_date date DEFAULT CURRENT_DATE, 
  work_radius numeric(9, 3) NULL, 
  employee_id bigint PRIMARY KEY, 
  mcp_id bigint NULL,
  CONSTRAINT janitor_employee_id_12a5ab16_fk_employee_id 
    FOREIGN KEY (employee_id) REFERENCES employee (user_id) ON DELETE CASCADE,
  CONSTRAINT janitor_mcp_id_c035f717_fk_mcp_id 
    FOREIGN KEY (mcp_id) REFERENCES mcp (asset_id) ON DELETE SET NULL
);

CREATE TABLE collector ( 
  employee_id bigint PRIMARY KEY, 
  route_id bigint NULL,
  CONSTRAINT collector_employee_id_34075942_fk_employee_id 
    FOREIGN KEY (employee_id) REFERENCES employee (user_id) ON DELETE CASCADE,
  CONSTRAINT collector_route_id_65a37aa4_fk_route_id 
    FOREIGN KEY (route_id) REFERENCES route (id) ON DELETE SET NULL
);

CREATE TABLE asset_supervisors (
  asset_id bigint NOT NULL, 
  backofficer_id bigint NOT NULL,
  CONSTRAINT asset_supervisors_asset_id_backofficer_id_6107fdf4_uniq 
    PRIMARY KEY (asset_id, backofficer_id),
  CONSTRAINT asset_supervisors_asset_id_308d9954_fk_asset_id 
    FOREIGN KEY (asset_id) REFERENCES main_asset (id) ON DELETE CASCADE,
  CONSTRAINT asset_supervisors_backofficer_id_6e97945b_fk_back_officer_id 
    FOREIGN KEY (backofficer_id) REFERENCES back_officer (user_id) ON DELETE CASCADE
);

CREATE TABLE "contains_mcp" (
  "order" smallint NOT NULL, 
  "mcp_id" bigint NOT NULL, 
  "route_id" bigint NOT NULL,
  CONSTRAINT "contain_route_id_mcp_id_order_9f9f8a58_prime" 
    PRIMARY KEY ("route_id", "mcp_id"),
  CONSTRAINT "contain_mcp_id_d8a5b2b5_fk_mcp_id" 
    FOREIGN KEY ("mcp_id") REFERENCES "mcp" ("asset_id") ON DELETE CASCADE,
  CONSTRAINT "contain_route_id_order_uniq_23jh23l" 
    UNIQUE ("route_id", "order")
);
