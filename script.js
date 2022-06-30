//=======================
//Variable Initialization
//Self explainatory...
//====================

// Keeps track of test progression
// 0 = menu, 1 = in test, 2 = end of test
var testState = 0

// UI Elements

var predTest = document.getElementById('pred-button'),
    wpreyTest = document.getElementById('wprey-button'),
    upreyTest = document.getElementById('uprey-button'),
    stragr = document.getElementById('stragr-button'),
    agr = document.getElementById('agr-button'),
    na = document.getElementById('na-button'),
    dis = document.getElementById('dis-button'),
    strdis = document.getElementById('strdis-button'),
    title = document.getElementById('title'),
    title2 = document.getElementById('results-desc-header-title'),
    textarea = document.getElementById('results-desc-header-type-desc'),
    textareaheader = document.getElementById('results-desc-header-quote'),
    textarea2 = document.getElementById('results-desc-text'),
    textarea3 = document.getElementById('results-desc-score-text'),
    textarea4 = document.getElementById('textarea4'),
    backbtn = document.getElementById('back-button'),
    resetbtn = document.getElementById('reset-button'),
    body = document.body,
    progressbar = document.getElementById('progressbar'),
    progressbarfill = document.getElementById('progress-bar-full'),
    scorestable = document.getElementById('scores-table'),
    scoreI = document.getElementById('score-individual'),
    scoreS = document.getElementById('score-shared'),
    scoreV = document.getElementById('score-visceral'),
    scoreE = document.getElementById('score-emotional'),
    scoreA = document.getElementById('score-active'),
    scoreP = document.getElementById('score-passive'),
    scoreX = document.getElementById('score-sexual'),
    scoreN = document.getElementById('score-sensual'),
    resetbtn2 = document.getElementById('reset-button-2'),
    shareLink = document.getElementById('results-share');

// Scores
var I = 0,
    S = 0,
    V = 0,
    E = 0,
    A = 0,
    P = 0,
    X = 0,
    N = 0;

// upreyStatements = [
//     // Individual
//     {question: 'I roll my eyes at predators who tell me how hungry they are.', answers: [{type:'I', value: 3},{type:'I', value: 1},{type:null, value: null},{type:'S', value: 1},{type:'S', value: 3}]},

//Test Statements Small Note: If these are the same thing it causes problems when loading a results page (This does not happen after a test is takes as these ger replaced with the correct data from the json file)
var predStatements = "PRED",

    wpreyStatements = "WPREY",

    upreyStatements = "UPREY";

//TestLogic

var testType = '',
    type = '',
    FinalScore = '',
    questionNo = 0,
    questions,
    scoreHist = [];

var typeDesc = '';

//=====================
//Event Listener Adding
//Area for adding event listeners
//===============================

//Test Type Buttons
predTest.addEventListener('click', function () {
    changeTheme("var(--pred)")
    startTest("data/pred.json");
    testType = "PRED";
});
wpreyTest.addEventListener('click', function () {
    changeTheme("var(--wPrey)")
    startTest("data/wprey.json");
    testType = "WPREY";
});
upreyTest.addEventListener('click', function () {
    changeTheme("var(--uPrey)")
    startTest("data/uprey.json");
    testType = "UPREY";
});

//Test Answers
stragr.addEventListener('click', function () {
onAnswer(4);
});
agr.addEventListener('click', function () {
    onAnswer(3);
});
na.addEventListener('click', function () {
    onAnswer(2);
});
dis.addEventListener('click', function () {
    onAnswer(1);
});
strdis.addEventListener('click', function () {
    onAnswer(0);
});

//Back Button
backbtn.addEventListener('click', function () {
    if (questionNo > 0) {
        prevQuestion();
    }
});

//Reset Buttons
resetbtn.addEventListener('click', function () {
    if (confirm("Are you sure? You will lose all saved data!")) {
        resetTest();
        resetScores();
        window.location.hash = '#';
    }
    else { }

});
resetbtn2.addEventListener('click', function () {
    if (confirm("Are you sure? You will lose all saved data!")) {
        resetTest();
        resetScores();
        window.location.hash = '#';
    }
    else { }

});

//======================
//Data Loading Functions
//Functions that deal with external data
//======================================

//Used to load a JSON File
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//===================
//Test Data Functions
//Functions that purely deal with test data
//=========================================

//Resets test data
function resetScores() {
    testState = 0;
    scoreHist = [];
    (I = 0), (S = 0), (V = 0), (E = 0), (A = 0), (P = 0), (X = 0), (N = 0);
    type = '';
    questionNo = 0;
}

//========================
//Auxillary Test Functions
//Functions that deal with other test features (mainly graphics, sometimes data)
//==============================================================================

//Starts Test
function startTest(questionData) {

    //Set vars
    resetScores();
    testState = 1;
    questionNo = 0;

    //Attempt to load questions
    try {
        readTextFile(questionData, (text) => {
            questions = JSON.parse(text);
            //console.log(questions); for debug
            nextQuestion();
            //title.innerText = title.innerText + ' - Predator';
            //testType = predStatements;
            //resetScores();
            //hideType();
            //showOptions();
            //document.body.className = 'predbody';
            //document.getElementById('progress-bar').className += 'progress-bar';
            //document.getElementById('progress-bar-full').className += 'progress-bar-full';

            //console.log(JSON.stringify(questions, null, 2));
        });
    }
    catch (err) {
        //Some sort of alert...
    }

    //UI update
    //console.log(questions); for debug
    document.getElementById('progress-bar-full').style.width = 0; //Set bar (back) to 0
    backbtn.setAttribute('disabled', ''); //Disable back button
    hideMenu('main-menu'); //Hide main menu
    showMenu('test-menu'); //Show test menu
}

