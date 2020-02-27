
exports.dateBetween = function(start_date, end_date, my_date) {
  if (!end_date.length)
    end_date = new Date();
  return new Date(start_date) <= new Date(my_date) && new Date(end_date) >= new Date(my_date);
}
