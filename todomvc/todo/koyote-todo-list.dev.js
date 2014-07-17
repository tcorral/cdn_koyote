( function (koyote) {
  'use strict';

  var _toString = Object.prototype.toString,
    _isFunction = function (obj) {
    return _toString.call(obj) === '[object Function]';
  };

  function adapter(koyote, bus, widget) {
    return (koyote.TodoList = widget.mix(
      {
        constructor: function (element) {
          koyote.callMethod('Widget.constructor', this, [ null, 'todo-list' ]);
          bus.subscribe(this);
          this.element = element;
        },
        '@render': function () {
          this.bindEvents();
          this.getChildren().forEach(function (child) {
            if (_isFunction(child.render)) {
              child.render();
            }
          });
        },
        '@addTodos': function (item) {
          var storeData = {
              todos: []
            };

          var todo = koyote.create('TodoItem',
            {
              text: item
            });

          this.add(todo);

          storeData.todos.push(
            {
              id: todo.id,
              text: todo.text,
              checked: todo.checked
            });

          this.render();

          bus.publish('todos', 'todo:add', storeData);
        },
        '@events': {
          'todos': {
            'list:restore': function (todos) {
              for (var id in todos) {
                if (todos.hasOwnProperty(id)) {
                  var todoData = todos[ id ];
                  this.add(koyote.create('TodoItem', todoData));
                }
              }

              bus.unsubscribeFrom('todos', 'list:restore', this);
            },
            'list:add': function (data) {
              this.addTodos(data.item);
            }
          }
        }
      }));
  }

  if (typeof define !== 'undefined') {
    define('koyote-todo-list', ['koyote', 'koyote-bus', 'koyote-widget'], adapter);
  } else {
    adapter(koyote, koyote.Bus, koyote.Widget);
  }
}(Koyote) );
