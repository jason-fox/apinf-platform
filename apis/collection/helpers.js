import ss from 'simple-statistics';

ApiBackends.helpers({
  getAverageRating () {
    console.log("getting average rating");
    // Fetch all ratings
    var apiBackendRatings = ApiBackendRatings.find({
      apiBackendId: this._id
    }).fetch();

    // If ratings exist
    if (apiBackendRatings) {
      // Create array containing only rating values
      var apiBackendRatingsArray = _.map(apiBackendRatings, function (rating) {
        // get only the rating value; omit User ID and API Backend ID fields
        return rating.rating;
      });

      // Get the average (mean) value for API Backend ratings
      var apiBackendRatingsAverage = ss.mean(apiBackendRatingsArray);

      return apiBackendRatingsAverage;
    }
  },
  setAverageRating () {
    // get average rating value
    const averageRating = this.getAverageRating();

    // Update the API Backend with average rating value
    ApiBackends.update(this._id, {$set: {averageRating}});
  },
  getBookmarksCount () {
    // Get API Backend ID
    const apiBackendId = this._id;

    return ApiBookmarks.find({apiBackendId}).count();
  },
  getRating () {
    // Get API Backend ID
    const apiBackendId = this._id;

    // Get current user ID
    const userId = Meteor.userId();

    // Check if user is logged in
    if (Meteor.userId()) {
      // Check if user has rated API Backend
      var userRating = ApiBackendRatings.findOne({
        apiBackendId,
        userId
      });

      if (userRating) {
        return userRating.rating;
      }
    }

    // Otherwise, get average rating
    return this.averageRating;
  },
  currentUserCanEdit () {
    // Get current userId
    var userId = Meteor.userId();

    // Check that user is logged in
    if( userId ) {
      // Check if user is API manager
      var isManager = _.contains(this.managerIds, userId);

      if (isManager) {
        return true;
      }

      // Check if user is administrator
      var isAdmin = Roles.userIsInRole(userId, ['admin']);

      if (isAdmin) {
        return true;
      }
    } else {
      // User is not logged in
      return false;
    }
  },
  currentUserIsManager () {
    // Get current User ID
    var userId = Meteor.userId();

    // Get Manager IDs array from API Backend document
    var managerIds = this.managerIds;

    // Check if User ID is in Manager IDs array
    var isManager = _.contains(managerIds, userId);

    return isManager;
  }
});
