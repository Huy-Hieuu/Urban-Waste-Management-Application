CREATE OR REPLACE FUNCTION GetRouteLoad(route_id BIGINT)
RETURNS NUMERIC(9,3)
AS $$
DECLARE
    total_load NUMERIC(9,3);
BEGIN
    SELECT SUM(main_asset.load) INTO total_load
    FROM route
    JOIN contains_mcp ON contains_mcp.route_id = route.id
    JOIN main_asset ON contains_mcp.mcp_id = main_asset.id
    WHERE route.id = route_id;

    RETURN total_load;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION InsertEmployee(
    p_username VARCHAR(150),
    p_password VARCHAR(128),
    p_name VARCHAR(150),
    p_mgr BIGINT,
    p_active BOOL,
    p_djoin TIMESTAMP,
    p_addr VARCHAR(100),
    p_bd DATE,
    p_gender VARCHAR(6),
    p_phone VARCHAR(15),
    p_email VARCHAR(254),
    p_lastlg TIMESTAMP,
    p_role BOOL,
    p_sal BIGINT
)
RETURNS BIGINT
AS $$
DECLARE
    temp_id BIGINT;
BEGIN
    INSERT INTO "user_system" (username, "password", "name", is_backofficer, is_active, date_joined, address, birth, gender, phone, email, last_login)
    VALUES (p_username, md5(p_password), p_name, FALSE, p_active, p_djoin, p_addr, p_bd, p_gender, p_phone, p_email, p_lastlg)
    RETURNING id INTO temp_id;
    
    INSERT INTO employee (user_id, manager_id, vehicle_id, is_working, is_collector, start_date, salary)
    VALUES (temp_id, p_mgr, NULL, p_active, p_role, NULL, p_sal);
    
    IF p_role = FALSE THEN 
        INSERT INTO janitor (mcp_start_date, work_radius, employee_id, mcp_id)
        VALUES (DEFAULT, NULL, temp_id, NULL);
    ELSE 
        INSERT INTO collector (employee_id, route_id)
        VALUES (temp_id, NULL);
    END IF;
    
    RETURN temp_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION UpdateEmployee (
    p_id BIGINT,
    p_name VARCHAR(150),
    p_addr VARCHAR(150),
    p_bd DATE,
    p_gender VARCHAR(6),
    p_phone VARCHAR(15),
    p_email VARCHAR(254),
    p_mngrId BIGINT,
    p_vecId BIGINT,
    p_start DATE,
    p_radius DECIMAL(9,3),
    p_mcpId BIGINT, -- janitor, if role = 0
    p_routeId BIGINT, -- collector, if role = 1
    p_is_working BOOL,
    p_role BOOL,
    p_sal BIGINT
)
RETURNS VOID
AS $$
BEGIN 
    UPDATE "user_system"
    SET
        "name" = COALESCE(p_name, "name"),
        address = COALESCE(p_addr, address),
        birth = COALESCE(p_bd, birth),
        gender = COALESCE(p_gender, gender),
        phone = COALESCE(p_phone, phone),
        email = COALESCE(p_email, email)
    WHERE id = p_id;
    
    UPDATE employee
    SET
        manager_id = COALESCE(p_mngrId, manager_id),
        vehicle_id = COALESCE(p_vecId, vehicle_id),
        is_working = COALESCE(p_is_working, is_working),
        salary = COALESCE(p_sal, salary)
    WHERE user_id = p_id; 
    
    IF p_role = FALSE THEN
        UPDATE janitor
        SET
            mcp_start_date = COALESCE(p_start, mcp_start_date),
            work_radius = COALESCE(p_radius, work_radius),
            mcp_id = COALESCE(p_mcpId, mcp_id)
        WHERE employee_id = p_id;
    ELSE
        UPDATE collector
        SET
            route_id = COALESCE(p_routeId, route_id)
        WHERE employee_id = p_id;
    END IF;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE DeleteEmployee(p_id BIGINT)
AS $$
BEGIN
    DELETE FROM "user_system"
    WHERE id = p_id AND is_backofficer = FALSE;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION GetUserFromLogin (
    p_username VARCHAR(150),
    p_password VARCHAR(128)
)
RETURNS SETOF "user_system"
AS $$
DECLARE
    hashpass VARCHAR(128);
