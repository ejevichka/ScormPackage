var isTerminated = false;
var GlobalScore = 0;
/*******************************************************************************
 **
 ** This function is used to go to a previous SCO
 **
 *******************************************************************************/
function Previous() {
    // we request the previous SCO from the LMS
    doSetValue( "adl.nav.request", "previous" );
    Unload();
}

/*******************************************************************************
 **
 ** This function is used to go to a next SCO
 **
 *******************************************************************************/
function Continue()
{
    // we request the next SCO from the LMS
    doSetValue("adl.nav.request", "continue");
    Unload();
}

/*******************************************************************************
 **
 ** This function asks the LMS if there exists a previous SCO or Asset to go to.
 ** If a SCO or Asset exists, then the previous button is displayed.
 **
 ** Inputs:  None
 **
 ** Return:  String - "true" if the previous button should be displayed
 **                   "false" if failed.
 **
 *******************************************************************************/
function RenderPreviousButton() {
    var value = doGetValue("adl.nav.request_valid.previous");

    if (value == "true"){
        return true;
    }
    return false;
}

/*******************************************************************************
 **
 ** This function asks the LMS if there exists a next SCO or Asset to continue
 ** to.  If a SCO or Asset exists, then the continue button is displayed.
 **
 ** Inputs:  None
 **
 ** Return:  String - "true" if the continue button should be displayed
 **                   "false" if failed.
 **
 *******************************************************************************/
function RenderContinueButton() {
    var value = doGetValue("adl.nav.request_valid.continue");

    if (value == "true"){
        return true;
    }
    return false;
}

function doStart(isInitial){
    //initialize communication with the LMS
    if(!doInitialize())
    {
        return;
    }
    SetLearnerName();
    PageInit();
	
	ShowStatus();
}
 //Показывает пройденные статусы опрашивая свойтсво cmi.objectives.success_status
function ShowStatus()
{
    if(!doInitialize())
    {
        return;
    }
    var childCount = doGetValue("cmi.objectives._count");
    for (i=0; i < childCount; i++){
        var id = doGetValue("cmi.objectives."+i+".id");
        var curentScore;
        var objSpan = $('#' + id );
        if(objSpan && objSpan.length > 0)
        {
            if(id.indexOf('obj_test') != 0)
            {

                if(doGetValue("cmi.objectives."+i+".success_status")=='passed')
                {
                    objSpan.html("<img src='../assets/img/done.png'>");
                }
            }
            else
            {
               /* objSpan.text(doGetValue("cmi.objectives."+i+".score.scaled"));*/
                curentScore = doGetValue("cmi.objectives."+i+".score.scaled");
                console.log( curentScore )
                if (curentScore == "1") {
                    objSpan.html("<img src='../assets/img/done.png'>");
                }
            }
        }
    }
}

function SetLearnerName()
{
    var learnerNameSpan = $('#learnerName');
    if(learnerNameSpan && learnerNameSpan.length > 0)
    {
        learnerNameSpan.text(doGetValue("cmi.learner_name"));
    }
}

function PageInit()
{	
    $('#butExit').hide();
    if(RenderPreviousButton())
    {
        $('#btn-prev-slide').show();
    }
    else
    {
        $('#btn-prev-slide').hide();
    }
    //in this sample course, the course is considered complete when the last page is reached
    if (!RenderContinueButton()){
        $('#btn-next-slide').hide();
    }
    else
    {
        $('#btn-next-slide').show();
    }
}

function doPrevious(){
    Previous();
}

function doNext(){
    Continue();
}

function GoToItem(itemId)
{
    if (itemId != "") {
		doSetValue("adl.nav.request", "{target=" + itemId + "}jump");
        doTerminate();
    }
}

function GoToUrl(url)
{
    if (url != "") {
		window.location.replace( url );
    }
}

function AddScore()
{
    doSetValue("cmi.score.scaled", new String(1));

    var childCount = doGetValue("cmi.objectives._count");
    for (i=0; i < childCount; i++){
        doSetValue("cmi.objectives."+i+".score.scaled", new String(1));
    }
}

