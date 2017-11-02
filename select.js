(function() {


  var defaults = {
    callbacks: {},
    labelKey: 'label',
    valueKey: 'value'
  };


  var S = self.Select = function(el, args) {
    var s = this;
    s.element = el;
    s.container = document.createElement('div');
    s.container.classList.add('select-container');
    s.dropdown = document.createElement('div');
    s.dropdown.classList.add('select-dropdown');
    s.parentNode.insertBefore(s.container, s.element);
    s.container.appendChild(s.element);
    s.container.appendChild(s.dropdown);

    for(var d in defaults) s[d] = defaults[d];

    var extendArgs = ['callbacks', 'options', 'labelKey', 'valueKey'];
    for(var i=0; i<extendArgs.length; i++) {
      var a = extendArgs[i];
      if(args[a] !== undefined) s[a] = args[a];
    }

    try {
      if (s.options) {
        s.element.innerHTML = '';
        s.options.forEach(function(o){
          s.element.insertAdjacentHTML('beforeend', '<option value="'+o[s.valueKey]+'">'+o[s.labelKey]+'</option>');
        });
      }
      s.options = s.element.childNodes;
      if (!s.options || !s.options.length) throw 'Error getting options';
    }
    catch (e) {
      console.log(e);
    }

    s.element.addEventListener('keydown', function(e) {
      switch(e.key) {
        case 'ArrowDown':
          s.hoverNext();
          return e.preventDefault();
        case 'ArrowUp':
          s.hoverPrev();
          return e.preventDefault();
        case 'Enter':
        case ' ':
          s.select();
          return e.preventDefault();
      }
    });

    s.element.addEventListener('click', function(e){
      e.preventDefault();
      s.toggle();
    });

    s.dropdown.childNodes.forEach(function(o) {
      o.addEventListener('mouseenter', function(){s.hover(this)});
    });

  };


  S.prototype.open = function() {
    var s = this;
    s.opened = true;
    s.dropdown.classList.add('active');
  };


  S.prototype.close = function() {
    var s = this;
    delete s.opened;
    s.dropdown.classList.remove('active');
  };


  S.prototype.toggle = function() {
    var s = this;
    s.opened ? s.close() : s.open();
  };


  S.prototype.hover = function(o) {
    var s = this;
    s.hovered = o;
    if (s.callbacks.hover) s.callbacks.hover(o);
  };

  S.prototype.hoverNext = function() {
    var s = this;
    if (!s.hovered || s.hovered === s.element.lastChild) s.hover(s.element.firstChild);
    else s.hover(s.hovered.nextSibling);
  };

  S.prototype.hoverPrev = function() {
    var s = this;
    if (!s.hovered || s.hovered === s.element.firstChild) s.hover(s.element.lastChild);
    else s.hover(s.hovered.previousSibling);
  };


  S.prototype.select = function(o) {
    var s = this;
    s.close();
    if (s.callbacks.select) s.callbacks.select(o);
  };


})();
