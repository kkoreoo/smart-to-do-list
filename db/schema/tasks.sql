DROP TABLE IF EXISTS tasks CASCADE;
CREATE TABLE tasks(
  id SERIAL PRIMARY KEY NOT NULL,
  task_name VARCHAR(255) NOT NULL,
  task_status boolean DEFAULT false,
  category_name VARCHAR(255) NOT NULL
);