/*
function GetStoredNotes()
{
	var value = doGetValue("cmi.suspend_data");
	if(!value)
	{
		value = sessionStorage.getItem('learner_notes_store');
		doSetValue("cmi.suspend_data", value);
	}
	return value;
}

*/
/*функция срабатывает на нажатие кнопки сохранить заметку и выводит ее в список*//*

function doNote ()
{
    var notes_content = $(".notes-text").val();
    var course_name_with_link = $(".course-name-with-link").html();
    var storedNotes = GetStoredNotes ()
    if( notes_content != "") {
        var notesValue = GetStoredNotes() + ";" + course_name_with_link + ";" + notes_content;
        doSetValue("cmi.suspend_data", notesValue);
        sessionStorage.setItem('learner_notes_store', notesValue);
    }
		
        $(".notes-list").prepend("<div class='row'> <div class='col-lg-4 course-name-with-link'>" + course_name_with_link + "</div>  <div class='col-lg-5'>" + notes_content + "</div> <div class='col-lg-3 text-right'> <button class=''><img src='../assets/img/notes_10.png'></button> <button class=''  onclick='doNote()'><img src='../assets/img/notes_06.png'></button> </div> </div>" );
    ShowNotes();
}

// функция получает заметки из LMS строкой, сплитит в массив и строит html
function ShowNotes() {
    var title = doGetValue("cmi.launch_data");
    var storedDataRaw = GetStoredNotes();
    console.log("storedDataRaw", storedDataRaw, typeof(storedDataRaw))
    var storedDataArr = [];
    var noteString = "";

    if(!doInitialize())
    {
        return;
    }


    storedDataArr = storedDataRaw.split(';');
    console.log("SHITISHERE", storedDataArr);
    if (title != "" ) {
        for (var i=0; i<storedDataArr.length; i++) {
            noteString = "<div class='row'> <div class='col-lg-4 course-name-with-link'>"
            if(i % 2 != 0) {
                noteString = noteString + storedDataArr[i]+"</div>";
                console.log("odd  ",i, noteString[i]);
            } else {
                noteString = "<div class='col-lg-5'>"+ noteString + storedDataArr[i] + "</div> <div class='col-lg-3 text-right'> <button class=''><img src='../assets/img/notes_10.png'></button> <button class=''  onclick='doNote()'><img src='../assets/img/notes_06.png'></button> </div> </div>"
                console.log("even  ",i, noteString);
            }
            $(".notes-list").prepend(noteString);
        }



    }

        console.log(storedDataArr);

}
*/

 //Достает массив заметок или из лмс через cmi.suspend_data или из sessionStorage и далее сохраняет в cmi.suspend_data 
function GetStoredNotes()
{
    var value = doGetValue("cmi.suspend_data");
    if (value == "null") {
        return
    }
    if(!value)
    {
        value = sessionStorage.getItem('learner_notes_store');
        doSetValue("cmi.suspend_data", value);
    }
    return value;
}

function doNote(e)
{
    var notesValue = "";
    var notes_content = $(e).parent().parent().find(".notes-text").val();
    if ( notes_content == "") {
        notes_content = $(e).parent().parent().find(".notes-text").html();
    }
    var course_name_with_link = $(e).parent().parent().find(".course-name-with-link").html();
    var storedDataRaw = GetStoredNotes();
    if (storedDataRaw != undefined ) {
        notesValue = storedDataRaw + ";";
    }
    if( notes_content != "") {
        var notesValue = notesValue + course_name_with_link + ";" + notes_content;
        doSetValue("cmi.suspend_data", notesValue);
        sessionStorage.setItem('learner_notes_store', notesValue);

        $(".notes-list").append("<div class='row'> <div class='col-lg-4 course-name-with-link'>" + course_name_with_link + "</div>  <div class='col-lg-6 notes-text'>" + notes_content + "</div> <div class='col-lg-2 text-right'> <button class='' onclick='doEditNotes(this)'><img src='../assets/img/notes_10.png'></button> <button class=''  onclick='doNote(this)'><img src='../assets/img/notes_06.png'></button> </div> </div>" );
    }

}


//редактирование заметок
function doEditNotes(e) {
    console.log(e);
    var item = $(e).parent().parent().find(".col-lg-6");
    var input = item.children('[type=text]');
    var value="";
    if(input.length==0){
        value = item.html();
    }
    else{
        value = input.val();
    }
    if($(e).hasClass("editing")) {
        $(e).removeClass("editing");
        item.html(value);
    } else {
        $(e).addClass("editing");
        item.html("<input type='text' class='notes-text'" + " value='" + value + "'>");
    }
    console.log("item", item, value);
}

