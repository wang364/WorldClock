var onBtnClick = function (t, opts) {
    return t.modal({
        title: "World Clock",
        url: 'world_clock.html',
        height: 420
    });
};

window.TrelloPowerUp.initialize({
  'board-buttons': function (t, opts) {
    return [{
      // we can either provide a button that has a callback function
      icon: 'https://icanhazdadjoke.com/static/smile.svg',
      text: 'World Clock',
      callback: onBtnClick,
      condition: 'edit'
    }];
  }
});