function jsonFlickrFeed(resp){
    var loadDomImages = new memoryGameController();
    loadDomImages.populateImages(resp);
}

var memoryGameController = (function () {

	function memoryGameController(id) {
        this.seconds;
        this.temp;
        this.randomIndex = '';
        //this.isStartGame = false;
		//this.init(id);
}
	
memoryGameController.prototype.init = function(id){
  	window.imageArray = [];
    window.imageStore = [];
    document.getElementById("tableContent").innerHTML = "";
    document.getElementsByClassName('message')[0].style.display = "none";
    document.getElementById('countdown').innerHTML = "6";
    document.getElementById("GameArea").style.display = "none";
    window.isStartGame = false;
    
    this.generate(id);
    this.countdown();
};

memoryGameController.prototype.generate= function(id){
	var $this = this;
    window.imageArray = [];
    var parent = document.getElementById(id);
	var imageContainer = document.createElement("table");
    var tdCounter = 1;
	imageContainer.className = "memoryGameOn";
	
	for (var i=0;i < 3 ; i++) {
		var tr = document.createElement("tr");
		for ( j =0; j<3 ;j++ ) { 
			var tabelcell = document.createElement("td");
			tabelcell.className = "imageHolder"; 
			var oImg=document.createElement("img");
			tabelcell.id = "memorybutton" + tdCounter;
            tabelcell.innerHTML = tdCounter;
            window.imageArray.push(tdCounter-1);
            tdCounter ++;
	        tr.appendChild(tabelcell);		
        }
		imageContainer.appendChild(tr);
	}
	
    parent.appendChild(imageContainer);
};

 memoryGameController.prototype.countdown = function(){
    window.localScope = memoryGameController.prototype;
    window.localScope.temp = document.getElementById('countdown');
    window.localScope.seconds = localScope.temp.innerHTML;
 
    if (window.localScope.seconds == 1) {
        window.localScope.temp.innerHTML = "Ready";
        window.localScope.temp.style.display = "none";
        if(!window.isStartGame)
            window.localScope.loadImages();
        else{
            /*var ctrllr = new memoryGameController();
            ctrllr.startGame();
            */
            window.localScope.startGame();
        }
        return;
    }
 
    window.localScope.seconds--;
    window.localScope.temp.innerHTML = window.localScope.seconds;
    timeoutMyOswego = setTimeout(window.localScope.countdown, 1000);
} ;
    
 memoryGameController.prototype.loadImages = function(){
     var script = document.createElement('script');
     script.src = 'http://api.flickr.com/services/feeds/photos_public.gne?tag=animal&lang=en-us&format=json';
     document.body.appendChild(script);
};
    
memoryGameController.prototype.populateImages = function(resp){
    var $this = this;
    window.imageStore = [];
    var tdCellStorage = document.getElementsByTagName('td');
    
    for(i=0;i < 9 ; i++ ){
        tdCellStorage[i].innerHTML = '<img alt="'+ resp.items[i].title + '"src="' + resp.items[i].media.m + '" width="100" height="100"/>';
        window.imageStore.push(tdCellStorage[i].cloneNode(true));    
    }
    
    document.getElementById('countdown').style.display = "block";
    document.getElementById('countdown').innerHTML = "15";
    window.isStartGame = true;
    this.countdown(true);
};
    
memoryGameController.prototype.randomizeArray = function(myArray){
    var counter = myArray.length, temp, index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = myArray[counter];
        myArray[counter] = myArray[index];
        myArray[index] = temp;
    }
    window.imageArray = myArray;
};


memoryGameController.prototype.startGame = function(){
    var ctrl = this;
    this.randomizeArray(window.imageArray);
    var tdCellStorage = document.getElementsByTagName('td');
    
    for(i=0;i < 9 ; i++ ){
        tdCellStorage[i].innerHTML = '?';    
    }
    
    document.getElementById("GameArea").style.display = "block";
    var checkInput = document.getElementsByClassName("search")[0];
        checkInput.oninput = function(event){
            ctrl.checkImage(event);
        };
    this.displayTestImage();
    
};

memoryGameController.prototype.displayTestImage = function(){
    if(window.imageArray.length >0)
        this.randomIndex = window.imageArray.pop();
    else
        this.reStartGame();
    var randomImage = window.imageStore[this.randomIndex];
    var parent = document.getElementById("testImage");
    
    document.getElementsByClassName("success")[0].style.display = "none";
    document.getElementsByClassName("error")[0].style.display = "none";
    var content= parent.getElementsByTagName("tr")[0];
    content.innerHTML = "";
    content.appendChild(randomImage);
};

memoryGameController.prototype.checkImage = function(event){
    var pos = event.target.value;
    if(pos.length > 0){
        document.getElementsByClassName("success")[0].style.display = "none";
        document.getElementsByClassName("error")[0].style.display = "none";
        if(pos == this.randomIndex+1){
            document.getElementsByClassName("success")[0].style.display = "block";
            var selector = "memorybutton" + ( parseInt(this.randomIndex)+1);
            document.getElementById(selector).innerHTML = "";
            document.getElementById(selector).appendChild(window.imageStore[this.randomIndex].lastChild);
            this.displayTestImage();
        } else {
            document.getElementsByClassName("error")[0].style.display = "block";
        }
    }
};


memoryGameController.prototype.reStartGame = function(){
    var $this = this;
    document.getElementsByClassName('message')[0].style.display = "block";    
    document.getElementById("GameArea").style.display = "none";
    
};

return memoryGameController;

}());


document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
            var controller = new memoryGameController();
            controller.init("tableContent")
        };
});