//выгрузка зметок при загрузке страницы
function ShowNotes() {
    if (!doInitialize()) {
        return;
    }
    var title = doGetValue("cmi.launch_data");
    var storedDataRaw = GetStoredNotes();
    var noteString;
    if (storedDataRaw != undefined ) {
        /*$(".course-notes").text(GetStoredNotes());*/
        var storedDataArr = storedDataRaw.split(';');
        console.log("SHITISHERE", storedDataArr);
        if (title != "") {
            noteString = "<div class='row'> <div class='col-lg-4 course-name-with-link'>"
            for (var i = 0; i < storedDataArr.length; i++) {

                if (i % 2 == 0) {
                    noteString = noteString + storedDataArr[i] + "</div>";

                } else {
                    noteString = noteString + "<div class='col-lg-6 notes-text'>" + storedDataArr[i] + "</div> <div class='col-lg-2 text-right'> <button onclick='doEditNotes(this)' class=''><img src='../assets/img/notes_10.png'></button> <button class=''  onclick='doNote(this)'><img src='../assets/img/notes_06.png'></button> </div> </div>"
                    console.log("even  ", i, noteString);
                    $(".notes-list").append(noteString);
                    noteString = "<div class='row'> <div class='col-lg-4 course-name-with-link'>"
                }
            }

        }
    }
}
function copyAllNotes(e) {
    $(".notes-list-for-copying").empty();
    var links = $(".notes-list .row .course-name-with-link");
    var items = $(".notes-list .row .col-lg-6");
    var message_itself;

    console.log("links", links);
    console.log("items", items);



    if( links != [] && items != []) {
    for (var i=0; i<links.length; i++) {
        if ( ($(items[i]).val()=="") ) {
            message_itself = $(items[i]).html();
            console.log(message_itself);
        } else {
            message_itself = $(items[i]).val();
        }

        $(".notes-list-for-copying").prepend($(links[i]).html() + "<br/>" + message_itself + "<br/>" );
    }
    }

    if($(e).hasClass("active-mode")) {
        $(e).removeClass("active-mode");
        $(".notes-list").removeClass("non-display");
        $(".notes-list-for-copying").addClass("non-display");
        $(".copy-content").addClass("non-display");
        $(".notes-content").removeClass("non-display");
    } else {
        $(e).addClass("active-mode");
        $(".notes-list").addClass("non-display");
        $(".notes-list-for-copying").removeClass("non-display");
        $(".copy-content").removeClass("non-display");
        $(".notes-content").addClass("non-display");
    }
    links = [];
    items = [];
}

function totalScore () {
    var childCount = doGetValue("cmi.objectives._count");
    var totally_score = 0;
    var score_scaled;
    for (i=0; i < childCount; i++){
        var id = doGetValue("cmi.objectives."+i+".id");
        if(id.indexOf('obj_test') == 0)
        {
            score_scaled = parseFloat(doGetValue("cmi.objectives."+i+".score.scaled"));
            if( isNaN(score_scaled)) {
            }
            else {
                totally_score += score_scaled;
                console.log("totally_score", totally_score);
            }
        }
    }
    console.log("totally_scoreTOTAL", totally_score);
    score_scaled = Math.round((totally_score * 100) / 7);
/*    doSetValue("cmi.score.raw", "7");
    var entireScore = (score_scaled/100).toString(10);
    doSetValue("cmi.score.scaled", entireScore);
    var getval =  doGetValue("cmi.score.scaled");
    console.log("getval", getval);*/

    Cup(totally_score, score_scaled);

}

function Cup (torally_score, score_scaled) {
    var totally_score = torally_score;
    var score_scaled = score_scaled;
    setTimeout(function(){
        $(".cert").addClass('riseUp');
        $(".cert").removeClass("non-display");

    },1750);
    if (totally_score == 7) {
        GlobalScore = 7;
        setTimeout(function(){
            $("#score01").addClass('riseUp');

            $("#score01").removeClass("non-display");
            $(".gold-cup").addClass('riseUp');
            $(".gold-cup").removeClass("non-display");


        },1050);
        setTimeout(function(){
            $(".total-ball").append(score_scaled);
            $(".total-ball").addClass('riseUp');
            $(".cup").addClass('riseUp');
            $(".cup").removeClass("non-display");
        },850);



    }
    else if (totally_score == 6) {
        GlobalScore = 0;
        $(".cert").addClass('cert-non');
        $(".cert").attr('href',"#");
        setTimeout(function(){

            $("#score02").addClass('riseUp');
            $("#score02").removeClass("non-display");
            $(".silver-cup").addClass('riseUp');
            $(".silver-cup").removeClass("non-display");
        },1050);
        setTimeout(function(){
            $(".total-ball").append(score_scaled);
            $(".total-ball").addClass('riseUp');
            $(".cup").addClass('riseUp');
            $(".cup").removeClass("non-display");
        },850);
    }
    else if (totally_score == 5) {
        GlobalScore = 0;
        $(".cert").addClass('cert-non');
        $(".cert").attr('href',"#");
        setTimeout(function(){
            $(".total-ball").append(score_scaled);
            $(".total-ball").addClass('riseUp');
            $(".bronze-cup").addClass('riseUp');
            $(".bronze-cup").removeClass("non-display");
        },850);
        setTimeout(function(){
            $("#score03").addClass('riseUp');
            $("#score03").removeClass("non-display");
            $(".cup").addClass('riseUp');
            $(".cup").removeClass("non-display");
        },1050);
    }
    else if (totally_score < 5) {
        GlobalScore = 0;
        $(".cert").addClass('cert-non');
        $(".cert").attr('href',"#");
        setTimeout(function(){

            $(".total-ball").addClass('riseUp');
            $("#score04").addClass('riseUp');
            $("#score04").removeClass("non-display");
            $(".total-ball").append(score_scaled);

            $(".non-cup").addClass('riseUp');
            $(".non-cup").removeClass("non-display");


        },850);
        /* setTimeout(function(){
         $(".total-ball").append("97");
         $("#score04").addClass('riseUp');
         $("#score04").removeClass("non-display");
         var calc = (Number(sessionStorage.getItem('TotalResult')));
         console.log("CALC", calc.toString());

         },1050);*/
    }
}

