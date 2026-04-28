-- deleting step by step DB
DROP VIEW IF EXISTS vw_sale_report;
DROP TRIGGER IF EXISTS tgr_product_update ON product;
DROP PROCEDURE IF EXISTS sp_bulk_insert_categories;
DROP PROCEDURE IF EXISTS sp_bulk_insert_products;
DROP PROCEDURE IF EXISTS sp_save_sale;
DROP PROCEDURE IF EXISTS sp_create_sale;
DROP FUNCTION IF EXISTS fn_filter_categories;
DROP FUNCTION IF EXISTS fn_filter_products;
DROP FUNCTION IF EXISTS fn_log_product_update;
DROP TABLE IF EXISTS sale_detail;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS sale;
DROP TABLE IF EXISTS product_log;

-- ## *****
-- tables
-- ## *****
CREATE TABLE category(
  category_id SMALLSERIAL,
  public_key VARCHAR(20) NOT NULL DEFAULT 'NEW_CODE',
  name VARCHAR(32) NOT NULL DEFAULT 'PLANK_CATEGORY',
  flag_state BOOLEAN NOT NULL DEFAULT FALSE,
  flag_visible BOOLEAN NOT NULL DEFAULT FALSE,
  create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update TIMESTAMP,
  CONSTRAINT pk_category_id PRIMARY KEY(category_id),
  CONSTRAINT uk_category_id UNIQUE(category_id),
  CONSTRAINT uk_category_public_key UNIQUE(public_key)
);

CREATE TABLE product(
  product_id SERIAL,
  public_key VARCHAR(20) NOT NULL DEFAULT 'NEW_CODE',
  name VARCHAR(64) NOT NULL DEFAULT 'PLANK_PRODUCT',
  unit_price FLOAT NOT NULL DEFAULT 0.0,
  ammount SMALLINT NOT NULL DEFAULT 0,
  flag_state BOOLEAN NOT NULL DEFAULT FALSE,
  flag_visible BOOLEAN NOT NULL DEFAULT FALSE,
  create_date TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  last_update TIMESTAMP,
  category_id SMALLINT NOT NULL,
  CONSTRAINT pk_product_id PRIMARY KEY(product_id),
  CONSTRAINT uk_product_id UNIQUE(product_id),
  CONSTRAINT uk_product_public_key UNIQUE(public_key),
  CONSTRAINT fk_product_category FOREIGN KEY(category_id) REFERENCES category(category_id)
);

CREATE TABLE sale(
  sale_id BIGSERIAL,
  public_key VARCHAR(20) NOT NULL DEFAULT 'NEW_CODE',
  flag_state BOOLEAN NOT NULL DEFAULT FALSE,
  flag_visible BOOLEAN NOT NULL DEFAULT FALSE,
  create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update TIMESTAMP,
  CONSTRAINT pk_sale PRIMARY KEY(sale_id),
  CONSTRAINT uk_sale_id UNIQUE(sale_id),
  CONSTRAINT uk_sale_public_key UNIQUE(public_key)
);

CREATE TABLE sale_detail(
  sale_detail_id BIGSERIAL,
  sale_id BIGINT NOT NULL,
  product_id INTEGER NOT NULL,
  unit_price FLOAT NOT NULL DEFAULT 0.0,
  ammount SMALLINT NOT NULL DEFAULT 0,
  CONSTRAINT pk_sale_detail PRIMARY KEY(sale_detail_id),
  CONSTRAINT uk_sale_detail_id UNIQUE(sale_detail_id),
  CONSTRAINT fk_sale_detail_sale FOREIGN KEY(sale_id) REFERENCES sale(sale_id),
  CONSTRAINT fk_sale_detail_product FOREIGN KEY(product_id) REFERENCES product(product_id)
);

-- ## *****
-- logs tables
-- ## *****
CREATE TABLE product_log(
  product_id INTEGER,
  public_key VARCHAR(20),
  name VARCHAR(64),
  unit_price FLOAT,
  ammount SMALLINT,
  flag_state BOOLEAN,
  flag_visible BOOLEAN,
  category_id SMALLINT,
  operation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  message VARCHAR(8) NOT NULL DEFAULT 'BLANK'
);

-- ## *****
-- procedures and functions
-- ## *****

-- ## *****
-- procedures
-- ## *****
CREATE OR REPLACE PROCEDURE sp_bulk_insert_categories(IN par_list_objects TEXT, OUT par_result_list TEXT) LANGUAGE plpgsql AS $fn_bulk_insert_categories$
  DECLARE
    var_result_list JSONB;
  BEGIN
    WITH var_tuples AS (
      INSERT INTO category(public_key, name, flag_state, flag_visible) SELECT item.public_key, item.name, TRUE, TRUE
      FROM jsonb_to_recordset(par_list_objects::JSONB) AS item(
        public_key VARCHAR(20),
        name VARCHAR(32)
      ) RETURNING *
    ) SELECT json_agg(var_tuples) INTO var_result_list FROM var_tuples;
    par_result_list := var_result_list::TEXT;
    EXCEPTION
      WHEN OTHERS THEN
        ROLLBACK;
  END;
