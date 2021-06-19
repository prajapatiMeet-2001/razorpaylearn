(function() {
  // Initialize Angular module
  var app = angular.module('app', []);

  app.controller('appctrl', [
    '$scope',
    '$http',
    function($scope, $http) {
      console.log('hello!');
      $scope.price = 99;
      $scope.price1 = 99*100;
      //CREATE ORDER
      $scope.createorder = function() {
        if ($scope.email === undefined) 
          return alert('Email Required');
        var obj = {
          amount: $scope.price1,
          currency: "INR",
          notes: { email: $scope.email }
        };
        console.log(obj);
        $http
          .post('/orders', obj)
          .then(function onSuccess(response) {
            // Handle success
            console.log(response);
            console.log(response.data.id);
            checkout(response.data.id);
          })
          .catch(function onError(error) {
            // Handle error
            console.log('error');
            console.log(error);
          });
      };
      //CHECKOUT
      function checkout(orderId) {
        var options = {
          //key:process.env.KEY_ID,
          key: $scope.key,
          order_id: orderId,
          "prefill": {
            "name": "Razorpay Admin",
            "email": "razorpay@gmail.com",
            "contact": "9999999999"
          },
          handler: function(response) 
          {
            alert(JSON.stringify(response))
            $http.post('/paymentdetails', response)
              .then(function onSuccess(response) {
                // Handle success
                console.log(response);
                document.write(response.data)
              })
              .catch(function onError(error) {
                // Handle error
                console.log('error');
                console.log(error);
              });
          },
          theme: {
            color: '#3399cc'
          }
        };
        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function(response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
        rzp1.open();
        e.preventDefault();
      }
    }
  ]);
})();
