// create a new pokemonRepository variable
var pokemonRepository = (function() {
  //repository array is empty
  var repository = [];
  //URL of the API
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

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
      .then(function(items) {
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
      .catch(function(e) {
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-enable no-console */
      });
  }

  //create a list and button then append them for pokemon name list
  function addListItem(pokemon) {
    //create a pokemon list
    var pokemonList = $('.pokemon-list');
    //create a button element
    var button = $(
      '<button type="button" class="btn btn-outline-light btn-sm btn-block list-group-item" data-toggle="modal" data-target="#exampleModal">' +
        pokemon.name +
        '</button>'
    );
    //add an event listner to the button
    button.click(function() {
      showDetails(pokemon);
    });

    //append the listItem
    pokemonList.append(button);
  }

  //fetches(ajax) additional details using the detailsUrl of the pokemon object then adds them to it
  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url, { dataType: 'json' })
      .then(function(details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.weight = details.weight;
        item.types = details.types.map(function(pokemon) {
          return pokemon.type.name;
        });
      })
      .catch(function(e) {
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-enable no-console */
      });
  }

  //show a modal with the pokemon's name, height, weight, type and image
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function() {
      showModal(pokemon);
    });
  }

  function showModal(pokemon) {
    var modalTitle = $('.modal-title');
    var modalBody = $('.modal-body');
    modalTitle.empty();
    modalBody.empty();

    var nameItem = $('<h3>' + pokemon.name + '</h3>');
    modalTitle.append(nameItem);

    var imageItem = $('<img src="' + pokemon.imageUrl + '">');
    modalBody.append(imageItem);

    var heightItem = $('<h6>Height</h6>' + '<p>' + pokemon.height + '</p>');
    modalBody.append(heightItem);

    var weightItem = $('<h6>Weight</h6>' + '<p>' + pokemon.weight + '</p>');
    modalBody.append(weightItem);

    var typesItem = pokemon.types;
    var typesHTML = '<h6>Type</h6>';
    $.each(typesItem, function(index) {
      typesHTML = typesHTML + '<p>' + typesItem[index] + '</p>';
    });
    modalBody.append($(typesHTML));
  }

  //return all functions
  return {
    getAll: getAll,
    add: add,
    loadList: loadList,
    addListItem: addListItem,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModal: showModal
  };
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

$(document).ready(function() {
  $(window).scroll(function() {
    if ($(this).scrollTop() > 50) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  });
  // scroll body to 0px on click
  $('#back-to-top').click(function() {
    $('body,html').animate(
      {
        scrollTop: 0
      },
      400
    );
    return false;
  });
});
