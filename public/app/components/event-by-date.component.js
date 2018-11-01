
eventApp.component('eventByDate',{
  templateUrl:'/app/components/templates/event-by-date.html',
  controller: ['$http',function eventController($http){
      let vm={};

      $http.get('/event').then(function(response){
      let temp=response.data;
      temp = temp.map(function(item){
        let d = new Date(item.edate);
        let date = d.getDate() + "-"+d.getMonth() + "-" + d.getFullYear();
        //console.log(date);
        return {
          ename:item.ename,
          venue:item.venue,
          edate:date
        };
      });
      vm.byDate=temp;
    });

    this.vm=vm;
  }]
});
