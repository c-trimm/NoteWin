// NoteWin
// Author: Casey Trimm
// Created: July 2010
$(document).ready(function() {
    var formBox = $("#form"),
        title = $("#title"), 
        note = $("#note"),
        submit = $("#form button"),
        dToggle = $("#showPane"),
        fBoxPos, editor; 
    
    // Default position of Form Box
    fBoxPos = {
        state : 0, // 1 for showing, 0 for hidden
        showing : {
            top : 20,
            left : 20
        },
        hidden : {
            top : (0 - (parseInt(formBox.height()) + 40)) + 20,
        	left : (0 - (parseInt(formBox.width()) + 40)) + 25
        }
    };
    
	formBox.css(fBoxPos.hidden);
	editor = $("#note").cleditor({width: "100%"});
    submit.button();
    dToggle.icon({icon : "circle-plus"});
	
	dToggle.click(function(e){
		if (fBoxPos.state = !fBoxPos.state) {
			formBox.animate(fBoxPos.showing);
		}
		else {
			formBox.animate(fBoxPos.hidden);
		}
	});
	
	submit.click(function(e) {
        var newWin;

		if (note.val() !== "") {
			if (title.val() === "")
				title.val("Untitled");
			
			newWin = $("<div title='" + title.val() + "'>" + note.val() + "</div>").miniWin();
			
			newWin.bind("saveState",function(e) {
				saveWinState($(this).miniWin("getState"),$(this).miniWin("getID"));
			});
			
			newWin.bind("close", function(e) {
				removeWin($(this).miniWin("getID"));
			});
			
			newWin.miniWin("open");
			
			title.val("");
			note.val("");
			
			formBox.animate({
				top : (0 - (parseInt(formBox.height()) + 40)) + 25,
				left : (0 - (parseInt(formBox.width()) + 40)) + 25
			});
			
			$("#showPane").data("out",false);
		}
		

	});
	
	var windowStates = new cookieObj("iceberg");
	log(windowStates);
	for (winID in windowStates.cookie) {
		var newWin = $("<div />");
		
		newWin.miniWin({uniqueID : winID, state: windowStates.cookie[winID]});
		
		newWin.bind("saveState",function(e) {
			saveWinState($(this).miniWin("getState"),$(this).miniWin("getID"));
		});
		
		newWin.bind("close", function(e) {
			removeWin($(this).parent().attr("id"));
		});
		
		newWin.miniWin("open");
		
	}
});


function saveWinState(state,winID) {
	var winStates = new cookieObj("iceberg");
	winStates.cookie[winID] = state;
	winStates.save();
}

function removeWin(winID) {
	var winStates = new cookieObj("iceberg");
	delete winStates.cookie[winID];
	winStates.save();
}

