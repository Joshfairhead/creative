document.addEventListener('DOMContentLoaded', function () {
  var filterBar = document.getElementById('tag-filter');
  var cardGrid = document.getElementById('card-grid');

  if (!filterBar || !cardGrid) return;

  var pills = filterBar.querySelectorAll('.tag-pill');
  var cards = cardGrid.querySelectorAll('.content-card');
  var activeTags = new Set();
  var params = new URLSearchParams(window.location.search);
  var locked = params.get('f') === '1';

  function getTagsFromURL() {
    var tagsParam = params.get('tags');
    if (tagsParam) {
      return tagsParam.split(',').map(function (t) { return t.trim(); });
    }
    return [];
  }

  function updateURL() {
    var url = new URL(window.location);
    if (activeTags.size === 0) {
      url.searchParams.delete('tags');
    } else {
      url.searchParams.set('tags', Array.from(activeTags).join(','));
    }
    window.history.replaceState({}, '', url);
  }

  function filterCards() {
    var showAll = activeTags.size === 0;

    cards.forEach(function (card) {
      var cardTags = (card.getAttribute('data-tags') || '')
        .split(',')
        .map(function (t) { return t.trim(); })
        .filter(function (t) { return t.length > 0; });

      var visible;
      if (showAll) {
        visible = true;
      } else {
        visible = Array.from(activeTags).every(function (tag) {
          return cardTags.indexOf(tag) !== -1;
        });
      }

      card.style.display = visible ? '' : 'none';
    });

    pills.forEach(function (pill) {
      var tag = pill.getAttribute('data-tag');
      if (tag === 'all') {
        pill.classList.toggle('active', activeTags.size === 0);
      } else {
        pill.classList.toggle('active', activeTags.has(tag));
      }
    });

    updateURL();
  }

  if (locked) {
    filterBar.style.display = 'none';
    cardGrid.querySelectorAll('[data-card-tag]').forEach(function (el) {
      el.style.cursor = 'default';
    });
  } else {
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        var tag = pill.getAttribute('data-tag');
        if (tag === 'all') {
          activeTags.clear();
        } else {
          if (activeTags.has(tag)) {
            activeTags.delete(tag);
          } else {
            activeTags.add(tag);
          }
        }
        filterCards();
      });
    });

    cardGrid.addEventListener('click', function (e) {
      var tagEl = e.target.closest('[data-card-tag]');
      if (tagEl) {
        e.preventDefault();
        e.stopPropagation();
        var tag = tagEl.getAttribute('data-card-tag');
        if (activeTags.has(tag)) {
          activeTags.delete(tag);
        } else {
          activeTags.add(tag);
        }
        filterCards();
      }
    });
  }

  var urlTags = getTagsFromURL();
  urlTags.forEach(function (tag) {
    activeTags.add(tag);
  });
  if (activeTags.size > 0) {
    filterCards();
  }
});
