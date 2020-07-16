const h1 = document.querySelector('#h1');
const h2 = document.querySelector('#h2');
const startinfo = document.querySelector("#startinfo");
const wordinfo = document.querySelector("#wordinfo");
const secretword = document.querySelector("#salainensana");
const joarvotut = document.querySelector("#joarvotut")
const form = document.querySelector('form');
const guessInput = document.querySelector('#tekstikentta');
const submitBtn = document.querySelector('#tarkistanappi');
const alertti = document.querySelector("#alert");
const arvaustenmaara = document.querySelector("#arvaustenmaara");
const divi = document.querySelector(".divi");

let arvaus;
let riisuttu;
let klikki=0;
let klikki2=0;
let arvottuSana;
let onkoarvottu=false;
let voitto = false;
let vaaratkirjaimet=[];
let kirjainarray;
let oikeakirjain = [];
let kaikkiarvaukset = [];
let guru=false;

let munSanat = (["vadelmavene","kirkonkello","helmisimpukka","tukkapölly","COVID","Melalahti","riikinkukko",
        "sinivalas","verikosto","meripihka","tuomiopäivä","liikuntamaa","trampoliini","posliini","mansikkarahka",
        "haisunäätä","valkosipuli","maissintähkä","Fennovoima","tulipunainen","kävelykeppi","kermavaahto",
        "mehulinko","kanisteri","majakka","savustin","paloasema","palolaitos","matkamittari","parkkipirkko",
        "festivaali","syntymäpäivä","tunturipöllö","komissaari","ratapölkky","asfaltti","perussuomalaiset"
         ]);

startgame();
arvo();

// Toiminnot peliikkunan auetessa
window.onload=function(){
    document.getElementById("reset").style.visibility="hidden";
    document.querySelector('#tekstikentta').focus();
    window.addEventListener('click', function(){ document.querySelector('#tekstikentta').focus();}, true); 
    window.addEventListener('click', function() {document.querySelector("#tekstikentta").value = "";});
};

// Estetään sivun päivittyminen painikkeesta
form.addEventListener('submit', function(e) {
    e.preventDefault();
});

// funktio pelin aloitus (Kirjoita oikeat tekstit pelin aloitukseen)
function startgame() {
h1.innerHTML="Old School Hangman";
h2.innerHTML="Tervetuloa hirsipuupeliin!";
startinfo.innerHTML="Kirjoita alle kirjain, jonka luulet <br>sisältyvän arpomaani sanaan.<br><br>Voit myös arvata kerralla koko sanan.<br>Sinulla on 10 yritystä!<br><br>Onnea matkaan!<br><br>";
}

// tämä ajetaan kun nappia painellaan
submitBtn.addEventListener('click', function() {
    validateForm();
});

// Sanalistalta arvattava sana ja tuikkaa ruutuun
function arvo(){
    var wordcnt = munSanat.length;
    arvottuSana = Math.floor(Math.random() * wordcnt);
    // pistetään tää piiloon ettei näy edes konsolissa console.log("Arvottu sana: " + munSanat[arvottuSana]);
    arvottuSana = munSanat[arvottuSana];
    for (var i = 0; i < arvottuSana.length; i++) {
        oikeakirjain[i] = "_";
      }
    secretword.innerHTML="Arvattava sana: " + oikeakirjain.join(" ") + ". Sana sisältää " + arvottuSana.length + " kirjainta. <br><br>";
    onkoarvottu=true;
    arvottuSana = arvottuSana.toLowerCase();
    kirjainarray = [...arvottuSana];
}

// Tarkistaa onko syöttöarvo tyhjä ja etenee sen mukaan
function validateForm() {
    var a = guessInput.value;
    a = a.replace(/[+]/gi,'');
    if(isNaN(a)){
        if (a === null || a === ""  || !a.match(/[a-zA-Z+öäå]/gi) || a === "+") {
        alertti.innerHTML="<b>Sinun on arvattava kirjain tai koko sana.</b>";
    }
    else if (onkoarvottu===false) {
        arvo();
        }
    else {
        lausetchk();
        arvaushandler();
        if((klikki+klikki2)===10){gameover();}
        }
    }
    else {
    alertti.innerHTML="<b>Sinun on arvattava kirjain tai koko sana.</b>";
    }
}

