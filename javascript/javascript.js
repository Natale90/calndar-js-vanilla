document.addEventListener("DOMContentLoaded", function() {

  console.log("JS ready");

  let nav = 0;
  let clicked = null;
  let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

  const calendar =  document.getElementById('calendar');
  const newEventModal = document.getElementById('newEventModal');
  const deleteEventModal = document.getElementById('deleteEventModal');
  const backDrop = document.getElementById('modalBackDrop');
  const eventTitleInput = document.getElementById('eventTitleInput');
  const weekdays = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

  function capitalize(string){

    return string && string[0].toUpperCase() + string.slice(1);
  }//end of capitalize

  function openModal(date){

    clicked = date;

    //ciclo sull'oggetto di eventi (events), e controllo se esistono gia eventi (e) nella data selezionata.
    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {

      document.getElementById('eventText').innerText = eventForDay.title;
      deleteEventModal.style.display = 'block';
    } else{

      newEventModal.style.display = 'block';
    }

    backDrop.style.display = 'block';

  }//end of openModal


  function load(){

    // dt è un oggetto
    const dt = new Date();

    if(nav !== 0){

      dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    //  al costruttore Date passo tre argomenti, anno,
    //  mese + 1 (inqaunto il mese è im index value) ed il giorno.
    //  Il giorno non è un indice, ma un vero e proprio valore. Il primo giorno del mese ha valore uno.
    //  quindi passando il valore zero, in realta ci verrà restituito l'ultimo giorno del mese precedente.
    //  in questo caso, year è il 2021, month è il mese corrente + 1 (definito sopra), il terzo
    //  argomento sono i è l'ultimo giorno del mese precedente che in questo caso
    //  equivale al mese in corso perche month è maggiorato di 1.

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1);

    const dateString = firstDayOfMonth.toLocaleDateString('it-IT', {

      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day:'numeric'

    });

    //  calcolo i giorni da rappresentare come spazi vuti nel calendario
    //  inquanto appartenenti al mese precedente.
    //  Nell'array weekdays cerco a quale indice appare il giorno corrente dopo aver
    //  trasformato in maiuscola la prima lettera della strinda che rappresenta il nome del giorno.

    // con split() spacco la stringa "domenica 1/8/2021" rappresentata in dateString sullo spazio,
    // isolando poi il valore ad indice zero. Con il metodo capitalize() trasformo
    // la prima lettera della stringa in maiuscolo. E con indexOf() ciclo nell'array weedays fino ad individuare il giorno corrente e quindi l'indice associato.
    // adesso ho un valore che rappresenta gli altri giorni della settimana da non tenere in considerazione.

    const paddingDays = weekdays.indexOf(capitalize(dateString.split(' ')[0]));

    document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('it-IT', {month: 'long'})} ${year}`

    //riporto il calendario a zero prima di ripopolarlo con i valori di un nuovo mese
    calendar.innerHTML = '';

    for (var i = 1; i <= paddingDays + daysInMonth; i++) {

      const daySquare = document.createElement('div');
      daySquare.classList.add('day');

      const dayString = `${month + 1}/${i - paddingDays}/${year}`;

      if(i > paddingDays){

        daySquare.innerText = i - paddingDays;
        const eventForDay = events.find(e => e.date === dayString);

        if(i - paddingDays === day && nav === 0){

          daySquare.id = 'currentDay';

        }

        if(eventForDay){

          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerText = eventForDay.title;
          daySquare.appendChild(eventDiv);
        }

        daySquare.addEventListener('click', () => openModal(dayString));

      }else{

        daySquare.classList.add('padding');

      }

      calendar.appendChild(daySquare);
    }



  }//end of load function

  function closeModal(){

    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';

    eventTitleInput.value = '';

    clicked = null;
    load();

  }//end of closeModal

  function saveEvent(){

    if (eventTitleInput.value) {

      eventTitleInput.classList.remove('error');

      events.push({
        date: clicked,
        title: eventTitleInput.value,
      });

      localStorage.setItem('events', JSON.stringify(events));
      closeModal();

    }else{

      eventTitleInput.classList.add('error');

    }

  }//end of saveEvent

  function deleteEvent(){

    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();

  }//end of deleteEvent

  function initButtons(){

    document.getElementById('nextButton').addEventListener('click', () => {
      nav++;
      load();
    });

    document.getElementById('backButton').addEventListener('click', () => {
      nav--;
      load();
    });

    document.getElementById('saveButton').addEventListener('click', saveEvent);;
    document.getElementById('cancelButton').addEventListener('click', closeModal);

    document.getElementById('deleteButton').addEventListener('click', deleteEvent);;
    document.getElementById('closeButton').addEventListener('click', closeModal);

  }//end of initButtons

  load();
  initButtons();

  //startin back from min 43:00
});
