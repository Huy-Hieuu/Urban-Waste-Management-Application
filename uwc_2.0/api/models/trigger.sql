-- Create phone number constraint
CREATE OR REPLACE FUNCTION check_phone_number()
    RETURNS TRIGGER AS $$
    DECLARE
        phone_mess VARCHAR(128);
    BEGIN
        IF LENGTH(NEW.phone) > 10 OR SUBSTRING(NEW.phone FROM 1 FOR 1) <> '0' THEN
            phone_mess := 'INSERT_Error: Phone number should have at max 10 digits and start with ''0'': ' || NEW.phone;
            RAISE EXCEPTION 'INSERT_Error: %', phone_mess;
        END IF;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER UserPhone_trigger_insert
    BEFORE INSERT ON "user_system"
    FOR EACH ROW
    EXECUTE FUNCTION check_phone_number();

CREATE TRIGGER UserPhone_trigger_update
    BEFORE UPDATE ON "user_system"
    FOR EACH ROW
    EXECUTE FUNCTION check_phone_number();

-- Create 18+ constraint
CREATE OR REPLACE FUNCTION check_age()
    RETURNS TRIGGER AS $$
    DECLARE
        bdate_mess varchar(128);
    BEGIN
        IF EXTRACT(YEAR FROM age(CURRENT_DATE, NEW.birth)) < 18 THEN
            bdate_mess := 'INSERT_Error: User should be over 18 years old: ' || NEW.birth::varchar;
            RAISE EXCEPTION '45000' USING MESSAGE = bdate_mess;
        END IF;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER Birth_trigger_insert
    BEFORE INSERT ON "user_system"
    FOR EACH ROW
    EXECUTE FUNCTION check_age();

CREATE TRIGGER Birth_trigger_update
    BEFORE UPDATE ON "user_system"
    FOR EACH ROW
    EXECUTE FUNCTION check_age();

-- Create end time - start time constraint
CREATE OR REPLACE FUNCTION check_end_time()
    RETURNS TRIGGER AS $$
    DECLARE
        endtime_mess varchar(128);
    BEGIN
        IF NEW.start > NEW."end" THEN
            endtime_mess := 'INSERT_Error: End time should be after start time: ' || NEW.start::varchar || ' - ' || NEW."end"::varchar;
            RAISE EXCEPTION '45000' USING MESSAGE = endtime_mess;
        END IF;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER end_time_trigger_insert
    BEFORE INSERT ON worktime
    FOR EACH ROW
    EXECUTE FUNCTION check_end_time();

CREATE TRIGGER end_time_trigger_update
    BEFORE UPDATE ON worktime
    FOR EACH ROW
    EXECUTE FUNCTION check_end_time();

--
-- Create work radius constraint
-- Create work_radius trigger for janitor
CREATE OR REPLACE FUNCTION check_work_radius()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.work_radius > 500.0 THEN
        NEW.work_radius = 500.0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER work_radius_trigger_insert
    BEFORE INSERT ON janitor
    FOR EACH ROW
    EXECUTE FUNCTION check_work_radius();

CREATE TRIGGER work_radius_trigger_update
    BEFORE UPDATE ON janitor
    FOR EACH ROW
    EXECUTE FUNCTION check_work_radius();

-- Create asset_load trigger for asset
CREATE OR REPLACE FUNCTION check_asset_load()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.load > NEW.capacity THEN
        NEW.load = NEW.capacity;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER asset_load_trigger_insert
    BEFORE INSERT ON main_asset
    FOR EACH ROW
    EXECUTE FUNCTION check_asset_load();

CREATE TRIGGER asset_load_trigger_update
    BEFORE UPDATE ON main_asset
    FOR EACH ROW
    EXECUTE FUNCTION check_asset_load();

-- Create function to find the max capacity of all trucks on the same route
CREATE OR REPLACE FUNCTION GetMaxCapacity(route_mcp_id bigint)
    RETURNS numeric(9, 3) AS $$
DECLARE
    max_cap numeric(9, 3);
BEGIN
    SELECT MAX(a.capacity) INTO max_cap
    FROM collector c
    JOIN employee e ON c.employee_id = e.user_id
    JOIN main_asset a ON e.vehicle_id = a.id
    WHERE c.route_id = route_mcp_id;

    RETURN max_cap;
END;
$$ LANGUAGE plpgsql;

--
-- function to get total load of a route
CREATE OR REPLACE FUNCTION GetRouteLoad(route_id bigint)
    RETURNS numeric(9, 3) AS $$
DECLARE
    res numeric(9, 3);
BEGIN
    SELECT SUM(main_asset.load) INTO res
    FROM route
    JOIN contains_mcp ON route.id = contains_mcp.route_id
    JOIN main_asset ON contains_mcp.mcp_id = main_asset.id
    WHERE route.id = route_id;

    RETURN res;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION overloaded_mcp_route_insert()
    RETURNS TRIGGER AS $$
DECLARE
    mcp_overload_mess varchar(128);
