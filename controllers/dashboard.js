const dashboard = async (req, res) => {
//   const locals = {
//     title: 'Dashboard',
//     description: 'Description',
//   }
  res.render('dashboard/dashboard', {
    // locals,
    layout: '../views/layouts/dashboard',
  })
}

module.exports = { dashboard }
