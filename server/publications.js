Meteor.publish('busses', function() {
  return Busses.find();
});

// TODO make a "cron" to insert/update/remove busses from the collection