BEGIN
    IF (GetRouteLoad(NEW.route_id) + (SELECT capacity FROM main_asset WHERE id = NEW.mcp_id)) > GetMaxCapacity(NEW.route_id) THEN
        mcp_overload_mess := CONCAT('Collector Truck will be overloaded on this route if MCP: ', NEW.mcp_id::varchar, ' is added into route: ', NEW.route_id::varchar, '.');
        RAISE EXCEPTION 'INSERT_Error: %', mcp_overload_mess;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER overloaded_mcp_route_insert_trigger
    BEFORE INSERT ON contains_mcp
    FOR EACH ROW
    EXECUTE FUNCTION overloaded_mcp_route_insert();

CREATE OR REPLACE FUNCTION count_employee_trigger()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE back_officer
    SET employee_count = employee_count + 1
    WHERE user_id = NEW.manager_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER count_employee_trigger_trigger
    AFTER INSERT ON employee
    FOR EACH ROW
    EXECUTE FUNCTION count_employee_trigger();

CREATE OR REPLACE FUNCTION count_mcp_trigger()
    RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT is_vehicle FROM main_asset WHERE id = NEW.asset_id) = 0 THEN
        UPDATE back_officer
        SET mcp_count = mcp_count + 1
        WHERE user_id = NEW.backofficer_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER count_mcp_trigger_trigger
    AFTER INSERT ON asset_supervisors
    FOR EACH ROW
    EXECUTE FUNCTION count_mcp_trigger();

CREATE OR REPLACE FUNCTION count_vehicle_trigger()
    RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT is_vehicle FROM main_asset WHERE id = NEW.asset_id) = 1 THEN
        UPDATE back_officer
        SET vehicle_count = vehicle_count + 1
        WHERE user_id = NEW.backofficer_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION count_janitor_trigger()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE mcp
    SET janitor_count = janitor_count + 1
    WHERE asset_id = NEW.mcp_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER count_janitor_trigger_trigger
    AFTER INSERT ON janitor
    FOR EACH ROW
    EXECUTE FUNCTION count_janitor_trigger();

CREATE OR REPLACE FUNCTION CountMCP(backofficer_id bigint)
    RETURNS bigint AS $$
DECLARE
    count_mcp bigint;
BEGIN
    SELECT COUNT(*) INTO count_mcp
    FROM asset_supervisors
    JOIN main_asset ON asset_supervisors.asset_id = asset.id
    WHERE asset_supervisors.backofficer_id = backofficer_id
        AND main_asset.is_vehicle = FALSE;
    RETURN count_mcp;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION CountVehicle(backofficer_id bigint)
    RETURNS bigint AS $$
DECLARE
    count_vehicle bigint;
BEGIN
    SELECT COUNT(*) INTO count_vehicle
    FROM asset_supervisors
    JOIN main_asset ON asset_supervisors.asset_id = asset.id
    WHERE asset_supervisors.backofficer_id = backofficer_id
        AND main_asset.is_vehicle = TRUE;
    RETURN count_vehicle;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE CountAll()
LANGUAGE plpgsql
AS $$
DECLARE
    finish boolean := FALSE;
    backofficer_id bigint;
    curID CURSOR FOR SELECT user_id FROM back_officer FOR UPDATE;
BEGIN
    OPEN curID;
    LOOP
        FETCH curID INTO backofficer_id;
        EXIT WHEN NOT FOUND;
        UPDATE back_officer
        SET mcp_count = CountMCP(backofficer_id),
            vehicle_count = CountVehicle(backofficer_id)
        WHERE user_id = backofficer_id;
    END LOOP;
    CLOSE curID;
END;
$$;

CREATE OR REPLACE FUNCTION shift_insert_trigger()
    RETURNS TRIGGER AS $$
DECLARE
    overload_shift_mess VARCHAR(128);
    is_overloaded BOOLEAN := FALSE;
    exit_shift BOOLEAN := FALSE;
    start_time TIME;
    end_time TIME;
    curShift CURSOR FOR 
        SELECT "start", "end" FROM worktime 
        WHERE 
            employee_id = NEW.employee_id AND
            weekday = NEW.weekday;
BEGIN
    OPEN curShift;
    LOOP
        FETCH curShift INTO start_time, end_time;
        EXIT WHEN NOT FOUND;
        -- New start time before old end time
        IF extract(epoch FROM NEW.start - end_time) > 0 THEN
            -- New end time after old start time
            IF extract(epoch FROM NEW.end - start_time) < 0 THEN 
                is_overloaded := TRUE;
            END IF;
        END IF;
        IF is_overloaded THEN
            overload_shift_mess := CONCAT('Shift inserted must not overload existing shifts: ', 
                                    CAST(NEW.start AS VARCHAR), ' - ', CAST(NEW.end AS VARCHAR), ' on: ', CAST(NEW.weekday AS VARCHAR));
            RAISE EXCEPTION '45000' USING MESSAGE = overload_shift_mess;
        END IF;
    END LOOP;
    CLOSE curShift;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shift_insert_trigger
    BEFORE INSERT ON worktime
    FOR EACH ROW
    EXECUTE FUNCTION shift_insert_trigger();
