var express = require("express");
var router = express.Router();
const axios = require('axios');
router.get("/",function(req,res){
    axios.get("http://covid19api.xapix.io/v2/locations")
  .then(function (response) {
    let raw_data=response.data;
    var groupBy = function(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };
    var corona_statistics=groupBy(raw_data.locations, 'country');
    let small_data =[];
    Object.keys(corona_statistics).forEach(key => {
      let total_deaths=0;
      let total_recovered=0;
      let total_confirmed=0;
      corona_statistics[key].forEach(element=>{
        total_deaths+=element.latest.deaths;
        total_recovered+=element.latest.recovered;
        total_confirmed+=element.latest.confirmed;
      }
      );
      small_data.push({
        country:key,
        deaths:total_deaths,
        recovered:total_recovered,
        confirmed:total_confirmed
      });
  });
  small_data.sort((a, b) =>  parseInt(b.confirmed)- parseInt(a.confirmed) );
  res.render('index', 
    {data:small_data,
      total:raw_data.latest
    }
    );
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
  });
})
module.exports = router;