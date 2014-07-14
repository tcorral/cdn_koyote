(function (koyote) {
  'use strict';

  function adapter(koyote, bus, widget){
    return (koyote.TodoStats = widget.mix(
      {
        constructor: function( data )
        {
          koyote.callMethod( 'Widget.constructor', this, [ null, 'todo-stats', data.id ] );
          this.remaining = data.remaining;
          this.completed = data.completed;
        },
        '@template': '<span id="todo-count"><strong>{{ remaining }}</strong> {{ items }} left</span><ul id="filters"><li><a class="selected" href="#/">All</a></li><li><a href="#/active">Active</a></li><li><a href="#/completed">Completed</a></li></ul>{{ completed }}<button id="clear-completed" class="{{clear_completed}}">Clear completed ({{ completed }})</button>',
        '@render': function()
        {
          var checkedAttr = '';
          var items = 'item';
          var clear_completed = 'hidden';
          if(this.remaining > 1) {
            items = 'items';
          }

          if(this.completed){
            clear_completed = '';
          }

          koyote.callMethod( 'Widget.render', this, [
            {
              id: this.id,
              remaining: this.remaining,
              items: items,
              completed: this.completed,
              clear_completed: clear_completed
            } ] );
        },
        update: function( todoItem, todoElement )
        {
          var text = todoElement.querySelector( '.todo-label' ).innerHTML,
            checked = !!todoElement.querySelector( '.todo-check' ).checked;

          todoItem.text = text;
          todoItem.checked = checked;

          bus.publish( 'todos', 'todo:update',
            {
              todos: [
                {
                  id: todoElement.id,
                  text: text,
                  checked: checked
                } ]
            } );
        },
        '@domEvents':
        {
          '.todo-check:change': function( event, todoItem )
          {
            var todoElement = this.parentNode;
            todoElement.classList.toggle( 'todo-done' );
            koyote.TodoItem.update( todoItem, todoElement );
          },
          '.todo-label:input': function( event, todoItem )
          {
            koyote.TodoItem.update( todoItem, this.parentNode );
          },
          '.todo-label:keypress': function( event )
          {
            if ( [ 13, 27 ].indexOf( event.keyCode ) > -1 )
            {
              event.preventDefault();
              this.blur();
              return;
            }
          }
        }
      } ));
  }

  if (typeof define !== 'undefined') {
    define('koyote-todo-item', ['koyote', 'koyote-bus', 'koyote-widget'], adapter);
  } else {
    adapter(koyote, koyote.Bus, koyote.Widget);
  }
}(Koyote));