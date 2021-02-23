// create a new pokemonRepository variable
var pokemonRepository = (function () {
  //repository array is empty
  var repository = [];
  //URL of the API
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  //returns repository array
  function getAll() {
    return repository;
  }

  //adds the pokemon object to the repository array
  function add(item) {
  repository.push(item);
  }

  //fetch data from the API, then uses it to populate the repository array
  function loadList() {
    return $.ajax(apiUrl)
    .then(function (items) {
      $.each(items.results, function(item) {
        var poke = items.results[item];
        var pokemon = {
          name: poke.name,
          detailsUrl: poke.url
        };
        //adds the retrived data to the repository
        add(pokemon);
      });
    })
    .catch(function (e) {
      console.error(e);
    });
  }

  //create a list and button then append them for pokemon name list
  function addListItem(pokemon){
    //create a pokemon list
    var $pokemonList = $('.pokemon-list');
    //create a li element
    var $listItem = $(
      '<li class="pokemon-list-item"></li>'
    );
    //create a button element
    var $button = $(
      '<button class="pokemon-selector-button" data-toggle="modal" data-target="#modal-container">' +
      pokemon.name +
      '</button>'
    );
    //add an event listner to the button
    $button.click(function() {
      showDetails(pokemon);
    });
    //add a class to the button
    $button.addClass('pokemon-selector-button');
    //append the button
    $listItem.append($button);
    //append the listItem
    $pokemonList.append($listItem);
  }

  //fetches(ajax) additional details using the detailsUrl of the pokemon object then adds them to it
  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url, { dataType: 'json' })
    .then(function (details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
      item.types = details.types.map(function (pokemon) {
        return pokemon.type.name;
      });
    })
    .catch(function (e) {
      console.error(e);
    });
  }

  //show a modal with the pokemon's name, height, weight, type and image
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {

      //create a modal
      var modalHTML =
        '<button class="modal-close">Close</button>'+
        '<h2>'+pokemon.name+'</h2>'+
        '<img src="'+pokemon.imageUrl+'">'+
        '<h3>Height</h3>'+
        '<p>'+pokemon.height+'cm</p>'+
        '<h3>Weight</h3>'+
        '<p>'+pokemon.weight+'g</p>'+
        '<h3>Type</h3>';

      var pokemonTypes = pokemon.types;
      $.each(pokemonTypes, function(index) {
        modalHTML = modalHTML +
          '<p>'+pokemonTypes[index]+'</p>';
      });
      var modalDOM = $('<div class="modal">' + modalHTML + '</div>');

      var modalContainer = $('#modal-container');
      $('#modal-container').empty();
      modalContainer.append(modalDOM);
      modalContainer.addClass('is-visible');

      //create a modal close button
      var modalCloseButton = $('.modal-close');
      modalCloseButton.click(function(e) {
        hideModal();
      });
    });
    }

    //close the modal
    function hideModal() {
      var modalContainer = $('#modal-container');
      modalContainer.removeClass('is-visible');
    }

    // ESC-key scenario
    $(window).keydown(function(e){
      var modalContainer = $('#modal-container');
      if (e.key === 'Escape' && modalContainer.hasClass('is-visible')) {
        hideModal();
      }
    });

    var modalContainer = $('#modal-container');
    modalContainer.click(function(e) {
        hideModal();
    });

    //return all functions
    return {
      getAll: getAll,
      add: add,
      loadList: loadList,
      addListItem: addListItem,
      loadDetails: loadDetails,
      showDetails: showDetails
    };
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