function ShowStatistics()
{
    if(!doInitialize())
    {
        return;
    }


    $(document).ready(function() {
        var num = doGetValue("cmi.objectives._count");
        var objIndex = -1;
        var uprScore;
        var objSpan;
        var totally_score = 0;


        for (var i=0; i < num; ++i) {
            objSpan = $('.' + (doGetValue("cmi.objectives." + i + ".id")) );
            uprScore = parseFloat(doGetValue("cmi.objectives."+i+".score.scaled"));
            if( isNaN(uprScore)) {

                $(objSpan).html("0%");
            }
            else {
                totally_score += uprScore;

                $(objSpan).html("100%");
            }
        }
        uprScore = Math.round((totally_score * 100) / 8);
        $(".total-stat-procent").html(uprScore + '%');
    });
}

function showCert() {


    if (GlobalScore > 0) {
        $(document).ready(function () {
            var learner_name = doGetValue("cmi.learner_name");
            var dd = {
                content: [
                    {
                        image: 'data:image/jpeg;base64,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',
                        width: 520
                    },
                    {
                        text: learner_name,
                        margin: [0, -230, 0, 0],
                        alignment: 'center',
                        color: "#006f3e"
                    }
                ]
            }
            pdfMake.createPdf(dd).download('cert.pdf');
        });
    }
}
function showUprStat() {
    $(document).ready(function() {
        var num = doGetValue("cmi.objectives._count");
        var objIndex = -1;
        var uprScore;
        var totally_score = 0;


        for (var i=0; i < num; ++i) {
            if (doGetValue("cmi.objectives." + i + ".id") == "obj_module_2_2") {
                console.log("FOUND!!", i);

                uprScore = parseFloat(doGetValue("cmi.objectives."+i+".score.scaled"));
                if( isNaN(uprScore)) {
                    if (sessionStorage.getItem('u1')!= null ){
                        $("#upr-pass").addClass("riseUp");
                    }
                    $(".progress-round").html("0%");
                }
                else {
                    totally_score += uprScore;
                    console.log("upr_score", uprScore);
                    $(".progress-round").html("100%");
                    $(".progress-round").addClass("green-progress-round")
                }
                uprScore = Math.round((totally_score * 100) / 8);
                $(".total-stat-procent").html(uprScore + '%');
            }
        }




    });
};


function ShowTableQUE()
{
    if(!doInitialize())
    {
        return;
    }


    $(document).ready(function() {
        var num = doGetValue("cmi.objectives._count");
        var objIndex = -1;
        var uprScore;
        var objSpan;
        var totally_score = 0;


        for (var i=0; i < num; ++i) {
            objSpan = $('.theory .' + (doGetValue("cmi.objectives." + i + ".id")) );
            uprScore = parseFloat(doGetValue("cmi.objectives."+i+".score.scaled"));
            if( isNaN(uprScore)) {

                $(objSpan).html("<img src='../assets/img/table-check_false.png'>");
            }
            else {
                totally_score += uprScore;

                if (doGetValue("cmi.objectives." + i + ".id") == "obj_module_2_2") {
                    uprScore = parseFloat(doGetValue("cmi.objectives."+i+".score.scaled"));
                    if( isNaN(uprScore)) {

                    }
                    else {
                        totally_score -= uprScore;
                    }

                }

                $(objSpan).html("<img src='../assets/img/table-check_true.png'>");
            }
        }
        uprScore = Math.round((totally_score * 100) / 7);
        /*$(".total-stat-procent").html(uprScore + '%');*/
        if (totally_score == 7) {
            $(".progress-round-test").html("100%");
            $(".progress-round-test").addClass("green-progress-round")
        } else {
            $(".progress-round-test").html(uprScore + "%");
        }

    });
};



function reStartCourse()
{
    doExit();
	//doSetValue("adl.nav.request", "first");
    Storage.clear();
    Continue();
}

function doExit () {
    sessionStorage.clear();
    doSetValue("cmi.exit", "logout");
    doTerminate();


}



function Unload()
{
    if(!isTerminated)
    {	
		doCommit();
        // we terminate this SCO's communication with the LMS
        isTerminated = doTerminate();
    }
}




