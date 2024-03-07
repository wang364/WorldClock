var WHITE_ICON = 'https://icanhazdadjoke.com/static/smile.svg';
var BLACK_ICON = 'https://icanhazdadjoke.com/static/smile.svg';

var onBtnClick = function (t, opts) {
    return t.modal({
        title: "World Clock",
        url: 'world_clock.html',
        // whether the modal should stretch to take up the whole screen
        fullscreen: true
    });
};

window.TrelloPowerUp.initialize({
  'board-buttons': function (t, opts) {
    return [{
      // we can either provide a button that has a callback function
      icon: {
        dark: WHITE_ICON,
        light: BLACK_ICON
      },
      text: 'World Clock',
      callback: onBtnClick,
      condition: 'edit'
    }];
  }
});