//Checks which score to change
function typeCheck(type, value) {
    switch (type) {
        case 'I':
            I = I + value;
            break;
        case 'S':
            S = S + value;
            break;
        case 'V':
            V = V + value;
            break;
        case 'E':
            E = E + value;
            break;
        case 'A':
            A = A + value;
            break;
        case 'P':
            P = P + value;
            break;
        case 'X':
            X = X + value;
            break;
        case 'N':
            N = N + value;
            break;
    }
}

//Desc: When an answer is given...
//Args: (int) index - current question number
function onAnswer(index) {
    //Get current score to history
    scoreHist.push([I, S, V, E, A, P, X, N]);
    
    //Calc new score
    let answer = questions[questionNo].answers[index];
    if (answer.type != null && answer.value != null) {
        typeCheck(answer.type, answer.value);
    }
    questionNo++;
    if (checkFinal()) {
        return;
    };

    //load next question
    nextQuestion();
}

//Desc: Displays next question and sets it's type
function nextQuestion() {
    //console.log("I=" + I + ",S=" + S + "V=" + V + ",E=" + E + ",A=" + A + ",P=" + P + ",X=" + X + ",N=" + N)
    //console.log(scoreHist)
    if (questionNo >= 0 && questionNo <= 4) { questionType = 'I'; }
    else if (questionNo >= 5 && questionNo <= 9) questionType = 'S';
    else if (questionNo >= 10 && questionNo <= 14) questionType = 'V';
    else if (questionNo >= 15 && questionNo <= 19) questionType = 'E';
    else if (questionNo == 20 && questionNo <= 24) questionType = 'A';
    else if (questionNo == 25 && questionNo <= 29) questionType = 'P';
    else if (questionNo == 30 && questionNo <= 34) questionType = 'X';
    else if (questionNo == 35 && questionNo <= 39) questionType = 'N';

    //Enable back button
    if (questionNo > 0) backbtn.removeAttribute('disabled');

    //Update progress bar
    progressbarfill.style.width = `${((questionNo + 1) / questions.length) * 100}%`;
    document.getElementById('question-header').innerText = 'Statement ' + (questionNo + 1) + '/' + + questions.length;
    document.getElementById('question-text').innerText = questions[questionNo].question;
}

//Desc: Displays previous question and sets it's type
function prevQuestion() {

    //console.log("I=" + I + ",S=" + S + "V=" + V + ",E=" + E + ",A=" + A + ",P=" + P + ",X=" + X + ",N=" + N)
    //Decrement question number
    questionNo--;
    //Sets last score
    lastScores = scoreHist.pop();
    I = lastScores[0]
    S = lastScores[1]
    V = lastScores[2]
    E = lastScores[3]
    A = lastScores[4]
    P = lastScores[5]
    X = lastScores[6]
    N = lastScores[7]
    //Sets question type
    if (questionNo >= 0 && questionNo <= 4) { questionType = 'I'; }
    else if (questionNo >= 5 && questionNo <= 9) questionType = 'S';
    else if (questionNo >= 10 && questionNo <= 14) questionType = 'V';
    else if (questionNo >= 15 && questionNo <= 19) questionType = 'E';
    else if (questionNo == 20 && questionNo <= 24) questionType = 'A';
    else if (questionNo == 25 && questionNo <= 29) questionType = 'P';
    else if (questionNo == 30 && questionNo <= 34) questionType = 'X';
    else if (questionNo == 35 && questionNo <= 39) questionType = 'N';

    if (questionNo == 0) backbtn.setAttribute('disabled', '');

    //Update progress bar
    progressbarfill.style.width = `${((questionNo + 1) / questions.length) * 100}%`;
    document.getElementById('question-header').innerText = 'Statement ' + (questionNo + 1) + '/' + questions.length;
    document.getElementById('question-text').innerText = questions[questionNo].question;
}

//Desc: Checks if current question is final
function checkFinal() {
    if (questionNo >= questions.length) {
        finalResult();
        return true;
    }
    return false;
}

//Desc: Reset graphics to main menu
function resetTest() {
    changeTheme('var(--menu)');
    hideMenu('test-menu');
    hideMenu('results-menu')
    showMenu('main-menu');
}

//Desc: Displays a given menu
//Args: (str) menu - id of menu
function showMenu(menu) {
    
    switch (menu) {
        case "results-menu":
            document.getElementById(menu).style.display = "flex";
            break;
        default: //usual case
            document.getElementById(menu).style.display = "inline";
            break;
    }
}

//Desc: Hids a given menu
//Args: (str) menu - id of menu
function hideMenu(menu) {
    document.getElementById(menu).style.display = "none"
}

//Desc: Changes the theme color
//Args: (str) color - css value (inclueding 'var()')
function changeTheme(color) {
    document.querySelector(':root').style.setProperty('--currentTheme', color);
}

//=====================
//Functions To Sort Out
//=====================

function debugMode() {
    textarea2.innerText =
        I + ' ' + S + ' ' + V + ' ' + E + ' ' + A + ' ' + P + ' ' + X + ' ' + N;
    title.innerText = questionType;
}

function finalResult() {
    console.log(testType)
    typeDesc = '';
    type = '';
    if (I >= S) {
        type = type + 'I';
        typeDesc = typeDesc + '[I]ndividual / ';
    } else {
        type = type + 'S';
        typeDesc = typeDesc + '[S]hared / ';
    }
    if (V >= E) {
        type = type + 'V';
        typeDesc = typeDesc + '[V]isceral / ';
    } else {
        type = type + 'E';
        typeDesc = typeDesc + '[E]motional / ';
    }
    if (A >= P) {
        type = type + 'A';
        typeDesc = typeDesc + '[A]ctive / ';
    } else {
        type = type + 'P';
        typeDesc = typeDesc + '[P]assive / ';
    }
    if (X >= N) {
        type = type + 'X';
        typeDesc = typeDesc + 'Se[X]ual';
    } else {
        type = type + 'N';
        typeDesc = typeDesc + 'Se[N]sual';
    }
    if (testType == "WPREY") {
        type = type + '-W';
    }
    if (testType == "UPREY") {
        type = type + '-U';
    }
    document.getElementById('results-desc-header-type').innerText = type;
    // document.getElementById('results-desc-text').innerText = 'Your type is: ' + type; Could not find use
    // textarea.innerText = typeDesc;
    descriptions();
    window.location.hash = `#${type}/${I}-${S}-${V}-${E}-${A}-${P}-${X}-${N}`;
    shareLink.setAttribute('href', window.location.toString());

    changeTheme('var(--menu)')
    hideMenu('test-menu');
    showMenu('results-menu');

}

