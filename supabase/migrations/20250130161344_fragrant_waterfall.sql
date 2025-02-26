-- Get the wheat commodity ID and insert all data
DO $$
DECLARE
  v_wheat_id uuid;
BEGIN
  -- Get the wheat commodity ID
  SELECT id INTO v_wheat_id
  FROM commodities
  WHERE symbol = 'WHEAT'
  LIMIT 1;

  -- Clear existing data
  DELETE FROM wheat_forecasts;

  -- Insert historical data (May 2024 - Jan 2025)
  INSERT INTO wheat_forecasts (commodity_id, date, price, is_forecast, confidence_lower, confidence_upper)
  VALUES
    (v_wheat_id, '2024-05-23', 234.52, false, NULL, NULL),
    (v_wheat_id, '2024-05-24', 249.36, false, NULL, NULL),
    (v_wheat_id, '2024-05-25', 246.16, false, NULL, NULL),
    (v_wheat_id, '2024-05-26', 246.03, false, NULL, NULL),
    (v_wheat_id, '2024-05-27', 204.41, false, NULL, NULL),
    (v_wheat_id, '2024-05-28', 208.61, false, NULL, NULL),
    (v_wheat_id, '2024-05-29', 218.71, false, NULL, NULL),
    (v_wheat_id, '2024-05-30', 227.64, false, NULL, NULL),
    (v_wheat_id, '2024-05-31', 244.15, false, NULL, NULL),
    (v_wheat_id, '2024-06-01', 216.30, false, NULL, NULL),
    (v_wheat_id, '2024-06-02', 225.00, false, NULL, NULL),
    (v_wheat_id, '2024-06-03', 244.89, false, NULL, NULL),
    (v_wheat_id, '2024-06-04', 208.46, false, NULL, NULL),
    (v_wheat_id, '2024-06-05', 200.85, false, NULL, NULL),
    (v_wheat_id, '2024-06-06', 215.16, false, NULL, NULL),
    (v_wheat_id, '2024-06-07', 203.59, false, NULL, NULL),
    (v_wheat_id, '2024-06-08', 243.37, false, NULL, NULL),
    (v_wheat_id, '2024-06-09', 241.83, false, NULL, NULL),
    (v_wheat_id, '2024-06-10', 200.68, false, NULL, NULL),
    (v_wheat_id, '2024-06-11', 230.55, false, NULL, NULL),
    (v_wheat_id, '2024-06-12', 217.94, false, NULL, NULL),
    (v_wheat_id, '2024-06-13', 215.79, false, NULL, NULL),
    (v_wheat_id, '2024-06-14', 220.83, false, NULL, NULL),
    (v_wheat_id, '2024-06-15', 228.07, false, NULL, NULL),
    (v_wheat_id, '2024-06-16', 223.28, false, NULL, NULL),
    (v_wheat_id, '2024-06-17', 235.11, false, NULL, NULL),
    (v_wheat_id, '2024-06-18', 244.09, false, NULL, NULL),
    (v_wheat_id, '2024-06-19', 235.81, false, NULL, NULL),
    (v_wheat_id, '2024-06-20', 226.52, false, NULL, NULL),
    (v_wheat_id, '2024-06-21', 214.22, false, NULL, NULL),
    (v_wheat_id, '2024-06-22', 243.58, false, NULL, NULL),
    (v_wheat_id, '2024-06-23', 218.26, false, NULL, NULL),
    (v_wheat_id, '2024-06-24', 217.34, false, NULL, NULL),
    (v_wheat_id, '2024-06-25', 206.69, false, NULL, NULL),
    (v_wheat_id, '2024-06-26', 225.84, false, NULL, NULL),
    (v_wheat_id, '2024-06-27', 218.58, false, NULL, NULL),
    (v_wheat_id, '2024-06-28', 238.40, false, NULL, NULL),
    (v_wheat_id, '2024-06-29', 202.37, false, NULL, NULL),
    (v_wheat_id, '2024-06-30', 224.57, false, NULL, NULL),
    (v_wheat_id, '2024-07-01', 233.37, false, NULL, NULL),
    (v_wheat_id, '2024-07-02', 229.86, false, NULL, NULL),
    (v_wheat_id, '2024-07-03', 220.29, false, NULL, NULL),
    (v_wheat_id, '2024-07-04', 209.70, false, NULL, NULL),
    (v_wheat_id, '2024-07-05', 218.34, false, NULL, NULL),
    (v_wheat_id, '2024-07-06', 214.29, false, NULL, NULL),
    (v_wheat_id, '2024-07-07', 208.65, false, NULL, NULL),
    (v_wheat_id, '2024-07-08', 211.74, false, NULL, NULL),
    (v_wheat_id, '2024-07-09', 219.30, false, NULL, NULL),
    (v_wheat_id, '2024-07-10', 246.63, false, NULL, NULL),
    (v_wheat_id, '2024-07-11', 225.48, false, NULL, NULL),
    (v_wheat_id, '2024-07-12', 240.21, false, NULL, NULL),
    (v_wheat_id, '2024-07-13', 244.81, false, NULL, NULL),
    (v_wheat_id, '2024-07-14', 214.04, false, NULL, NULL),
    (v_wheat_id, '2024-07-15', 222.89, false, NULL, NULL),
    (v_wheat_id, '2024-07-16', 247.80, false, NULL, NULL),
    (v_wheat_id, '2024-07-17', 235.66, false, NULL, NULL),
    (v_wheat_id, '2024-07-18', 233.09, false, NULL, NULL),
    (v_wheat_id, '2024-07-19', 225.09, false, NULL, NULL),
    (v_wheat_id, '2024-07-20', 206.04, false, NULL, NULL),
    (v_wheat_id, '2024-07-21', 202.76, false, NULL, NULL),
    (v_wheat_id, '2024-07-22', 231.66, false, NULL, NULL),
    (v_wheat_id, '2024-07-23', 201.55, false, NULL, NULL),
    (v_wheat_id, '2024-07-24', 239.10, false, NULL, NULL),
    (v_wheat_id, '2024-07-25', 242.82, false, NULL, NULL),
    (v_wheat_id, '2024-07-26', 246.71, false, NULL, NULL),
    (v_wheat_id, '2024-07-27', 221.46, false, NULL, NULL),
    (v_wheat_id, '2024-07-28', 202.67, false, NULL, NULL),
    (v_wheat_id, '2024-07-29', 232.83, false, NULL, NULL),
    (v_wheat_id, '2024-07-30', 242.81, false, NULL, NULL),
    (v_wheat_id, '2024-07-31', 202.95, false, NULL, NULL),
    (v_wheat_id, '2024-08-01', 239.84, false, NULL, NULL),
    (v_wheat_id, '2024-08-02', 218.04, false, NULL, NULL),
    (v_wheat_id, '2024-08-03', 226.15, false, NULL, NULL),
    (v_wheat_id, '2024-08-04', 237.53, false, NULL, NULL),
    (v_wheat_id, '2024-08-05', 227.91, false, NULL, NULL),
    (v_wheat_id, '2024-08-06', 205.96, false, NULL, NULL),
    (v_wheat_id, '2024-08-07', 217.03, false, NULL, NULL),
    (v_wheat_id, '2024-08-08', 237.64, false, NULL, NULL),
    (v_wheat_id, '2024-08-09', 210.35, false, NULL, NULL),
    (v_wheat_id, '2024-08-10', 226.79, false, NULL, NULL),
    (v_wheat_id, '2024-08-11', 212.54, false, NULL, NULL),
    (v_wheat_id, '2024-08-12', 229.70, false, NULL, NULL),
    (v_wheat_id, '2024-08-13', 215.78, false, NULL, NULL),
    (v_wheat_id, '2024-08-14', 218.97, false, NULL, NULL),
    (v_wheat_id, '2024-08-15', 203.59, false, NULL, NULL),
    (v_wheat_id, '2024-08-16', 247.86, false, NULL, NULL),
    (v_wheat_id, '2024-08-17', 225.23, false, NULL, NULL),
    (v_wheat_id, '2024-08-18', 233.16, false, NULL, NULL),
    (v_wheat_id, '2024-08-19', 204.95, false, NULL, NULL),
    (v_wheat_id, '2024-08-20', 232.39, false, NULL, NULL),
    (v_wheat_id, '2024-08-21', 244.51, false, NULL, NULL),
    (v_wheat_id, '2024-08-22', 217.28, false, NULL, NULL),
    (v_wheat_id, '2024-08-23', 233.63, false, NULL, NULL),
    (v_wheat_id, '2024-08-24', 212.99, false, NULL, NULL),
    (v_wheat_id, '2024-08-25', 221.54, false, NULL, NULL),
    (v_wheat_id, '2024-08-26', 249.01, false, NULL, NULL),
    (v_wheat_id, '2024-08-27', 226.11, false, NULL, NULL),
    (v_wheat_id, '2024-08-28', 229.54, false, NULL, NULL),
    (v_wheat_id, '2024-08-29', 227.24, false, NULL, NULL),
    (v_wheat_id, '2024-08-30', 237.53, false, NULL, NULL),
    (v_wheat_id, '2024-08-31', 218.50, false, NULL, NULL),
    (v_wheat_id, '2024-09-01', 220.81, false, NULL, NULL),
    (v_wheat_id, '2024-09-02', 210.25, false, NULL, NULL),
    (v_wheat_id, '2024-09-03', 209.56, false, NULL, NULL),
    (v_wheat_id, '2024-09-04', 211.98, false, NULL, NULL),
    (v_wheat_id, '2024-09-05', 235.68, false, NULL, NULL),
    (v_wheat_id, '2024-09-06', 214.21, false, NULL, NULL),
    (v_wheat_id, '2024-09-07', 245.64, false, NULL, NULL),
    (v_wheat_id, '2024-09-08', 239.40, false, NULL, NULL),
    (v_wheat_id, '2024-09-09', 247.58, false, NULL, NULL),
    (v_wheat_id, '2024-09-10', 223.23, false, NULL, NULL),
    (v_wheat_id, '2024-09-11', 209.27, false, NULL, NULL),
    (v_wheat_id, '2024-09-12', 249.07, false, NULL, NULL),
    (v_wheat_id, '2024-09-13', 247.19, false, NULL, NULL),
    (v_wheat_id, '2024-09-14', 246.74, false, NULL, NULL),
    (v_wheat_id, '2024-09-15', 224.26, false, NULL, NULL),
    (v_wheat_id, '2024-09-16', 200.57, false, NULL, NULL),
    (v_wheat_id, '2024-09-17', 210.11, false, NULL, NULL),
    (v_wheat_id, '2024-09-18', 231.49, false, NULL, NULL),
    (v_wheat_id, '2024-09-19', 219.99, false, NULL, NULL),
    (v_wheat_id, '2024-09-20', 228.09, false, NULL, NULL),
    (v_wheat_id, '2024-09-21', 212.51, false, NULL, NULL),
    (v_wheat_id, '2024-09-22', 242.24, false, NULL, NULL),
    (v_wheat_id, '2024-09-23', 242.53, false, NULL, NULL),
    (v_wheat_id, '2024-09-24', 214.20, false, NULL, NULL),
    (v_wheat_id, '2024-09-25', 203.43, false, NULL, NULL),
    (v_wheat_id, '2024-09-26', 204.10, false, NULL, NULL),
    (v_wheat_id, '2024-09-27', 218.82, false, NULL, NULL),
    (v_wheat_id, '2024-09-28', 206.73, false, NULL, NULL),
    (v_wheat_id, '2024-09-29', 225.06, false, NULL, NULL),
    (v_wheat_id, '2024-09-30', 216.84, false, NULL, NULL),
    (v_wheat_id, '2024-10-01', 226.75, false, NULL, NULL),
    (v_wheat_id, '2024-10-02', 214.42, false, NULL, NULL),
    (v_wheat_id, '2024-10-03', 211.47, false, NULL, NULL),
    (v_wheat_id, '2024-10-04', 220.22, false, NULL, NULL),
    (v_wheat_id, '2024-10-05', 231.99, false, NULL, NULL),
    (v_wheat_id, '2024-10-06', 208.84, false, NULL, NULL),
    (v_wheat_id, '2024-10-07', 214.53, false, NULL, NULL),
    (v_wheat_id, '2024-10-08', 204.97, false, NULL, NULL),
    (v_wheat_id, '2024-10-09', 249.22, false, NULL, NULL),
    (v_wheat_id, '2024-10-10', 214.24, false, NULL, NULL),
    (v_wheat_id, '2024-10-11', 234.74, false, NULL, NULL),
    (v_wheat_id, '2024-10-12', 213.00, false, NULL, NULL),
    (v_wheat_id, '2024-10-13', 206.74, false, NULL, NULL),
    (v_wheat_id, '2024-10-14', 239.83, false, NULL, NULL),
    (v_wheat_id, '2024-10-15', 245.09, false, NULL, NULL),
    (v_wheat_id, '2024-10-16', 227.45, false, NULL, NULL),
    (v_wheat_id, '2024-10-17', 236.20, false, NULL, NULL),
    (v_wheat_id, '2024-10-18', 222.12, false, NULL, NULL),
    (v_wheat_id, '2024-10-19', 247.04, false, NULL, NULL),
    (v_wheat_id, '2024-10-20', 249.14, false, NULL, NULL),
    (v_wheat_id, '2024-10-21', 233.17, false, NULL, NULL),
    (v_wheat_id, '2024-10-22', 237.02, false, NULL, NULL),
    (v_wheat_id, '2024-10-23', 238.07, false, NULL, NULL),
    (v_wheat_id, '2024-10-24', 227.59, false, NULL, NULL),
    (v_wheat_id, '2024-10-25', 247.01, false, NULL, NULL),
    (v_wheat_id, '2024-10-26', 225.41, false, NULL, NULL),
    (v_wheat_id, '2024-10-27', 217.86, false, NULL, NULL),
    (v_wheat_id, '2024-10-28', 215.00, false, NULL, NULL),
    (v_wheat_id, '2024-10-29', 239.52, false, NULL, NULL),
    (v_wheat_id, '2024-10-30', 244.42, false, NULL, NULL),
    (v_wheat_id, '2024-10-31', 239.90, false, NULL, NULL),
    (v_wheat_id, '2024-11-01', 205.43, false, NULL, NULL),
    (v_wheat_id, '2024-11-02', 205.06, false, NULL, NULL),
    (v_wheat_id, '2024-11-03', 229.63, false, NULL, NULL),
    (v_wheat_id, '2024-11-04', 229.54, false, NULL, NULL),
    (v_wheat_id, '2024-11-05', 241.29, false, NULL, NULL),
    (v_wheat_id, '2024-11-06', 215.59, false, NULL, NULL),
    (v_wheat_id, '2024-11-07', 242.80, false, NULL, NULL),
    (v_wheat_id, '2024-11-08', 249.69, false, NULL, NULL),
    (v_wheat_id, '2024-11-09', 228.36, false, NULL, NULL),
    (v_wheat_id, '2024-11-10', 212.22, false, NULL, NULL),
    (v_wheat_id, '2024-11-11', 224.09, false, NULL, NULL),
    (v_wheat_id, '2024-11-12', 223.79, false, NULL, NULL),
    (v_wheat_id, '2024-11-13', 238.07, false, NULL, NULL),
    (v_wheat_id, '2024-11-14', 213.76, false, NULL, NULL),
    (v_wheat_id, '2024-11-15', 239.03, false, NULL, NULL),
    (v_wheat_id, '2024-11-16', 249.65, false, NULL, NULL),
    (v_wheat_id, '2024-11-17', 228.32, false, NULL, NULL),
    (v_wheat_id, '2024-11-18', 246.13, false, NULL, NULL),
    (v_wheat_id, '2024-11-19', 231.28, false, NULL, NULL),
    (v_wheat_id, '2024-11-20', 231.23, false, NULL, NULL),
    (v_wheat_id, '2024-11-21', 234.36, false, NULL, NULL),
    (v_wheat_id, '2024-11-22', 221.20, false, NULL, NULL),
    (v_wheat_id, '2024-11-23', 213.94, false, NULL, NULL),
    (v_wheat_id, '2024-11-24', 200.75, false, NULL, NULL),
    (v_wheat_id, '2024-11-25', 202.90, false, NULL, NULL),
    (v_wheat_id, '2024-11-26', 243.96, false, NULL, NULL),
    (v_wheat_id, '2024-11-27', 215.85, false, NULL, NULL),
    (v_wheat_id, '2024-11-28', 225.15, false, NULL, NULL),
    (v_wheat_id, '2024-11-29', 230.57, false, NULL, NULL),
    (v_wheat_id, '2024-11-30', 245.48, false, NULL, NULL),
    (v_wheat_id, '2024-12-01', 223.13, false, NULL, NULL),
    (v_wheat_id, '2024-12-02', 249.26, false, NULL, NULL),
    (v_wheat_id, '2024-12-03', 228.68, false, NULL, NULL),
    (v_wheat_id, '2024-12-04', 218.31, false, NULL, NULL),
    (v_wheat_id, '2024-12-05', 226.20, false, NULL, NULL),
    (v_wheat_id, '2024-12-06', 237.97, false, NULL, NULL),
    (v_wheat_id, '2024-12-07', 208.53, false, NULL, NULL),
    (v_wheat_id, '2024-12-08', 218.49, false, NULL, NULL),
    (v_wheat_id, '2024-12-09', 239.06, false, NULL, NULL),
    (v_wheat_id, '2024-12-10', 215.59, false, NULL, NULL),
    (v_wheat_id, '2024-12-11', 226.68, false, NULL, NULL),
    (v_wheat_id, '2024-12-12', 225.00, false, NULL, NULL),
    (v_wheat_id, '2024-12-13', 216.72, false, NULL, NULL),
    (v_wheat_id, '2024-12-14', 243.99, false, NULL, NULL),
    (v_wheat_id, '2024-12-15', 231.85, false, NULL, NULL),
    (v_wheat_id, '2024-12-16', 212.61, false, NULL, NULL),
    (v_wheat_id, '2024-12-17', 243.03, false, NULL, NULL),
    (v_wheat_id, '2024-12-18', 242.00, false, NULL, NULL),
    (v_wheat_id, '2024-12-19', 247.69, false, NULL, NULL),
    (v_wheat_id, '2024-12-20', 235.86, false, NULL, NULL),
    (v_wheat_id, '2024-12-21', 209.41, false, NULL, NULL),
    (v_wheat_id, '2024-12-22', 201.48, false, NULL, NULL),
    (v_wheat_id, '2024-12-23', 213.38, false, NULL, NULL),
    (v_wheat_id, '2024-12-24', 202.26, false, NULL, NULL),
    (v_wheat_id, '2024-12-25', 210.38, false, NULL, NULL),
    (v_wheat_id, '2024-12-26', 204.48, false, NULL, NULL),
    (v_wheat_id, '2024-12-27', 218.48, false, NULL, NULL),
    (v_wheat_id, '2024-12-28', 216.40, false, NULL, NULL),
    (v_wheat_id, '2024-12-29', 206.47, false, NULL, NULL),
    (v_wheat_id, '2024-12-30', 201.71, false, NULL, NULL),
    (v_wheat_id, '2024-12-31', 215.00, false, NULL, NULL),
    (v_wheat_id, '2025-01-01', 209.34, false, NULL, NULL),
    (v_wheat_id, '2025-01-02', 215.94, false, NULL, NULL),
    (v_wheat_id, '2025-01-03', 218.15, false, NULL, NULL),
    (v_wheat_id, '2025-01-04', 219.63, false, NULL, NULL),
    (v_wheat_id, '2025-01-05', 215.26, false, NULL, NULL),
    (v_wheat_id, '2025-01-06', 215.26, false, NULL, NULL),
    (v_wheat_id, '2025-01-07', 219.07, false, NULL, NULL),
    (v_wheat_id, '2025-01-08', 214.22, false, NULL, NULL),
    (v_wheat_id, '2025-01-09', 217.86, false, NULL, NULL),
    (v_wheat_id, '2025-01-10', 216.66, false, NULL, NULL),
    (v_wheat_id, '2025-01-11', 200.82, false, NULL, NULL),
    (v_wheat_id, '2025-01-12', 216.26, false, NULL, NULL),
    (v_wheat_id, '2025-01-13', 217.44, false, NULL, NULL),
    (v_wheat_id, '2025-01-14', 218.33, false, NULL, NULL),
    (v_wheat_id, '2025-01-15', 211.15, false, NULL, NULL),
    (v_wheat_id, '2025-01-16', 212.52, false, NULL, NULL),
    (v_wheat_id, '2025-01-17', 207.28, false, NULL, NULL),
    (v_wheat_id, '2025-01-18', 202.21, false, NULL, NULL),
    (v_wheat_id, '2025-01-19', 205.63, false, NULL, NULL),
    (v_wheat_id, '2025-01-20', 214.92, false, NULL, NULL),
    (v_wheat_id, '2025-01-21', 205.10, false, NULL, NULL),
    (v_wheat_id, '2025-01-22', 227.17, true, 210.71, 241.57),
    (v_wheat_id, '2025-01-23', 231.29, true, 223.19, 254.85),
    (v_wheat_id, '2025-01-24', 222.99, true, 218.19, 258.67),
    (v_wheat_id, '2025-01-25', 239.47, true, 226.71, 253.14),
    (v_wheat_id, '2025-01-26', 237.79, true, 212.40, 257.48),
    (v_wheat_id, '2025-01-27', 227.79, true, 205.23, 245.57),
    (v_wheat_id, '2025-01-28', 230.34, true, 212.35, 259.50),
    (v_wheat_id, '2025-01-29', 236.25, true, 221.24, 236.24),
    (v_wheat_id, '2025-01-30', 232.14, true, 221.01, 255.37),
    (v_wheat_id, '2025-01-31', 234.44, true, 229.92, 259.21),
    (v_wheat_id, '2025-02-01', 237.10, true, 221.18, 248.51),
    (v_wheat_id, '2025-02-02', 233.41, true, 205.59, 245.41),
    (v_wheat_id, '2025-02-03', 231.93, true, 208.30, 244.27),
    (v_wheat_id, '2025-02-04', 233.94, true, 228.19, 256.12),
    (v_wheat_id, '2025-02-05', 230.17, true, 205.74, 253.84),
    (v_wheat_id, '2025-02-06', 244.52, true, 206.91, 255.65),
    (v_wheat_id, '2025-02-07', 232.78, true, 225.80, 246.84),
    (v_wheat_id, '2025-02-08', 236.21, true, 221.59, 253.84),
    (v_wheat_id, '2025-02-09', 232.00, true, 205.90, 242.44),
    (v_wheat_id, '2025-02-10', 233.90, true, 206.73, 248.74),
    (v_wheat_id, '2025-02-11', 232.94, true, 225.22, 259.94),
    (v_wheat_id, '2025-02-12', 222.12, true, 219.24, 241.43),
    (v_wheat_id, '2025-02-13', 225.10, true, 215.81, 258.93),
    (v_wheat_id, '2025-02-14', 233.15, true, 205.58, 246.94),
    (v_wheat_id, '2025-02-15', 241.69, true, 205.37, 254.21),
    (v_wheat_id, '2025-02-16', 231.24, true, 221.29, 240.04),
    (v_wheat_id, '2025-02-17', 236.02, true, 216.48, 243.88),
    (v_wheat_id, '2025-02-18', 226.16, true, 216.52, 244.03),
    (v_wheat_id, '2025-02-19', 239.98, true, 223.01, 251.69),
    (v_wheat_id, '2025-02-20', 220.17, true, 219.16, 241.70),
    (v_wheat_id, '2025-02-21', 231.96, true, 221.01, 250.68),
    (v_wheat_id, '2025-02-22', 236.53, true, 229.15, 238.63),
    (v_wheat_id, '2025-02-23', 228.73, true, 223.73, 233.73),
    (v_wheat_id, '2025-02-24', 215.32, true, 210.32, 220.32),
    (v_wheat_id, '2025-02-25', 220.14, true, 215.14, 225.14),
    (v_wheat_id, '2025-02-26', 219.41, true, 214.41, 224.41),
    (v_wheat_id, '2025-02-27', 219.52, true, 214.52, 224.52),
    (v_wheat_id, '2025-02-28', 219.20, true, 214.20, 224.20),
    (v_wheat_id, '2025-03-01', 227.29, true, 222.29, 232.29),
    (v_wheat_id, '2025-03-02', 212.85, true, 207.85, 217.85),
    (v_wheat_id, '2025-03-03', 225.55, true, 220.55, 230.55),
    (v_wheat_id, '2025-03-04', 214.64, true, 209.64, 219.64),
    (v_wheat_id, '2025-03-05', 227.29, true, 222.29, 232.29),
    (v_wheat_id, '2025-03-06', 222.18, true, 217.18, 227.18),
    (v_wheat_id, '2025-03-07', 216.30, true, 211.30, 221.30),
    (v_wheat_id, '2025-03-08', 213.40, true, 208.40, 218.40),
    (v_wheat_id, '2025-03-09', 229.19, true, 224.19, 234.19),
    (v_wheat_id, '2025-03-10', 224.18, true, 219.18, 229.18),
    (v_wheat_id, '2025-03-11', 222.28, true, 217.28, 227.28),
    (v_wheat_id, '2025-03-12', 223.27, true, 218.27, 228.27),
    (v_wheat_id, '2025-03-13', 231.60, true, 226.60, 236.60),
    (v_wheat_id, '2025-03-14', 225.71, true, 220.71, 230.71),
    (v_wheat_id, '2025-03-15', 229.65, true, 224.65, 234.65),
    (v_wheat_id, '2025-03-16', 212.57, true, 207.57, 217.57),
    (v_wheat_id, '2025-03-17', 219.32, true, 214.32, 224.32),
    (v_wheat_id, '2025-03-18', 212.84, true, 207.84, 217.84),
    (v_wheat_id, '2025-03-19', 214.21, true, 209.21, 219.21),
    (v_wheat_id, '2025-03-20', 220.51, true, 215.51, 225.51),
    (v_wheat_id, '2025-03-21', 225.93, true, 220.93, 230.93),
    (v_wheat_id, '2025-03-22', 212.65, true, 207.65, 217.65),
    (v_wheat_id, '2025-03-23', 231.32, true, 226.32, 236.32),
    (v_wheat_id, '2025-03-24', 230.99, true, 225.99, 235.99),
    (v_wheat_id, '2025-03-25', 229.69, true, 224.69, 234.69),
    (v_wheat_id, '2025-03-26', 216.86, true, 211.86, 221.86),
    (v_wheat_id, '2025-03-27', 216.16, true, 211.16, 221.16),
    (v_wheat_id, '2025-03-28', 221.63, true, 216.63, 226.63),
    (v_wheat_id, '2025-03-29', 212.93, true, 207.93, 217.93),
    (v_wheat_id, '2025-03-30', 227.12, true, 222.12, 232.12),
    (v_wheat_id, '2025-03-31', 222.74, true, 217.74, 227.74),
    (v_wheat_id, '2025-04-01', 214.71, true, 209.71, 219.71),
    (v_wheat_id, '2025-04-02', 219.99, true, 214.99, 224.99),
    (v_wheat_id, '2025-04-03', 227.06, true, 222.06, 232.06),
    (v_wheat_id, '2025-04-04', 230.67, true, 225.67, 235.67),
    (v_wheat_id, '2025-04-05', 219.81, true, 214.81, 224.81),
    (v_wheat_id, '2025-04-06', 229.69, true, 224.69, 234.69),
    (v_wheat_id, '2025-04-07', 217.92, true, 212.92, 222.92),
    (v_wheat_id, '2025-04-08', 222.78, true, 217.78, 227.78),
    (v_wheat_id, '2025-04-09', 219.77, true, 214.77, 224.77),
    (v_wheat_id, '2025-04-10', 231.52, true, 226.52, 236.52),
    (v_wheat_id, '2025-04-11', 228.07, true, 223.07, 233.07),
    (v_wheat_id, '2025-04-12', 219.45, true, 214.45, 224.45),
    (v_wheat_id, '2025-04-13', 220.80, true, 215.80, 225.80),
    (v_wheat_id, '2025-04-14', 227.05, true, 222.05, 232.05),
    (v_wheat_id, '2025-04-15', 230.14, true, 225.14, 235.14),
    (v_wheat_id, '2025-04-16', 223.27, true, 218.27, 228.27),
    (v_wheat_id, '2025-04-17', 213.77, true, 208.77, 218.77),
    (v_wheat_id, '2025-04-18', 224.61, true, 219.61, 229.61),
    (v_wheat_id, '2025-04-19', 214.48, true, 209.48, 219.48),
    (v_wheat_id, '2025-04-20', 226.18, true, 221.18, 231.18),
    (v_wheat_id, '2025-04-21', 226.42, true, 221.42, 231.42),
    (v_wheat_id, '2025-04-22', 214.79, true, 209.79, 219.79),
    (v_wheat_id, '2025-04-23', 224.63, true, 219.63, 229.63),
    (v_wheat_id, '2025-04-24', 231.72, true, 226.72, 236.72);

  -- Update statistics
  ANALYZE wheat_forecasts;
END $$;

-- Add helpful comment
COMMENT ON TABLE wheat_forecasts IS 'Contains historical and forecasted wheat prices from May 2024 to April 2025';