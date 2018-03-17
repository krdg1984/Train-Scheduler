// KG Initialize Firebase
  var config = {
    apiKey: "AIzaSyCBhsyuX0ZnQeMgtE5fDaOxYnqq4Sd7K5o",
    authDomain: "train-schedule-9a8f4.firebaseapp.com",
    databaseURL: "https://train-schedule-9a8f4.firebaseio.com",
    projectId: "train-schedule-9a8f4",
    storageBucket: "",
    messagingSenderId: "219361037312"
};
firebase.initializeApp(config);


// Reference to database 
var database = firebase.database();

// Global Variable
var trainName, 
    destination, 
    firstTrainTime,
    frequency = 0;


$("#addTrainBtn").on("click", add);

function add() {
    event.preventDefault();
    
    var newTrain = {
        trainName: $("#trainName").val().trim(),
        destination: $("#destination").val().trim(),
        firstTrainTime: $("#firstTrainTime").val().trim(),
        frequency: $("#frequency").val().trim()
    };

    database.ref().push(newTrain);
};


// Create Child Added
database.ref().on("child_added", function(snapshot) {
    //console.log(snapshot.val().trainName);
    
    var myTrainObject = snapshot.val();
    // Calculating minutesAway
    //console.log(firstTrainTime);
    
    var firstTrainTimeConverted = moment(parseInt(myTrainObject.firstTrainTime), "hh:mm") //.subtract(1, "years");
    //console.log(firstTrainTimeConverted);
    // Actual Current Time 
    
    var currentTime = moment();
    //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // The Difference between the Times in Min
    
    var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
    //console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time Remaining (remainder)
    
    var remainder = diffTime % parseInt(myTrainObject.frequency);
    //console.log(remainder);
    // Minute Until The Next Train
    
    var minutesAway = parseInt(myTrainObject.frequency) - remainder;
    //console.log("minutesAway: " + minutesAway);
    // Next Train Arrival
    
    var nextArrival = moment().add(minutesAway, "minutes");
    nextArrival = moment(nextArrival).format("hh:mm")
    //console.log("nextArrival: " + moment(nextArrival).format("hh:mm"));


    var trainRow = "<tr>" +
        "<td>" + snapshot.val().trainName + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + snapshot.val().frequency + "</td>" +
        "<td>" + nextArrival + "</td>" +
        "<td>" + minutesAway + "</td>" +
        "</tr>";

    $("#trainContainer").append(trainRow);

});