BEGIN
    IF NOT EXISTS (SELECT * FROM "user_system" WHERE username = p_username) THEN
        RAISE EXCEPTION 'No username matched';
    END IF;

    SELECT "password" INTO hashpass
    FROM "user_system"
    WHERE username = p_username;

    IF md5(p_password) <> hashpass THEN
        RAISE EXCEPTION 'Wrong password';
    END IF;

    RETURN QUERY
    SELECT *
    FROM "user_system"
    WHERE username = p_username;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION GetUser(user_id BIGINT)
RETURNS SETOF "user_system"
AS $$
DECLARE
    temp_var BOOL;
BEGIN
    SELECT is_backofficer INTO temp_var
    FROM "user_system"
    WHERE id = user_id;

    IF temp_var = TRUE THEN 
        RETURN QUERY
        SELECT *
        FROM "user_system"
        JOIN back_officer ON "user_system".id = back_officer.user_id
        WHERE "user_system".id = user_id;
    ELSE 
        SELECT is_collector INTO temp_var
        FROM employee
        WHERE employee.user_id = user_id;
        
        IF temp_var = FALSE THEN
            RETURN QUERY
            SELECT *
            FROM "user_system"
            JOIN employee ON "user".id = employee.user_id
            JOIN janitor ON employee.user_id = janitor.employee_id
            WHERE janitor.employee_id = user_id;
        ELSE 
            RETURN QUERY
            SELECT *
            FROM "user_system"
            JOIN employee ON "user_system".id = employee.user_id
            JOIN collector ON employee.user_id = collector.employee_id
            WHERE collector.employee_id = user_id;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION GetEmployees(mgr_id BIGINT)
RETURNS SETOF "user_system"
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM "user_system"
    JOIN employee ON id = user_id
    WHERE manager_id = mgr_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION InsertRoute(
    mgr_id BIGINT
) 
RETURNS BIGINT
AS $$
DECLARE
    temp_id BIGINT;
BEGIN
    INSERT INTO route
    VALUES (DEFAULT, DEFAULT, DEFAULT, NULL, mgr_id)
    RETURNING id INTO temp_id;
    
    RETURN temp_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE InsertMCPToRoute(
    mcp_id BIGINT,
    route_id BIGINT,
    order_val SMALLINT
)
AS $$
BEGIN
    INSERT INTO contains_mcp("order", mcp_id, route_id)
    VALUES (order_val, mcp_id, route_id);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE DeleteRoute(route_id BIGINT)
AS $$
BEGIN
    DELETE FROM route 
    WHERE id = route_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE DeleteMCPsFromRoute(route_id BIGINT)
AS $$
BEGIN
    DELETE FROM contains_mcp
    WHERE contains_mcp.route_id = route_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION RetrieveMap(mgr_id BIGINT)
RETURNS TABLE (
    asset_id BIGINT,
    longitude NUMERIC,
    latitude NUMERIC,
    load NUMERIC,
    percentage NUMERIC,
    pop_density NUMERIC,
    janitor_count INTEGER
)
AS $$
BEGIN
    RETURN QUERY
    SELECT mcp.asset_id, longtitude, latitude, "load", "load"/capacity as percentage, pop_density, janitor_count
    FROM main_asset
    JOIN mcp ON main_asset.id = mcp.asset_id
    JOIN asset_supervisors asp ON mcp.asset_id = asp.asset_id
    WHERE asp.backofficer_id = mgr_id; 
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION RetrieveMCPsFromRoute(route_id BIGINT)
RETURNS TABLE (
    id BIGINT,
    order_val SMALLINT,
    longitude NUMERIC,
    latitude NUMERIC,
    load NUMERIC,
    capacity NUMERIC,
    percentage NUMERIC
)
AS $$
BEGIN
    RETURN QUERY
    SELECT contains_mcp.id, "order", longitude, latitude, "load", capacity, "load"/capacity as percentage
    FROM contains_mcp
    JOIN main_asset ON contains_mcp.mcp_id = main_asset.id
    WHERE contains_mcp.route_id = route_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION RetrieveRoutes(mgr_id BIGINT)
