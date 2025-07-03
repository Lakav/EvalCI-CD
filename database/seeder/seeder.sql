INSERT INTO tasks (title, description, completed, user_id)
SELECT 
  'Tâche ' || g, 
  'Description ' || g, 
  false, 
  1
FROM generate_series(1, 10000) AS g;