$fn_bulk_insert_categories$;

CREATE OR REPLACE PROCEDURE sp_bulk_insert_products(IN par_list_objects TEXT, OUT par_result_list TEXT) LANGUAGE plpgsql AS $sp_bulk_insert_products$
  DECLARE
    var_category RECORD;
    var_record RECORD;
    var_record_result RECORD;
    var_temp JSON;
    var_result JSONB DEFAULT '[]';
    var_category_public_key VARCHAR(20);
  BEGIN
    FOR var_record IN SELECT * FROM jsonb_to_recordset(par_list_objects::JSONB) AS item(
      public_key VARCHAR(20),
      name VARCHAR(64),
      unit_price FLOAT,
      ammount SMALLINT,
      category JSONB
    ) LOOP
        var_category_public_key := var_record.category->>'public_key';
        SELECT * FROM category WHERE (category.flag_state IS TRUE) AND (category.flag_visible IS TRUE) AND (category.public_key = var_category_public_key) INTO var_category;
        INSERT INTO product(public_key, name, unit_price, ammount, flag_state, flag_visible, category_id) VALUES (
          var_record.public_key,
          var_record.name,
          var_record.unit_price,
          var_record.ammount,
          TRUE,
          TRUE,
          var_category.category_id
        ) RETURNING * INTO var_record_result;
        var_result := var_result || jsonb_build_object(
          'public_key', var_record_result.public_key,
          'name', var_record_result.name,
          'unit_price', var_record_result.unit_price,
          'ammount', var_record_result.ammount,
          'flag_state', var_record_result.flag_state,
          'flag_visible', var_record_result.flag_visible,
          'create_date', var_record_result.create_date,
          'last_update', var_record_result.last_update,
          'category', row_to_json(var_category)::JSONB
        );
      END LOOP;
    par_result_list := var_result::TEXT;
  END;
$sp_bulk_insert_products$;

CREATE OR REPLACE PROCEDURE sp_save_sale(
  IN par_sale_public_key VARCHAR(20),
  IN par_list_products TEXT,
  OUT par_result_list TEXT
) LANGUAGE plpgsql AS $sp_save_sale$
  DECLARE
    var_sale RECORD;
    var_product RECORD;
    var_record RECORD;
    var_result JSONB DEFAULT '[]';
    var_product_public_key VARCHAR(20);
  BEGIN
    CALL sp_create_sale(par_sale_public_key);
    SELECT * INTO var_sale FROM sale WHERE (flag_state IS TRUE) AND (flag_visible IS TRUE) AND (public_key LIKE CONCAT('%', par_sale_public_key, '%'));
    FOR var_record IN SELECT * FROM jsonb_to_recordset(par_list_products::JSONB) AS item(ammount SMALLINT, product JSONB)
      LOOP
        SELECT * INTO var_product FROM product WHERE (product.flag_state IS TRUE) AND (product.flag_visible IS TRUE) AND (product.public_key = var_record.product->>'public_key');
        INSERT INTO sale_detail(sale_id, product_id, unit_price, ammount) VALUES (var_sale.sale_id, var_product.product_id, var_product.unit_price, var_record.ammount);
        UPDATE product SET ammount = (var_product.ammount - var_record.ammount), last_update = CURRENT_TIMESTAMP WHERE (product.flag_state IS TRUE) and (product.product_id = var_product.product_id);
        var_result := var_result || jsonb_build_object(
          'unit_price', var_product.unit_price,
          'ammount', var_record.ammount,
          'sale', row_to_json(var_sale)::JSONB,
          'product', row_to_json(var_product)::JSONB
        );
      END LOOP;
    par_result_list := var_result::TEXT;
  END;
$sp_save_sale$;

CREATE OR REPLACE PROCEDURE sp_create_sale(IN par_sale_public_key VARCHAR(20)) LANGUAGE plpgsql AS $sp_create_sale$
  BEGIN
    INSERT INTO sale(public_key, flag_state, flag_visible) VALUES (par_sale_public_key, TRUE, TRUE);
  END;
$sp_create_sale$;

-- ## *****
-- functions
-- ## *****
CREATE OR REPLACE FUNCTION fn_filter_categories(
  IN par_public_key VARCHAR(20),
  IN par_name VARCHAR(32),
  IN par_flag_state BOOLEAN,
  IN par_flag_visible BOOLEAN
) RETURNS TEXT AS $fn_filter_categories$
  DECLARE
    var_record RECORD;
    var_category JSONB;
    var_list_products JSONB;
    var_result JSONB DEFAULT '[]';
  BEGIN
    FOR var_record IN SELECT * FROM category WHERE (category.flag_state = par_flag_state) AND (category.flag_visible = par_flag_visible) AND (category.public_key LIKE CONCAT('%', par_public_key, '%')) AND (category.name LIKE CONCAT(par_name, '%'))
      LOOP
        SELECT COALESCE(json_agg(products), '[]') INTO var_list_products FROM (SELECT * FROM product WHERE (product.flag_state IS TRUE) AND (product.flag_visible IS TRUE) AND (product.category_id = var_record.category_id)) AS products;
        var_category := row_to_json(var_record);
        var_category := jsonb_set(var_category, '{list_products}', var_list_products);
        var_result := var_result || var_category;
      END LOOP;
    RETURN var_result::TEXT;
  END;