RETURNS SETOF route
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM route
    WHERE manager_id = mgr_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION GetDistance(route_id BIGINT)
RETURNS NUMERIC(9,3)
AS $$
DECLARE
    distance_val NUMERIC(9,3);
BEGIN
    SELECT route.distance INTO distance_val
    FROM route 
    WHERE id = route_id;
    
    RETURN distance_val;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE UpdateDistance(route_id BIGINT, distance NUMERIC(9,3))
AS $$
BEGIN
    UPDATE route 
    SET distance = distance 
    WHERE id = route_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE AssignAreaToJanitor(work_radius NUMERIC(9,3), mcp_id BIGINT, start_date DATE, jan_id BIGINT)
AS $$
BEGIN
    UPDATE janitor
    SET mcp_start_date = start_date, 
        work_radius = work_radius,
        mcp_id = mcp_id
    WHERE employee_id = jan_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE AssignRouteToCollector(route_id BIGINT, col_id BIGINT)
AS $$
BEGIN 
    UPDATE collector
    SET route_id = route_id
    WHERE employee_id = col_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION InsertShift(start_time TIME(6), end_time TIME(6), weekday VARCHAR(3), emp_id BIGINT)
RETURNS BIGINT
AS $$
DECLARE
    id BIGINT;
BEGIN
    INSERT INTO worktime(start_time, end_time, weekday, employee_id)
    VALUES (start_time, end_time, weekday, emp_id)
    RETURNING id INTO id;
    
    RETURN id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION RetrieveShift(p_id BIGINT)
RETURNS worktime
AS $$
DECLARE
    shift worktime;
BEGIN
    SELECT *
    INTO shift
    FROM worktime
    WHERE id = p_id;
    
    RETURN shift;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION RetrieveSchedule(emp_id BIGINT)
RETURNS SETOF worktime
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM worktime
    WHERE employee_id = emp_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE InsertMCP(
    longitude NUMERIC(10,7),
    latitude NUMERIC(10,7),
    load NUMERIC(9,3),
    capacity NUMERIC(9,3),
    pop_density NUMERIC(9,3),
    janitor_count BIGINT
)
AS $$
DECLARE
    temp_id BIGINT;
BEGIN
    INSERT INTO main_asset(asset_type, longitude, latitude, load, capacity)
    VALUES (0, longitude, latitude, load, capacity)
    RETURNING id INTO temp_id;
    
    INSERT INTO mcp(asset_id, pop_density, janitor_count)
    VALUES (temp_id, pop_density, janitor_count);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE InsertVehicle(
    longitude NUMERIC(10,7),
    latitude NUMERIC(10,7),
    load NUMERIC(9,3),
    capacity NUMERIC(9,3),
    type VARCHAR(10)
)
AS $$
DECLARE
    temp_id BIGINT;
BEGIN
    INSERT INTO main_asset(asset_type, longitude, latitude, load, capacity)
    VALUES (1, longitude, latitude, load, capacity)
    RETURNING id INTO temp_id;
    
    INSERT INTO vehicle(asset_id, type)
    VALUES (temp_id, type::vehicle_type);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE DeleteShift(id BIGINT)
AS $$
BEGIN
    DELETE FROM worktime
    WHERE worktime.id = id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION GetTruckOnRoute(route_id BIGINT)
RETURNS SETOF record
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM collector
    JOIN employee ON user_id = employee_id
    JOIN vehicle ON vehicle_id = asset_id
    WHERE is_working = 1 AND type = 'truck' AND collector.route_id = route_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION GetWorkingCollector()
RETURNS SETOF record
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM collector
    JOIN employee ON user_id = employee_id
    WHERE is_working = 1;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION CountDailyShift(emp_id BIGINT)
RETURNS SETOF record
AS $$
BEGIN
    RETURN QUERY
    SELECT COUNT(*) AS Num_of_shifts, weekday
    FROM worktime
    JOIN employee ON user_id = employee_id
    WHERE user_id = emp_id
    GROUP BY weekday;
END;
$$ LANGUAGE plpgsql;

