// NoteWin
// Author: Casey Trimm
// Created: July 2010
$(document).ready(function() {
    var $formBox, $title, $note, $submit, $dToggle, $clearBtn, title, note, editor, windowStates; 

    function init() {
	    $formBox = $("#form");
	    $title = $("#title");
	    $note = $("#note");
	    $submit = $("#form button");
	    $dToggle = $("#showPane");
	    $clearBtn = $("#clear-form");
	    
	    $formBox.data("showing", true);
		editor = $("#note").cleditor({width: "100%"});
	    $submit.button();
	    $dToggle.icon({icon : "circle-plus"});

		$dToggle.click(toggleForm);
		$submit.click(submitForm);
		$clearBtn.click(clearForm);

		for (var winID in localStorage) {
			if (localStorage.hasOwnProperty(winID)) {
				createWindow({uniqueID: winID, state: JSON.parse(localStorage[winID])});
			}
		}

		//toggleForm();
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
    	$newWin = $("<div />")
			.bind("saveState", saveWindowState)
			.bind("close", removeWindowState);

    	if (state && uniqueID) {
    		existing = {
    			uniqueID: uniqueID,
    			state: state
    		}
    	}

		// Create window element
		$newWin.attr("title", title);
		$newWin.html(note);

		// Apply plugin and open window
		$newWin.miniWin(existing).miniWin("open");

		return $newWin;
	}

    function toggleForm() {
    	var animateTo, showing, $showPane;

    	showing = $formBox.data("showing");
    	animateTo = { top : 20, left : 20 };
    	$showPane = $("#showPane");

    	if (showing) {
			animateTo = {
	    		top : (0 - (parseInt($formBox.height()) + 40)) + 25,
				left : (0 - (parseInt($formBox.width()) + 40)) + 25
	    	};

	    	$showPane.icon("option", "icon", "circle-plus");
		}
		else {
			$showPane.icon("option", "icon", "closethick");
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

		clearForm();
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

	function clearForm() {
		$title.val("");
		$note.cleditor()[0].clear();
	}

	init();
});