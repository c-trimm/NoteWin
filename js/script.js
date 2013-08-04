// NoteWin
// Author: Casey Trimm
// Created: July 2010
$(document).ready(function() {
    var $formBox, $title, $note, $submit, $dToggle, title, note, editor, windowStates; 

    function init() {
	    $formBox = $("#form");
	    $title = $("#title");
	    $note = $("#note");
	    $submit = $("#form button");
	    $dToggle = $("#showPane");
	    
	    $formBox.data("showing", true);
		editor = $("#note").cleditor({width: "100%"});
	    $submit.button();
	    $dToggle.icon({icon : "circle-plus"});

		$dToggle.click(toggleForm);
		$submit.click(submitForm);

		for (var winID in localStorage) {
			if (localStorage.hasOwnProperty(winID)) {
				createWindow({uniqueID: winID, state: JSON.parse(localStorage[winID])});
			}
		}
	}

	function createWindow(attrs) {
    	var $newWin, title, note, uniqueID, state, existing;

    	if (!attrs) {
    		throw new Error("Window attributes not supplied!");
    	}

    	existing = null;
    	title = attrs.title;
    	note = attrs.note;
    	uniqueID = attrs.uniqueID
    	state = attrs.state;

    	// Create new element and bind events
    	$newWin = $("<div />");
		$newWin.bind("saveState", saveWindowState);
		$newWin.bind("close", removeWindowState);

    	if (state && uniqueID) {
    		existing = {
    			uniqueID: uniqueID,
    			state: state
    		}
    	}

		// Create window element
		$newWin.attr("title", title);
		$newWin.html(note);

		// Apply plugin
		$newWin.miniWin(existing);
		$newWin.miniWin("open");

		return $newWin;
	}

    function toggleForm() {
    	var animateTo, showing;

    	showing = $formBox.data("showing");
    	animateTo = { top : 20, left : 20 };

    	if (showing) {
			animateTo = {
	    		top : (0 - (parseInt($formBox.height()) + 40)) + 25,
				left : (0 - (parseInt($formBox.width()) + 40)) + 25
	    	};
		}

		$formBox.animate(animateTo);
		$formBox.data("showing", !showing);
    }

    function submitForm() {
        var $newWin, title, note;

        title = ($title.val()) ? $title.val() : "Untitled";
        note = $note.val();

		if (note === "") {
			return alert("You must enter note text!");
		}

		// Create a new note window, add bindings, and open it
		$newWin = createWindow({
			title: title,
			note: note
		});
		saveWindowState.call($newWin);
		
		// Hide the form
		toggleForm();

		// Clear the form
		$title.val("");
		$note.cleditor()[0].clear();
	}

	function saveWindowState() {
		var winID = $(this).miniWin("getID");
		var state = $(this).miniWin("getState");
		localStorage[winID] = JSON.stringify(state);
	}

	function removeWindowState() {
		var winID = $(this).miniWin("getID");
		localStorage.removeItem(winID);
	}

	init();
	toggleForm();
});