function descriptions() {

    switch (type) {
        /* PREDATOR DESCRIPTIONS */
        case 'IVAN':
            title2.innerText = 'The Apex Predator';
            textarea.innerText = typeDesc;
            textareaheader.innerText = "'You're all mine now, little snack!'";
            textarea2.innerText =
                'You are an Alpha Predator. Filling your gut is all that matters to you, and there are plenty of tasty prey in the world to fill it with. You hunt them actively, pursuing prey for the sole purpose of feeding your insatiable hunger. They may kick and struggle but, being top of the food chain, you will always win in the end. The IVAN predator tends to be detached from the feelings of their prey, they could eat just about anyone and enjoy it about the same so long as they were delicious. \n';
            break;
        case 'IVAX':
            title2.innerText = 'The Ravenous';
            textareaheader.innerText =
                "'Mmm, keep squirming all you want, there's no way out~'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "Feeding your stomach is one thing, but you're drawn to far more... carnal desires. When some hapless prey goes down your throat, they're contributing not only to your body but a fun night of passion. The IVAX predator revels in a squirming prey, especially one that knows how to push against all the right places. \n";
            break;
        case 'IVPN':
            title2.innerText = 'The Spider';
            textareaheader.innerText =
                "'You know, things would be a lot easier if you just admitted you want this as much as I do~'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The IVPN does not go out of its way to find prey. You know that in time the food will come to you if you're patient. This hunting strategy usually leaves you famished, so when a prey comes your way you don't hesitate to devour them and enjoy a well-earned meal. It's true what they say; Good things come to those who wait. \n";
            break;
        case 'IVPX':
            title2.innerText = 'The Siren';
            textareaheader.innerText =
                "'Come now, wouldn't you love to be a part of this beautiful form?'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "Unlike their IVPN counterparts, IVPX predators consider a prey's looks before they decide on making them a meal. You much prefer a meal to be cute or attractive, it makes them taste better in ways you can't put your finger on. On the other hand, you may just be making sure that only the highest quality of prey go into your body, knowing that after they're digested your curves will be all the more noticeable for it. \n";
            break;
        case 'IEAN':
            title2.innerText = 'The Seeker';
            textareaheader.innerText =
                "'Struggle all you want, it won't change things between us.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "IEAN predators have their reasons to eat others. Whether they're filling their bellies with people who have wronged them, or whether doing so makes them feel superior, the Seeker archetype uses vore as a means to an emotional end, feeding not only their hunger but their emotional needs. \n";
            break;
        case 'IEAX':
            title2.innerText = 'The Bully';
            textareaheader.innerText =
                "'I'm going to find out what makes you tick, and keep you ticking all the way down~'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'You always know the right thing to say to make your prey squirm. The IEAX predator finds joy in taunting and teasing their prey into squirming in their gut. They devour prey for amusement, and love it when their prey has a lot of energy to use up in their stomach. They can sometimes get tired of passive or willing prey, but it can also prove to be a fun challenge to figure out what to do to get a reaction out of them. IEAX predators are not always malicious, however. An IEAX predator could also be a predator who likes to flirt with their prey, teasing them as they eat them. \n';
            break;
        case 'IEPN':
            title2.innerText = 'The Trapper';
            textareaheader.innerText =
                "'We both know I want it... the question is, when will you?'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "IEPN predators love to lure their prey into a false sense of security. They get to know them, often hinting at their fate whilst never outright saying it. In some ways, prey of IEPN know that they are just a meal to them, and yet the IEPN's natural charisma encourages them to remain friends. The IEPN eats to satisfy a desire of Emotional connection to their prey as well as the sensations that come with the process. They can be equally passionate predators and clever tricksters.";
            break;
        case 'IEPX':
            title2.innerText = 'The Temptress';
            textareaheader.innerText =
                "'I'll give you the ride of your life, which happens to end in a long slide to my stomach.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'The Temptress can often be found in public, simply waiting for prey to notice them. They wink and slip away from the crowd, guiding they prey into a quiet area where they can get to know eachother better, both emotionally and physically. The IEPN predator enjoys playing games with their prey, luring them into a night of passion (at least, for them) and devouring them when they least expect it. Their seductive nature makes them hard to resist for most, though being Passive they tend to wait for their prey to come to them instead. \n';
            break;
        case 'SVAN':
            title2.innerText = 'The Companion';
            textareaheader.innerText = "'Friends are the tastiest food of all!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SVAN are much friendlier predators than their IVAN counterparts. They often seek out willing prey to sate their appetite and try to make the experience an enjoyable one for both sides. While they still eat primarily to satisfy their hunger, their Shared nature ensures that their gluttony will never take precedence over the comfort of their prey. \n';
            break;
        case 'SVAX':
            title2.innerText = 'The Host';
            textareaheader.innerText = "'I want you to be comfortable with this.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SVAX predators like to make their prey feel comfortable before the main event, outlining clearly what is about to happen to them. They explain their hunger and their desire to be filled, and how good it will feel for both them and their prey. Their passion is infectious, often convincing even the most unwilling prey of their arousal at the prospect of being eaten. The host can use their skills to trick prey, but most would rather that their prey be as satisfied with the outcome as they are. \n';
            break;
        case 'SVPN':
            title2.innerText = 'The Tempted';
            textareaheader.innerText =
                "'I'm really sorry about this, but I'm just so hungry...'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'The SVPN is in a constant battle with their urges. They have plenty of prey friends, but when their stomach starts growling all they can think about doing is eating them. They try to ignore the feelings, despite how good it would be to just give in and binge on lots of prey. Finding a willing prey partner is a welcome relief of SVPN... if they can convince themselves to stop at just eating one prey, anyway. \n';
            break;
        case 'SVPX':
            title2.innerText = 'The Lustful';
            textareaheader.innerText =
                "'Sex is great, but have you tried getting devoured? Omph!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'Wild nights of frisky passion usually end with a full belly for the SVPX. They can sometimes lose themselves in the moment, wanting to feel their partners deeper than they can possibly go. They may use vore to help themselves or their partner achieve climax, or as a way to cuddle with them after spending time with them. In any case, SVPX predators are lovers with a voracious appetite. \n';
            break;
        case 'SEAN':
            title2.innerText = 'The Keeper';
            textareaheader.innerText = "'The way to my heart is through my stomach!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SEAN predators like to keep their friends close, and what better way to do that than keeping them inside them? These predators love to spend quality time with the prey in their stomach, often holding them for extended periods of time even while they go about their day to day lives. SEAN predators are likely candidates for endosoma given their love of keeping prey in their bellies for the emotional comfort it brings them. \n';
            break;
        case 'SEAX':
            title2.innerText = 'The Collector';
            textareaheader.innerText =
                "'I'd love for us to always be together, even if that means having you on my hips.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "SEAX predators have an eye for quality when it comes to prey. They are social creatures, enjoying getting to know any attractive individual who catches their eye. They encourage prey to explore their body and give their opinions on where they'd like to end up on it, though they're more likely to go to 'fun' areas. Their Shared and Emotional traits give them a strong preference for willing prey, who they actively search for when 'hunting'. In Non-fatal scenarios these predators are the type to constantly remind their prey how much they've contributed to their body, often posing or showing off and talking to their fat with their friends' names. \n";
            break;
        case 'SEPN':
            title2.innerText = 'The Nurturer';
            textareaheader.innerText =
                "'How's that? feeling comfortable? You just let me know when you want out.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "SEPN predators love to make their prey feel warm and cosy, often encouraging them with comforting words before and after they are done eating them. They lean towards keeping their prey safe and secure, and are reluctant when it comes to anything that would cause their prey harm such as digestion. Some SEPN predators don't even consider themselves to be predators at all, choosing only to eat when a prey comes to them seeking to experience vore. \n";
            break;
        case 'SEPX':
            title2.innerText = 'The Romantic ';
            textareaheader.innerText =
                "'I want to feel you inside of me, but only if you want that too.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "Romantics, Lovers, Seekers of passion. SEPX predators understand the intimate nature of vore better than anyone. It is a display of passion between two people who both want them same thing; an intimate closeness like no other. SEPX predators do not actively seek prey, but instead offer them the chance to explore their bodies of their own free will. Once inside them, the SEPX takes great sexual pleasure in both their own and their prey's arousal. They often choose to spit their prey out after they're done, or at least find means to revive them as SEPX predators form strong connections with those they eat, and wouldn't want them to be harmed. \n";
            break;

        /* WILLING PREY DESCRIPTIONS */

        case 'IVAN-W':
            title2.innerText = 'The Snack';
            textareaheader.innerText =
                "'What're you waiting for? Open up so I can dive in!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "You're not sure when it started, but you have a strange desire to be eaten. Perhaps it was the tight embrace of the throat, the low gurgles of a stomach or imagining yourself hanging off the waist of some lucky predator, but you knew you were destined to be food. You seek out predators and try to actively get eaten by them, to the point that most know you mostly as being a willing snack who's always up to be devoured. \n";
            break;
        case 'IVAX-W':
            title2.innerText = 'The Thrillseeker';
            textareaheader.innerText =
                "'Your tongue looks so slimy, I can't wait to feel it all over me~'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "You're active in the pursuit of your vorish dreams, turning your fantasies into reality with each predator you meet. Some are taken aback by just how eager you are, but the motions you make in their stomach after you're devoured clear up any doubts. To you, being eaten is a fetish, and it's one you'll do anything to experience. \n";
            break;
        case 'IVPN-W':
            title2.innerText = 'The Patient';
            textareaheader.innerText =
                "'I'm not sure what's taking them so long, aren't I delicious enough already?'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "You are no stranger to waiting. You often listen to other prey talking about predators they've had experiences with. While you'd love to feel the warm embrace of a stomach, your passive nature prevents you from approaching predators. Instead, you wait, knowing sooner or later a predator will hunt you down and devour you. \n";
            break;
        case 'IVPX-W':
            title2.innerText = 'The Daydreamer';
            textareaheader.innerText = "'Wh-what? Sorry, I was distracted.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "You're caught in an almost constant state of fantasizing about being prey. The hot breath of a predator, their warm tongue between your legs as you slide down their throat. These daydreams make you squirm in delight, but you can't bring yourself to act on them. Still, if a predator were to corner you or put the offer forward... \n";
            break;
        case 'IEAN-W':
            title2.innerText = 'The Worshipper';
            textareaheader.innerText =
                "'It's so soothing, please don't ever let me go.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "Something about stomachs make you feel at peace. You've never known comfort like the embracing walls of a gut. The IEAN-W prey seeks out predators for the emotional comfort they get from them, or the knowledge they are fulfilling their purpose as prey. \n";
            break;
        case 'IEAX-W':
            title2.innerText = 'The Explorer';
            textareaheader.innerText = "'Who's hungry~?'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'The IEAX-W is a promiscuous prey. They enjoy the emotional elements of vore, finding sexual arousal in the excitement of a gut. However, their Individual nature means that they are not tied down to a single predator. They adventure from place to place, finding new throats to delve down and stomachs to explore. An IEAX-W prey will always have plenty of stories to tell about their experiences. \n';
            break;
        case 'IEPN-W':
            title2.innerText = 'The Wallflower';
            textareaheader.innerText =
                "'A predator who recognises you as food and treats you like it... Mmh, I might have to sit down.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The IEPN is often confused with the IVPX daydreamer, though any IEPN prey would make it clear their desires are more than simply 'being eaten'. They fantasize about the sensations of the stomach around them as their predator taunts them from the outside, the knowledge that they are nothing but food to the powerful creature that has consumed them. They often don't care who their predator is, just that someday, somehow, they will be approached by someone who can make them feel like a special treat, and devour them in a single gulp. \n";
            break;

        /* Descriptions and Flavour Text To Be Added */

        case 'IEPX-W':
            title2.innerText = 'The Blusher';
            textareaheader.innerText = "'O-oh heck, maws!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'The IEPX are easily flustered, blushing at the mere sight of a predator. Their Passive trait leads them to usually being submissive in nature, leaving them at the whims of any predator who can taunt and tease them into arousal. They favour sexually attractive predators, particularly if they can appeal to their Emotional trait. \n';
            break;
        case 'SVAN-W':
            title2.innerText = 'The Committed';
            textareaheader.innerText =
                "'I can't think of anyone I'd rather be eaten by than you.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SVAN-W may see themselves as food but, rather than find any predator to sate that desire like their IVAN counterpart, they're reserving themselves for either a friend or perhaps a needy predator. While the relationship between them and their predator remains an exchange when it comes to vore (IE the experience of being eaten for the joy of eating them), the SVAN prey is likely to quickly make predator friends who they can call on when they feel the urge to delve into a stomach. \n";
            break;
        case 'SVAX-W':
            title2.innerText = 'The Flavourful';
            textareaheader.innerText =
                "'Does something smell delicious around here, or is it just me?'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'The SVAX-W follows their SVAN counterpart of having close relationships with their predators, however with a kinky aspect added into the situation, this prey might desire to make themselves as attractive to potential predators as possible, whether that be dressing provocatively, covering themselves with condiments, or whatever else that might make a potential predator see themselves as a delicious, pleasurable morsel. They actively pursue predators for raunchy encounters, experiencing the excitement of vore along with the compliments they get from those who eat them. \n';
            break;
        case 'SVPN-W':
            title2.innerText = 'The Friend';
            textareaheader.innerText =
                "'You can eat me if you want to, I don't mind.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "While not actively looking to be food, the SVPN-W prey will likely get to know several predators in the hopes that one of them will eventually decide to eat them, rather than try their luck with strangers. If this prey gets to be food to a friend, then they are satisfied, but often they struggle with getting the courage to make their true feelings about being eaten clear to the point where their predator friends might just assume they're not interested. \n";
            break;
        case 'SVPX-W':
            title2.innerText = 'The Pleaser';
            textareaheader.innerText =
                "'Hff, eat me... please, I'm so turned on right now.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'To the SVPX-W, being eaten is the ultimate climax. They seek to create connections with predators who they find attractive in the hopes of being devoured and adding themselves to their form, or just making a bulge in their sexy guts for a while. However, unlike their SVAX counterparts, the SVPX-W would rather the predator do most of the work in taking control and devouring them while they submit to them completely and enjoy the ride. Unlike the SEPX-W, the SVPX focuses on the raw passion in the heat of the moment with their predator, getting pleasure out of pleasing their predator in a potentially unstable feedback loop, if they find the right predator type to match up with. \n';
            break;
        case 'SEAN-W':
            title2.innerText = 'The Eager';
            textareaheader.innerText =
                "'We're such close friends, and I have a way for us to be even closer.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'The SEAN-W prey will often have similar views to their predator counterpart, seeking to spend a lot of time inside of them for fun. This prey will actively encourage this to happen and may give the predator internal belly rubs to help keep themselves inside. They might also wish to become one with their predator, feeling that both parties will be benefited with the prey becoming part of a greater whole. In any case, they are often sociable and are able to form deeper bonds with the other predator archetypes, but may find IV- types too intense. \n';
            break;
        case 'SEAX-W':
            title2.innerText = 'The Flirtatious';
            textareaheader.innerText =
                "'I really enjoy our little talks, but our conversation would be even better with a wall of fat between us~'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SEAX-W prey is well aware of their interests, and delights in finding predators who match them. They encourage and return sexual teasing and taunting, perhaps goading the predator to into becoming aroused enough to consume their prey in a lust-filled state. If the predator isn't enjoying or returning the teasing, then they likely won't wish to be eaten by them as vore isn't fun unless both sides are happy. They might also seek to become part of an attractive predator, or perhaps to help make a predator more attractive, as they might feel better being part of predator's sexual features or otherwise making them more beautiful. \n";
            break;
        case 'SEPN-W':
            title2.innerText = 'The Servant';
            textareaheader.innerText =
                "'I can't wait to be inside you, or to be a part of you...'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SEPN-W is a dedicated prey who seeks to feed their predator friends, and someone who finds joy in serving themselves as food for others. They often give their predator complete control, however long they stay they'll be content to sit back and relax deep inside of their friend's body. They perhaps might see themselves as their friend's personal snack or chew toy, to be taken and used whenever they want to play. They can sometimes be mistaken for SVPX 'lovers', but their interests come more from their Sensual trait; the sensation of being eaten is above the sexual exhilaration for these sensitive types. \n";
            break;
        case 'SEPX-W':
            title2.innerText = 'The Devotee';
            textareaheader.innerText = "'Use me however you want.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'While the SEPN-W finds comfort in serving their predator, the SEPX-W finds arousal in being controlled and used by their predator. They might see themselves as an edible sex toy, to be used to pleasure their lover, master or friends whenever they need it. They are willing to give themselves to their lover to sate their sexual desires, up to and including being processed on various levels. Though, being Emotional types, they yearn for teasing and compliments from their predator, as well as building long-term connections. This leads them to having smaller pools of predators to choose from than their SVPX companions, but their relationships are more intimate for it. \n';
            break;

        /* UNWILLING PREY DESCRIPTIONS */

        case 'IVAN-U':
            title2.innerText = 'The Challenger';
            textareaheader.innerText = "'I'm not going down without a fight!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "You've been in enough maws to know how to break out of them. Despite multiple escapes, predators keep thinking they can devour you. Maybe some of them think it's a challenge to be able to keep such an active prey down? In any case, the idea that there are people who want to get eaten confuses you greatly, you would never allow yourself to be prey and will punch your way out of anyone who forces it on you.\n";
            break;
        case 'IVAX-U':
            title2.innerText = 'The Evasive';
            textareaheader.innerText =
                "'Wh-what? Of course I don't like it! Let me go!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "You put up a fight at first, but now that you're in a gut your heart begins to flutter in the most peculiar way... are you turned on? Why would you feel aroused at a time like this? The IVAX-U experience some sexual excitement at their situation, but refuse to admit it. Better to keep struggling than stop just because you're horny. \n";
            break;
        case 'IVPN-U':
            title2.innerText = 'The Fatalist';
            textareaheader.innerText = "'Ugh, fine...'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'You fought for a little while, but decided to stop. Maybe you had given up, or maybe you were just conserving your strength. The IVPN knows the nature of their universe means that their chances of being eaten by a predator are high, and so when the time comes, they put up the bare minimum of a fight. Passive prey rarely last long against the stomach walls, though perhaps this tactic might bore your predator into letting you go? ...one can only hope. \n';
            break;
        case 'IVPX-U':
            title2.innerText = 'The Swayed';
            textareaheader.innerText =
                "'It's actually not so bad when you get used to it...'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The IVPX-U is a complicated prey. They know how dangerous being eaten is, how disgusting the innards of a predator are likely to be, but when they are met with this fate they give in. Once the predator begins the process of eating them they find themselves stimulated, having a tongue tasting them is oddly arousing. Perhaps in this sense they aren't as unwilling as they first thought.  \n";
            break;
        case 'IEAN-U':
            title2.innerText = 'The Remorseful';
            textareaheader.innerText = "'You can't do this to me!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'IEAN-U are melancholic prey. While their willing and predator counterparts find purpose and meaning in the activity, the IEAN-U finds only regret for all the things they never accomplished. They will fight to free themselves and complete their unfinished business. Their E trait is often the strongest weapon in their arsenal, convincing some E, and especially SE, predators to let them go. \n';
            break;
        case 'IEAX-U':
            title2.innerText = 'The Squirmer';
            textareaheader.innerText = "'Aaah, no, let me go!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The IEAX-U are easily flustered prey. While their Individual nature means they try to avoid being eaten, they can't help but take a second glance when a predator opens their jaws before them. They cover up their arousal through firm struggles and protesting that they aren't prey, often coaxing predators into teasing them more. A predator who wants to get the most out of an IEAX-U prey should focus on teasing them about their fate, telling them how good they tasted and, above all else, taunting them about how much they IEAX-U prey is enjoying themselves. A combination of these three strategies will guarantee them a prey who squirms all night long. \n";
            break;
        case 'IEPN-U':
            title2.innerText = 'The Tragic';
            textareaheader.innerText = "'There really wasn't any escape, was there?'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "All hope was lost the moment a predator laid eyes on them. Trapped with a single gulp, stifled by a burp, now nothing more than a meal. The IEPN-U find themselves in situations outside of their control where they are devoured, and often give into their fate immediately. While an IVPN-U would focus more on the concerns about being digested, the IEPN-U is more worried about how people will react when they find out they've been devoured. They are Passive prey, often giving up after a single attempt at escaping or easily silenced by a pat. \n";
            break;

        case 'IEPX-U':
            title2.innerText = 'The Indecisive';
            textareaheader.innerText =
                "'This is kind of hot actually, erf, so long as I don't stay for too long...'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The IEPX-U can often be confused for their willing counterpart, though they are much more likely to deny their secret desire to be eaten. Some might have little to no desire to be eaten, but might be too easily aroused or similar that sexual teasing might override whatever resistance they're able to put forward. The IEPX might come to regret their decision once their predator's body has begun to process them or they're otherwise trapped indefinitely. Or, alternatively, they might be willing afterwards, especially if they'll get to live to see this act again. \n";
            break;
        case 'SVAN-U':
            title2.innerText = 'The Feeder';
            textareaheader.innerText =
                "'H-ha, here's another prey! Just don't eat me, alright? Haha...'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The typical SVAN-U prey has predator friends they hang around. They skirt the border of being eaten through socialising with predators and convincing them that they're a better companion than a meal. They often end up as feeders or find prey for predators to avoid ending up as prey themselves, but they are constantly aware that the next stomach they hear growl could be for them. They are often active strugglers when their time finally comes to be devoured. \n";
            break;
        case 'SVAX-U':
            title2.innerText = 'The Voyeur';
            textareaheader.innerText = "'Glad it's them and not me.... yep. Glad.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SVAX-U prey are often onlookers who find strange arousal out of watching vore but fearing being prey. They might be feeders for their predator friends, follow social media trends about predators eating prey, or just stop and watch when someone else is being devoured. Their Active trait encourages them to get closer and closer to the action, until finally they get a bit too close. At this point their arousal turns against them, leaving them wondering how much they can experience before they reach a point of no return. \n';
            break;
        case 'SVPN-U':
            title2.innerText = 'The Gourmet';
            textareaheader.innerText =
                "'I hope you enjoyed that at least, even if it's gross in here.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SVPN-U doesn't want to be eaten, but if approached, they are likely to give in and let the predator have their way. Unlike IVPN, however, this prey might make sure that their predator enjoys them at the very least as, if they must be food, they at least should be a memorable meal. While they wouldn't admit it, they do appreciate being complimented on their flavour or how filling they were after being eaten. \n";
            break;
        case 'SVPX-U':
            title2.innerText = 'The Offering';
            textareaheader.innerText =
                "'Mmh, well if this is happening I might as well try to enjoy it.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SVPX-U is similar to the SVPN in almost every way, although their relationship with being devoured differs on their reaction to the outcome. While the SVPN hopes they're at least a filling or delicious meal, the SVPX hopes to find some enjoyment in the confines of the stomach. They often find odd arousal in the predator dominating them, and as such act on it when they're out of view in the predator's stomach. \n";
            break;
        case 'SEAN-U':
            title2.innerText = 'The Humiliated';
            textareaheader.innerText = "'H-how dare you!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SEAN-U prey finds that their biggest emotional response to being eaten is humiliation. Their Shared nature means that they're easily teased by a predator, and their Emotional trait leads them to focus more on the predator's words than the stomach walls around them. Teasing leaves them quickly kicking up a frenzy to escape while their pride is still intact. \n ";
            break;
        case 'SEAX-U':
            title2.innerText = 'The Closeted';
            textareaheader.innerText =
                "'No I'm not blushing, it's just really hot in here!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SEAX-U prey is close to their SEAN-U counterpart; vulnerable to teasing and goading from predators, especially those they are close to. However unlike the Sensation-focused SEAN, the SEAX-U finds some arousal in the predator's teasing, often leading them to squirm less out of humiliation and more out of trying to hide their arousal at the predator's domination over them. \n ";
            break;
        case 'SEPN-U':
            title2.innerText = 'The Trusting';
            textareaheader.innerText =
                "'Well, okay... but let me out the second I tell you to, alright?'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SEPN-U is a reluctant prey who can be coaxed into going inside of someone they trust. They might not want it, but if their companion really does, they will give in and give them the enjoyment they desire. Most will want to get reassurance from their predator that its safe, but despite their desire to be in control they'll often slip into a passive role if their predator begins to act more dominantly. These prey can eventually be worked into willing with the right time and predator, though they need to watch themselves around manipulative IE predator types! \n";
            break;
        case 'SEPX-U':
            title2.innerText = 'The Toy ';
            textareaheader.innerText =
                "'So long as you're enjoying it, I guess it's okay.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "Much like the SEPN-U, the SEPX-U is a bit of a reluctant toy. They don't find the same enjoyment in being eaten as their partner does in eating them, but their relationship with the predator is important enough they can often bypass this in order to sate their partner's desires. This level of connection with their predator from the SE traits, combined with their passive approach from the P trait, means that they can often find arousal in the dominance aspect of being eaten, though they still wouldn't consider it to be something they personally enjoy. \n";
            break;
    }

    // Build the Traits Description

    let isDesc = '';
    let veDesc = '';
    let apDesc = '';
    let xsDesc = '';

    if (I >= S) {
        isDesc =
            "<b>Individual (I)</b> characters generally don't put much thought toward their partner and their partner's feelings; nor would they put much effort into making the experience enjoyable for their partner. Individual characters aren't necessarily averse to taking it slow and having a little fun beforehand, but in the end they're in it to please themselves. In the case of unwilling prey, Individual means they could care less what their predator wants, they just want to escape and not have to experience it. Willing prey would seek to satisfy their own fantasy regardless of their predator's orientation. \n";
    } else {
        isDesc =
            "<b>Shared (S)</b> characters can only truly enjoy themselves if their partner is enjoying themselves as well. Though they still seek to achieve their own goals, they do so with respect to their partner's wishes. Shared predators prefer to eat only willing prey, or maybe coax the prey into sliding down their gullet; and, in the event that they do devour unwilling prey (perhaps out of absolute need), they feel remorseful about it, genuinely valuing their prey's emotions. Shared prey characters tend to go willingly and aim to please their predator as best they can on their way down. Unwillingness in Shared prey characters usually amounts to something more like reluctance- they didn't want to be food, but they may as well go along with it now that it's happening. \n";
    }
    if (V >= E) {
        veDesc =
            '<b>Visceral (V)</b> characters do what they do because they need it, or it simply makes sense. Predators with a Visceral leaning are driven by their raw hunger, or their physical desire to partake in the act, or simply for the need to fuel their body. Visceral prey, when willing, are much the same- they want to be eaten because it feels good, they enjoy the experience physically. Unwilling Visceral prey are motivated purely by their will to survive, or their fear of the pain and/or discomfort of being trapped inside a predator. \n';
    } else {
        veDesc =
            '<b>Emotional (E)</b> characters tend to focus on the deeper implications behind the whole process of vore. Emotional predators do what they do because they enjoy the relationship with their prey- be it one of affection, or domination- or because they enjoy the thought of holding another being inside themselves and/or turning their prey into a part of their own body. They might enjoy it when their prey begs or struggles while a Visceral predator would likely see such things as a nuisance, something keeping them from their food. Emotional willing prey function much the same way, enjoying the act because it fulfills their desire to be dominated, or to be intimate with their predator, or to be very intimate with their predator- i.e, digested. Emotional unwilling prey want to escape for those very reasons- not for the fear of the physical sensations, but rather the implications of being subjugated in such a way- and, potentially, of not getting to continue with their own life. \n';
    }
    if (A >= P) {
        apDesc =
            "<b>Active (A)</b> characters go out of their way to make things happen, putting in real effort to achieve their desires. The significance of this trait in predators is simple enough- active predators are the types who hunt regularly, or commonly seek out vore opportunities. Once they have their prey, active predators will likely want to get right to the point, and also probably won't be afraid to apply a little force to get what they want. Active prey will of course actively resist or struggle against their predator- or, in willing cases, intentionally seek out or encourage a pred to make a meal out of them. \n";
    } else {
        apDesc =
            "<b>Passive (P)</b> characters generally go with the flow of things, more often being drawn into situations than creating them. Passive predators are more inclined to wait and watch potential prey go by rather than simply grabbing one- perhaps coming up with a detailed plan to claim their prize, or luring prey close using their own appealing body. Passive predators can also simply not see themselves as predators, or try to resist their hunger when they're around prey (often failing to do so when the temptation becomes too much). Passive prey, naturally, tends to submit once the predator has them in their grasp- giving in for a host of possible reasons ranging from subservience to despair to sexual thrill. Willing types will happily subject themselves to their predator's whims, serving the role of 'toy' or 'food' with few objections. Unwilling Passive types tend to be more defeatist in nature- giving up struggling once they realize it's hopeless (while Active types tend to struggle on and on regardless of how hopeless it may seem). \n";
    }
    if (X >= N) {
        xsDesc =
            "<b>SeXual (X)</b> characters see vore as an act of temptation, sprouting from lust. Generally, any Sexual character would be hard-pressed to resist becoming aroused if they happened to be drawn into a vore scenario. Sexual predators seek out food to satisfy their carnal urges in tandem with any other motivations, including hunger, the desire to dominate, and/or put some extra weight on their hips. Sexual prey enjoy the experience similarly, taking pleasure in being their predator's meal, plaything or body-fuel- regardless of whether they do so willingly or unwillingly. \n";
    } else {
        xsDesc =
            "<b>SeNsual (N)</b> characters see vore as an act of plain pleasure, satisfaction, or perhaps of pure hunger. They don't associate the sexual element with it directly like Sexual types do- although this doesn't mean they can't still have a sexually involved vore experience now and then. Sensual predators can have all sorts of motivations depending on their other personality aspects, but generally, they do vore for food, satisfaction, bonding or fun- and not as an act of lust in and of itself. Sensual prey likewise enjoy the experience without the need for eroticism- or perhaps they're just some unfortunate unwilling prey-type, one that's pure enough not to take guilty pleasure in being devoured. \n";
    }

    textarea3.innerHTML =
        isDesc +
        '<br /> <br />' +
        veDesc +
        '<br /> <br />' +
        apDesc +
        '<br /> <br />' +
        xsDesc;

    // PERCENTAGE CALCULATOR

    // Hard code max values for all (30) strdis+stragr

    let isTotal = 30;
    let veTotal = 30;
    let apTotal = 30;
    let xnTotal = 30;

    let iPerc = (I / isTotal) * 100;
    let sPerc = (S / isTotal) * 100;
    let vPerc = (V / veTotal) * 100;
    let ePerc = (E / veTotal) * 100;
    let aPerc = (A / apTotal) * 100;
    let pPerc = (P / apTotal) * 100;
    let xPerc = (X / xnTotal) * 100;
    let nPerc = (N / xnTotal) * 100;

    // STRDIS=3 to Opposite, DIS=1 to Opposite, NEU=0,  AGR=2, STRAGR=3

    scoreI.innerText = Math.round(iPerc) + '%';
    scoreS.innerText = Math.round(sPerc) + '%';
    scoreV.innerText = Math.round(vPerc) + '%';
    scoreE.innerText = Math.round(ePerc) + '%';
    scoreA.innerText = Math.round(aPerc) + '%';
    scoreP.innerText = Math.round(pPerc) + '%';
    scoreX.innerText = Math.round(xPerc) + '%';
    scoreN.innerText = Math.round(nPerc) + '%';
}