$fn_filter_categories$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_filter_products(
  IN par_public_key VARCHAR(20),
  IN par_name VARCHAR(64),
  IN par_flag_state BOOLEAN,
  IN par_flag_visible BOOLEAN,
  IN par_category_public_key VARCHAR(20)
) RETURNS TEXT AS $fn_filter_products$
  DECLARE
    var_record RECORD;
    var_result JSONB DEFAULT '[]';
    var_product JSONB;
  BEGIN
    FOR var_record IN SELECT product.*, to_json(category.*) AS category FROM product INNER JOIN category ON (product.category_id = category.category_id)
    WHERE (product.flag_state = par_flag_state) AND
    (product.flag_visible = par_flag_visible) AND
    (product.public_key LIKE CONCAT('%', par_public_key, '%')) AND
    (product.name LIKE CONCAT(par_name, '%')) AND
    (category.public_key LIKE CONCAT('%', par_category_public_key, '%'))
      LOOP
        var_product := row_to_json(var_record);
        var_result := var_result || var_product;
      END LOOP;
    RETURN var_result::TEXT;
  END;
$fn_filter_products$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_filter_sales(
  IN par_public_key VARCHAR(20),
  IN par_date DATE
) RETURNS TEXT AS $fn_filter_sales$
  DECLARE
    var_tuples RECORD;
    var_result TEXT;
  BEGIN
    SELECT json_agg(var_sales.sales)::TEXT INTO var_result FROM (
      SELECT
        json_build_object(
          'public_key', sale.public_key,
          'create_date', sale.create_date,
          'flag_state', true,
          'flag_visible', true,
          'list_sale_details', json_agg(
            json_build_object(
              'unit_price', sale_detail.unit_price,
              'ammount', sale_detail.ammount,
              -- 'price', (sale_detail.unit_price * sale_detail.ammount)
              'product', json_build_object(
                'public_key', product.public_key,
                'name', product.name,
                'unit_price', product.unit_price,
                'ammount', product.ammount,
                'flag_state', product.flag_state,
                'flag_visible', product.flag_visible
              )
            )
          )
        ) AS sales
      FROM sale
      INNER JOIN sale_detail ON (sale.sale_id = sale_detail.sale_id)
      INNER JOIN product ON (product.product_id = sale_detail.product_id)
      WHERE (sale.flag_state IS TRUE) AND (sale.flag_visible IS TRUE) AND
      (sale.public_key LIKE CONCAT('%', par_public_key, '%')) AND
      (sale.create_date::DATE = par_date) GROUP BY sale.public_key, sale.create_date
    ) AS var_sales;
    RETURN COALESCE(var_result, '[]');
  END;
$fn_filter_sales$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_log_product_update() RETURNS TRIGGER AS $tgr_product_update$
  DECLARE
    var_message VARCHAR(8) DEFAULT 'UPDATE';
  BEGIN
    IF (NEW.ammount > OLD.ammount) THEN
      var_message := 'PURCHASE';
    ELSEIF (NEW.ammount < OLD.ammount) THEN
      var_message := 'SALE';
    END IF;
    INSERT INTO product_log(product_id, public_key, name, unit_price, ammount, flag_state, flag_visible, category_id, message) VALUES (OLD.product_id, OLD.public_key, NEW.name, NEW.unit_price, NEW.ammount, NEW.flag_state, NEW.flag_visible, NEW.category_id, var_message);
    RETURN NEW;
  END;
$tgr_product_update$ LANGUAGE plpgsql;

-- ## *****
-- ## triggers
-- ## *****
CREATE TRIGGER tgr_product_update AFTER UPDATE ON product FOR EACH ROW EXECUTE FUNCTION fn_log_product_update();

-- ## *****
-- ## views
-- ## *****
CREATE OR REPLACE TEMP VIEW vw_sale_report AS SELECT sale.public_key AS sale_nbr, product.name AS product_name, sale_detail.ammount AS ammount, sale_detail.unit_price AS unit_price, (sale_detail.ammount * sale_detail.unit_price) AS price
FROM sale INNER JOIN sale_detail ON (sale.sale_id = sale_detail.sale_id) INNER JOIN product ON (product.product_id = sale_detail.product_id) WHERE (sale.flag_state IS TRUE) AND (sale.flag_visible IS TRUE) ORDER BY product.name;
