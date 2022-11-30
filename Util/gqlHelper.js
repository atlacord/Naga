const requireText = require('require-text');
module.exports = {
    


//GraphiQl Templates
  NextAirDate_NoQuery: requireText('../src/assets/gql/NextAirDateWithoutQuery.graphql', require)
, NextAirDate_Query: requireText('../src/assets/gql/NextAirDateWithQuery.graphql', require)
, Schedule: requireText('../src/assets/gql/Schedule.graphql', require)
, Seiyuu: requireText('../src/assets/gql/Seiyuu.graphql', require)
, Watching: requireText('../src/assets/gql/Watching.graphql',  require)






// End of expor
}