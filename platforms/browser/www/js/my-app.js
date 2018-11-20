// Initialize app
var myApp = new Framework7();
var storage;
var tasks = [];
var tasksStorageKey = "TASKS_LIST";
var listRef;

function myListItemHTML(index,text) {
    return '<li><a href="#" class="del_btn"><img src="images/trash_icon.png" /></a> <a href="edit.html?index='+index+'" class="item-content item-link"><div class="item-inner"><div class="item-title">'+text+'</div></div></a></li>';
}
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    storage = window.localStorage;
    tasks = getAllTasks();
    listRef = $$("#myTodoList");
    refreshList();
});

function refreshList() {
    var allTasks = getAllTasks();
    listRef.html('');
    for (var ti=0;ti<allTasks.length;ti++){
        var myListItem = myListItemHTML(ti,allTasks[ti]);
        listRef.append(myListItem)
    }
}

function getAllTasks() {
    var storedTasks = storage.getItem(tasksStorageKey);
    if(storedTasks){
        return JSON.parse(storedTasks);
    }else{
        return [];
    }
}

function addTask(task){
    var allTasks = getAllTasks();
    allTasks.push(task);
    storage.setItem(tasksStorageKey,JSON.stringify(allTasks))
}

function updateTask(index,task){
    var allTasks = getAllTasks();
    allTasks[index] = task;
    storage.setItem(tasksStorageKey,JSON.stringify(allTasks))
}

myApp.onPageInit('add', function (page) {
    $$("#addBtn").click(function () {
        var addText = $$("#myAddInput").val();
        if(addText.length === 0){
            myApp.alert("Please enter some text!");
            return;
        }
        addTask(addText);
        page.view.back({url:'/'});
        refreshList()
    })
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page
    console.log("About page is initialized!")
});

myApp.onPageInit('edit', function (page) {
    var itemIndex = page.query.index;
    var myEditInp = $$("#myEditInput");
    var tasks = getAllTasks();
    myEditInp.val(tasks[itemIndex]);
    $$("#editBtn").click(function () {
        var myText = myEditInp.val();
        if(myText.length === 0){
            myApp.alert("Please enter task text!")
            return;
        }
        updateTask(itemIndex,myText);
        page.view.back({url:"/"});
        refreshList()
    });
});

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        //alert("Hello")
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    //myApp.alert('Here comes About page');
});