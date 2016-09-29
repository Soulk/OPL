/**
 * Created by Sim on 28/09/2016.
 * Manage the search repos by user tool
 */

/**
 * print the getReposByUser response
 */
function printRepos(){
    var response = JSON.parse(this.responseText);

    $("#repos").append("<ul id =\"reposDetails\"></ul>");
    for(var i in response) {
        var li = "<li>";
        $("#reposDetails").append(li.concat(response[i].name))
    }

}

/**
 * get all the user repos from user name get in the input (searchUser)
 */
function getReposByUser(){

    var user = document.getElementById("searchUser").value;
    var request = new XMLHttpRequest();

    request.onload = printRepos;
    request.open('get', 'https://api.github.com/users/' + user + '/repos', true);
    request.send();
}

/**
 * run when the enter key is pressed on the input(searchUser)
 * @param e
 */
document.getElementById('searchUser').onkeydown = function(e) {
    if (e.keyCode == 13) {
        getReposByUser();
    }
};

