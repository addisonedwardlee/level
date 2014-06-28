angular.module('user.charts', [])

.controller('ChartsCtrl', ['$scope', '$stateParams', 'LevelUserService',
  function($scope, $stateParams, LevelUserService) {

    LevelUserService.getCharts({
      screenName: $stateParams.screenName
    }, function(dataPoints){
      console.log(dataPoints);
      $scope.createChartData(dataPoints, function(parsedArray){
        $scope.charts = parsedArray;
      });
    });

    $scope.createChartData = function(dataPoints, callback){
      var parsedData = {};
      var parsedArray = [];
      for (var i = 0; i < dataPoints.length; i++){
        var tag = dataPoints[i].data.tag.toLowerCase();
        if(parsedData[tag]){
          parsedData[tag].labels.push($scope.formatDate(dataPoints[i].created_at));
          parsedData[tag].values.push(dataPoints[i].data.value);
        } else {
          parsedData[tag] = {
            tag: tag,
            labels: [$scope.formatDate(dataPoints[i].created_at)],
            values: [dataPoints[i].data.value]
          };
        }
      }
      for(var keys in parsedData){
        parsedArray.push(parsedData[keys]);
      }
      callback(parsedArray);
    };

    $scope.formatDate = function(string){
      if(string.substring(3,4) === ','){
        return string.substring(8,11) + ' ' + string.substring(5,7);
      } else {
        return string.substring(4, 10);
      }
    };
}])

.directive('statchart', [
  function(){
    return {
      restrict: 'E',
      replace: true,
      scope: {
        chart: '='
      },
      template: '<div class="stat-chart">{{chart.tag}}<canvas></canvas></div>',
      link: function(scope, element, attrs){    
        scope.showChartjsData = function(tag, labels, values){
          var data = {
            labels: labels,
            datasets:[{
                fillColor : "rgba(151,187,205,0.5)",
                strokeColor : "rgba(151,187,205,1)",
                pointColor : "rgba(151,187,205,1)",
                pointStrokeColor : "#fff",
                data: values
              }]
          };
          options = {};
          scope.drawChartjs(tag, data, options);
        };

        scope.drawChartjs = function(tag, data, options){
          console.log(data);
          var canvas =  element[0].children[0].getContext("2d");
          new Chart(canvas).Line(data);
        };

        scope.showChartjsData(scope.chart.tag, scope.chart.labels, scope.chart.values);
      }
    };
}]);