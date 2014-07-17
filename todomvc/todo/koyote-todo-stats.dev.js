(function (koyote) {
  'use strict';

  function adapter(koyote, bus, widget) {
    return (koyote.TodoStats = widget.mix({
      constructor: function (element) {
        koyote.callMethod('Widget.constructor', this, [ null, 'todo-stats' ]);
        this.element = element;
        this.selected = element.querySelector('.selected');
        this.setData();
        this.filter = 'all';
        bus.subscribe(this);
      },
      '@filtering': {
        'all': function () {
          var key;
          var item;
          this.setData();
          for (key in this.remaining) {
            if (this.remaining.hasOwnProperty(key)) {
              item = this.remaining[key];
              bus.publish('todos', 'todo:show', item);
            }
          }
          for (key in this.completed) {
            if (this.completed.hasOwnProperty(key)) {
              item = this.completed[key];
              bus.publish('todos', 'todo:show', item);
            }
          }
        },
        'active': function () {
          var key;
          var item;
          this.setData();
          for (key in this.remaining) {
            if (this.remaining.hasOwnProperty(key)) {
              item = this.remaining[key];
              bus.publish('todos', 'todo:show', item);
            }
          }
          for (key in this.completed) {
            if (this.completed.hasOwnProperty(key)) {
              item = this.completed[key];
              bus.publish('todos', 'todo:hide', item);
            }
          }
        },
        'completed': function () {
          var key;
          var item;
          this.setData();
          for (key in this.remaining) {
            if (this.remaining.hasOwnProperty(key)) {
              item = this.remaining[key];
              bus.publish('todos', 'todo:hide', item);
            }
          }
          for (key in this.completed) {
            if (this.completed.hasOwnProperty(key)) {
              item = this.completed[key];
              bus.publish('todos', 'todo:show', item);
            }
          }
        }
      },
      '@toggle': function (element) {
        if (element) {
          this.selected.classList.remove('selected');
          this.selected = element;
          this.selected.classList.add('selected');
        }
        this.filtering[this.filter].call(this);
      },
      '@setData': function () {
        this.setRemaining();
        this.setCompleted();
      },
      '@setRemaining': function () {
        var id;
        var todo;
        this.remaining = {};
        bus.publish('todos', 'todo:getAll', this);
        for (id in this.todos) {
          if (this.todos.hasOwnProperty(id)) {
            todo = this.todos[id];
            if (todo.checked === false) {
              this.remaining[id] = todo;
            }
          }
        }
      },
      '@setCompleted': function () {
        var id;
        var todo;
        this.completed = {};
        bus.publish('todos', 'todo:getAll', this);
        for (id in this.todos) {
          if (this.todos.hasOwnProperty(id)) {
            todo = this.todos[id];
            if (todo.checked === true) {
              this.completed[id] = todo;
            }
          }
        }
      },
      '@template': '',
      '@render': function () {
        this.bindEvents();
      },
      '@events': {
        'todos': {
          'todo:update': function () {
            this.setData();
            this.filtering[this.filter].call(this);
          },
          'list:add': function () {
            this.filtering[this.filter].call(this);
          },
          'filter:refresh': function () {
            this.filtering[this.filter].call(this);
          },
          'filter:get': function (data) {
            data.filter = this.filter;
          },
          'filter:toggle': function (data) {
            this.filter = data.filter || this.filter;
            this.toggle(data.element);
          }
        }
      },
      '@domEvents': {
        'a[href="#/"]:click': function (event) {
          bus.publish('todos', 'filter:toggle', { element: this, filter: 'all' });
          event.preventDefault();
        },
        'a[href="#/active"]:click': function (event) {
          bus.publish('todos', 'filter:toggle', { element: this, filter: 'active' });
          event.preventDefault();
        },
        'a[href="#/completed"]:click': function (event) {
          bus.publish('todos', 'filter:toggle', { element: this, filter: 'completed' });
          event.preventDefault();
        },
        '#clear-completed:click': function (event) {
          event.preventDefault();
        }
      }
    }));
  }

  if (typeof define !== 'undefined') {
    define('koyote-todo-item', ['koyote', 'koyote-bus', 'koyote-widget'], adapter);
  } else {
    adapter(koyote, koyote.Bus, koyote.Widget);
  }
}(Koyote));