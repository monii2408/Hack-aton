/**
 * Utilidades con código vulnerable
 */

// SQL Injection
function searchUsers(searchTerm) {
  const query = "SELECT * FROM users WHERE name LIKE '%" + searchTerm + "%'";
  return db.execute(query);
}

// Eval() usage
function calculate(expression) {
  return eval(expression);
}

// Más SQL injection
function updateUserStatus(userId, status) {
  const sql = "UPDATE users SET status = '" + status + "' WHERE id = " + userId;
  return db.query(sql);
}

module.exports = {
  searchUsers,
  calculate,
  updateUserStatus
};

