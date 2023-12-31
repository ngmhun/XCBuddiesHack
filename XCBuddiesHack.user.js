// ==UserScript==
// @name         XCAddBuddies
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  Add more flights to the air buddies
// @author       Gabor Nagy
// @match        https://xcontest.org/*
// @match        https://www.xcontest.org/*
// @icon         data:image/gif;base64,R0lGODlhIAAgAMZZAABv/wBx/wB0/wB1/wB2/wF2/wB4/wB5/wl3/wB9/xt6/x97/x18/yl+/y+B/zeE/0GC/kKD/jOJ/0SF/jeN/02H/k+K/mCX/1qb/WKf/Zqampubm3Gm/6KioqOjo3+q/6ampqmpqYG0/7GxsZa9/7q6uru7u53B/729vai/+5zD+76+vqjD+6HF/6nD+6HG+sTExMXFxcbGxsfHx9LS0rzW/7rX/9XV1cHY/9bW1tfX19ra2src/9nc3N/f3+Dg4Nbo99fp9+bm5tzp/+rq6uLr/+nz9ur09vLy8uzz/+v19vPz8+z29u329u71/+339vb29vf39/T5//r6+vz8/Pz9//39/f3+//7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEKAH8ALAAAAAAgACAAAAf5gFmCg4SFhoeIiYqLjIRROzqRkkKNiVghMTmamjQaP5WHVh5UhjsyoIZWIKSFPjCohaqshK6whLKGtbaCuK2vu1m9tL+7Vh1ThjczwFlYJiMrKNIoJRtEzFlUS0jc3VDY4OHihz3l5ufo6ernSu3u7/Dx8vP08ExP+PlPTfX9SkcvLFQYSDBDEH/0jBwYwJBhAgkDXCCcZyRAwwEKeAxxkGKivIoNBZCocgJBR4/wKjK4UIDDlRoMT6J0ZwSACCktkhR5EHPmu4oLcGRxQqGhTJ8gG9j4cPHoTCMGGAogcJGFT3dHVEyIwJUrBAxArrq7py+f2LNo4wUCADs=
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    //Add a new button somewhere:
    var menu = document.querySelector("#menu-top-buttons div");
    if (menu){
        var flights = false;
        var detail = false; //(window.location.href.substring(6).includes(":"));
        var flightsdiv =document.querySelector("div#flights");
	var flightsform =document.querySelector("form#filter-flights");
        var flightdiv =document.querySelector("div#flight");
        if (flightsdiv || flightsform){
            flights=true;
        }
        if (flightdiv){
            detail=true;
        }
        var btn;
        if (flights || detail){
            //Create a button to access the extra function:
            btn = document.createElement("button");
            btn.style.minWidth="20px";
            btn.style.borderRadius= "5px";
            btn.setAttribute("type","button");
            btn.setAttribute("tryCount","0");
            btn.setAttribute("id","hackButton");
            btn.setAttribute("class","button-bazaar");
        }
        if (detail){
            if (!window.sessionStorage.getItem('view_id_list')){
                return;
            }
            btn.setAttribute("onClick","document.hackFunctions.addFlights();");
            btn.textContent="Add flights";
        }
        else if (flights){
            btn.setAttribute("onClick","document.hackFunctions.addCheckboxes();");
            btn.textContent="Select flights";
            if (window.sessionStorage.getItem('view_id_list')){
               //If the next page is requested so the #... part in the URL has been changed -> try to add the checkboxes again
               addEventListener("hashchange", (event) => {setTimeout(function() {document.hackFunctions.addCheckboxes()},600)});
            }
        }
        if (flights || detail){
            var div = document.createElement("div");
            div.setAttribute("class","button corner");
            div.setAttribute("id","button-bazaar");
            div.appendChild(btn);
            menu.appendChild(div);
        }
        if (flights && window.sessionStorage.getItem('view_id_list')){
           setTimeout(function() {document.hackFunctions.addCheckboxes()},600);
        }
    }
})();
var hackFunctions = document.hackFunctions = {};
hackFunctions.addCheckboxes = function(){
    if (document.getElementById("selectFlightsTH")){
        //Checkboxes already added
        return;
    }
    var tryCount = document.getElementById("hackButton").getAttribute("tryCount");
    var ids=[];
    var idlist = window.sessionStorage.getItem('view_id_list');
    if (idlist && idlist != null){
        ids=idlist.split(',');
        hackFunctions.addClearButton();
    }

    var tbs=document.querySelectorAll(".flights, .XCList tbody");
    if (tbs.length==0){
        if (parseInt(tryCount) < 4){ // TODO: is 4 iterations enough?
            document.getElementById("hackButton").setAttribute("tryCount",""+parseInt(tryCount)+1);
            //try again a bit later, maybe the flight list is not loaded yet:
            setTimeout(function() {document.hackFunctions.addCheckboxes()},600)
        }
        return;
    }
    else{
        document.getElementById("hackButton").style.display="inline";
    }

    var allChecked = true;
    if (tbs.length>0){
        for (var tbidx=0; tbidx < tbs.length; tbidx++){
            var foundRow = false;
            var trs=tbs[tbidx].rows;
            for (var idx = 0; idx<trs.length; idx++){
                var tr=trs[idx];
                if (tr.id){
                    foundRow=true;
                    var flightNo = ''+parseInt(tr.id.substring(7));
                    var cell2 = document.createElement("td");
                    tr.appendChild(cell2);
                    var checkbox = document.createElement("input");
                    checkbox.setAttribute("type","checkbox");
                    checkbox.setAttribute("flightNo",flightNo);
                    if (ids.indexOf(flightNo)>-1){
                        checkbox.checked=true;
                    }
                    else{
                        allChecked = false;
                    }
                    checkbox.setAttribute("onChange","document.hackFunctions.addFlight(this);");
                    cell2.appendChild(checkbox);
                    tr.appendChild(cell2);
                }
            }
            if (foundRow && tbs[tbidx].parentNode && tbs[tbidx].parentNode.tHead){
                var cell1 = document.createElement("th");
                cell1.setAttribute("id","selectFlightsTH");
                cell1.innerHTML="Select flights";
                var checkbox2 = document.createElement("input");
                checkbox2.setAttribute("type","checkbox");
                checkbox2.setAttribute("id","hackCheckAll");
                checkbox2.checked=allChecked;
                checkbox2.setAttribute("onChange","document.hackFunctions.checkAll(this);");
                cell1.appendChild(checkbox2);
                tbs[tbidx].parentNode.tHead.rows[0].appendChild(cell1);
            }
        }
        document.getElementById("hackButton").style.display="none";
    }
    else{
        document.getElementById("hackButton").style.display="inline";
    }
}
hackFunctions.addFlight = function(checkbox){
    var flightNo = checkbox.getAttribute("flightNo");
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
    if (checkbox.checked && !document.getElementById("hackClearButton")){
        hackFunctions.addClearButton();
    }
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

    var table = document.getElementById("hackXCList");
    if (!table || table==null){
        var airb = document.querySelector(".XCslotJointFlights");
        var div = document.createElement("div");
        div.setAttribute("class","XCjointFlights");
        var header = document.createElement("h3");
        header.innerText="Selected flights:";
        div.appendChild(header);
        table = document.createElement("table");
        div.appendChild(table);
        airb.parentNode.insertBefore(div,airb);
        table.setAttribute("id","hackXCList");
        table.setAttribute("class","XCList");
    }
    for (var idx = 0; idx < ids.length; idx++){
        //Only add the element if not already there:
        if (!document.getElementById("hackCheck"+ids[idx])){
            var row = table.insertRow();
            row.innerHTML = flights[idx];
            row.cells[0].innerHTML=''+(idx+1);
            row.cells[row.cells.length-1].removeChild(row.cells[row.cells.length-1].childNodes[0]);
            var checkbox = document.createElement("input");
            checkbox.setAttribute("type","checkbox");
            checkbox.setAttribute("onChange","XContest.gadgets['joint_flights'].View.svelte_flightMulti_showHideFlight(this, '"+ids[idx]+"');");
            checkbox.setAttribute("id","hackCheck"+ids[idx]);
            row.cells[row.cells.length-1].appendChild(checkbox);
        }
    }
}

