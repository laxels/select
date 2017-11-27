(function() {


  var defaults = {
    callbacks: {},
    getLabel: function(o){return o.label},
    getValue: function(o){return o.value}
  };


  var S = window.Select = function(el, args) {
    var s = this;
    s.optionToElMap = {};
    s.elToOptionMap = {};
    s.element = el;
    s.container = document.createElement('div');
    s.container.classList.add('select-container');
    s.selection = document.createElement('div');
    s.selection.classList.add('select-selection');
    s.dropdown = document.createElement('div');
    s.dropdown.classList.add('select-dropdown');
    s.element.parentNode.insertBefore(s.container, s.element);
    s.container.appendChild(s.element);
    s.container.appendChild(s.selection);
    s.container.appendChild(s.dropdown);

    for(var d in defaults) s[d] = defaults[d];

    var extendArgs = ['callbacks', 'options', 'getLabel', 'getValue', 'getSubLabel', 'class', 'emptyLabel', 'selected'];
    for(var i=0; i<extendArgs.length; i++) {
      var a = extendArgs[i];
      if(args[a] !== undefined) s[a] = args[a];
    }

    try {
      if (s.options) {
        s.element.innerHTML = '';
        for(i=0; i<s.options.length; i++) {
          var o = s.options[i];
          s.element.insertAdjacentHTML('beforeend', '<option value="'+s.getValue(o)+'">'+s.getLabel(o)+'</option>');
          var id = 'select-option-'+Math.random();
          var optionContents = s.getLabel(o);
          if (s.getSubLabel) optionContents += ' <span class="sub">'+s.getSubLabel(o)+'</span>';
          s.dropdown.insertAdjacentHTML('beforeend', '<div class="select-option" id="'+id+'">'+optionContents+'</div>');
          s.optionToElMap[s.getLabel(o)] = s.dropdown.lastChild;
          s.elToOptionMap[s.dropdown.lastChild.id] = o;
        }
      }
      s.optionEls = s.dropdown.childNodes;
      if (!s.optionEls || !s.optionEls.length) throw new Error('Error getting options');
    }
    catch (e) {
      console.log(e);
    }

    if (s.class) s.container.classList.add(...s.class.split(' '));

    if (s.emptyLabel) {
      s.selection.innerHTML = s.emptyLabel;
      s.selection.classList.add('empty');
    }

    if (s.selected) s.select(s.selected);

    s.element.addEventListener('keydown', function(e) {
      console.log(e.key);
      switch(e.key) {
        case 'ArrowDown':
          s.hoverNext();
          return e.preventDefault();
        case 'ArrowUp':
          s.hoverPrev();
          return e.preventDefault();
        case 'Enter':
        case ' ':
          s.select(s.hovered);
          return e.preventDefault();
        // no default
      }
    });

    s.container.addEventListener('click', function(e){s.toggle(); e.stopPropagation()});

    document.addEventListener('click', function(){s.close()});

    for (i=0; i<s.optionEls.length; i++) {
      o = s.optionEls[i];
      o.addEventListener('mouseenter', function() {
        s.hover(s.elToOption(this));
      });
      o.addEventListener('click', function(e) {
        s.select(s.elToOption(this));
        e.stopPropagation();
      });
    }

  };


  S.prototype.elToOption = function(el) {
    var s = this;
    return s.elToOptionMap[el.id];
  };

  S.prototype.optionToEl = function(o) {
    var s = this;
    return s.optionToElMap[s.getLabel(o)];
  };


  S.prototype.open = function() {
    var s = this;
    s.opened = true;
    s.container.classList.add('active');
  };

  S.prototype.close = function() {
    var s = this;
    delete s.opened;
    s.container.classList.remove('active');
  };

  S.prototype.toggle = function() {
    var s = this;
    s.opened ? s.close() : s.open();
  };


  S.prototype.hover = function(o) {
    var s = this;
    if (!o) return;
    s.hovered = o;
    s.optionEls.forEach(function(el){el.classList.remove('hovered')});
    s.optionToEl(o).classList.add('hovered');
  };

  /*
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
  */


  S.prototype.select = function(o, ignoreCb) {
    var s = this;
    if (!o) return;
    s.selected = o;
    s.element.value = s.getValue(o);
    s.selection.innerHTML = s.getLabel(o);
    s.selection.classList.remove('empty');
    s.close();
    if (s.callbacks.select && !ignoreCb) s.callbacks.select(s.getValue(o));
  };


  S.prototype.setValue = function(v) {
    var s = this;
    if (!v) return;
    for (var i=0; i<s.options.length; i++) {
      var o = s.options[i];
      if(v === s.getValue(o)) return s.select(o, true);
    }
  };


})();