//siivoa arvaus funktio
function cleaninput(){
    arvaus = guessInput.value;
    riisuttu = arvaus.replace(/[^a-z+öäå]/gi,'');
    riisuttu = riisuttu.toLowerCase(); //muutetaan pieniksi kirjaimiksi ja poistetaan ei halutut merkit
    var unique = kirjainarray.filter((v, i, a) => a.indexOf(v) === i); 
    console.log("Löydettävässä sanassa on kirjaimia: " + unique.length);

    if (voitto===true){
        winner();
    }

    else if (kirjainarray.includes(riisuttu)===true){
        //alert("kirjainarray sisältää riisutun - eli ensimmäinen tarkistus");
            if(kaikkiarvaukset.includes(riisuttu)===true){
                //alert("tämä " + riisuttu + " on jo arvattu!")
                alertti.innerHTML="<b>Ei kannata tuhlata yrityksiä arvaamalla samoja kirjaimia!</b>";
                vaaratkirjaimet.push(riisuttu);
                console.log(riisuttu);
                joarvotut.innerHTML=kaikkiarvaukset.join(", ");
                klikki2+=1;
                joarvotut.innerHTML="Olet arvannut seuraavasti: " + kaikkiarvaukset.join(", ");
                console.log("Vääriä arvauksia klikki2: " + klikki2);
                }
            else if (kaikkiarvaukset.includes(riisuttu)===false){
                alertti.innerHTML="";
                kaikkiarvaukset.push(riisuttu);
                console.log(kaikkiarvaukset);
                klikki+=1;
                console.log("Kirjaimia oikein klikki1: " + klikki);
                joarvotut.innerHTML="Olet arvannut seuraavasti: " +kaikkiarvaukset.join(", ");
            }
            if(klikki===unique.length){winner();}
    } 
    else if (kirjainarray.includes(riisuttu)===false){
        klikki2+=1;
        kaikkiarvaukset.push(riisuttu);
        console.log("kirjainta ei löydy sanasta")
        console.log("Vääriä arvauksia klikki2: " + klikki2);
        arvaustenmaara.innerHTML = "<b><br>Arvauskertoja jäljellä: " + (10-(klikki+klikki2)) + "/10</b>";
        alertti.innerHTML="<b>Ei ollut oikea sana!</b>";
        joarvotut.innerHTML="Olet arvannut seuraavasti: " + kaikkiarvaukset.join(", ");
    }
kirjainhandler();    
}

function kirjainhandler(){
        for (var i = 0; i < kirjainarray.length; i++) {
            if (kirjainarray[i] === riisuttu) {
                oikeakirjain[i] = riisuttu; 
                secretword.innerHTML="Arvattava sana: <b>" + oikeakirjain.join(" ") + "</b>. Sana sisältää " + arvottuSana.length + " kirjainta. <br><br>";
                arvaustenmaara.innerHTML = "<b><br>Arvauskertoja jäljellä: " + (10-(klikki+klikki2)) + "/10</b>";
             }
        } 
}

function lausetchk(){
    if(guessInput.value.length > 1 ){
        if(arvottuSana === guessInput.value){
        guru=true;
        }
        else if (arvottuSana != guessInput.value){guru=false;}
    }
}

function arvaushandler(){
    if (guru===true){console.log(guru);winner();}
    else if ((klikki+klikki2)<=9){
        cleaninput();
    } 
    else {gameover()}
}

function gameover(){
    divi.style.display = 'none';
    h1.innerHTML="GAME OVER <br><br> Käytit kaikki yrityksesi :(<br><br>";
    h2.innerHTML="Arvattava sana oli: " + arvottuSana;
    startinfo.innerHTML="";
    secretword.innerHTML="";
    console.log("GAME OVER - yritetty 10 kertaa " + klikki);
    arvaustenmaara.innerHTML = "Arvaukset: "+(klikki+klikki2)+"/10";
    alertti.innerHTML="<b>Parempi onni ensi kerralla!</b>";
    document.getElementById("reset").style.visibility="visible";
}

function winner(){
    divi.style.display = 'none';
    document.querySelector('h2').textContent="Arvattava sana oli: " + arvottuSana;
    startinfo.innerHTML="<h1>VOITIT! USKOMATON ARVAUS!</h1>";
    wordinfo.innerHTML="Käytit arvauksia " + (1+(klikki+klikki2)) + "/10";
    secretword.innerHTML="";
    arvaustenmaara.innerHTML = "";
    alertti.innerHTML="<b>Minun täytyy keksiä vaikeampia sanoja.</b>";
    voitto=true;
    document.getElementById("reset").style.visibility="visible";
}

function refreshPage(){
    window.location.reload();
} 