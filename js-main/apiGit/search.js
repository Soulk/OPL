/**
 * Created by Sim on 28/09/2016.
 * Manage the search repos by user tool
 */

/**
 * print the getReposByUser response
 */

function printRepos(){
    var response = JSON.parse(this.responseText);

    var myTBody = document.getElementById("listRepos");
    myTBody.innerHTML = "";

    for (var i=0; i<response.length; i++) {
        var tr = document.createElement('TR');
        myTBody.appendChild(tr);

        for (var j=0; j<2; j++) {
            var td = document.createElement('TD');
            var a = document.createElement('A');
            a.href = "pullrequest.html";
            td.appendChild(a);
            getPullRequestByName(response[i].name,tr)
            if(j == 0){
                a.appendChild(document.createTextNode(response[i].name));
                tr.appendChild(td);

            } else {

                //tr.appendChild(td);
            }
        }
    }

};

/**
 * get all the user repos from user name get in the input (searchUser)
 */
function getReposByUser(){

    var user = document.getElementById("searchUser").value;
    var request = new XMLHttpRequest();

    request.onload = printRepos;
    request.open('get', 'https://api.github.com/users/' + user + '/repos', true);
    request.send();
};


function getPullRequestByName(rep,tr) {
    var request = new XMLHttpRequest();

    request.onload = function(tr) {
        var response = JSON.parse(this.responseText);
    };
    request.open('get', 'https://api.github.com/repos/'+document.getElementById("searchUser").value+'/'+rep+'/pulls', true)
    request.send()
    /*for (var j=0; j<response.length; j++) {
        console.log(response.name);
    }*/
};



/**
 * run when the enter key is pressed on the input(searchUser)
 * @param e
 */
/*document.getElementById('searchUser').onkeydown = function(e) {
    if (e.keyCode == 13) {
        getReposByUser();
    }
};*/

/**
 * filter of all the column of pull request list in pullRequest.html
 */
function pullFilter(){
    var val = document.getElementById('searchPull').value.toLowerCase();
    $.each($("#table tr:not(:first)"), function() {
            var tmp = $(this).find("td");

            var bool = false;
            for (var j=0; j<tmp.length; j++) {
                console.log(tmp[j].innerText);
                if(tmp[j].innerText.toLowerCase().indexOf(val) !== -1){
                   bool = true;
                }
            }
            if(bool)
                $(this).show();
            else
                $(this).hide();
    });
}

/**
 * filter of all the column of repos list in index.html
 */
function pullRepos(){
    var val = document.getElementById('searchRepos').value.toLowerCase();
    $.each($("#repostable tr:not(:first)"), function() {
        var tmp = $(this).find("td");

        var bool = false;
        for (var j=0; j<tmp.length; j++) {
            console.log(tmp[j].innerText);
            if(tmp[j].innerText.toLowerCase().indexOf(val) !== -1){
                bool = true;
            }
        }
        if(bool)
            $(this).show();
        else
            $(this).hide();
    });
}
