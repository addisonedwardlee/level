angular.module('level.services.leaderboard', [])

.service('LeaderboardService', function(){

  this.getAll = function(){
    return this.leaders;
  };

  this.topFive = function(){
    return this.leaders.slice(0,5);
  };

  this.leaders = [
    {
      id: 1,
      userName:'Tim Curran',
      points: 1200,
      userImg: 'http://4.bp.blogspot.com/-9QFrr7Pd58I/TZEbHzS55zI/AAAAAAAAAGA/ajLAzZjDXpA/s1600/kobe-Bryant.jpg',
    },{
      id: 7,
      userName:'Otis Redding',
      points: 1000,
      userImg: 'http://sportsrants.com/women/files/2014/05/90847-Richard-Sherman-wink-point-mem-C9a7_zps2778a332.jpeg'
    },{
      id: 2,
      userName:'Pat Curran',
      points: 987,
      userImg: 'http://img2.timeinc.net/people/i/2012/cbb/blog/121224/tom-brady-240x320.jpg'
    },{
      id: 3,
      userName:'Tom Brady',
      points: 940,
      userImg: 'http://img2.timeinc.net/people/i/2012/cbb/blog/121224/tom-brady-240x320.jpg'
    },{
      id: 1,
      userName:'Roxi Perez',
      points: 901,
      userImg: 'http://sportsrants.com/women/files/2014/05/90847-Richard-Sherman-wink-point-mem-C9a7_zps2778a332.jpeg'
    },{
      id: 2,
      userName:'Michael Jordan',
      points: 870,
      userImg: 'http://bostonherald.com/sites/default/files/styles/full/public/media/2013/07/29/puig.jpg?c=0fb0e180004f9a936f2cbf1819b5fcf8'
    },{
      id: 7,
      userName:'Richard Sherman',
      points: 820,
      userImg: 'http://img.bleacherreport.net/img/images/photos/002/166/857/uspw_5156722_crop_north.jpg?w=630&h=420&q=75'
    },{
      id: 3,
      userName:'Kobe Bryant',
      points: 740,
      userImg: 'http://bostonherald.com/sites/default/files/styles/full/public/media/2013/07/29/puig.jpg?c=0fb0e180004f9a936f2cbf1819b5fcf8'
    },
  ];

});