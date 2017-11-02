(function() {

  var defaults = {
  };

  var S = self.Select = function(el, args) {
    var s = this;

    for(var d in defaults) s[d] = defaults[d];

    var extendArgs = [];
    for(var i=0; i<extendArgs.length; i++) {
      var a = extendArgs[i];
      if(args[a] !== undefined) s[a] = args[a];
    }

    s.element.addEventListener('keydown', function(e) {
      switch(e.key) {
        case 'ArrowDown':
          return e.preventDefault();
        case 'ArrowUp':
          return e.preventDefault();
        case 'Enter':
        case ' ':
          return e.preventDefault();
      }
    });

    s.element.addEventListener('focus', function(){});
    s.element.addEventListener('blur', function(){});
  };

  S.prototype.open = function() {
  };

  S.prototype.close = function() {
  };

})();