hackFunctions.checkAll = function(checkbox){
    var allChecked = checkbox.checked;
    var chks=document.querySelectorAll("input[type=checkbox]");
    if (chks.length>0){
        for (var chkidx=0; chkidx < chks.length; chkidx++){
            if (chks[chkidx].getAttribute("flightNo")){
                chks[chkidx].checked=allChecked;
                hackFunctions.addFlight(chks[chkidx]);
            }
        }
    }
}

hackFunctions.clearSelected = function(){
    window.sessionStorage.removeItem('view_id_list');
    window.sessionStorage.removeItem('view_flight_list');
    var chks=document.querySelectorAll("input[type=checkbox]");
    if (chks.length>0){
        for (var chkidx=0; chkidx < chks.length; chkidx++){
            if (chks[chkidx].getAttribute("flightNo") || chks[chkidx].getAttribute("id")=="hackCheckAll"){
                chks[chkidx].checked=false;
            }
        }
    }
}

hackFunctions.addClearButton = function(){
    if (document.getElementById("hackClearButton")){
        //Already added
        return;
    }
    var btn = document.createElement("button");
    btn.style.minWidth="20px";
    btn.style.borderRadius= "5px";
    btn.setAttribute("type","button");
    btn.setAttribute("id","hackClearButton");
    btn.setAttribute("class","button-bazaar");
    btn.textContent="Clear selected";
    btn.setAttribute("onClick","document.hackFunctions.clearSelected();");
    var div =document.getElementById("hackButton").parentNode;
    div.appendChild(btn);
}