// Initialisation
const hashRegex = /^#([IS][VE][AP][XN])(?:-([WU]))?\/?(?:\/(\d{1,3}(?:-(\d{1,3})){7}))?$/i;

function processHash() {
    if (window.location.hash == '' || window.location.hash == '#') {
        resetTest();
        resetScores();
        hideMenu('results-menu');
    } else {
        const m = hashRegex.exec(window.location.hash);
        if (m !== null) {
            switch ((m[2] ?? '').toUpperCase()) {
                case 'W':
                    title.innerText = title.innerText + ' - Willing Prey';
                    testType = wpreyStatements;
                    document.body.className = 'wpreybody';
                    break;
                case 'U':
                    title.innerText = title.innerText + ' - Unwilling Prey';
                    testType = upreyStatements;
                    document.body.className = 'upreybody';
                    break;
                default:
                    title.innerText = title.innerText + ' - Predator';
                    testType = predStatements;
                    document.body.className = 'predbody';
                    break;
            }
            if (m[3]) {
                const tokens = m[3].split('-');
                I = parseInt(tokens[0]);
                S = parseInt(tokens[1]);
                V = parseInt(tokens[2]);
                E = parseInt(tokens[3]);
                A = parseInt(tokens[4]);
                P = parseInt(tokens[5]);
                X = parseInt(tokens[6]);
                N = parseInt(tokens[7]);
            } else {
                const type = m[1].toUpperCase();
                if (type[0] == 'I') I = 30; else S = 30;
                if (type[1] == 'V') V = 30; else E = 30;
                if (type[2] == 'A') A = 30; else P = 30;
                if (type[3] == 'X') X = 30; else N = 30;
            }
            hideMenu('main-menu');
            finalResult();
        }
    }
}

window.addEventListener('hashchange', processHash);
processHash();
