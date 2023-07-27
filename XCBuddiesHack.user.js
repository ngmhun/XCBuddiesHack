// ==UserScript==
// @name         XCAddBuddies
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add more flights to the air buddies
// @author       Gabor Nagy
// @match        https://xcontest.org/*flights*
// @match        https://www.xcontest.org/*flights*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    //Add a new button somewhere:
    var menu = document.querySelector("#menu-top-buttons div");
    if (menu){
        //Add a button to turn on the selection checkboxes
        var div = document.createElement("div");
        div.setAttribute("class","button corner");
        div.setAttribute("id","button-bazaar");
        var btn = document.createElement("button");
        btn.style.minWidth="20px";
        btn.style.borderRadius= "5px";
        btn.setAttribute("type","button");
        btn.setAttribute("needsClear","true");
        btn.setAttribute("id","hackButton");
        btn.setAttribute("class","button-bazaar");
        if (window.location.href.includes("/detail:")){
            if (!window.sessionStorage.getItem('view_id_list')){
                return;
            }
            btn.setAttribute("onClick","document.hackFunctions.addFlights();");
            btn.textContent="Add flights";
        }
        else{
            btn.setAttribute("onClick","document.hackFunctions.addCheckboxes();");
            btn.textContent="Select flights";
        }
        div.appendChild(btn);
        menu.appendChild(div);
    }
})();
var hackFunctions = document.hackFunctions = {};
hackFunctions.addCheckboxes = function(){
    var needsClear = document.getElementById("hackButton").getAttribute("needsClear");
    if (needsClear == "true"){
        window.sessionStorage.removeItem('view_id_list');
        window.sessionStorage.removeItem('view_flight_list');
        //Next page was requested so the #... part in the URL has been changed -> try to add the checkboxes again
        addEventListener("hashchange", (event) => {setTimeout(function() {document.hackFunctions.addCheckboxes()},600)});
        document.getElementById("hackButton").setAttribute("needsClear","false");
    }
    var idlist = window.sessionStorage.getItem('view_id_list');
    var ids=[];
    if (idlist && idlist != null){
        ids=idlist.split(',');
    }
    if (needsClear!="true" && document.getElementById("selectFlightsTH")){
        //600 ms was too quick, try again a bit later:
        setTimeout(function() {document.hackFunctions.addCheckboxes()},600)
        ////600 ms was too quick, so re-enable the button and do nothing else (TODO: could be a bit more clever to try again with setTimeout
        //document.getElementById("hackButton").disabled=false;
        return;
    }
    else{
        document.getElementById("hackButton").disabled=true;
    }

    var ths=document.querySelectorAll(".flights, .XCList thead");
    if (ths.length>0){
        var cell1 = document.createElement("th");
        cell1.setAttribute("id","selectFlightsTH");
        cell1.innerHTML="Select flights";
        ths[0].rows[0].appendChild(cell1);
    }
    var tbs=document.querySelectorAll(".flights, .XCList tbody");
    if (tbs.length>0){
        var trs=tbs[0].rows;
        for (var idx = 0; idx<trs.length; idx++){
            var tr=trs[idx];
            if (tr.id){
                var flightNo = ''+parseInt(tr.id.substring(7));
                var cell2 = document.createElement("td");
                tr.appendChild(cell2);
                var checkbox = document.createElement("input");
                checkbox.setAttribute("type","checkbox");
                if (ids.indexOf(flightNo)>-1){
                    checkbox.checked=true;
                }
                checkbox.setAttribute("onChange","document.hackFunctions.addFlight(this,'"+flightNo+"');");
                cell2.appendChild(checkbox);
                tr.appendChild(cell2);
            }
        }
    }
    else{
        document.getElementById("hackButton").disabled=false;
    }
}
hackFunctions.addFlight = function(checkbox, flightNo){
    var flightlist = window.sessionStorage.getItem('view_flight_list');
    var idlist = window.sessionStorage.getItem('view_id_list');
    var flights=[];
    var ids=[];
    if (idlist){
        ids=idlist.split(',');
    }
    if (flightlist){
        flights=JSON.parse(flightlist);
    }
    if (checkbox.checked){
        ids.push(flightNo);
        flights.push(checkbox.parentNode.parentNode.innerHTML);
    }
    else{
        var idx = ids.indexOf(flightNo);
        if (idx>-1){
            ids.splice(idx, 1);
            flights.splice(idx, 1);
        }
    }
	window.sessionStorage.setItem('view_id_list',ids.toString());
	window.sessionStorage.setItem('view_flight_list',JSON.stringify(flights));
}
hackFunctions.addFlights = function(){
    var flightlist = window.sessionStorage.getItem('view_flight_list');
    var idlist = window.sessionStorage.getItem('view_id_list');
    var flights=[];
    var ids=[];
    if (idlist){
        ids=idlist.split(',');
    }
    if (flightlist){
        flights=JSON.parse(flightlist);
    }

    var airb = document.querySelector(".XCslotJointFlights");
    var div = document.createElement("div");
    div.setAttribute("class","XCjointFlights");
    var header = document.createElement("h3");
    header.innerText="Selected flights:";
    div.appendChild(header);
    var table = document.createElement("table");
    table.setAttribute("class","XCList");
    for (var idx = 0; idx < ids.length; idx++){
        var row = table.insertRow();
        row.innerHTML = flights[idx];
        row.cells[0].innerHTML=''+(idx+1);
        row.cells[row.cells.length-1].removeChild(row.cells[row.cells.length-1].childNodes[0]);
        var checkbox = document.createElement("input");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("onChange","XContest.gadgets['joint_flights'].View.svelte_flightMulti_showHideFlight(this, '"+ids[idx]+"');");
        row.cells[row.cells.length-1].appendChild(checkbox);
    }
    div.appendChild(table);
    airb.parentNode.insertBefore(div,airb);

    document.getElementById("hackButton").disabled=true;
	//window.sessionStorage.removeItem('view_id_list');
	//window.sessionStorage.removeItem('view_flight_list');
}
