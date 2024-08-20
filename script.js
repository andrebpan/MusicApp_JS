const songName = document.getElementById('song-name');//referencia para o html
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const alteraCor = document.getElementById('changeC');//elemento para alterar cores de fundo (extra)
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');
const likeButton = document.getElementById('like');


const SenhorDT = {
     songName: 'Senhor do tempo',
     artist: 'Charlie Brown',
     file: 'Charlie Brown Jr - Senhor do tempo',
     liked: false,
};

const Vicios = {
     songName: 'Vícios e Virtudes',
     artist: 'Charlie Brown',
     file: 'Charlie Brown Jr - Vícios E Virtudes',
     liked: true,
};

const Longe = {
     songName: 'Longe de você',
     artist: 'Charlie Brown',
     file: 'Charlie Brown Jr - Longe de você',
     liked: false,
};

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
let colorChange = false;
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [SenhorDT,Vicios,Longe];
let SortedPlaylist = [...originalPlaylist];//spread (pega os dados do array selecionado)
let i = 0;
let cores = ["rgb(240, 240, 240)", "rgb(192, 192, 192)", "rgb(230, 230, 230)", "rgb(211, 211, 211)", "rgb(249, 249, 249)"];
let j = 0;

function playSong(){
     play.querySelector('.bi').classList.remove('bi-play-circle-fill');
     play.querySelector('.bi').classList.add('bi-pause-circle-fill');
     song.play();
     isPlaying = true;
}

function pauseSong(){
     play.querySelector('.bi').classList.add('bi-play-circle-fill');
     play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
     song.pause();
     isPlaying = false;
}

function playPauseDecider(){
     if(isPlaying === true){
          pauseSong();
     }
     else{
          playSong();
     }
}

function likeButtonRender(){
     if(SortedPlaylist[i].liked === true){
          likeButton.querySelector('.bi').classList.remove('bi-heart');
          likeButton.querySelector('.bi').classList.add('bi-heart-fill');
          likeButton.classList.add('button-active');
     }
     else{
          likeButton.querySelector('.bi').classList.add('bi-heart');
          likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
          likeButton.classList.remove('button-active');
     }
}

function initializeSong() {
     cover.src = `imagensTeste/${SortedPlaylist[i].file}.webp`;
     song.src = `songs/${SortedPlaylist[i].file}.mp3`;
     songName.innerText = SortedPlaylist[i].songName;
     bandName.innerText = SortedPlaylist[i].artist;
     likeButtonRender();
}

function previousSong(){
     if(i === 0){
          i = SortedPlaylist.length - 1;
     }
     else{
          i -= 1;
     }
     initializeSong();
     playSong();
}

function nextSong(){
     if(i === SortedPlaylist.length-1){
          i = 0; 
     }
     else{
          i += 1;
     }
     initializeSong();
     playSong();
}

function changeBackgroundColor() {
     alteraCor.body = cores[i];

     if(colorChange === false){
          colorChange = true;
          alteraCor.classList.add('button-active');
     }
     else{
          colorChange = false;
          alteraCor.classList.remove('button-active');
     }
 }

function updateProgress(){
     song.currentTime
     song.duration
     const barwidth = (song.currentTime/song.duration) * 100;
     currentProgress.style.setProperty('--progress', `${barwidth}%`);//pega o valor da variavel progress, transforma em texto $=valor da variavel `texto`.
     songTime.innerText = toHHMMSS(song.currentTime);
}


function jumpTo(event){//chama o addeventlistener
     const width = progressContainer.clientWidth;//largura da barra de progresso
     const clickPosition = event.offsetX;//da o quanto clicou a partir do inicio(largura do click)
     const jumpToTime = (clickPosition / width) * song.duration;//calculo dos segundos para onde foi o click
     song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray){
     const size = SortedPlaylist.length;
     let currentIndex = size-1;
     while(currentIndex > 0){
          let randomIndex = Math.floor(Math.random()*size);//pega um inteiro de 0 a 2(tamanho da playlist);
          let aux = preShuffleArray[currentIndex];
          preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
          preShuffleArray[randomIndex] = aux;
          currentIndex -=1;
     }
}

function shuffleButtonClicked() {
     if(isShuffled === false) {
          isShuffled = true;
          shuffleArray(SortedPlaylist);
          shuffleButton.classList.add('button-active');
     }
     else{
          isShuffled = false;
          SortedPlaylist = [...originalPlaylist];
          shuffleButton.classList.remove('button-active');
     }
}

function repeatButtonClicked(){
     if(repeatOn === false){
          repeatOn = true;
          repeatButton.classList.add('button-active');
     }
     else{
          repeatOn = false;
          repeatButton.classList.remove('button-active');
     }
}

function nextOrRepeat(){
     if(repeatOn === false){
          nextSong();
     }
     else{
          playSong();
     }
}

function toHHMMSS(orginalNumber){
      let hours = Math.floor(orginalNumber / 3600); 
      let minutes = Math.floor((orginalNumber - hours * 3600) / 60);
      let sec = Math.floor(orginalNumber - hours * 3600 - minutes *60);

      return `${hours.toString().padStart(2,'0')}:${minutes
          .toString()
          .padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

function updateTotalTime(){

     totalTime.innerText = toHHMMSS(song.duration);     
}

function likeButtonClicked(){
     if(SortedPlaylist[i].liked === false){
          SortedPlaylist[i].liked = true;
     }
     else{
          SortedPlaylist[i].liked = false;
     }
     likeButtonRender();
     localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}

initializeSong();

play.addEventListener('click', playPauseDecider);//quando tiver o evento de click, faz a função especificada
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
alteraCor.addEventListener('click',changeBackgroundColor);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended',nextOrRepeat);
song.addEventListener('loadedmetadata',updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);
